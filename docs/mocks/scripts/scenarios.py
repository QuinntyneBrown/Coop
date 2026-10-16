"""Source-derived capture inventory. No application code or real API is modified."""
from copy import deepcopy

TODAY = '2026-10-13T12:00:00Z'
PROFILE = dict(id='profile-mira', profileId='profile-mira', userId='user-mira', username='mira.fern', firstName='Mira', lastName='Fern', firstname='Mira', lastname='Fern', email='mira@example.invalid', phone='555-0101', phoneNumber='555-0101', type=0, profileType='Member', unit='101', unitNumber='101', address='101 Fictional Court', avatarUrl='')
PROFILES = [PROFILE, dict(PROFILE, id='profile-board', profileId='profile-board', type=1, profileType='BoardMember', boardTitle='Treasurer')]
BOARD = [dict(name='Mira Fern', title='Treasurer'), dict(name='Tavi Moss', title='President'), dict(name='Neri Vale', title='Secretary')]
COMMENTS = [dict(id='comment-1', body='It drips most at night. I have put a bowl under it for now.', content='It drips most at night. I have put a bowl under it for now.', createdBy='Mira Fern', authorName='Mira Fern', createdOn='2026-10-13T14:20:00Z', createdAt='2026-10-13T14:20:00Z')]
REQUESTS = [dict(id=f'request-{i}', maintenanceRequestId=f'request-{i}', title=title, description=desc, status=status, priority=priority, category='General', createdAt=when, createdOn=when, dateCreated=when, address='101 Fictional Court', phoneNumber='555-0101', unattendedUnitEntry=True, unitNumber='101', requestedBy='Mira Fern', requestedByName='Mira Fern', comments=COMMENTS, attachments=[], digitalAssets=[], workDetails='Inspection scheduled.') for i, (title, desc, status, priority, when) in enumerate([
    ('Kitchen tap leak', 'The kitchen tap drips after it is closed.', 'New', 'High', '2026-10-13T12:00:00Z'),
    ('Hallway light', 'The light outside unit 101 flickers.', 'Received', 'Medium', '2026-10-09T14:30:00Z'),
    ('Courtyard gate', 'The courtyard gate needs its hinges adjusted.', 'Started', 'Low', '2026-10-02T17:15:00Z'),
    ('Window latch', 'The bedroom window latch has been repaired.', 'Completed', 'Low', '2026-09-22T13:45:00Z')])]
DOCS = [dict(id=f'document-{i}', documentId=f'document-{i}', title=title, name=title, type=kind, documentType=kind, content=body, body=body, description=body, status=status, published=status=='Published', createdAt=TODAY, createdOn=TODAY, publishedOn=TODAY, fileUrl='', fileName='') for i, (title, kind, status, body) in enumerate([
    ('Autumn courtyard gathering', 'Notice', 'Published', 'Join your neighbours in the courtyard on Saturday at 2 pm. Bring a mug and a story to share.'),
    ('Shared spaces bylaw', 'ByLaw', 'Published', 'Keep shared entrances clear and return community equipment after use.'),
    ('September maintenance report', 'Report', 'Draft', 'Four repairs were completed this month. The next inspection is scheduled for October.')])]
