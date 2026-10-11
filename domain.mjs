import { DatabaseSync } from 'node:sqlite';
import { randomUUID } from 'node:crypto';
import { workflow } from './workflow.mjs';
import { sales } from './sales.mjs';

export const commercialStatuses = ['Disponível', 'Reserva técnica', 'Permuta', 'Mútuo', 'Transferido', 'Vendido/terceiros'];
export const legalStatuses = ['Livre', 'Escriturado', 'Caucionado', 'Hipotecado', 'Penhorado', 'Alienação fiduciária', 'Não informado'];
export const constructionStatuses = ['Projeto', 'Em Construção', 'Concluído'];
export const today = () => new Intl.DateTimeFormat('en-CA', {timeZone:'America/Sao_Paulo'}).format(new Date());
export class ValidationError extends Error { constructor(message, status=422) { super(message); this.status=status; } }
const required = (value, name, max=120) => { if(typeof value !== 'string' || !value.trim() || value.trim().length>max) throw new ValidationError(`${name}: preencha até ${max} caracteres.`); return value.trim(); };
const amount = (value,name) => { if(typeof value !== 'number' || !Number.isFinite(value) || value<0 || value>1e12) throw new ValidationError(`${name}: informe um número válido, maior ou igual a zero.`); return value; };
const date = (value,name) => { if(typeof value!=='string' || !/^\d{4}-\d{2}-\d{2}$/.test(value) || !Number.isFinite(Date.parse(value)) || new Date(value).toISOString().slice(0,10)!==value) throw new ValidationError(`${name}: data inválida.`); return value; };
const member = (value, list, name) => { if(!list.includes(value)) throw new ValidationError(`${name}: opção inválida.`); return value; };

