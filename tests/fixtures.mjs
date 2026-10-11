import {createStore as createDomainStore} from '../domain.mjs';
export const requiredUnit={commonArea:0,nonproportionalArea:0,fraction:1,fractionArea:60,propertyType:'Apartamento',indexer:'REAL',indexedQuantity:1000,availableDate:'2026-10-11'};
export const requiredContract={delivery:'2027-01-01',accountingDate:'2026-10-11',salePrice:1000,correction:'Mensal',plans:[{plan:'test-plan',share:100,main:true}]};
export function createStore(...args){
  const store=createDomainStore(...args);
  if(!store.salesList('financialPlans').some(p=>p.id==='test-plan'))store.salesSave('financialPlans',{id:'test-plan',name:'Plano fictício de testes'});
  const addUnit=store.addUnit,issue=store.issueContract;
  store.addUnit=input=>addUnit({...requiredUnit,...input});
  store.issueContract=(id,input)=>issue(id,{company:'Empresa de testes',code:`TEST-${id}`,delivery:'2027-01-01',salePrice:store.listProposals().find(p=>p.id===id)?.price_cents/100,planId:'test-plan',correction:'Mensal',...input});
  return store;
}
