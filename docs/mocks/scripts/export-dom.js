// Serialize rendered Angular DOM; retain encapsulation attributes and source classes.
({screen, state, routes, links}) => {
  const root = document.querySelector('app-root');
  const clone = root.cloneNode(true);
  const originals = [...root.querySelectorAll('*')];
  const copies = [...clone.querySelectorAll('*')];
  const limitations = [];
  originals.forEach((el,i) => {
    const copy = copies[i];
    if (el instanceof HTMLInputElement) {
      if (el.type !== 'file') copy.setAttribute('value', el.value);
      if (el.checked) copy.setAttribute('checked',''); else copy.removeAttribute('checked');
    }
    if (el instanceof HTMLTextAreaElement) copy.textContent=el.value;
    if (el instanceof HTMLOptionElement) {
      if (el.selected) copy.setAttribute('selected',''); else copy.removeAttribute('selected');
    }
    // Keep source event expressions as provenance, but only static navigation executes.
    const events = window.ng.getListeners(el).filter(e => ['click','submit'].includes(e.name));
    if (events.length) copy.dataset.sourceAction=events.map(e=>e.name).join(',');
    for (const a of [...copy.attributes]) if (a.name.startsWith('ng-reflect-')) copy.removeAttribute(a.name);
  });
  clone.querySelectorAll('script,router-outlet').forEach(el=>el.remove());
  const walker=document.createTreeWalker(clone,NodeFilter.SHOW_COMMENT);
  const comments=[]; while(walker.nextNode()) comments.push(walker.currentNode);
  comments.forEach(n=>n.remove());
  for(const a of clone.querySelectorAll('a[href]')) {
    const href=a.getAttribute('href');
    if(href.startsWith('/')) {
      const route=href.split('?')[0];
      if(routes[route]) a.href=routes[route];
      else { a.href='../../index.html'; limitations.push('Unimplemented route '+href+' returns to the gallery.'); }
    }
  }
  for(const [selector,target] of Object.entries(links)) {
    clone.querySelectorAll(selector).forEach(el=>{
      if(el.tagName==='A') el.setAttribute('href',target);
      else {el.dataset.mockHref=target; if(!['BUTTON','INPUT','SELECT'].includes(el.tagName)) {el.tabIndex=0;el.setAttribute('role','link');}}
    });
  }
  // Labels here belong to the static review artifact; no application source is changed.
  clone.querySelectorAll('input,textarea,select').forEach((el,i)=>{
    if(el.type==='hidden')return;
    if(el.id && clone.querySelector(`label[for="${CSS.escape(el.id)}"]`))return;
    if(el.closest('label') || el.hasAttribute('aria-label'))return;
    const label=el.closest('.form-group,.color-group,.scope-group')?.querySelector('label')?.textContent?.trim() || el.getAttribute('placeholder') || el.getAttribute('formcontrolname') || el.getAttribute('name') || el.dataset.testid || (el.type==='file'?'Choose file':'Form field '+(i+1));
    el.setAttribute('aria-label',label);
    limitations.push('Static review label added: '+label);
  });
  clone.querySelectorAll('button,a').forEach(el=>{
    if(el.textContent.trim() || el.getAttribute('aria-label'))return;
    const label=(el.dataset.testid || el.getAttribute('title') || 'Icon action').replaceAll('-',' ');
    el.setAttribute('aria-label',label); limitations.push('Static review name added: '+label);
  });
  clone.querySelectorAll('img').forEach(el=>{if(!el.hasAttribute('alt')){el.alt='';limitations.push('Decorative image alt added for review.');}});
  if(!clone.querySelector('main')) clone.setAttribute('role','main');
  const main=clone.querySelector('main') || clone;
  main.id='main';
  const h1=clone.querySelectorAll('h1').length;
  if(h1!==1) limitations.push('Source has '+h1+' h1 headings; retained for fidelity.');
  return {html:clone.outerHTML,limitations,headings:h1,hasMain:!!clone.querySelector('main'),styles:[...document.styleSheets].filter(s=>!s.href || new URL(s.href).origin===location.origin).map(s=>[...s.cssRules].map(r=>r.cssText).join('\n'))};
}
