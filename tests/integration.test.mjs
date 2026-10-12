import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {createStore} from './fixtures.mjs';
import {createServer} from '../server.mjs';

function setup(file=':memory:'){
  const s=createStore(file,{seed:false,clock:()=> '2026-10-11'});
  const unit=(name,project='P1')=>s.addUnit({project,name,tower:'A',floor:1,area:60,price:1000,commercial:'Disponível',legal:'Livre',construction:'Projeto'});
  const u=unit('101'),v=unit('102'),other=unit('101','P2');
  const c=s.addClient({name:'Cliente teste'}),b=s.addBroker({name:'Corretor teste'});
  const proposal=(unitId=u.id,extra={})=>s.addProposal({unitId,clientId:c.id,brokerId:b.id,price:1000,expires:'2026-12-31',...extra});
  const approve=id=>{for(const status of ['Em Aprovação Comercial','Em Aprovação de Crédito','Aprovada'])s.proposalState(id,{status});};
  const issue=id=>{approve(id);return s.issueContract(id,{count:2,firstDue:'2026-11-01',rate:3});};
  return{s,u,v,other,c,b,proposal,issue};
}

test('reserva vinculada converte em proposta e chega ao contrato e comissão',()=>{
  const {s,u,c,b,proposal,issue}=setup();try{
    const r=s.reserve({unitId:u.id,clientId:c.id,brokerId:b.id,origin:'Pró-Vendas',expires:'2026-12-31'});
    s.editClient(c.id,{name:'Cliente atualizado'});
    assert.equal(s.listReservations()[0].client,'Cliente atualizado');
    assert.throws(()=>proposal(u.id,{reservationId:r.id,clientId:s.addClient({name:'Outro'}).id}),/cliente vinculado/);
    assert.equal(s.listReservations()[0].status,'Ativa');
    const p=proposal(u.id,{reservationId:r.id});assert.equal(s.listReservations()[0].status,'Convertida');
    const t=issue(p.id),rich=s.salesGet('contracts',t.id);
    assert.equal(rich.proposalId,p.id);assert.equal(rich.reservationId,r.id);assert.equal(rich.brokers[0].id,b.id);
    assert.equal(s.salesList('commissions')[0].contractId,t.id);assert.equal(s.listUnits().find(x=>x.id===u.id).status,'Vendida');
    assert.equal(s.salesReport().ranking[0].broker,'Corretor teste');
  }finally{s.close();}
});

test('baixa na API nova e distrato pela anterior usam o mesmo contrato',()=>{
  const {s,proposal,issue,u}=setup();try{
    const t=issue(proposal().id);let c=s.salesGet('contracts',t.id);
    c=s.salesReceipt(c.id,{revision:c.revision,installmentId:c.installments[0].id,amount:100,date:'2026-10-11'});
    assert.equal(s.details(t.id).installments[0].paidCents,10000);
    assert.equal(s.salesReport().totals.received,100);
    s.terminate(t.id,{note:'Encerrar teste'});
    assert.equal(s.salesGet('contracts',t.id).status,'Distratado');assert.equal(s.listContracts()[0].status,'Distratado');
    assert.equal(s.salesList('commissions')[0].installments[0].status,'Canceladas');
    const d=s.salesList('terminations')[0];assert.equal(d.receivedCents,10000);assert.equal(d.refundCents,10000);
    assert.equal(s.listUnits().find(x=>x.id===u.id).status,'Disponível');
    const ended=s.salesGet('contracts',t.id);assert.throws(()=>s.salesAction('contracts',t.id,{revision:ended.revision,action:'rename',code:'ENCERRADO'}),/baixas/);
    assert.equal(s.listUnits().find(x=>x.id===u.id).status,'Disponível');
    assert.throws(()=>s.salesBulk({ids:[t.id],firstDue:'2027-01-01'}),/distratado/);
    issue(proposal().id);assert.equal(s.listContracts().length,2);
  }finally{s.close();}
});

