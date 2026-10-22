(function(global){
'use strict';
const config=global.Algebra2Config||{},E=global.Algebra2Engine,registry=global.Algebra2CourseRegistry;
const esc=E.helpers.esc,$=s=>document.querySelector(s),base=String(config.apiBaseUrl||'').replace(/\/$/,'');
let session=null,app=null,revision=0,pending=null,serial=0,timer=null,inFlight=null,blocked=false,syncLabel='Saved on this device',selectedStudent=null,currentReport=null,importProfiles=null,reportSerial=0;
const queueKey=id=>'algebra2-connected-pending-v1:'+id;
const cacheKey=id=>'algebra2-connected-cache-v1:'+id;
const notice=document.createElement('div');notice.id='account-notice';notice.setAttribute('role','status');$('#main').before(notice);
function showNotice(message,actions=''){notice.innerHTML=`<div class="notice account-notice">${esc(message)}${actions?'<div class="btn-row">'+actions+'</div>':''}</div>`;}
function clearNotice(){notice.innerHTML='';}
function errorMessage(error){return error?.message||'This request could not be completed.';}
async function api(route,{method='GET',data,keepalive=false}={}){
 let response;
 try{response=await fetch(base+route,{method,credentials:'include',headers:data?{'Content-Type':'application/json'}:{},...(data?{body:JSON.stringify(data)}:{}),keepalive,signal:AbortSignal.timeout(120000)});}
 catch{throw Error('The service could not be reached. Local work is retained. Check the connection and sign-in configuration.');}
 let result;try{result=await response.json();}catch{throw Error('The service returned an unreadable response.');}
 if(!response.ok){const error=Error(result.error||'Request failed.');error.status=response.status;error.code=result.code;throw error;}
 return result;
}
function download(value,name){const url=URL.createObjectURL(new Blob([JSON.stringify(value,null,2)],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);}
function backupPending(){if(!pending)return;const p=pending.profile;download({format:'algebra2-course-progress',version:E.version,activeProfileId:p.id,profiles:{[p.id]:p},prefs:{sound:true,volume:12,motion:true}},'algebra2_unsynced_progress.json');}
function storeQueue(){
 try{if(pending)localStorage.setItem(queueKey(session.student.id),JSON.stringify(pending));return true;}
 catch{showNotice('Device saving is unavailable. Keep this page open until synchronization succeeds, or download a progress backup.','<button class="btn secondary small" data-account-action="backup-pending">Download backup</button>');return false;}
}
function setSyncLabel(value){syncLabel=value;app?.refreshStatus();}
function queueProfile(profile){
 if(!session?.student||blocked)return;
 serial++;pending={revision,profile,serial};const persisted=storeQueue();setSyncLabel(persisted?'Saved on this device · sync pending':'Device save unavailable · sync pending');
 if(!blocked&&!timer)timer=setTimeout(()=>{timer=null;sync().catch(()=>{});},15000);
}
async function sync(){
 if(inFlight)return inFlight;
 if(!pending||blocked)return;
 const snapshot=pending,sentSerial=snapshot.serial;
 setSyncLabel('Saving to course account…');
 inFlight=(async()=>{
  try{
   const result=await api('/api/progress',{method:'PUT',data:{revision,lessons:snapshot.profile.lessons}});
   revision=result.revision;
   if(pending?.serial===sentSerial){pending=null;try{localStorage.removeItem(queueKey(session.student.id));}catch{}setSyncLabel('Saved to course account');}
   else{pending.revision=revision;storeQueue();setSyncLabel('Saved on this device · sync pending');}
   clearNotice();
  }catch(error){
   setSyncLabel('Saved on this device · sync needs attention');
   if(error.status===409||error.status===401){blocked=true;$('#main').inert=true;showNotice(errorMessage(error),'<button class="btn secondary small" data-account-action="backup-pending">Download local backup</button><button class="btn secondary small" data-account-action="reload-server">Reload saved account</button>');}
   else showNotice(errorMessage(error),'<button class="btn secondary small" data-account-action="sync-now">Retry save</button><button class="btn secondary small" data-account-action="backup-pending">Download local backup</button>');
   throw error;
  }finally{inFlight=null;if(pending&&!blocked&&!timer)timer=setTimeout(()=>{timer=null;sync().catch(()=>{});},30000);}
 })();
 return inFlight;
}
function accountHeader(label){$('#app-header').innerHTML=`<div class="topbar-inner"><div class="brand"><span class="brand-mark" aria-hidden="true">A2</span><span class="brand-name">Algebra 2 Studio<span class="brand-sub">${esc(label)}</span></span></div>${session?.authenticated?'<button class="icon-btn" data-account-action="logout">Sign out</button>':''}</div>`;$('#app-footer').innerHTML='<span>Algebra 2 Studio · 0.3.0 · Practice ×0.25 / Problem Set ×1</span>';}
function gate(message=''){
 clearNotice();
 accountHeader('Student and instructor access');
 $('#main').innerHTML=`<section class="account-grid"><article class="card"><div class="eyebrow">STUDENT ACCESS</div><h1>Continue learning.</h1><p>Open the private enrollment link supplied by the instructor. No student password or GitHub account is required.</p><p>The link works once and expires after 24 hours. After enrollment, this browser stays signed in for up to 30 days. The instructor can issue a replacement link for another device.</p><div class="notice info">An enrollment link identifies one student. Keep it private.</div><button class="btn secondary" data-account-action="local-mode">Use local practice profiles</button><p class="small muted">Local profiles stay on this device and are separate from registered student accounts.</p></article><article class="card"><div class="eyebrow">INSTRUCTOR ACCESS</div><h2>Instructor sign-in</h2><form id="instructor-login"><label class="field-label" for="instructor-username">Username</label><input class="text-input" id="instructor-username" name="username" autocomplete="username" required maxlength="80"><label class="field-label" for="instructor-password">Passphrase</label><input class="text-input" id="instructor-password" name="password" type="password" autocomplete="current-password" required maxlength="256"><button class="btn" type="submit">Sign in</button></form><p id="account-message" role="alert">${esc(message)}</p></article></section>`;
}
function startLocal(){
 session=null;clearNotice();
 app=E.createApp(registry,{onSave:()=>{}});global.Algebra2CourseApp=app;
 showNotice('Local profiles are saved on this device. Instructor reporting requires a registered student session.');
 // A different hosted path has a different legacy storage key. Never silently map old profiles to registered students.
 const candidates=[];try{for(let i=0;i<localStorage.length;i++){const key=localStorage.key(i);if(key.startsWith('algebra2-course.foundation.v0.1:')&&key!=='algebra2-course.foundation.v0.1:'+location.pathname)candidates.push(key);}}catch{}
 if(candidates.length)showNotice('Earlier local course saves were found under another app address. Export a backup from the original app, then use Restore / import here. The earlier saves have not been changed.');
}
async function startStudent(){
 const saved=await api('/api/progress');revision=saved.revision;let profile=saved.profile,queued=null;
 try{queued=JSON.parse(localStorage.getItem(queueKey(session.student.id))||'null');}catch{}
 if(queued?.profile?.id===session.student.id){
  if(queued.revision===revision){profile=queued.profile;pending=queued;serial=queued.serial||1;syncLabel='Saved on this device · sync pending';}
  else{pending=queued;blocked=true;syncLabel='Saved account loaded · local copy needs review';}
 }
 app=E.createApp(registry,{connected:true,storageKey:cacheKey(session.student.id),profile,syncStatus:()=>syncLabel,onSave:queueProfile});global.Algebra2CourseApp=app;
 if(blocked){$('#main').inert=true;showNotice('This browser has unsynchronized work based on an older account revision. Download that local copy before continuing with the newer account copy.','<button class="btn secondary small" data-account-action="backup-pending">Download local backup</button><button class="btn secondary small" data-account-action="reload-server">Use saved account copy</button>');}
 else if(pending)sync().catch(()=>{});
 else{clearNotice();setSyncLabel('Saved to course account');}
}
function category(c){return c?`${c.credit}/${c.total} · ${E.percentText(c.percent)}`:'—';}
function weighted(s){return s&&s.percent!==null?`${E.percentText(s.percent)} · ${esc(s.letter)}`:'—';}
function reportHtml(report){
 const s=report.course;
 return `<div class="card-topline"><div><div class="eyebrow">STUDENT REPORT</div><h2>${esc(report.student.name)}</h2><p class="small muted">Last saved: ${esc(report.student.updatedAt?new Date(report.student.updatedAt).toLocaleString():'No work saved yet')}</p></div><strong class="instructor-grade">${weighted(s)}</strong></div><p>${s.completed}/${s.available} prepared lessons complete · ${s.inProgress} in progress · ${s.available}/137 course lessons prepared.</p><div class="category-scores"><span><strong>Practice:</strong> ${category(s.practice)}</span><span><strong>Problem Set:</strong> ${category(s.problem)}</span></div><p class="small muted">Chapter and course grades include completed lessons only. In-progress lesson grades are provisional.</p>${report.archivedLessonIds?.length?`<p class="notice info">Archived, excluded from grades: ${report.archivedLessonIds.map(esc).join(", ")}. These histories remain in the account pending verified packages.</p>`:""}<h3>Chapter grades</h3><div class="table-scroll"><table class="course-report-table"><thead><tr><th>Chapter</th><th>Complete / prepared</th><th>Practice</th><th>Problem Set</th><th>Weighted grade</th></tr></thead><tbody>${report.chapters.map(ch=>`<tr><td>${esc(ch.title)}</td><td>${ch.completed}/${ch.available}</td><td>${category(ch.practice)}</td><td>${category(ch.problem)}</td><td>${weighted(ch)}</td></tr>`).join('')}</tbody></table></div><h3>Lesson grades</h3><div class="table-scroll"><table class="course-report-table"><thead><tr><th>Lesson</th><th>Status / completion</th><th>Practice</th><th>Problem Set</th><th>Weighted grade</th></tr></thead><tbody>${s.lessons.map(row=>`<tr><td>${row.number}. ${esc(row.title)}</td><td>${esc(row.status)}${row.stats?' · '+row.stats.done+'/'+row.stats.total:''}</td><td>${category(row.stats?.practice)}</td><td>${category(row.stats?.problem)}</td><td>${row.stats?weighted(row.stats)+(row.stats.complete?'':' · provisional'):'—'}</td></tr>`).join('')}</tbody></table></div>${report.imports?.length?`<p class="notice">${report.imports.length} instructor-approved local import(s). Imported histories are labeled as local records, not independently authenticated historical submissions.</p>`:''}<div class="btn-row"><button class="btn secondary small" data-account-action="enrollment">Create replacement enrollment link</button><button class="btn secondary small" data-account-action="import">Import local progress backup</button><button class="btn secondary small" data-account-action="revoke">Revoke student sessions</button></div><div id="enrollment-result" role="status"></div><div id="import-result"></div><input id="instructor-import-file" type="file" accept="application/json,.json" hidden>`;
}
async function loadReport(id){
 selectedStudent=id;currentReport=null;importProfiles=null;const requestSerial=++reportSerial;
 $('#student-report').innerHTML='<p role="status">Loading student report…</p>';
 const report=await api(`/api/instructor/students/${id}/report`);if(requestSerial!==reportSerial)return;currentReport=report;
 $('#student-report').innerHTML=reportHtml(currentReport);
 document.querySelectorAll('[data-account-action="student-report"]').forEach(button=>button.classList.toggle('selected',button.dataset.student===id));
}
async function instructor(){
 accountHeader('Instructor dashboard');clearNotice();
 reportSerial++;$('#main').innerHTML='<section class="card"><p role="status">Loading class roster…</p></section>';
 const result=await api('/api/instructor/students');
 $('#main').innerHTML=`<section class="instructor-heading"><div><div class="eyebrow">INSTRUCTOR</div><h1>Student progress</h1><p>Practice ×0.25 · Problem Set ×1 · Grades based on completed lessons.</p></div><button class="btn secondary" data-account-action="refresh-roster">Refresh</button></section><div class="instructor-layout"><aside class="card"><h2>Class roster</h2><form id="add-student"><label class="field-label" for="student-name">Student name</label><input class="text-input" id="student-name" maxlength="80" required><button class="btn small" type="submit">Register student</button></form><div class="student-roster">${result.students.map(student=>`<button class="btn secondary" data-account-action="student-report" data-student="${esc(student.id)}">${esc(student.name)}</button>`).join('')||'<p class="muted">Register a student to create the first private enrollment link.</p>'}</div></aside><section class="card" id="student-report"><h2>Select a student</h2><p>Open a roster entry to review lesson, chapter, and completed-course grades.</p></section></div>`;
 if(selectedStudent&&result.students.some(s=>s.id===selectedStudent))await loadReport(selectedStudent);
}
async function checkSession(){
 session=await api('/api/session');
 if(!session.authenticated)return false;
 return true;
}
document.addEventListener('submit',async event=>{
 const form=event.target;if(!['instructor-login','add-student'].includes(form.id))return;
 event.preventDefault();const button=form.querySelector('button[type="submit"]');button.disabled=true;
 try{
  if(form.id==='instructor-login'){
   const username=$('#instructor-username').value,password=$('#instructor-password').value;
   try{await api('/api/instructor/login',{method:'POST',data:{username,password}});}finally{$('#instructor-password').value='';}
   if(!await checkSession())throw Error('The browser did not retain the session cookie. Use the connected app on the backend address or configure same-site app/API domains.');
   await instructor();
  }else{
   const result=await api('/api/instructor/students',{method:'POST',data:{name:$('#student-name').value}});selectedStudent=result.student.id;await instructor();await enrollment();
  }
 }catch(error){const message=$('#account-message');if(message)message.textContent=errorMessage(error);else showNotice(errorMessage(error));}
 finally{button.disabled=false;}
});
async function enrollment(){
 const id=selectedStudent;$('#enrollment-result').innerHTML='<p role="status">Creating a private enrollment link…</p>';
 const result=await api(`/api/instructor/students/${id}/enrollment`,{method:'POST',data:{}});if(id!==selectedStudent)return;
 $('#enrollment-result').innerHTML=`<div class="notice info"><label class="field-label" for="enrollment-link">Private, single-use student link</label><textarea class="text-input" id="enrollment-link" readonly>${esc(result.link)}</textarea><p>Expires ${esc(new Date(result.expiresAt).toLocaleString())}. Issuing a new link invalidates earlier unused links for this student.</p><button class="btn secondary small" data-account-action="copy-enrollment">Copy link</button></div>`;
}
document.addEventListener('click',async event=>{
 const button=event.target.closest('[data-account-action]');if(!button||button.disabled)return;event.preventDefault();const action=button.dataset.accountAction;
 try{
  if(action==='account'){
   if(!config.connected){showNotice('Connected accounts are not configured in this static build. The backend-served app enables sign-in, or the public configuration can point to a deployed backend.');return;}
   app?.flush();location.hash='';location.reload();
  }else if(action==='local-mode'){location.hash='local';location.reload();}
  else if(action==='logout'){
   if(session?.role==='student'){app.flush();await sync();if(pending)throw Error('Synchronization is still pending. Download a backup before leaving this account.');}
   await api('/api/logout',{method:'POST',data:{}});
   if(session?.student){localStorage.removeItem(cacheKey(session.student.id));localStorage.removeItem(queueKey(session.student.id));}
   location.hash='';location.reload();
  }else if(action==='refresh-roster')await instructor();
  else if(action==='student-report')await loadReport(button.dataset.student);
  else if(action==='enrollment')await enrollment();
  else if(action==='copy-enrollment'){const link=$('#enrollment-link');try{await navigator.clipboard.writeText(link.value);showNotice('Enrollment link copied. Share it privately with the intended student.');}catch{link.focus();link.select();showNotice('Select and copy the private enrollment link.');}}
  else if(action==='revoke'){if(confirm('Revoke all current sessions and unused enrollment links for this student?')){await api(`/api/instructor/students/${selectedStudent}/revoke`,{method:'POST',data:{}});showNotice('Student sessions revoked. Create a new enrollment link when access is needed.');}}
  else if(action==='import')$('#instructor-import-file').click();
  else if(action==='confirm-import'){
   if(!currentReport||!importProfiles)throw Error('Choose a backup for the current student first.');
   const profile=importProfiles[Number($('#import-profile').value)];
   if(!profile||!confirm('Import this local profile into '+currentReport.student.name+'? Matching lesson histories will be replaced.'))return;
   const result=await api(`/api/instructor/students/${selectedStudent}/import`,{method:'POST',data:{revision:currentReport.revision,profile}});await loadReport(selectedStudent);showNotice(`${result.importedLessons} lesson histories imported and labeled as instructor-approved local records.`);
  }else if(action==='sync-now'){clearTimeout(timer);timer=null;await sync();}
  else if(action==='backup-pending')backupPending();
  else if(action==='reload-server'){
   if(pending&&!confirm('Download a backup of this browser’s unsynchronized work, then load the account copy?'))return;
   backupPending();if(session?.student)localStorage.removeItem(queueKey(session.student.id));location.hash='';location.reload();
  }
 }catch(error){showNotice(errorMessage(error));}
});
document.addEventListener('change',async event=>{
 if(event.target.id!=='instructor-import-file')return;
 const file=event.target.files?.[0],id=selectedStudent;if(!file)return;
 try{
  if(file.size>5_000_000)throw Error('The backup exceeds 5 MB.');const raw=JSON.parse(await file.text());if(id!==selectedStudent||!currentReport)return;
  importProfiles=raw.format==='algebra2-course-progress'?Object.values(raw.profiles||{}):raw.lessons?[raw]:raw.schema==='algebra2-lesson-state-v1'?[{name:'Single lesson backup',lessons:{[raw.lessonId]:raw}}]:[];
  if(!importProfiles.length)throw Error('This file contains no recognized student profiles.');
  $('#import-result').innerHTML=`<div class="notice"><label class="field-label" for="import-profile">Choose the source profile for ${esc(currentReport.student.name)}</label><select id="import-profile">${importProfiles.map((profile,i)=>`<option value="${i}">${esc(profile.name||'Unnamed profile')} · ${Object.keys(profile.lessons||{}).length} lesson(s)</option>`).join('')}</select><p>This explicitly maps a local profile to the selected registered student.</p><button class="btn small" data-account-action="confirm-import">Review and import</button></div>`;
 }catch(error){showNotice(errorMessage(error));}
});
window.addEventListener('online',()=>{if(!blocked)sync().catch(()=>{});});
async function start(){
 if(!config.connected||location.hash==='#local')return startLocal();
 const parameters=new URLSearchParams(location.hash.slice(1)),enroll=parameters.get('enroll');
 showNotice('Connecting to the course account service. A sleeping preview can take about a minute to wake.');
 if(enroll){history.replaceState(null,'',location.pathname+location.search);await api('/api/enroll',{method:'POST',data:{token:enroll}});}
 if(!await checkSession())return gate(enroll?'The browser did not retain the student session. Use the backend-served app or same-site app/API domains.':'');
 if(session.role==='instructor')await instructor();else await startStudent();
}
start().catch(error=>gate(errorMessage(error)));
global.Algebra2Accounts={sync,api,getSession:()=>session};
})(window);