export function createStore(file=':memory:', {seed=true, clock=today}={}) {
  const db = new DatabaseSync(file);
  db.exec(`PRAGMA foreign_keys=ON; PRAGMA journal_mode=WAL;
    CREATE TABLE IF NOT EXISTS units(id TEXT PRIMARY KEY, project TEXT NOT NULL, name TEXT NOT NULL, tower TEXT NOT NULL, floor INTEGER NOT NULL, area REAL NOT NULL, price_cents INTEGER NOT NULL, commercial TEXT NOT NULL, legal TEXT NOT NULL, construction TEXT NOT NULL, UNIQUE(project,name));
    CREATE TABLE IF NOT EXISTS reservations(id TEXT PRIMARY KEY, unit_id TEXT NOT NULL REFERENCES units(id), client TEXT NOT NULL, broker TEXT NOT NULL, origin TEXT NOT NULL, created TEXT NOT NULL, expires TEXT NOT NULL, status TEXT NOT NULL, note TEXT NOT NULL);
    CREATE UNIQUE INDEX IF NOT EXISTS one_active_reservation ON reservations(unit_id) WHERE status='Ativa';
    CREATE TABLE IF NOT EXISTS events(id TEXT PRIMARY KEY, entity_id TEXT NOT NULL, action TEXT NOT NULL, occurred TEXT NOT NULL);
  `);
  const event=(id,action)=>db.prepare('INSERT INTO events VALUES(?,?,?,?)').run(randomUUID(),id,action,new Date().toISOString());
  const expire=()=>db.prepare("UPDATE reservations SET status='Vencida' WHERE status='Ativa' AND expires < ?").run(clock());
  const getUnit=id=> { const unit=db.prepare('SELECT * FROM units WHERE id=?').get(id); if(!unit) throw new ValidationError('Unidade não encontrada.',404); return unit; };
  const unitView=row=>({...row,price:row.price_cents/100,status:row.reservation_id?'Reservada':row.commercial});
  const flows=workflow(db,clock,event);
  for(const column of ['client_id','broker_id'])if(!db.prepare('PRAGMA table_info(reservations)').all().some(c=>c.name===column))db.exec(`ALTER TABLE reservations ADD COLUMN ${column} TEXT REFERENCES ${column==='client_id'?'clients':'brokers'}(id)`);
  function listUnits() {expire();flows.expire();return db.prepare("SELECT u.*, r.id reservation_id, p.id proposal_id FROM units u LEFT JOIN reservations r ON u.id=r.unit_id AND r.status='Ativa' LEFT JOIN proposals p ON p.unit_id=u.id AND p.status IN ('Em Construção','Em Aprovação Comercial','Em Aprovação de Crédito','Aprovada') ORDER BY project,tower,floor,name").all().map(row=>({...unitView(row),status:row.proposal_id?'Proposta':unitView(row).status}));}
  function addUnit(input) {
    const id=randomUUID(),project=required(input.project,'Empreendimento'),name=required(input.name,'Unidade',40),tower=required(input.tower,'Torre',40);
    const floor=amount(input.floor,'Pavimento');if(!Number.isInteger(floor)||floor>200) throw new ValidationError('Pavimento deve ser inteiro de 0 a 200.');
    const area=amount(input.area,'Área');if(area<=0)throw new ValidationError('Área deve ser maior que zero.');
    const price=amount(input.price,'Preço'),commercial=member(input.commercial,commercialStatuses,'Estoque comercial'),legal=member(input.legal,legalStatuses,'Estoque legal'),construction=member(input.construction,constructionStatuses,'Estoque de obra');
    try { db.prepare('INSERT INTO units VALUES(?,?,?,?,?,?,?,?,?,?)').run(id,project,name,tower,floor,area,Math.round(price*100),commercial,legal,construction); } catch(e) {if(e.code==='ERR_SQLITE_ERROR' && e.message.includes('UNIQUE')) throw new ValidationError('Já existe uma unidade com esse nome no empreendimento.',409);throw e;}
    event(id,'Unidade cadastrada'); return unitView(getUnit(id));
  }
  function reserve(input) {
    const linked=(table,id)=>{const row=db.prepare(`SELECT * FROM ${table} WHERE id=?`).get(id);if(!row)throw new ValidationError('Cliente ou corretor não encontrado.',404);return row;};
    const client=required(input.clientId?linked('clients',input.clientId).name:input.client,'Cliente'),broker=required(input.brokerId?linked('brokers',input.brokerId).name:input.broker,'Corretor'),origin=member(input.origin,['Vendas','Pró-Vendas','Proposta'],'Origem');
    const expires=date(input.expires,'Validade');if(expires<clock())throw new ValidationError('A validade não pode estar no passado.');
    const note=typeof input.note==='string'?input.note.trim():'';if(note.length>1000)throw new ValidationError('Observação deve ter até 1000 caracteres.');
    db.exec('BEGIN IMMEDIATE');try {
      expire();const unit=getUnit(input.unitId);if(unit.commercial!=='Disponível')throw new ValidationError('Esta unidade não está disponível para reserva.',409);
      flows.expire();if(db.prepare("SELECT id FROM proposals WHERE unit_id=? AND status IN ('Em Construção','Em Aprovação Comercial','Em Aprovação de Crédito','Aprovada')").get(input.unitId))throw new ValidationError('Esta unidade possui uma proposta aberta.',409);
      if(db.prepare("SELECT id FROM reservations WHERE unit_id=? AND status='Ativa'").get(input.unitId))throw new ValidationError('Esta unidade já está reservada.',409);
      const id=randomUUID();db.prepare('INSERT INTO reservations(id,unit_id,client,broker,origin,created,expires,status,note,client_id,broker_id) VALUES(?,?,?,?,?,?,?,?,?,?,?)').run(id,input.unitId,client,broker,origin,clock(),expires,'Ativa',note,input.clientId||null,input.brokerId||null);event(id,'Reserva criada');db.exec('COMMIT');return {id};
    }catch(e){db.exec('ROLLBACK');throw e;}
  }
  function cancel(id) {expire();const result=db.prepare("UPDATE reservations SET status='Cancelada' WHERE id=? AND status='Ativa'").run(id);if(!result.changes)throw new ValidationError('Reserva inexistente ou não está ativa.',409);event(id,'Reserva cancelada');}
  function listReservations() {expire();return db.prepare('SELECT r.*,COALESCE(c.name,r.client) client,COALESCE(b.name,r.broker) broker,u.name unit,u.project,u.tower FROM reservations r JOIN units u ON u.id=r.unit_id LEFT JOIN clients c ON c.id=r.client_id LEFT JOIN brokers b ON b.id=r.broker_id ORDER BY r.created DESC,r.rowid DESC').all();}
  if(seed && !db.prepare('SELECT COUNT(*) count FROM units').get().count) {
    for(let floor=1;floor<=5;floor++)for(let position=1;position<=4;position++)addUnit({project:'Residencial Aurora • Demonstração',name:`A-${floor}0${position}`,tower:'A',floor,area:position%2?68.5:82,price:350000+floor*12000+position*8500,commercial:floor===1&&position===4?'Reserva técnica':'Disponível',legal:'Livre',construction:'Em Construção'});
    reserve({unitId:listUnits()[0].id,client:'Cliente Exemplo',broker:'Corretor Exemplo',origin:'Pró-Vendas',expires:clock(),note:'Reserva fictícia para demonstração.'});
  }
  if(seed&&!flows.listClients().length){
    const demoClient=flows.addClient({name:'Cliente Demonstração',email:'cliente@example.com',phone:'',source:'Campanha de lançamento'});
    flows.addBroker({name:'Corretor Demonstração',email:'corretor@example.com',agency:'Imobiliária Exemplo'});
    const future=new Date(`${clock()}T12:00:00Z`);future.setUTCDate(future.getUTCDate()+30);const due=future.toISOString().slice(0,10),available=listUnits().filter(u=>u.status==='Disponível');
    flows.addActivity({clientId:demoClient.id,subject:'Visita ao apartamento decorado',owner:'Corretor Demonstração',due,note:'Atendimento fictício para testar a agenda.'});
    flows.addCampaign({name:'Lançamento • Demonstração',channel:'Indicação / site',starts:clock(),ends:due});
    if(available[0]){flows.addInterest({clientId:demoClient.id,project:available[0].project,type:'Apartamento',budget:450000,note:'Registro fictício.'});const proposal=flows.addProposal({clientId:demoClient.id,unitId:available[0].id,broker:'Corretor Demonstração',price:available[0].price,expires:due,note:'Proposta fictícia.'});for(const status of ['Em Aprovação Comercial','Em Aprovação de Crédito','Aprovada'])flows.proposalState(proposal.id,{status});flows.issueContract(proposal.id,{count:12,firstDue:due,rate:3,commissionCount:3});}
    if(available[1])flows.addProposal({clientId:demoClient.id,unitId:available[1].id,broker:'Corretor Demonstração',price:available[1].price,expires:due,note:'Proposta em elaboração para demonstração.'});
  }
  const core={...flows,listUnits,addUnit,reserve,cancel,listReservations};
  return {...core,...sales(db,clock,core),close:()=>db.close()};
}