CONVERSATIONS = [dict(id='conversation-1', conversationId='conversation-1', subject='Courtyard gathering', title='Courtyard gathering', participantNames=['Mira Fern', 'Tavi Moss'], participants=[dict(username='Mira Fern'), dict(username='Tavi Moss')], lastMessage='Shall we meet at the courtyard?', lastMessageAt=TODAY, updatedAt=TODAY, createdOn=TODAY, unreadCount=2)]
MESSAGES = [dict(id='message-1', content='Shall we meet at the courtyard?', body='Shall we meet at the courtyard?', senderName='Tavi Moss', senderId='user-tavi', createdBy='Tavi Moss', createdAt=TODAY, createdOn=TODAY), dict(id='message-2', content='Yes, I will bring the meeting notes.', body='Yes, I will bring the meeting notes.', senderName='Mira Fern', senderId='user-mira', createdBy='mira.fern', createdAt=TODAY, createdOn=TODAY)]
USERS = [dict(id=f'user-{i}', userId=f'user-{i}', username=n, role='Member', roles=['Member'], createdOn=TODAY) for i,n in enumerate(['mira.fern','tavi.moss','neri.vale','oren.reed'])]
ASSETS = [dict(digitalAssetId=f'asset-{i}', name=n, contentType='application/pdf', size=2048, contentLength=2048, createdOn=TODAY) for i,n in enumerate(['Courtyard plan.pdf','Meeting notes.pdf'])]
INVITATIONS = [dict(invitationTokenId=f'invitation-{i}', value='fictional-invite-'+str(i), type=i, createdOn=TODAY, expirationDate=expires, redeemed=used) for i, (expires,used) in enumerate([('2026-11-13',False),('2026-09-13',False),('2026-11-13',True)])]
ROLES = [dict(roleId='role-'+name, name=name, privileges=[]) for name in ['SystemAdministrator','Member','Staff','BoardMember','Support']]
PRIVILEGES = [dict(aggregate=name, canRead=True, canUpdate=True, canCreate=True, canDelete=True, privilegeIds={}, allPrivilegeIds={}) for name in ['User','MaintenanceRequest','Document','Profile']]
UNITS = [dict(id=str(n), name=f'Unit {n}', number=str(n)) for n in [101,102,103]]

screens=[]
def add(app, name, req, base=None, route=None, component=None, kind='page', parent=None, note=''):
    component=component or name
    screen=dict(id=f'{app}-{name}', kind=kind, title=f'{app.title()} · {name.replace("-", " ").title()}', app=app, route=route if route is not None else ('/' if component=='landing' else '/'+component), selector='app-'+component,
        source=f'frontend/projects/{app}/src/app/{"pages" if app=="public" else "features"}/{component}/{component}.component.ts', requirements=[f'L2-REQ-{n:03}' for n in req], base=base or {}, cases=[], note=note)
    if parent: screen['opens_from']=f'{app}-{parent}'
    screens.append(screen)
    return screen
def state(s, name='default', patch=None, action='', note='', forms=None):
    s['cases'].append(dict(name=name, patch=patch or {}, action=action, note=note, forms=forms or {}))
def overlay(app,name,parent,req,patch,note=''):
    p=next(s for s in screens if s['id']==f'{app}-{parent}')
    s=add(app,name,req,dict(deepcopy(p['base']),**patch),route=p['route'],component=p['selector'][4:],kind='dialog',parent=parent,note=note)
    state(s)
    return s
def notice(app,name,parent,req,patch,variant='success',note=''):
    p=next(s for s in screens if s['id']==f'{app}-{parent}')
    s=add(app,name,req,dict(deepcopy(p['base']),**patch),route=p['route'],component=p['selector'][4:],kind='notification',parent=parent,note=note)
    state(s,variant)
    return s