test('comissão paga na API nova bloqueia distrato antigo e vice-versa',()=>{
  const {s,proposal,issue}=setup();try{
    const t=issue(proposal().id);let m=s.salesList('commissions')[0];
    s.commissionState(m.id,{status:'Aguardando liberação'});m=s.salesGet('commissions',m.id);
    assert.equal(m.installments[0].status,'Aguardando liberação');
    m=s.salesAction('commissions',m.id,{revision:m.revision,action:'release'});
    s.salesAction('commissions',m.id,{revision:m.revision,action:'pay',date:'2026-10-11',reference:'Teste fictício'});
    assert.equal(s.listCommissions()[0].status,'Pagas');assert.throws(()=>s.terminate(t.id,{note:'Teste'}),/comissão paga/);
  }finally{s.close();}
});

test('aditivo de contrato originado em proposta libera unidade para nova venda',()=>{
  const {s,proposal,issue,u,v}=setup();try{
    const t=issue(proposal().id);let a=s.salesSave('addenda',{contractId:t.id,date:'2026-10-11',changes:{units:[{id:v.id,share:100,main:true}]}});
    s.salesAction('addenda',a.id,{revision:a.revision,action:'approve'});
    assert.equal(s.listContracts()[0].unit_id,v.id);assert.equal(s.listUnits().find(x=>x.id===u.id).status,'Disponível');
    issue(proposal(u.id).id);assert.equal(s.listContracts().length,2);
  }finally{s.close();}
});

test('distrato encerra aditivo pendente sem permitir reativação de estoque',()=>{
  const {s,proposal,issue}=setup();try{
    const t=issue(proposal().id),c=s.salesGet('contracts',t.id);
    const a=s.salesSave('addenda',{contractId:t.id,date:'2026-10-11',changes:{conditions:[{type:'PM',amount:1000,count:3,firstDue:'2027-01-01'}]}});
    s.salesTerminate({contractId:t.id,revision:c.revision,date:'2026-10-11',reason:'Encerrar'});
    assert.equal(s.salesGet('addenda',a.id).status,'Reprovado');
    assert.throws(()=>s.salesAction('addenda',a.id,{revision:a.revision,action:'approve'}),/pendente/);
    const ended=s.salesGet('contracts',t.id);s.salesAction('contracts',t.id,{revision:ended.revision,action:'rename',code:'ENCERRADO'});
    assert.equal(s.listUnits().filter(u=>u.status==='Vendida'||u.status==='Proposta').length,0);
  }finally{s.close();}
});

test('cadastros complementares e apropriações validam os vínculos',()=>{
  const {s,c,u,proposal,issue}=setup();try{
    s.salesSave('clientProfiles',{entityId:c.id,profession:'Engenheiro'});s.salesSave('unitProfiles',{entityId:u.id,note:'Teste'});
    assert.equal(s.listClients()[0].profile.profession,'Engenheiro');assert.equal(s.listUnits().find(x=>x.id===u.id).profile.note,'Teste');
    assert.throws(()=>s.salesSave('clientProfiles',{entityId:c.id}),/já existe/);
    assert.throws(()=>s.salesSave('teams',{name:'Equipe',members:[{id:'ausente'}]}),/Vínculo/);
    const t=issue(proposal().id);assert.throws(()=>s.salesSave('commissions',{contractId:t.id,brokers:[{id:s.listBrokers()[0].id,base:1000,rate:3,count:1,firstDue:'2027-01-01',work:'ausente'}]}),/não encontrado/);
  }finally{s.close();}
});

