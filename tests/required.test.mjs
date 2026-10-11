import test from 'node:test';
import assert from 'node:assert/strict';
import {createStore} from '../domain.mjs';
import {createServer} from '../server.mjs';
import {requiredUnit,requiredContract} from './fixtures.mjs';
import {requiredRules,missingRequired,missingSchemaFields} from '../public/form-validation.mjs';
const unit={...requiredUnit,project:'P',name:'101',area:60,commercial:'Disponível',legal:'Livre',construction:'Projeto'};
function setup(){const s=createStore(':memory:',{seed:false,clock:()=> '2026-10-11'}),u=s.addUnit(unit),client=s.addClient({name:'Cliente fictício'});s.salesSave('financialPlans',{id:'test-plan',name:'Plano fictício'});const draft={...requiredContract,company:'E',project:'P',code:'C1',date:'2026-10-11',amount:1000,clients:[{id:client.id,share:100,main:true}],units:[{id:u.id,share:100,main:true}],conditions:[{type:'PM',amount:1000,count:2,firstDue:'2026-11-01'}]};return{s,u,client,draft};}

test('cada campo com asterisco da unidade é exigido pelo domínio',()=>{
  const s=createStore(':memory:',{seed:false});try{for(const [key,label] of requiredRules.units){const input={...unit};delete input[key];assert.throws(()=>s.addUnit(input),error=>error.status===422&&error.message.includes(label));}assert.equal(s.listUnits().length,0);}finally{s.close();}
});

test('zero preenche campos numéricos obrigatórios e espaços não preenchem texto',()=>{
  const s=createStore(':memory:',{seed:false});try{const u=s.addUnit({...unit,commonArea:0,nonproportionalArea:0,indexedQuantity:0});assert.equal(u.commonArea,0);assert.equal(u.indexedQuantity,0);assert.throws(()=>s.addUnit({...unit,name:'   '}),/Unidade/);assert.throws(()=>s.addUnit({...unit,name:'102',propertyType:'   '}),/Tipo de imóvel/);}finally{s.close();}
});

test('obrigatórios do contrato bloqueiam gravação e estoque, inclusive planos em outra aba',()=>{
  const {s,draft}=setup();try{for(const key of ['company','project','code','date','delivery','accountingDate','amount','salePrice','correction','clients','units','conditions','plans']){const input={...draft};delete input[key];assert.throws(()=>s.salesSave('contracts',input),/obrigatórios/);}assert.throws(()=>s.salesSave('contracts',{...draft,plans:[{share:100,main:true}]}),/Plano financeiro/);assert.equal(s.salesList('contracts').length,0);assert.equal(s.listUnits()[0].status,'Disponível');assert.equal(s.salesSave('contracts',draft).code,'C1');}finally{s.close();}
});

test('verificação de formulário considera abas fechadas e registros repetidos',()=>{
  const sections=[['Cadastro',[{key:'company',label:'Empresa',required:true}]],['Clientes',[{key:'clients',label:'Clientes',repeat:true,required:true,fields:[{key:'id',label:'Cliente',required:true},{key:'share',label:'Participação',required:true}]}]]];
  assert.deepEqual(missingSchemaFields(sections,{company:'E',clients:[{id:'',share:0}]}).map(f=>[f.tab,f.path]),[[1,'clients.0.id']]);
  assert.equal(missingSchemaFields(sections,{company:' ',clients:[]}).length,2);
  assert.equal(missingSchemaFields(sections,{company:'E',clients:[{id:'C',share:0}]}).length,0);
});

test('a mesma política rejeita planos vazios na importação sem criar contrato',()=>{
  const {s,draft}=setup();try{const preview=s.salesImportPreview({contracts:[{...draft,plans:[]}]});assert.equal(preview[0].valid,false);assert.match(preview[0].error,/Planos financeiros/);assert.throws(()=>s.salesImport({contracts:[{...draft,delivery:''}]}),/erros/);assert.equal(s.salesList('contracts').length,0);}finally{s.close();}
});

test('campos opcionais não são exigidos e metadados de grupos mantêm vínculo',()=>{
  assert.equal(missingRequired('units',unit).length,0);
  assert.equal(missingRequired('commissions',{contractId:'C',brokers:[{id:'B',base:1000,count:1,firstDue:'2027-01-01'}]}).length,0);
  assert.equal(missingRequired('commissions',{contractId:'C',brokers:[{base:1000,count:1,firstDue:'2027-01-01'}]})[0].path,'brokers.0.id');
});

test('API bloqueia salvamento sem obrigatório e disponibiliza o módulo de validação',async()=>{
  const {s,draft}=setup(),server=createServer(s);await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const base=`http://127.0.0.1:${server.address().port}`;
  try{const post=(path,body)=>fetch(base+path,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});const res=await post('/api/sales/contracts',{...draft,delivery:''});assert.equal(res.status,422);assert.match((await res.json()).error,/Previsão de entrega/);assert.equal((await post('/api/units',{...unit,name:'102',fractionArea:''})).status,422);assert.equal((await fetch(base+'/form-validation.mjs')).status,200);assert.equal(s.salesList('contracts').length,0);}finally{await new Promise(resolve=>server.close(resolve));s.close();}
});

test('emissão por proposta sem obrigatórios desfaz contrato, comissão e venda',()=>{
  const {s,u,client}=setup();try{const p=s.addProposal({unitId:u.id,clientId:client.id,broker:'Teste',price:1000,expires:'2026-12-31'});for(const status of ['Em Aprovação Comercial','Em Aprovação de Crédito','Aprovada'])s.proposalState(p.id,{status});assert.throws(()=>s.issueContract(p.id,{count:2,firstDue:'2026-11-01',rate:3}),/obrigatórios/);assert.equal(s.listContracts().length,0);assert.equal(s.listCommissions().length,0);assert.equal(s.listProposals()[0].status,'Aprovada');assert.equal(s.listUnits()[0].status,'Proposta');}finally{s.close();}
});