for app in ['public','admin']:
    if app=='admin':  # the public landing is the hand-written OWN proposal in pages/public-landing; it is not captured
        s=add(app,'landing',[53,68,70],dict(heroTitle='Welcome to Your Cooperative',heroSubtitle='Manage your community, submit requests, and stay connected with your neighbors.',boardMembers=BOARD,notices=DOCS[:1],currentYear=2026))
        state(s); state(s,'empty',dict(boardMembers=[],notices=[]),note='Empty CMS collections. No loading or error screen is implemented.')
    s=add(app,'login',[7,76]); state(s); state(s,'invalid',dict(submitted=True))
    state(s,'submitting',dict(loading=True,username='mira.fern',password='FictionalPass123!'),forms={'loginForm':dict(username='mira.fern',password='FictionalPass123!')} if app=='admin' else {})
    state(s,'error',dict(loginError='Invalid username or password',username='mira.fern'),forms={'loginForm':dict(username='mira.fern')} if app=='admin' else {})
    s=add(app,'register',[1,44,77]); state(s); state(s,'invalid',dict(submitted=True))
    state(s,'mismatch',dict(submitted=True,password='FictionalPass123!',confirmPassword='DifferentPass123!'),forms={'registerForm':dict(password='FictionalPass123!',confirmPassword='DifferentPass123!')} if app=='admin' else {})
    state(s,'submitting',dict(loading=True)); state(s,'error',dict(registrationError='Registration failed. Please check your invitation token.'))
    s=add(app,'forgot-password',[1],note='Submit handler is a stub. There is no implemented reset request, busy indicator, or confirmation. Requirement linkage is contextual; self-service reset is not specified by L2-REQ-001.')
    state(s)
    if app=='public':
        s=add(app,'dashboard',[9,30,38],dict(firstName='Mira',requestsCount='4',messagesCount='1',membersCount='4',recentRequests=REQUESTS))
    else:
        s=add(app,'dashboard',[9,30,35,38],dict(displayName='Mira',requestsCount=3,messagesCount=2,documentsCount=3,membersCount=4,unreadCount=2,recentRequests=REQUESTS,recentNotices=DOCS[:1]))
    state(s); state(s,'empty',dict(recentRequests=[],recentNotices=[],requestsCount=0,messagesCount=0,membersCount=0,documentsCount=0,unreadCount=0))
    state(s,'partial',dict(recentRequests=[],requestsCount=0),note='A failed maintenance request produces an empty section; no error banner is implemented.')
    s=add(app,'documents',[35],dict(documents=DOCS,filteredDocuments=DOCS,loading=False,activeFilter='all',selectedDocument=None))
    state(s); state(s,'loading',dict(documents=[],filteredDocuments=[],loading=True)); state(s,'empty',dict(documents=[],filteredDocuments=[]),note='Fetch failures reach this same empty presentation.')
    for f,doc in zip(['notices','bylaws','reports'],DOCS): state(s,f,dict(activeFilter=f,filteredDocuments=[doc]))
    state(s,'no-results',dict(activeFilter='reports',documents=DOCS[:1],filteredDocuments=[]))
    overlay(app,'document-viewer','documents',[35],dict(selectedDocument=DOCS[0]))
    s=add(app,'maintenance',[21,25,30],dict(requests=REQUESTS,filteredRequests=REQUESTS,loading=False,activeFilter='all',selectedRequest=None))
    state(s); state(s,'loading',dict(requests=[],filteredRequests=[],loading=True)); state(s,'empty',dict(requests=[],filteredRequests=[]),note='Fetch errors display the same empty state.')
    for f,index in [('new',0),('started',2),('done',3),('received',1)]: state(s,f,dict(activeFilter=f,filteredRequests=[REQUESTS[index]]))
    state(s,'no-results',dict(activeFilter='done',requests=REQUESTS[:1],filteredRequests=[]))
    c=overlay(app,'maintenance-create','maintenance',[21],dict(showCreateModal=True))
    if app=='public': state(c,'invalid',dict(createSubmitted=True))
    else: state(c,'invalid',action='c.createForm.markAllAsTouched()',note='Touched required fields show the source form styling; no inline error copy is implemented.')
    if app=='public':
        c=overlay(app,'maintenance-detail','maintenance',[28,29,30],dict(selectedRequest=REQUESTS[0])); state(c,'empty',dict(selectedRequest=dict(REQUESTS[0],comments=[],attachments=[])))
    else:
        for i,status in enumerate(['new','received','started','completed']): state(s,'detail-'+status,dict(selectedRequest=REQUESTS[i],activeTab='details'))
        state(s,'comments',dict(selectedRequest=REQUESTS[0],activeTab='comments',comments=COMMENTS)); state(s,'comments-empty',dict(selectedRequest=REQUESTS[0],activeTab='comments',comments=[]))
    s=add(app,'messaging',[36,37,38],dict(conversations=CONVERSATIONS,filteredConversations=CONVERSATIONS,messages=[],selectedConversation=None,loading=False,currentUserId='user-mira'),route='/messaging' if app=='public' else '/messages')
    state(s); state(s,'loading',dict(conversations=[],filteredConversations=[],loading=True)); state(s,'empty',dict(conversations=[],filteredConversations=[]),note='Conversation fetch failures display the empty view.')
    # The admin app marks a conversation read when it is opened.
    opened=dict(conversations=[dict(CONVERSATIONS[0],unreadCount=0)],filteredConversations=[dict(CONVERSATIONS[0],unreadCount=0)]) if app=='admin' else {}
    state(s,'chat',dict(opened,selectedConversation=CONVERSATIONS[0],messages=MESSAGES)); state(s,'chat-empty',dict(opened,selectedConversation=CONVERSATIONS[0],messages=[]))
    state(s,'read',dict(conversations=[dict(CONVERSATIONS[0],unreadCount=0)],filteredConversations=[dict(CONVERSATIONS[0],unreadCount=0)]))
    if app=='admin':
        state(s,'no-results',dict(filteredConversations=[])); overlay(app,'new-conversation','messaging',[36],dict(showNewConversationDialog=True),note='Start only closes the dialog and clears the recipient; no conversation is created by this handler.')
    s=add(app,'onboarding',[14],dict(units=UNITS) if app=='public' else {},note='No blocking validation, busy state, or API failure screen is implemented in the step navigation.')
    state(s)
    step='currentStep' if app=='public' else 'step'
    offset=0 if app=='public' else 1
    state(s,'profile',{step:1+offset}); state(s,'unit',{step:2+offset}); state(s,'unit-selected',{step:2+offset,'selectedUnit':0})
    if app=='public': state(s,'success',dict(currentStep=3))
    for name in (['profile'] if app=='public' else ['profile','profiles']):
        base=dict(profiles=PROFILES,profile=PROFILE) if app=='public' else dict(profiles=PROFILES,currentProfile=PROFILE)
        s=add(app,name,[15,16,18,19],base,route='/'+name,component='profile' if app=='public' else 'profiles')
        state(s); state(s,'empty',dict(profiles=[],profile=None,currentProfile=None))
        state(s,'edit',action='c.enterEditMode()'); state(s,'password',dict(showPasswordForm=True))
        if app=='public':
            state(s,'password-invalid',dict(showPasswordForm=True,passwordMismatchError='New passwords do not match'))
            state(s,'password-error',dict(showPasswordForm=True,passwordError='Failed to change password. Check your current password.'))
            overlay(app,'profile-switcher',name,[18],dict(showProfileOptions=True))
        else:
            state(s,'invalid',dict(editMode=True),action='c.profileForm.markAllAsTouched()')
            state(s,'board-edit',dict(currentProfile=PROFILES[1]),action='c.enterEditMode()')
        notice(app,name+'-saved',name,[15],dict(successMessage='Profile updated successfully!') if app=='public' else dict(editMode=True,successMessage='Profile updated successfully'),note='The source also shows success after an API save failure.')