test('relatórios respeitam empreendimento e corretor sem duplicar VGV no ranking',()=>{
  const {s,u,other,c,b,proposal,issue}=setup();try{
    issue(proposal().id);const b2=s.addBroker({name:'Segundo'});issue(proposal(other.id,{brokerId:b2.id}).id);
    const r=s.salesReport({project:u.project,brokerId:b.id});assert.equal(r.contracts.length,1);assert.equal(r.commissions.length,1);assert.equal(r.units.length,2);assert.equal(r.totals.vgv,1000);
    assert.equal(s.salesReport({project:'P2',brokerId:b.id}).totals.count,0);
    const free=s.addUnit({project:'P1',name:'103',tower:'A',floor:1,area:60,price:1000,commercial:'Disponível',legal:'Livre',construction:'Projeto'});
    let d=s.salesSave('contracts',{delivery:'2027-01-01',accountingDate:'2026-10-11',salePrice:1000,correction:'Mensal',plans:[{plan:'test-plan',share:100,main:true}],company:'E',project:'P1',code:'MULTI',date:'2026-10-11',amount:1000,clients:[{id:c.id,share:100,main:true}],units:[{id:free.id,share:100,main:true}],brokers:[{id:b.id},{id:b2.id}],conditions:[{type:'PM',amount:1000,count:1,firstDue:'2027-01-01'}]});
    d=s.salesAction('contracts',d.id,{revision:d.revision,action:'authorize'});s.salesAction('contracts',d.id,{revision:d.revision,action:'issue'});
    assert.equal(s.salesReport().ranking.reduce((sum,r)=>sum+r.value,0),s.salesReport().totals.vgv);
  }finally{s.close();}
});

test('as duas rotas HTTP consultam o mesmo estado e persistem após reabrir',async()=>{
  const dir=mkdtempSync(join(tmpdir(),'comercial-integracao-')),file=join(dir,'test.sqlite');const {s,proposal,issue}=setup(file);
  const t=issue(proposal().id),server=createServer(s);await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const base=`http://127.0.0.1:${server.address().port}/api/`;
  try{
    const c=await(await fetch(base+`sales/contracts/${t.id}/details`)).json();
    const result=await fetch(base+`sales/contracts/${t.id}/receipt`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({revision:c.revision,installmentId:c.installments[0].id,amount:100,date:'2026-10-11'})});assert.equal(result.status,200);
    const old=await(await fetch(base+`contracts/${t.id}/details`)).json();assert.equal(old.installments[0].paidCents,10000);
  }finally{await new Promise(resolve=>server.close(resolve));s.close();}
  const reopened=createStore(file,{seed:false,clock:()=> '2026-10-11'});try{assert.equal(reopened.details(t.id).installments[0].paidCents,10000);assert.equal(reopened.salesReport().totals.received,100);}finally{reopened.close();rmSync(dir,{recursive:true,force:true});}
});

test('corretores com nomes iguais conservam identificadores diferentes na comissão',()=>{
  const {s,b,proposal,issue}=setup();try{
    const second=s.addBroker({name:s.listBrokers().find(x=>x.id===b.id).name});
    const t=issue(proposal(undefined,{brokerId:second.id}).id);
    assert.equal(s.salesGet('contracts',t.id).brokers[0].id,second.id);
    assert.equal(s.salesList('commissions')[0].brokers[0].id,second.id);
  }finally{s.close();}
});

test('configuração do distrato e recebimento alimentam devolução e liberação automática',()=>{
  const {s,proposal,issue,b}=setup();try{
    const t=issue(proposal().id);let c=s.salesGet('contracts',t.id);
    s.salesSave('settings',{id:'termination',revision:s.salesList('settings')[0].revision,minimum:80,days:30});
    let m=s.salesSave('commissions',{contractId:t.id,autoRelease:true,releasePercent:10,brokers:[{id:b.id,base:1000,rate:1,count:1,firstDue:'2027-01-01'}]});
    m=s.salesAction('commissions',m.id,{revision:m.revision,action:'authorize'});assert.equal(m.installments[0].status,'Aguardando liberação');
    c=s.salesReceipt(c.id,{revision:c.revision,installmentId:c.installments[0].id,amount:100,date:'2026-10-11'});
    assert.equal(s.salesGet('commissions',m.id).installments[0].status,'Liberadas');
    assert.equal(s.salesTerminationPreview({contractId:c.id,deductions:[{type:'Fixo',value:99}]}).refundCents,8000);
  }finally{s.close();}
});
