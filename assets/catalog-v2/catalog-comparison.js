/* Portable catalog comparison logic; also usable inline by independent previews. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.SahandComparison=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const machineCategories=new Set(['cutting','welding','marking','cleaning']);
  function eligible(product){return Boolean(product&&machineCategories.has(product.category)&&product.comparable!==false);}
  function initial(catalog,selectedCode,random=Math.random){
    const selected=catalog.find(p=>p.code===selectedCode);if(!eligible(selected))return [];
    const peers=catalog.filter(p=>eligible(p)&&p.category===selected.category&&p.code!==selected.code);
    for(let i=peers.length-1;i>0;i--){const j=Math.min(i,Math.max(0,Math.floor(random()*(i+1))));[peers[i],peers[j]]=[peers[j],peers[i]];}
    return [selected.code,...peers.slice(0,2).map(p=>p.code)];
  }
  function add(catalog,currentCodes,code){
    const product=catalog.find(p=>p.code===code);if(!eligible(product))return [...currentCodes];
    const current=[...new Set(currentCodes)].filter(id=>eligible(catalog.find(p=>p.code===id)));
    const first=catalog.find(p=>p.code===current[0]);if(first&&first.category!==product.category)return current;
    return current.includes(code)?current:[...current,code];
  }
  function values(product){
    const data={};for(const field of product.comparisonFields||[])data[field]=null;
    const set=(field,value,scope,source)=>{if(field in data&&value)data[field]={value:String(value),scope,source:source||null};};
    for(const field of Object.keys(data)){
      const aliases={توان:/توان/,سورس:/^سورس|منبع لیزر/,هد:/^هد/,کنترلر:/کنترلر|سیستم کنترل/,دقت:/دقت/,سرعت:/سرعت/,خنک‌کاری:/خنک/, 'نوع لیزر':/نوع لیزر|نوع خروجی/,'برق ورودی':/برق ورودی/,'محدوده حکاکی':/محدوده حکاکی|محدوده کار|ابعاد حکاکی/};
      const matcher=aliases[field];if(matcher){const spec=product.specs.find(s=>matcher.test(s.label));if(spec)set(field,spec.value,spec.scope||'catalog',spec.source);}
    }
    if(product.power)set('توان',product.power,'catalog_identity');
    if(product.category==='cutting'){
      set('گروه ابعادی',product.family,'user_requested_taxonomy');
      if(['3015','6020'].includes(product.family)){
        set('ساختار میز',product.name.includes('دو میز')?'دو میز':'تک میز','user_requested_taxonomy');
        set('کابین',product.name.includes('کابین')?'کابین‌دار':'بدون کابین در نام پیکربندی','user_requested_taxonomy');
        set('لوله‌بر',product.name.includes('+ لوله')?'ورق و لوله':'ورق‌بر در نام پیکربندی','user_requested_taxonomy');
      }
      for(const [key,field]of [['power','توان'],['source','سورس'],['head','هد'],['controller','کنترلر']])if(product.seriesReference?.[key])set(field,product.seriesReference[key]+' (گزینه‌های سری)','supplied_series_options',product.seriesReference.document);
    }
    if(product.category==='marking'){
      const series=product.seriesReference;
      if(series?.scope==='user_supplied_marking_series_options'){
        for(const [key,field]of [['source','سورس'],['controller','کنترلر'],['workingArea','محدوده حکاکی'],['lens','لنز'],['head','گالوو']])if(series[key])set(field,series[key]+' (گزینه‌های سری)','user_supplied_series_options',series.document);
        const supply=product.specs.find(s=>s.label==='برق معرفی‌شده سری فایبر در بروشور');
        if(supply)set('برق ورودی',supply.value,supply.scope,supply.source);
      }
      const type=product.name.match(/UV|MOPA|فایبر/i);if(type)set('نوع لیزر',type[0],'catalog_identity');
      const format=product.name.match(/پرتابل|رومیزی|میزدار|Inline/i);if(format)set('روش نصب',format[0],'catalog_identity');
    }
    if(product.category==='cleaning'){
      const type=product.name.match(/پالسی|پیوسته/);if(type)set('نوع لیزر',type[0],'catalog_identity');
      if(product.name.includes('پرتابل'))set('نوع کاربری','پرتابل','catalog_identity');
    }
    if(product.category==='welding'){
      if(/Air.?Cool|Air Cooling/i.test(product.name))set('خنک‌کاری','هواخنک','catalog_identity');
      if(/QCW/.test(product.name))set('نوع لیزر','QCW','catalog_identity');
      if(/Spot/.test(product.name))set('نوع جوش','نقطه‌ای','catalog_identity');
      if(/Robotic/.test(product.name))set('نوع کاربری','رباتیک','catalog_identity');
      if(/Handheld/.test(product.name))set('نوع کاربری','دستی','catalog_identity');
      if(/Portable/.test(product.name))set('نوع کاربری','پرتابل','catalog_identity');
      if(product.name.includes('فایبر'))set('نوع لیزر','فایبر','catalog_identity');
    }
    return data;
  }
  return {eligible,initial,add,values};
});