s=add('admin','users',[1,2,3,13,57],dict(users=USERS[:2],allUsers=USERS,page=1,pageSize=2,totalCount=4,totalPages=2,pages=[1,2])); state(s)
state(s,'empty',dict(users=[],allUsers=[],totalCount=0,totalPages=1,pages=[1])); state(s,'no-results',dict(users=[],totalCount=0)); state(s,'page-2',dict(users=USERS[2:],page=2))
c=overlay('admin','user-create','users',[1],dict(showModal=True)); state(c,'invalid',action='c.userForm.markAllAsTouched()',note='Only touched invalid field styling is implemented.')
c=overlay('admin','user-edit','users',[2],dict(showModal=True,editingUser=USERS[0])); c['cases'][0]['forms']={'userForm':dict(username='mira.fern',role='Member')}; c['note']='The edit dialog submits through addUser(), which calls createUser().'
overlay('admin','user-delete','users',[3],dict(showDeleteDialog=True,deletingUser=USERS[0]))
s=add('admin','roles',[10,11,12],dict(roles=ROLES,selectedRole=ROLES[0],rolePrivileges=PRIVILEGES)); state(s); state(s,'empty',dict(roles=[],selectedRole=None,rolePrivileges=[])); state(s,'no-privileges',dict(selectedRole=ROLES[1],rolePrivileges=[])); state(s,'member',dict(selectedRole=ROLES[1],rolePrivileges=[dict(PRIVILEGES[1],canDelete=False,canUpdate=False)]))
s=add('admin','assets',[40,41,42],dict(assets=ASSETS,filteredAssets=ASSETS)); state(s); state(s,'empty',dict(assets=[],filteredAssets=[])); state(s,'no-results',dict(filteredAssets=[]))
c=overlay('admin','asset-upload','assets',[40],dict(showUploadDialog=True)); state(c,'busy',dict(uploadProgressValue=0),note='The implemented progress value only changes to zero; no progress events advance it.')
overlay('admin','asset-detail','assets',[41],dict(selectedAsset=ASSETS[0]),note='Download button has no click handler.')
overlay('admin','asset-delete','assets',[42],dict(selectedAsset=ASSETS[0],showDeleteAssetDialog=True),note='The confirmation is stacked over the still-open detail dialog.')
s=add('admin','invitations',[43,44],dict(invitations=INVITATIONS)); state(s); state(s,'empty',dict(invitations=[]))
overlay('admin','invitation-create','invitations',[43],dict(showModal=True)); overlay('admin','invitation-created','invitations',[43],dict(showTokenDialog=True,createdToken='fictional-invite-mira'))
overlay('admin','document-create','documents',[31],dict(showDocumentDialog=True)); overlay('admin','document-delete','documents',[34],dict(showDeleteDocDialog=True,deletingDocument=DOCS[0]))
s=add('admin','settings',[45,46],note='Content and Account tabs contain only headings and descriptive text. errorMsg is rendered but never assigned a nonempty value by the implementation.'); state(s); state(s,'content',dict(activeTab='content')); state(s,'account',dict(activeTab='account'))
notice('admin','theme-saved','settings',[45],dict(successMsg='Theme saved successfully'),note='API failures also display success because settings are stored locally.')
s=add('admin','change-password',[4]); state(s); state(s,'invalid',dict(submitted=True)); state(s,'submitting',dict(loading=True)); state(s,'mismatch',dict(submitted=True,passwordMismatch=True,errorMsg='Passwords do not match'),forms={'form':dict(currentPassword='FictionalPass123!',newPassword='NewFictional123!',confirmNewPassword='OtherFictional123!')}); state(s,'error',dict(errorMsg='Failed to update password'))
notice('admin','password-saved','change-password',[4],dict(successMsg='Password updated successfully',submitted=True),note='The form resets while submitted stays true, so required-field errors remain visible after success.')
notice('admin','dashboard-unread','dashboard',[38],dict(unreadCount=2),'info',note='Notification bell has no handler. Badge reflects unread message count.')

