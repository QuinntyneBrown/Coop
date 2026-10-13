"""Export source-rendered static HTML. Run both apps' development servers first.

Requires Python playwright. APIs are blocked; fictional fixture data is set on
debug component instances. ng.applyChanges renders the original templates.
No application source is patched. See README for commands and limitations.
"""
import argparse
import hashlib
import html
import json
import re
import urllib.request
from pathlib import Path
from playwright.sync_api import sync_playwright
from scenarios import screens, manifest

ROOT=Path(__file__).resolve().parents[1]
REPO=ROOT.parents[1]
FOLDERS={'page':'pages','dialog':'dialogs','notification':'notifications'}
def path(s,state='default'):
    return f"{FOLDERS[s['kind']]}/{s['id']}/{state}.html"
def href(id,state='default'):
    s=next(s for s in screens if s['id']==id)
    return '../../'+path(s,state)
def navlinks(s,case):
    app=s['app']; parent=s.get('opens_from',s['id']); name=parent[len(app)+1:]
    links={}
    def tid(test,target,state='default'):
        links[f'[data-testid="{test}"]']=href(app+'-'+target,state)
    # Each supported route also remains accessible through the gallery.
    if name=='maintenance':
        tid('maintenance-create-btn','maintenance-create')
        for key in ['all','new','started','done','received','completed']:
            if app=='public' and key in ['received','completed']:continue
            tid('maintenance-filter-'+key,'maintenance','default' if key=='all' else 'done' if key=='completed' else key)
        tid('maintenance-request-card','maintenance-detail' if app=='public' else 'maintenance','default' if app=='public' else 'detail-new')
        if app=='admin':
            for t in ['details','comments']:tid('maintenance-tab-'+t,'maintenance','detail-new' if t=='details' else 'comments')
            tid('maintenance-receive-button','maintenance','detail-received')
        tid('maintenance-cancel-btn','maintenance')
    if name=='documents':
        for key in ['all','notices','bylaws','reports']:
            for prefix in ['documents-filter-','documents-tab-']:tid(prefix+key,'documents','default' if key=='all' else key)
        tid('document-card','document-viewer');tid('document-viewer-close','documents')
        if app=='admin':
            tid('documents-new-button','document-create');tid('document-delete-button','document-delete');tid('document-dialog-cancel','documents')
    if name=='messaging':
        for t in ['messaging-conversation-item','conversation-item']:tid(t,'messaging','chat')
        tid('messaging-back-to-list','messaging')
        if app=='admin':tid('new-conversation-button','new-conversation');tid('new-conversation-cancel','messaging');tid('new-conversation-start','messaging')
    if name in ['profile','profiles']:
        for t in ['profile-edit-btn','profiles-edit-link']:tid(t,name,'edit')
        for t in ['profile-cancel-btn','profile-cancel']:tid(t,name)
        tid('profile-change-password-btn',name,'password');tid('profile-logout-btn','login')
        if app=='public':tid('profile-switcher','profile-switcher')
    if name=='users':
        for t,d in [('users-add-button','user-create'),('user-edit-button','user-edit'),('user-delete-button','user-delete'),('user-dialog-cancel','users'),('user-delete-cancel','users')]:tid(t,d)
        tid('users-pagination-next','users','page-2');tid('users-pagination-prev','users')
    if name=='assets':
        for t,d in [('assets-upload-button','asset-upload'),('asset-card','asset-detail'),('asset-delete-button','asset-delete'),('upload-cancel','assets')]:tid(t,d)
    if name=='invitations':
        tid('invitations-create-button','invitation-create');tid('invitation-dialog-cancel','invitations');tid('invitation-token-close','invitations')
    if name=='settings':
        for t in ['theme','content','account']:tid('settings-tab-'+t,'settings','default' if t=='theme' else t)
    if name=='onboarding':
        tid('onboarding-get-started-btn','onboarding','profile');tid('onboarding-go-to-dashboard-btn','dashboard')
        tid('onboarding-next-btn','onboarding','unit' if case['name']=='profile' else 'success' if app=='public' else 'unit')
        tid('onboarding-back-btn','onboarding','default' if case['name']=='profile' else 'profile')
        tid('onboarding-skip-btn','onboarding','success' if app=='public' else 'unit')
        tid('onboarding-unit-option','onboarding','unit-selected')
    if s['kind']=='dialog':
        links['.close-btn']=href(parent)
    return links

def local_fonts():
    folder=ROOT/'assets/fonts';folder.mkdir(parents=True,exist_ok=True)
    file=ROOT/'assets/fonts.css'
    if file.exists():return
    chunks=[]
    for url in ['https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap','https://fonts.googleapis.com/icon?family=Material+Icons']:
        css=urllib.request.urlopen(url).read().decode()
        for remote in set(re.findall(r'https://fonts.gstatic.com/[^)\s]+',css)):
            content=urllib.request.urlopen(remote).read();ext=remote.split('.')[-1]
            name=hashlib.sha256(content).hexdigest()[:12]+'.'+ext
            (folder/name).write_bytes(content);css=css.replace(remote,'fonts/'+name)
        chunks.append(css)
    file.write_text('\n'.join(chunks),encoding='utf-8')

