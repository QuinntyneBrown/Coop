/* Adapted from the invoked skill: chrome handling and state-link navigation.
   Theme: ?theme=light|dark forces one. Otherwise public mocks stay light (their
   markup sets data-theme="light"; the public app has no dark theme) and admin
   mocks follow the OS preference through docs/design-system/tokens/tokens.css. */
(() => {
  const params=new URLSearchParams(location.search);
  const theme=params.get('theme');if(theme==='light'||theme==='dark')document.documentElement.dataset.theme=theme;
  if(params.get('chrome')==='0')document.documentElement.dataset.chrome='off';
  function go(target){const url=new URL(target,location.href);if(params.get('chrome')==='0')url.searchParams.set('chrome','0');location.href=url.href;}
  function note(text){let box=document.querySelector('.mock-status');if(!box){box=document.createElement('div');box.className='mock-status';box.setAttribute('role','status');document.body.append(box);}box.textContent=text;setTimeout(()=>box.remove(),4500);}
  document.addEventListener('click',e=>{
    const link=e.target.closest('[data-mock-href]');if(link && !link.disabled){e.preventDefault();go(link.dataset.mockHref);return;}
    const inert=e.target.closest('button,[data-source-action],a:not([href])');
    if(inert && !inert.closest('.mock-bar') && !inert.closest('a[href]')){e.preventDefault();note('Static implementation reference. Use the state links in the review panel to inspect outcomes. No data is saved.');}
  });
  document.addEventListener('submit',e=>{e.preventDefault();const target=e.target.querySelector('[type="submit"][data-mock-href]');if(target)go(target.dataset.mockHref);else note('Static form. No data is submitted.');});
  document.addEventListener('keydown',e=>{if(['Enter',' '].includes(e.key) && e.target.matches('[data-mock-href]:not(button)')){e.preventDefault();go(e.target.dataset.mockHref);}if(e.key==='Escape')document.querySelector('.mock-status')?.remove();});
  document.querySelectorAll('a[href]').forEach(a=>a.addEventListener('click',()=>{if(params.get('chrome')==='0'){const u=new URL(a.href);u.searchParams.set('chrome','0');a.href=u.href;}}));
})();