DEFAULTS={'page':['default','loading','empty','error'],'dialog':['default','busy','invalid'],'notification':['info','success','warning','danger']}
NO_FETCH='The component loads no data on entry, so there is no loading presentation.'
FAIL_EMPTY='A failed fetch renders the empty presentation; the source has no distinct error screen or banner.'
FORM_NO_EMPTY='This is a form or action screen with no collection, so there is no empty presentation.'
FORM_NO_LOADING='Submission only toggles a button flag where implemented; there is no page-level loading presentation.'
NA_BY_NAME={
 ('landing','loading'):'Content comes from CMS collections shown as-is; the source renders no loading screen.',
 ('landing','error'):'Failed CMS fetches leave the empty sections shown in the empty state; no error banner is implemented.',
 ('forgot-password','loading'):'The submit handler is a stub, so there is no busy or loading presentation.',
 ('forgot-password','empty'):FORM_NO_EMPTY,
 ('forgot-password','error'):'The submit handler is a stub, so no failure feedback is implemented.',
 ('dashboard','loading'):'Dashboard cards render zero counts until data arrives; no loading presentation is implemented.',
 ('dashboard','error'):'A failed request leaves an empty section (see the partial state); no error banner is implemented.',
 ('documents','error'):FAIL_EMPTY,('maintenance','error'):FAIL_EMPTY,('messaging','error'):FAIL_EMPTY,
 ('onboarding','loading'):'Step navigation is local; the source shows no loading presentation.',
 ('onboarding','empty'):'Steps always render their fixed content; there is no empty presentation.',
 ('onboarding','error'):'The source shows no failure feedback in step navigation.',
 ('profile','loading'):'The profile renders directly from loaded values; the source has no loading presentation.',
 ('profile','error'):'Save failures are not surfaced distinctly; the saved notification can appear after a failed save.',
 ('profiles','loading'):'The profile renders directly from loaded values; the source has no loading presentation.',
 ('profiles','error'):'Save failures are not surfaced distinctly; the saved notification can appear after a failed save.',
 ('users','loading'):'The user list renders without a loading presentation in the source.',
 ('users','error'):'A failed fetch leaves the list unchanged or empty; no error banner is implemented.',
 ('roles','loading'):'The role list renders without a loading presentation in the source.',
 ('roles','error'):'A failed fetch leaves the lists empty; no error banner is implemented.',
 ('assets','loading'):'The asset grid renders without a loading presentation in the source.',
 ('assets','error'):'A failed fetch leaves the grid empty; no error banner is implemented.',
 ('invitations','loading'):'The invitation list renders without a loading presentation in the source.',
 ('invitations','error'):'A failed fetch leaves the list empty; no error banner is implemented.',
 ('settings','loading'):'Theme values are read from local storage, so there is no loading presentation.',
 ('settings','empty'):'Settings always show their controls; there is no empty presentation.',
 ('settings','error'):'The errorMsg template branch is never assigned a nonempty value, so no error presentation is reachable.',
 ('change-password','loading'):'Only the submit button changes while busy (see the submitting state); there is no page-level loading presentation.',
 ('change-password','empty'):FORM_NO_EMPTY,
}
def na_reason(s,n):
    name=s['id'].split('-',1)[1]
    if s['kind']=='page':
        if (name,n) in NA_BY_NAME: return NA_BY_NAME[(name,n)]
        if n=='empty': return FORM_NO_EMPTY
        if n=='loading': return NO_FETCH if name in ('login','register') else FORM_NO_LOADING
        if n=='error': return 'The source shows no failure feedback for this screen.'
    if s['kind']=='dialog':
        if n=='busy': return 'The dialog closes on submit and shows no pending indicator in the source.'
        if n=='invalid': return 'The dialog has no validation or the source shows no distinct invalid presentation.'
    if s['kind']=='notification':
        if n in ('warning','danger'): return 'The source implements only its '+' and '.join(x['name'] for x in s['cases'])+' feedback; there is no '+n+' notification.'
        return 'The source implements no '+n+' notification for this screen.'
    return 'No distinct presentation of the '+n+' state exists in '+s['source']+'.'
