export const blank=value=>value===undefined||value===null||(typeof value==='string'&&!value.trim());
export const requiredRules={
  units:[['project','Empreendimento'],['name','Unidade'],['area','Área privativa'],['commonArea','Área comum'],['nonproportionalArea','Área comum de divisão não proporcional'],['fraction','Fração ideal'],['fractionArea','Fração ideal em m²'],['propertyType','Tipo de imóvel'],['indexer','Indexador'],['indexedQuantity','Quantidade indexada'],['availableDate','Data'],['commercial','Estoque comercial'],['legal','Estoque legal'],['construction','Estoque de obra']],
  contracts:[['company','Empresa'],['project','Empreendimento'],['code','Contrato'],['date','Data do contrato'],['delivery','Previsão de entrega'],['accountingDate','Data contábil'],['amount','Valor total'],['salePrice','Preço total da venda'],['correction','Tipo de correção'],['clients','Clientes do contrato'],['units','Unidades do contrato'],['conditions','Condições de pagamento'],['plans','Planos financeiros'],['plans.*.plan','Plano financeiro']],
  commissions:[['contractId','Contrato'],['brokers','Corretores'],['brokers.*.id','Corretor'],['brokers.*.base','Valor-base do contrato'],['brokers.*.count','Nº de parcelas'],['brokers.*.firstDue','1º vencimento']],
  priceTables:[['name','Tabela de preço'],['project','Empreendimento'],['version','Nome da versão'],['starts','Início da vigência'],['ends','Fim da vigência'],['conditions','Condições'],['conditions.*.type','Tipo de condição'],['conditions.*.share','% do valor da unidade'],['conditions.*.count','Quantidade de parcelas']],
  conditionTypes:[['name','Descrição'],['code','Código'],['count','Quantidade máxima de parcelas'],['interval','Intervalo']],
  indexers:[['name','Indexador'],['date','Data-base'],['value','Valor do índice']],
  models:[['name','Descrição'],['content','Texto do modelo']],
  deductions:[['name','Descrição'],['type','Tipo de dedução'],['value','Valor / percentual']],
  associations:[['unitId','Unidade'],['brokerId','Corretor']],
  clientProfiles:[['entityId','Cliente']],unitProfiles:[['entityId','Unidade']],
  departments:[['name','Departamento']],works:[['name','Obra']],financialPlans:[['name','Plano financeiro']],captureLocations:[['name','Local de captação']],teams:[['name','Equipe'],['members.*.id','Colaborador']]
};

export function missingRequired(kind,data){
  const missing=[];
  const walk=(value,parts,path,label)=>{
    if(!parts.length){if(blank(value)||(Array.isArray(value)&&!value.length))missing.push({path,label});return;}
    const [key,...rest]=parts;
    if(key==='*'){if(Array.isArray(value))value.forEach((item,i)=>walk(item,rest,`${path}.${i}`,`${label} (registro ${i+1})`));return;}
    walk(value?.[key],rest,path?`${path}.${key}`:key,label);
  };
  for(const [path,label] of requiredRules[kind]||[])walk(data,path.split('.'),'',label);
  return missing.map(item=>({...item,path:item.path.trim().replace(/^\./,'')}));
}

// All tabs are checked against the draft, including fields currently outside the DOM.
export function missingSchemaFields(sections,draft){
  const missing=[];
  sections.forEach(([section,fields],tab)=>fields.forEach(field=>{
    const value=field.key.split('.').reduce((item,key)=>item?.[key],draft);
    if(field.repeat){
      if(field.required&&(!Array.isArray(value)||!value.length))missing.push({tab,section,path:field.key,label:field.label,repeat:true});
      (Array.isArray(value)?value:[]).forEach((row,index)=>field.fields.forEach(child=>{
        const value=child.key.split('.').reduce((item,key)=>item?.[key],row);
        if(child.required&&blank(value))missing.push({tab,section,path:`${field.key}.${index}.${child.key}`,label:`${child.label} (registro ${index+1})`});
      }));
    }else if(field.required&&blank(value))missing.push({tab,section,path:field.key,label:field.label});
  }));
  return missing;
}

export function decorateRequired(form){
  form.noValidate=true;
  if(!form.querySelector('.required-help')){
    const help=document.createElement('p');help.className='helper required-help';help.textContent='Campos com * são obrigatórios.';
    form.querySelector('.dialog-head')?.after(help);
  }
  for(const input of form.querySelectorAll('input:not([type="hidden"]),select,textarea')){
    const label=input.closest('label');if(!label)continue;
    label.querySelector('.required-mark')?.remove();
    input.setAttribute('aria-required',String(input.required));
    if(!input.hasAttribute('aria-label'))input.setAttribute('aria-label',label.firstChild?.textContent?.trim()||input.name);if(input.required){let caption=label.querySelector('.field-caption');if(!caption){caption=document.createElement('span');caption.className='field-caption';caption.textContent=label.firstChild?.textContent||'';if(label.firstChild?.nodeType===3)label.firstChild.replaceWith(caption);else label.prepend(caption);}const mark=document.createElement('span');mark.className='required-mark';mark.textContent=' *';mark.setAttribute('aria-hidden','true');caption.append(mark);}
  }
}

export function validateForm(form){
  const missing=[];
  for(const input of form.querySelectorAll('input:not([type="hidden"]),select,textarea')){
    if(input.disabled)continue;
    const invalid=input.required&&blank(input.value)||!input.validity.valid;
    input.setAttribute('aria-invalid',String(Boolean(invalid)));
    if(invalid){const label=input.getAttribute('aria-label')||input.closest('label')?.childNodes[0]?.textContent?.trim()||input.name;missing.push({input,label});}
  }
  if(!missing.length)return true;
  const error=form.querySelector('.form-error');if(error)error.textContent=`Preencha corretamente os campos: ${missing.map(item=>item.label).join(', ')}.`;
  missing[0].input.focus();return false;
}