def main():
    parser=argparse.ArgumentParser();parser.add_argument('--only');parser.add_argument('--source-screenshots',action='store_true');args=parser.parse_args()
    for d in ['assets/styles','.cache/source']: (ROOT/d).mkdir(parents=True,exist_ok=True)
    local_fonts()
    (ROOT/'manifest.json').write_text(json.dumps(manifest(),indent=2)+'\n',encoding='utf-8')
    exporter=(ROOT/'scripts/export-dom.js').read_text(encoding='utf-8')
    reports=[]
    with sync_playwright() as p:
        browser=p.chromium.launch()
        for s in screens:
            if args.only and args.only not in s['id']:continue
            print(s['id'],len(s['cases']),flush=True)
            context=browser.new_context(viewport={'width':1280,'height':800},locale='en-CA',timezone_id='America/Toronto')
            context.add_init_script("localStorage.setItem('auth_token','fictional-mock-token');localStorage.setItem('auth_user_id','user-mira');localStorage.setItem('auth_username','mira.fern');")
            context.route('**/api/**',lambda route:route.fulfill(status=503,content_type='application/json',body='{}'))
            page=context.new_page()
            errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
            origin='http://127.0.0.1:'+('4311' if s['app']=='public' else '4312')
            for case in s['cases']:
                page.goto(origin+s['route'],wait_until='networkidle')
                page.wait_for_function('(selector)=>!!window.ng?.getComponent(document.querySelector(selector))',arg=s['selector'])
                page.evaluate("""({s,case:scenario})=>{const el=document.querySelector(s.selector);const c=ng.getComponent(el);Object.assign(c,s.base,scenario.patch);for(const [name,values] of Object.entries(scenario.forms))if(c[name]?.patchValue)c[name].patchValue(values);if(scenario.action)new Function('c',scenario.action)(c);ng.applyChanges(c);const layout=document.querySelector('app-layout');if(layout){const l=ng.getComponent(layout);if('profile' in l)l.profile={firstName:'Mira',lastName:'Fern'};ng.applyChanges(l);}}""",dict(s=s,case=case))
                page.wait_for_timeout(60)
                # Use bundled fonts for reproducible offline source/static comparisons.
                page.add_style_tag(content=(ROOT/'assets/fonts.css').read_text().replace('url(fonts/','url('+ (ROOT/'assets/fonts').as_uri()+'/'))
                routes={t['route']:href(t['id']) for t in screens if t['kind']=='page' and t['app']==s['app']}
                if s['app']=='admin':routes['/messaging']=href('admin-messaging')
                data=page.evaluate(exporter,dict(screen=s,state=case,routes=routes,links=navlinks(s,case)))
                styles=[]
                for css in data['styles']:
                    css=re.sub(r'/\*# sourceMappingURL=.*?\*/','',css,flags=re.S)
                    css=re.sub(r'@import[^;]+;','',css)
                    if '@font-face' in css:continue
                    if not css.strip():continue
                    name=hashlib.sha256(css.encode()).hexdigest()[:16]+'.css'
                    (ROOT/'assets/styles'/name).write_text(css,encoding='utf-8');styles.append(name)
                title=s['title']+' · '+case['name']
                metas={'screen':s['id'],'kind':s['kind'],'state':case['name'],'requirements':', '.join(s['requirements'])}
                head='\n'.join(f'<meta name="mock:{k}" content="{html.escape(v)}">' for k,v in metas.items())
                head+='\n'+ '\n'.join(f'<link rel="stylesheet" href="../../assets/{name}">' for name in ['tokens.css','fonts.css']+['styles/'+n for n in styles]+['mock.css'])
                notes=' '.join(filter(None,[s['note'],case['note'],'Static capture of the implemented light UI. Forms do not submit. Missing states and source limitations are documented in the README.']))
                links=' '.join(f'<a href="{c["name"]}.html"'+(' aria-current="page"' if c==case else '')+'>'+html.escape(c['name'])+'</a>' for c in s['cases'])
                related=[t for t in screens if t.get('opens_from')==s.get('opens_from',s['id'])]
                links+=' '+ ' '.join(f'<a href="{href(t["id"],t["cases"][0]["name"])}">{html.escape(t["title"].split(" · ")[-1])}</a>' for t in related if t!=s)
                if s.get('opens_from'):links+=f' <a href="{href(s["opens_from"])}">Back to page</a>'
                bar=f'<aside class="mock-bar"><details><summary>{html.escape(title)} — review states</summary><nav aria-label="Mock states"><a href="../../index.html">All screens</a>{links}</nav><p class="mock-note">{html.escape(notes)}</p><p class="mock-note"><code>{html.escape(s["source"])}</code></p></details></aside>'
                product=data['html']
                if not data['hasMain']:product='<main style="display:contents">'+product+'</main>'
                if data['headings']==0:bar='<h1 class="mock-review-heading">'+html.escape(title)+'</h1>'+bar
                output=f'<!doctype html>\n<html lang="en" data-theme="light"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>{html.escape(title)}</title>\n{head}\n<script src="../../assets/mock.js" defer></script></head><body>\n<a class="mock-skip" href="#main">Skip to content</a>\n{product}\n{bar}\n</body></html>\n'
                dest=ROOT/path(s,case['name']);dest.parent.mkdir(parents=True,exist_ok=True);dest.write_text(output,encoding='utf-8')
                report=dict(file=path(s,case['name']),source=s['source'],state=case['name'],limitations=data['limitations'],errors=list(errors));reports.append(report);errors.clear()
                if args.source_screenshots and case['name']==s['cases'][0]['name']:
                    for width,height in [(360,800),(768,1024),(1280,800)]:
                        page.set_viewport_size(dict(width=width,height=height));page.screenshot(path=str(ROOT/'.cache/source'/f'{s["id"]}-{width}.png'),full_page=True,animations='disabled')
                    page.set_viewport_size(dict(width=1280,height=800))
            context.close()
        browser.close()
    (ROOT/('.cache/capture-report'+('-'+args.only if args.only else '')+'.json')).write_text(json.dumps(reports,indent=2),encoding='utf-8')
    print('Captured',len(reports),'files;',sum(len(r['errors']) for r in reports),'browser errors',flush=True)

if __name__=='__main__':main()