# Hand-written screens that live beside the captures. They are listed first so manifest.json keeps them across recaptures.
PROPOSALS=[{
        "id": "public-landing",
        "kind": "page",
        "title": "Public · Landing",
        "app": "public",
        "route": "/",
        "source": "Hand-written proposal (not captured); replaces the earlier capture of frontend/projects/public/src/app/pages/landing/landing.component.ts",
        "requirements": [
            "L2-REQ-053",
            "L2-REQ-068",
            "L2-REQ-070",
            "L2-REQ-072"
        ],
        "note": "Public landing page reimagined for Oakridge Women's Neighbourhood Housing Co-operative Inc.: the CMS-driven home page reimagined with a PAL Toronto-style structure (hero, at a glance, who we are, gallery, building and community, what's on, board, quote, visit, footer). Hand-written HTML on its own stylesheet (assets/own-site.css) with light and dark themes; not a capture of the implemented app.",
        "states": [
            "default",
            "menu"
        ],
        "not_applicable": {
            "loading": "Marketing page rendered from published CMS content; no in-page loading presentation is proposed.",
            "empty": "A published home page always has a hero and footer; blocks without content are simply omitted by the CMS.",
            "error": "Failed content fetches fall back to the last published page; no error presentation is proposed."
        }
    }]

def manifest():
    result=list(PROPOSALS)
    for s in screens:
        names=[x['name'] for x in s['cases']]
        result.append({k:v for k,v in dict(s,states=names,not_applicable={n:na_reason(s,n) for n in DEFAULTS[s['kind']] if n not in names}).items() if k not in ['base','cases','selector']})
    return dict(project='Coop — implemented UI',screens=result)

if __name__=='__main__':
    from collections import Counter
    print(Counter(s['kind'] for s in screens))
    print(sum(len(s['cases']) for s in screens),'state files')
