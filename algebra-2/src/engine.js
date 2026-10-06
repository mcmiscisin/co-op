
(function(global){
'use strict';

const COURSE_VERSION='0.1.0';
const COURSE_FORMAT='algebra2-course-progress';
const SCORE_POLICY='one-choice-two-fill-v1';
const $=(s,el=document)=>el.querySelector(s);
const $$=(s,el=document)=>Array.from(el.querySelectorAll(s));
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const math=s=>`<span class="math">${s}</span>`;
const pow=(s,n=2)=>`${s}<sup>${n}</sup>`;
const frac=(a,b)=>`<span class="frac"><span>${a}</span><span>${b}</span></span>`;
const root=s=>`<span class="root"><span class="root-symbol">√</span><span class="radicand">${s}</span></span>`;
const display=s=>`<div class="display-math">${s}</div>`;
const panel=(s,caption='')=>`<div class="formula-panel"><div class="formula">${s}</div>${caption?`<div class="caption">${caption}</div>`:''}</div>`;
const callout=(title,text)=>`<div class="callout"><strong>${title}</strong>${text}</div>`;
const choice=(label,html)=>({label,html});
const mono=(co,exps,vars=['x','y','z'])=>`${co<0?'−':''}${Math.abs(co)===1?'':Math.abs(co)}${exps.map((n,i)=>n===0?'':vars[i]+(n===1?'':`<sup>${n}</sup>`)).join('')}`;
const letters=['A','B','C','D','E'];
const makeChoices=a=>a.map((html,i)=>choice(letters[i],html));
const clone=o=>JSON.parse(JSON.stringify(o));
const pad3=n=>String(n).padStart(3,'0');
const uid=()=>global.crypto?.randomUUID?.()||('p-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,9));

function plain(s){
 const node=document.createElement('div');node.innerHTML=String(s??'');
 $$('.frac',node).forEach(n=>n.replaceWith('('+n.children[0].textContent+')/('+n.children[1].textContent+')'));
 $$('sup',node).forEach(n=>n.replaceWith('^'+n.textContent));
 $$('sub',node).forEach(n=>n.replaceWith('_'+n.textContent));
 $$('br',node).forEach(n=>n.replaceWith(' '));
 return node.textContent.replace(/\s+/g,' ').trim();
}

function parseNumber(raw){
 let s=String(raw??'').trim().toLowerCase().replace(/[−–—]/g,'-').replace(/[×·]/g,'*').replace(/÷/g,'/').replace(/√/g,'sqrt').replace(/²/g,'^2').replace(/³/g,'^3');
 if(!s)throw Error('Enter an answer first.');
 if(s.length>160)throw Error('Please use a shorter numeric answer.');
 if(/^(no\s*(real\s*)?solutions?|none|no\s*solution\s*exists|∅)$/.test(s))return null;
 s=s.replace(/^[a-z]\s*=\s*/,'').replace(/\s*(hours?|hrs?|h|units?)\s*$/,'').trim();
 if(/,/.test(s)){if(!/^[+-]?\d{1,3}(,\d{3})+(\.\d+)?$/.test(s))throw Error('Use commas only as thousands separators, or remove them.');s=s.replace(/,/g,'');}
 const mixed=s.match(/^([+-]?)(\d+)\s+(\d+)\s*\/\s*(\d+)$/);
 if(mixed){const den=Number(mixed[4]);if(den===0)throw Error('A denominator cannot be zero.');return(mixed[1]==='-'?-1:1)*(Number(mixed[2])+Number(mixed[3])/den);}
 const tokens=[];let pos=0;
 while(pos<s.length){
  if(/\s/.test(s[pos])){pos++;continue;}
  const rest=s.slice(pos),n=rest.match(/^(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?/);
  if(n){tokens.push({t:'n',v:Number(n[0])});pos+=n[0].length;}
  else if(rest.startsWith('sqrt')){tokens.push({t:'sqrt'});pos+=4;}
  else if('+-*/^()'.includes(s[pos]))tokens.push({t:s[pos++]});
  else throw Error('Use a number, a fraction, or sqrt(...). Only numeric arithmetic is supported.');
  if(tokens.length>100)throw Error('Please simplify your numeric answer.');
 }
 let i=0,depth=0;const peek=()=>tokens[i]?.t;
 const ensureFinite=v=>{if(!Number.isFinite(v))throw Error('That expression does not give a finite real number.');return v;};
 function atom(){if(++depth>25)throw Error('There are too many nested parentheses.');let val;
  if(peek()==='n')val=tokens[i++].v;
  else if(peek()==='('){i++;val=expression();if(peek()!==')')throw Error('Close every opening parenthesis.');i++;}
  else if(peek()==='sqrt'){i++;val=atom();if(val<0)throw Error('A real square root cannot have a negative radicand.');val=Math.sqrt(val);}
  else throw Error('Check your number, signs, and parentheses.');
  depth--;return ensureFinite(val);}
 function power(){let v=atom();if(peek()==='^'){i++;let ex=unary();if(Math.abs(ex)>100)throw Error('The exponent is too large.');v=Math.pow(v,ex);}return ensureFinite(v);}
 function unary(){if(peek()==='+'){i++;return unary();}if(peek()==='-'){i++;return-unary();}return power();}
 function term(){let v=unary();while(peek()==='*'||peek()==='/'){const op=tokens[i++].t,w=unary();if(op==='/'&&w===0)throw Error('A denominator cannot be zero.');v=op==='*'?v*w:v/w;ensureFinite(v);}return v;}
 function expression(){let v=term();while(peek()==='+'||peek()==='-'){const op=tokens[i++].t,w=term();v=op==='+'?v+w:v-w;ensureFinite(v);}return v;}
 const result=expression();if(i!==tokens.length)throw Error('Check the expression. Use * explicitly for multiplication.');return ensureFinite(result);
}

function grade(q,draft){
 const parts=[];
 if(q.choices){
  if(!Number.isInteger(draft?.choice)||draft.choice<0||draft.choice>=q.choices.length)return{valid:false,error:q.type==='trip'?'Choose an equation before submitting.':'Select one answer before submitting.'};
  parts.push({group:'choice',label:q.type==='trip'?'Equation':'Choice',correct:draft.choice===q.correct});
 }
 if(q.fields){
  for(const field of q.fields){
   const raw=draft?.values?.[field.key]??'';
   if(!String(raw).trim())return{valid:false,error:'Fill in '+field.label.replace(/ =$/,'')+' before submitting.',field:field.key};
   let parsed;try{parsed=parseNumber(raw);}catch(e){return{valid:false,error:field.label+': '+e.message,field:field.key};}
   let correct=field.value===null?parsed===null:parsed!==null&&Math.abs(parsed-field.value)<=(field.tolerance||0)+1e-12;
   if(q.type==='scientific'&&field.key==='coefficient')correct=correct&&parsed!==null&&Math.abs(parsed)>=1&&Math.abs(parsed)<10;
   if(q.type==='scientific'&&field.key==='exponent')correct=correct&&Number.isInteger(parsed);
   parts.push({group:'fields',label:field.label.replace(/ =$/,''),correct});
  }
 }
 return{valid:true,correct:parts.every(p=>p.correct),parts};
}

function blankRecord(){return{draft:{choice:null,values:{}},notes:'',hints:0,attempts:[],revealed:false,done:false,solved:false,firstCorrect:null,credit:0,solutionOpen:true,workOpen:true,feedback:null};}

function creditLimit(q,key){
 const custom=q.creditLimits?.[key];
 if(Number.isInteger(custom)&&custom>=0)return custom;
 return key==='choice'?1:2;
}
function scoringFor(q,r){
 const groups=[];
 for(const [key,label] of [['choice',q.type==='trip'?'Equation choice':'Multiple choice'],['fields',q.type==='trip'?'Typed answer':'Fill-in answer']]){
  if(key==='choice'?!q.choices:!q.fields)continue;
  const limit=creditLimit(q,key);
  const i=r.attempts.findIndex(a=>{const p=a.parts.filter(p=>p.group===key);return p.length>0&&p.every(p=>p.correct);});
  const solved=i>=0,used=solved?i+1:r.attempts.length;
  groups.push({key,label,limit,solved,correctAt:solved?i+1:null,used,remaining:solved?0:Math.max(0,limit-used),earned:solved&&i<limit,possible:solved?i<limit:used<limit});
 }
 const solved=groups.length>0&&groups.every(g=>g.solved)&&!r.revealed;
 return{groups,solved,done:solved||r.revealed,credit:solved&&groups.every(g=>g.earned)?1:0,possible:!r.revealed&&groups.every(g=>g.possible)};
}
function syncRecord(q,r){
 const sc=scoringFor(q,r);r.solved=sc.solved;r.done=sc.done;r.credit=sc.credit;r.firstCorrect=r.attempts.length?r.attempts[0].correct:(r.revealed?false:null);
 for(const g of sc.groups.filter(g=>g.solved)){const d=r.attempts[g.correctAt-1].draft;if(g.key==='choice')r.draft.choice=d.choice;else for(const f of q.fields)r.draft.values[f.key]=d.values[f.key];}
 return sc;
}
function cleanDraft(q,d){const copy={choice:null,values:{}};if(q.choices&&Number.isInteger(d?.choice)&&d.choice>=0&&d.choice<q.choices.length)copy.choice=d.choice;for(const f of q.fields||[])if(Object.prototype.hasOwnProperty.call(d?.values||{},f.key))copy.values[f.key]=String(d.values[f.key]??'').slice(0,160);return copy;}

function freshLessonState(pkg){
 const indices={};for(const s of pkg.sections)indices[s.id]=0;
 return{schema:'algebra2-lesson-state-v1',lessonId:pkg.id,contentVersion:pkg.contentVersion,sourceRevision:pkg.sourceRevision,scorePolicy:SCORE_POLICY,
  view:'home',lastLocation:null,topicIndex:0,read:[],stepCounts:{},mini:{},indices,answers:{},custom:pkg.freshCustomState?pkg.freshCustomState():{},
  reportFilter:'all',startedAt:null,completedAt:null,updatedAt:null,migration:null};
}

function normalizeLessonState(pkg,raw){
 if(!raw||typeof raw!=='object')throw Error('Lesson progress is missing or invalid.');
 if(raw.lessonId&&raw.lessonId!==pkg.id)throw Error('That progress belongs to a different lesson.');
 const out=freshLessonState(pkg),qs=pkg.buildQuestions(),topicIds=new Set(pkg.topics.map(t=>t.id));
 out.view=['home','learn','results',...pkg.sections.flatMap(s=>[s.id,s.id+'-intro'])].includes(raw.view)?raw.view:'home';
 out.topicIndex=Number.isInteger(raw.topicIndex)?Math.max(0,Math.min(pkg.topics.length-1,raw.topicIndex)):Number.isInteger(raw.lessonIndex)?Math.max(0,Math.min(pkg.topics.length-1,raw.lessonIndex)):0;
 out.read=Array.from(new Set((Array.isArray(raw.read)?raw.read:[]).filter(x=>topicIds.has(x))));
 for(const t of pkg.topics){
  const count=t.steps?.length||0;
  if(count)out.stepCounts[t.id]=Number.isInteger(raw.stepCounts?.[t.id])?Math.max(1,Math.min(count,raw.stepCounts[t.id])):1;
  if(Number.isInteger(raw.mini?.[t.id])&&raw.mini[t.id]>=0&&raw.mini[t.id]<(t.mini?.options?.length||0))out.mini[t.id]=raw.mini[t.id];
 }
 for(const s of pkg.sections){const count=qs.filter(q=>q.section===s.id).length;out.indices[s.id]=Number.isInteger(raw.indices?.[s.id])?Math.max(0,Math.min(Math.max(0,count-1),raw.indices[s.id])):0;}
 out.custom=pkg.normalizeCustomState?pkg.normalizeCustomState(raw.custom||raw):clone(raw.custom||{});
 for(const q of qs){
  const from=raw.answers?.[q.id];if(!from||typeof from!=='object')continue;const r=blankRecord();
  r.notes=String(from.notes??'').slice(0,5000);r.hints=Math.max(0,Math.min(q.hints?.length||0,Number.isInteger(from.hints)?from.hints:0));
  r.draft=cleanDraft(q,from.draft);r.workOpen=from.workOpen!==false;r.solutionOpen=from.solutionOpen!==false;
  for(const a of(Array.isArray(from.attempts)?from.attempts:[])){
   const d=cleanDraft(q,a.draft),res=grade(q,d);if(!res.valid)continue;
   r.attempts.push({draft:d,correct:res.correct,parts:res.parts,at:typeof a.at==='string'?a.at.slice(0,80):'',hints:Math.max(0,Math.min(q.hints?.length||0,Number.isInteger(a.hints)?a.hints:0))});
  }
  r.revealed=from.revealed===true;syncRecord(q,r);r.feedback=r.revealed?'revealed':r.attempts.length?(r.solved?'correct':'wrong'):null;out.answers[q.id]=r;
 }
 out.reportFilter=['all','missed','unfinished',...pkg.sections.map(s=>s.id)].includes(raw.reportFilter)?raw.reportFilter:'all';
 for(const k of['startedAt','completedAt','updatedAt'])out[k]=typeof raw[k]==='string'&&Number.isFinite(Date.parse(raw[k]))?raw[k]:null;
 if(!qs.every(q=>out.answers[q.id]?.done))out.completedAt=null;
 out.lastLocation=raw.lastLocation&&typeof raw.lastLocation==='object'?clone(raw.lastLocation):null;
 out.migration=raw.migration&&typeof raw.migration==='object'?clone(raw.migration):null;
 return out;
}

function lessonStats(pkg,state){
 const qs=pkg.buildQuestions(),rec=q=>state.answers[q.id]||blankRecord();
 const credit=qs.reduce((n,q)=>n+scoringFor(q,rec(q)).credit,0),done=qs.filter(q=>rec(q).done).length,solved=qs.filter(q=>rec(q).solved).length;
 return{total:qs.length,credit,done,solved,complete:done===qs.length,percent:qs.length?Math.round(1000*credit/qs.length)/10:0,read:state.read.length,topics:pkg.topics.length};
}

function createApp(registry){
 const STORAGE_KEY='algebra2-course.foundation.v0.1:'+location.pathname;
 let storageAvailable=true,modalAction=null,modalRestoreFocus=null,toastTimer=null,inputError=null,feedbackPulseFor=null;
 let course=freshCourse(),mode='dashboard',activeLessonId=null,activePkg=null,lessonState=null,questions=[];
 let audioContext=null,audioNodes=[],audioSerial=0,audioWarning='';

 function freshProfile(name='Student 1'){const id=uid();return{id,name:String(name).slice(0,80),createdAt:new Date().toISOString(),updatedAt:new Date().toISOString(),lessons:{}};}
 function freshCourse(){const p=freshProfile();return{format:COURSE_FORMAT,version:COURSE_VERSION,activeProfileId:p.id,profiles:{[p.id]:p},prefs:{sound:true,volume:12,motion:true},dashboard:{filter:'available',search:''},updatedAt:null};}
 function activeProfile(){let p=course.profiles[course.activeProfileId];if(!p){const ids=Object.keys(course.profiles);course.activeProfileId=ids[0];p=course.profiles[course.activeProfileId];}return p;}
 function saveCourse(){
  course.updatedAt=new Date().toISOString();activeProfile().updatedAt=course.updatedAt;
  if(activeLessonId&&lessonState){lessonState.updatedAt=course.updatedAt;activeProfile().lessons[activeLessonId]=clone(lessonState);}
  try{localStorage.setItem(STORAGE_KEY,JSON.stringify(course));storageAvailable=true;}catch(_){storageAvailable=false;}
  updateSaveStatus();
 }
 function validateCourse(raw){
  if(!raw||raw.format!==COURSE_FORMAT||typeof raw.profiles!=='object')throw Error('This is not an Algebra 2 course progress file.');
  const out=freshCourse();out.profiles={};
  for(const [id,p] of Object.entries(raw.profiles)){
   if(!p||typeof p!=='object')continue;const np={id:String(id).slice(0,100),name:String(p.name??'Student').slice(0,80),createdAt:String(p.createdAt??''),updatedAt:String(p.updatedAt??''),lessons:{}};
   for(const [lessonId,ls] of Object.entries(p.lessons||{})){const pkg=registry.get(lessonId);if(pkg){try{np.lessons[lessonId]=normalizeLessonState(pkg,ls);}catch(_){}}}
   out.profiles[np.id]=np;
  }
  if(!Object.keys(out.profiles).length){const p=freshProfile();out.profiles[p.id]=p;}
  out.activeProfileId=out.profiles[raw.activeProfileId]?raw.activeProfileId:Object.keys(out.profiles)[0];
  out.prefs={sound:raw.prefs?.sound!==false,volume:Number.isInteger(raw.prefs?.volume)?Math.max(0,Math.min(30,raw.prefs.volume)):12,motion:raw.prefs?.motion!==false};
  out.dashboard={filter:['available','all'].includes(raw.dashboard?.filter)?raw.dashboard.filter:'available',search:String(raw.dashboard?.search??'').slice(0,50)};
  return out;
 }
 try{const stored=localStorage.getItem(STORAGE_KEY);if(stored)course=validateCourse(JSON.parse(stored));localStorage.setItem(STORAGE_KEY+'.probe','1');localStorage.removeItem(STORAGE_KEY+'.probe');}
 catch(_){storageAvailable=false;course=freshCourse();}

 function rec(q){return lessonState.answers[q.id]||(lessonState.answers[q.id]=blankRecord());}
 function sectionQuestions(id){return questions.filter(q=>q.section===id);}
 function sectionDone(id){return sectionQuestions(id).filter(q=>rec(q).done).length;}
 function sectionScore(id){return sectionQuestions(id).reduce((sum,q)=>sum+scoringFor(q,rec(q)).credit,0);}
 function allDone(){return questions.length>0&&questions.every(q=>rec(q).done);}
 function hasDraft(r){return Number.isInteger(r.draft.choice)||Object.values(r.draft.values).some(v=>String(v).trim())||!!r.notes.trim();}
 function hasProgress(){return lessonState.read.length>0||questions.some(q=>rec(q).attempts.length||rec(q).revealed||hasDraft(rec(q)));}
 function getQuestion(){return sectionQuestions(lessonState.view)[lessonState.indices[lessonState.view]];}

 function updateSaveStatus(){const s=$('#save-status');if(!s)return;s.textContent=storageAvailable?'Saved on this device':'Use backup file';s.classList.toggle('warning',!storageAvailable);}
 function announce(t){const a=$('#announcement');if(!a)return;a.textContent='';setTimeout(()=>a.textContent=t,15);}
 function toast(t){clearTimeout(toastTimer);const n=$('#toast');if(!n)return;n.textContent=t;n.hidden=false;toastTimer=setTimeout(()=>n.hidden=true,4200);}
 function focusMain(){window.scrollTo({top:0,behavior:'auto'});$('#main')?.focus({preventScroll:true});}
 function openModal(title,body,footer=''){modalRestoreFocus=document.activeElement;$('#modal-root').innerHTML=`<div class="overlay" id="modal-overlay"><section class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" tabindex="-1"><div class="modal-header"><h2 id="modal-title">${title}</h2><button class="icon-btn" data-action="close-modal" aria-label="Close dialog">✕</button></div><div class="modal-body">${body}</div>${footer?`<div class="btn-row">${footer}</div>`:''}</section></div>`;$('#modal-root .modal').focus();document.body.style.overflow='hidden';}
 function closeModal(){const old=modalRestoreFocus;$('#modal-root').innerHTML='';document.body.style.overflow='';modalAction=null;modalRestoreFocus=null;if(old&&document.contains(old))old.focus({preventScroll:true});}
 function confirmDialog(title,body,label,callback,danger=false){openModal(title,body,`<button class="btn ${danger?'danger':''}" data-action="confirm-modal">${label}</button><button class="btn secondary" data-action="close-modal">Cancel</button>`);modalAction=callback;}

 function stopCue(){audioSerial++;for(const n of audioNodes){try{n.stop();}catch(_){}}audioNodes=[];}
 function scheduleCue(ctx,kind,destination,start,level){
  const nodes=[],positive=kind==='correct',vol=Math.max(0,Math.min(.30,level)),notes=positive?[[523.25,0,.13],[659.25,.14,.13],[783.99,.28,.14],[1046.5,.43,.28]]:[[145,0,.32],[172,0,.32]];let wave=null;
  if(positive){const re=new Float32Array(10),im=new Float32Array([0,1,.58,.35,.22,.13,.08,.05,.03,.02]);wave=ctx.createPeriodicWave(re,im);}
  for(const[f,offset,duration]of notes){const osc=ctx.createOscillator(),gain=ctx.createGain(),filter=ctx.createBiquadFilter(),t=start+offset;if(positive)osc.setPeriodicWave(wave);else osc.type='sawtooth';osc.frequency.setValueAtTime(f,t);if(!positive)osc.frequency.linearRampToValueAtTime(f*.88,t+duration);filter.type='lowpass';filter.frequency.setValueAtTime(positive?2600:850,t);filter.Q.value=.5;const peak=vol*(positive?.42:.23);gain.gain.setValueAtTime(0,t);gain.gain.linearRampToValueAtTime(peak,t+.014);gain.gain.linearRampToValueAtTime(peak*.72,t+.05);gain.gain.setValueAtTime(peak*.72,t+duration-.045);gain.gain.linearRampToValueAtTime(0,t+duration);osc.connect(filter);filter.connect(gain);gain.connect(destination);osc.start(t);osc.stop(t+duration+.015);nodes.push(osc);}
  return nodes;
 }
 function playCue(kind){if(!course.prefs.sound||course.prefs.volume===0)return;stopCue();const serial=audioSerial;try{const C=window.AudioContext||window.webkitAudioContext;if(!C)throw Error();if(!audioContext||audioContext.state==='closed')audioContext=new C();Promise.resolve(audioContext.state==='running'?null:audioContext.resume()).then(()=>{if(serial!==audioSerial||!course.prefs.sound)return;audioNodes=scheduleCue(audioContext,kind,audioContext.destination,audioContext.currentTime+.018,course.prefs.volume/100);}).catch(()=>{audioWarning='Sound is unavailable or blocked. Visual feedback and scoring still work.';});}catch(_){audioWarning='Sound is unavailable or blocked. Visual feedback and scoring still work.';}}
 function updateSoundButton(){const b=$('#sound-toggle');if(b){b.textContent='Sound: '+(course.prefs.sound&&course.prefs.volume>0?'on':'off');b.setAttribute('aria-pressed',String(course.prefs.sound));}}
 function settingsModal(){openModal('Sound & feedback',`<p>Correct answers play a short synthesized fanfare; incorrect submissions play a quiet buzzer. Visual feedback always states correctness and credit.</p><div class="settings-row"><label><input type="checkbox" id="setting-sound" ${course.prefs.sound?'checked':''}> Enable answer sounds</label></div><div class="settings-row"><label for="setting-volume">Cue volume: <strong id="volume-value">${course.prefs.volume}%</strong></label><input id="setting-volume" type="range" min="0" max="30" value="${course.prefs.volume}"><div class="btn-row"><button class="btn secondary small" data-action="test-sound" data-kind="correct">Preview trumpet</button><button class="btn secondary small" data-action="test-sound" data-kind="wrong">Preview buzzer</button></div></div><div class="settings-row"><label><input type="checkbox" id="setting-motion" ${course.prefs.motion?'checked':''}> Gently pulse new answer banners</label></div>${audioWarning?`<p class="audio-note">${esc(audioWarning)}</p>`:''}`,`<button class="btn" data-action="close-modal">Return</button>`);}

 function header(){
  const p=activeProfile(),profiles=Object.values(course.profiles);
  const lessonLabel=mode==='lesson'&&activePkg?`Lesson ${activePkg.number} · ${activePkg.title}`:'137-lesson course foundation';
  $('#app-header').innerHTML=`<div class="topbar-inner"><button class="brand" data-action="course-home" aria-label="Algebra 2 course home"><span class="brand-mark" aria-hidden="true">A2</span><span class="brand-name">Algebra 2 Studio<span class="brand-sub">${esc(lessonLabel)}</span></span></button><div class="top-tools"><span id="save-status" class="save-status">Saved on this device</span>${mode==='lesson'?'<button class="icon-btn course-back" data-action="course-home">Course home</button><button class="icon-btn" data-action="jump">Jump to…</button><button class="icon-btn" id="sound-toggle" data-action="toggle-sound">Sound: on</button><button class="icon-btn reference-top" data-action="reference">Reference</button>':'<button class="icon-btn" data-action="course-report">Course progress</button>'}<div class="profile-tools"><select id="profile-select" aria-label="Student profile">${profiles.map(x=>`<option value="${esc(x.id)}" ${x.id===p.id?'selected':''}>${esc(x.name)}</option>`).join('')}</select><button class="icon-btn" data-action="new-profile" title="Add student profile">＋</button></div></div></div>`;
  updateSaveStatus();updateSoundButton();
 }
 function footer(){const f=$('#app-footer');f.innerHTML=`<span>Algebra 2 Studio · Course foundation ${COURSE_VERSION}</span><div class="footer-links"><button class="text-btn" data-action="export-course">Save all progress</button><button class="text-btn" data-action="load-progress">Restore / import</button>${mode==='lesson'?'<button class="text-btn" data-action="settings">Sound & feedback</button>':''}<button class="text-btn" data-action="about-course">About</button></div>`;}

 function courseStats(p){
  let completed=0,earned=0,possible=0,inProgress=0;
  for(const pkg of registry.available()){const ls=p.lessons[pkg.id];if(!ls)continue;const st=lessonStats(pkg,ls);if(st.complete){completed++;earned+=st.credit;possible+=st.total;}else if(st.done||st.read)inProgress++;}
  return{available:registry.available().length,completed,earned,possible,inProgress,score:possible?Math.round(1000*earned/possible)/10:null};
 }
 function dashboard(){
  const p=activeProfile(),st=courseStats(p),available=registry.available().length,search=course.dashboard.search.trim().toLowerCase(),filter=course.dashboard.filter;
  const catalog=[];for(let n=1;n<=137;n++){const id='lesson-'+pad3(n),pkg=registry.get(id);if(filter==='available'&&!pkg)continue;const title=pkg?pkg.title:`Lesson ${n}`;if(search&&!(`${n} ${title}`.toLowerCase().includes(search)))continue;catalog.push({n,pkg});}
  return `<section class="course-hero"><div class="course-panel"><div class="course-kicker"><span class="tag">ALGEBRA 2 · 137 LESSONS</span><span class="tag neutral">Foundation build</span></div><h1>One course.<br><em>Each lesson stays modular.</em></h1><p class="lesson-intro">Choose any prepared lesson, resume unfinished work, and keep course progress in one place. Lesson 89 is the first validated lesson package; the remaining lesson slots stay explicitly unavailable until their source material is supplied and verified.</p><div class="btn-row"><button class="btn" data-action="open-lesson" data-lesson="lesson-089">Open Lesson 89 →</button><button class="btn secondary" data-action="course-report">View course progress</button></div>${!storageAvailable?'<div class="notice">Automatic browser saving is unavailable. Use “Save all progress” before closing.</div>':''}</div><aside class="course-panel"><h3>${esc(p.name)}</h3><div class="course-summary"><div class="course-stat"><span class="big">${st.completed}/${available}</span><span class="label">Available lessons complete</span></div><div class="course-stat"><span class="big">${st.score===null?'—':st.score+'%'}</span><span class="label">Score on completed lessons</span></div><div class="course-stat"><span class="big">${available}/137</span><span class="label">Course lessons prepared</span></div><div class="course-stat"><span class="big">${st.inProgress}</span><span class="label">Lessons in progress</span></div></div></aside></section>
  <section class="course-panel"><div class="card-topline"><div><p class="eyebrow">COURSE LIBRARY</p><h2 style="margin-bottom:0">Choose a lesson</h2></div><span class="tag neutral">${available} prepared · ${137-available} awaiting source</span></div><div class="course-controls"><div><label class="field-label" for="lesson-search">Find a lesson</label><input id="lesson-search" class="text-input" type="search" placeholder="Search by number or title" value="${esc(course.dashboard.search)}"></div><button class="btn secondary small ${filter==='available'?'selected':''}" data-action="catalog-filter" data-filter="available">Prepared lessons</button><button class="btn secondary small ${filter==='all'?'selected':''}" data-action="catalog-filter" data-filter="all">All 137</button></div><div class="lesson-catalog">${catalog.length?catalog.map(({n,pkg})=>lessonCard(n,pkg,p)).join(''):'<div class="placeholder-note">No lesson matches that search.</div>'}</div></section>`;
 }
 function lessonCard(n,pkg,p){
  if(!pkg)return `<article class="course-lesson-card unavailable"><div class="lesson-number">Lesson ${n}</div><h3>Not yet prepared</h3><p class="lesson-meta">Source material has not been supplied and verified for this lesson.</p><div class="card-actions"><button class="btn secondary small" disabled>Unavailable</button></div></article>`;
  const ls=p.lessons[pkg.id],s=ls?lessonStats(pkg,ls):null,status=!s?'Ready to begin':s.complete?`Complete · ${s.credit}/${s.total} points`:`In progress · ${s.done}/${s.total} exercises complete`;
  return `<article class="course-lesson-card available"><div class="lesson-number">Lesson ${pkg.number}</div><h3>${esc(pkg.title)}</h3><p class="lesson-meta">${esc(pkg.chapter||'')} · ${pkg.topics.length} guided topics · ${pkg.buildQuestions().length} exercises</p><div class="lesson-status">${status}</div><div class="card-actions"><button class="btn small" data-action="open-lesson" data-lesson="${pkg.id}">${s?'Continue':'Open lesson'}</button>${s?'<button class="btn secondary small" data-action="lesson-report-card" data-lesson="'+pkg.id+'">Progress</button>':''}</div></article>`;
 }
 function courseReport(){
  const p=activeProfile(),s=courseStats(p),rows=registry.available().map(pkg=>{const ls=p.lessons[pkg.id],st=ls?lessonStats(pkg,ls):null;return{pkg,st};});
  return `<section class="card"><div class="card-topline"><div><p class="eyebrow">COURSE PROGRESS</p><h1 style="font-size:3rem;margin-bottom:8px">${esc(p.name)}</h1><p class="lesson-intro">Course scores use completed lessons only. Unprepared and unstarted lessons are never counted as zeros.</p></div><button class="btn secondary" data-action="course-home">Return to course</button></div><div class="course-report-grid"><div class="course-stat"><span class="big">${s.completed}/${s.available}</span><span class="label">Prepared lessons completed</span></div><div class="course-stat"><span class="big">${s.score===null?'—':s.score+'%'}</span><span class="label">Score across completed lesson points</span></div><div class="course-stat"><span class="big">${s.available}/137</span><span class="label">Course content prepared</span></div></div><table class="course-report-table"><thead><tr><th>Lesson</th><th>Status</th><th>Exercise progress</th><th>Score</th><th></th></tr></thead><tbody>${rows.map(({pkg,st})=>`<tr><td><strong>${pkg.number}. ${esc(pkg.title)}</strong></td><td>${!st?'Not started':st.complete?'Complete':'In progress'}</td><td>${st?st.done+'/'+st.total:'0/'+pkg.buildQuestions().length}</td><td>${st?(st.credit+'/'+st.total+(st.complete?' · '+st.percent+'%':' · provisional')):'—'}</td><td><button class="text-btn" data-action="open-lesson" data-lesson="${pkg.id}">${st?'Open':'Start'}</button></td></tr>`).join('')}</tbody></table><div class="notice info"><strong>Current scope:</strong> only Lesson 89 has validated content. Course-wide chapter grouping and additional lesson titles will be added from actual source material rather than inferred.</div></section>`;
 }

 function openLesson(id,goHome=false){
  const pkg=registry.get(id);if(!pkg)return toast('That lesson is not prepared yet.');
  if(activeLessonId&&lessonState)saveCourse();
  activeLessonId=id;activePkg=pkg;questions=pkg.buildQuestions();const raw=activeProfile().lessons[id];
  lessonState=raw?normalizeLessonState(pkg,raw):freshLessonState(pkg);mode='lesson';
  if(goHome)lessonState.view='home';saveCourse();render();focusMain();
 }
 function leaveLesson(){if(lessonState)saveCourse();mode='dashboard';activeLessonId=null;activePkg=null;lessonState=null;questions=[];render();focusMain();}
 function setLessonView(view,{focus=true}={}){lessonState.view=view;lessonState.lastLocation={view,topicIndex:lessonState.topicIndex,index:lessonState.indices[view]??0};inputError=null;saveCourse();render();if(focus)focusMain();}

 function lessonWorkflow(){
  const stages=[{id:'learn',label:'Learn',caption:`${lessonState.read.length}/${activePkg.topics.length} topics`,view:'learn'},
   ...activePkg.sections.map(s=>({id:s.id,label:s.label,caption:`${sectionDone(s.id)}/${sectionQuestions(s.id).length} complete`,view:s.id})),
   {id:'results',label:allDone()?'Results':'Progress',caption:allDone()?'Final lesson report':'Provisional report',view:'results'}];
  const current=lessonState.view.endsWith('-intro')?lessonState.view.replace('-intro',''):lessonState.view;
  return `<nav class="workflow" aria-label="Lesson stages">${stages.map((s,i)=>`<button data-action="lesson-stage" data-view="${s.view}" class="${current===s.id?'active ':''}${s.id!=='learn'&&s.id!=='results'&&sectionDone(s.id)===sectionQuestions(s.id).length?'complete':''}"><span class="step-dot">${i+1}</span><span>${esc(s.label)}<span class="step-caption">${esc(s.caption)}</span></span></button>`).join('')}</nav>`;
 }
 function overallProgress(){
  const st=lessonStats(activePkg,lessonState),parts=activePkg.topics.length+st.total,done=lessonState.read.length+st.done,pct=parts?Math.round(done/parts*100):0;
  return `<div class="course-progress-strip"><strong>Lesson ${activePkg.number}</strong><span>${done}/${parts} learning checkpoints complete</span><span>·</span><span>${st.credit}/${st.total} points earned${st.complete?'':' so far'}</span><span class="spacer"></span><button class="text-btn" data-action="course-home">Course dashboard →</button></div>`;
 }
 function lessonHome(){
  const st=lessonStats(activePkg,lessonState),resume=hasProgress();
  return `<section class="hero"><div class="hero-copy"><span class="tag">LESSON ${activePkg.number} · ${esc(activePkg.title.toUpperCase())}</span><h1>${activePkg.heroTitle||esc(activePkg.title)}</h1><p>${activePkg.description||''}</p><div class="btn-row"><button class="btn" data-action="resume-lesson">${st.complete?'View final results':resume?'Resume where I left off':'Begin lesson'} →</button><button class="btn secondary" data-action="jump">Choose any topic or problem</button></div><p class="small muted" style="margin-top:14px">Free navigation is always available. Leaving a question does not submit it or use a try.</p></div><div class="hero-art">${activePkg.heroArt||`<div class="art-caption"><span>Lesson ${activePkg.number}</span><span>${esc(activePkg.title)}</span></div><div class="formula">${esc(activePkg.title)}</div>`}</div></section><div class="lesson-home-grid"><section class="lesson-home-card"><h3>Guided instruction</h3><div class="value">${lessonState.read.length}/${activePkg.topics.length} topics marked read</div><p class="small muted">Open any topic as a reference. Topic-reading progress is tracked separately from exercise scores.</p><button class="btn secondary small" data-action="lesson-stage" data-view="learn">Open topics</button></section><section class="lesson-home-card"><h3>Exercise score</h3><div class="value">${st.credit}/${st.total} points${st.complete?' · '+st.percent+'%':' · provisional'}</div><p class="small muted">${st.done}/${st.total} exercises complete; ${st.solved}/${st.total} solved.</p><button class="btn secondary small" data-action="lesson-stage" data-view="results">${st.complete?'View results':'View progress'}</button></section></div><div class="section-launches">${activePkg.sections.map(s=>`<section class="section-launch"><h3>${esc(s.label)}</h3><div class="value">${sectionDone(s.id)}/${sectionQuestions(s.id).length}</div><p class="small muted">${sectionScore(s.id)} points earned so far.</p><button class="btn small" data-action="start-section" data-section="${s.id}">Open ${esc(s.label)}</button></section>`).join('')}</div>${lessonState.migration?`<div class="notice info">${esc(lessonState.migration.message||'Earlier progress was imported into the course app.')}</div>`:''}`;
 }
 function topicSidebar(){return `<aside class="side-panel"><div class="side-label"><span>Guided topics</span><span>${lessonState.read.length}/${activePkg.topics.length}</span></div><div class="lesson-menu">${activePkg.topics.map((t,i)=>`<button data-action="topic" data-index="${i}" class="${i===lessonState.topicIndex?'current ':''}${lessonState.read.includes(t.id)?'visited':''}"><span class="menu-num">${lessonState.read.includes(t.id)?'✓':i+1}</span><span>${t.short}</span></button>`).join('')}</div><div class="sidebar-help">Topics can be opened in any order. Quick checks are not scored.</div></aside>`;}
 function worked(t,all=false){const shown=all?(t.steps?.length||0):(lessonState.stepCounts[t.id]||1);if(!t.steps?.length)return'';return `<div class="worked-example"><div class="example-head"><span>Walk through an example</span><span class="tag neutral">${shown}/${t.steps.length} steps</span></div>${t.steps.slice(0,shown).map(([title,text],i)=>`<div class="example-step"><span class="step-number">${i+1}</span><div><p><strong>${title}</strong></p><p>${text}</p></div></div>`).join('')}${!all&&shown<t.steps.length?`<div class="example-action"><button class="text-btn" data-action="next-step" data-id="${t.id}">Reveal the next step →</button></div>`:''}</div>`;}
 function miniCheck(t){if(!t.mini)return'';const sel=lessonState.mini[t.id],answered=Number.isInteger(sel),correct=answered&&sel===t.mini.correct;return `<section class="mini-check"><div class="eyebrow">Quick check · not scored</div><p class="mini-prompt">${t.mini.prompt}</p><div class="mini-options">${t.mini.options.map((o,i)=>`<button class="mini-option ${sel===i?'selected':''}" data-action="mini" data-id="${t.id}" data-index="${i}">${math(o)}</button>`).join('')}</div>${answered?`<div class="mini-feedback ${correct?'':'wrong'}"><strong>${correct?'Correct.':'Try again.'}</strong> ${correct?t.mini.explain:'Review the pattern above. This does not affect your score.'}</div>`:''}</section>`;}
 function learnView(){const t=activePkg.topics[lessonState.topicIndex];return `<div class="layout">${topicSidebar()}<article class="card"><div class="card-topline"><p class="eyebrow">LEARN · TOPIC ${lessonState.topicIndex+1}</p><span class="tag neutral">${t.short}</span></div><h2>${t.title}</h2><p class="lesson-intro">${t.intro}</p>${t.body||''}${worked(t)}${t.after||''}${miniCheck(t)}<div class="lesson-bottom"><button class="text-btn" data-action="previous-topic" ${lessonState.topicIndex===0?'disabled':''}>← Previous topic</button><span class="small">${lessonState.read.includes(t.id)?'Marked read.':'Mark this topic read when ready.'}</span><button class="btn" data-action="mark-topic">${lessonState.read.includes(t.id)?'Next topic':'Mark read & continue'} →</button></div></article></div>`;}
 function sectionIntro(id){const s=activePkg.sections.find(x=>x.id===id),qs=sectionQuestions(id);return `<section class="section-start card"><div class="eyebrow">Open in any order · progress stays saved</div><h1>${esc(s.label)}</h1><p class="lesson-intro">${s.intro||''}</p><div class="section-metrics"><div class="metric"><div class="number">${sectionDone(id)}/${qs.length}</div><div class="label">Exercises complete</div></div><div class="metric"><div class="number">${sectionScore(id)}/${qs.length}</div><div class="label">Points earned so far</div></div><div class="metric"><div class="number">Any order</div><div class="label">No locked questions</div></div></div><div class="notice info"><strong>Credit policy:</strong> multiple choice allows one valid try for credit; fill-in allows two. Later correct answers still count as solved but earn no point.</div><div class="btn-row"><button class="btn" data-action="start-section" data-section="${id}">${sectionDone(id)?'Continue':'Begin'} ${esc(s.label)} →</button><button class="btn secondary" data-action="jump">Choose a specific problem</button></div></section>`;}

 function statusInfo(q,r){const c=scoringFor(q,r);if(r.revealed)return{label:'Solution reviewed · 0 pts',map:'reviewed',mark:'R'};if(c.credit)return{label:'Correct · 1 pt',map:'solved',mark:'✓'};if(c.solved)return{label:'Correct · no credit',map:'no-credit',mark:'✓0'};if(r.attempts.length)return{label:c.possible?'In progress · credit available':'In progress · practice only',map:'in-progress',mark:'…'};if(hasDraft(r))return{label:'Draft saved',map:'drafted',mark:'•'};return{label:'Not started',map:'',mark:''};}
 function questionGrid(id,index=-1){return `<div class="question-grid">${sectionQuestions(id).map((q,i)=>{const s=statusInfo(q,rec(q));return `<button data-action="question" data-section="${id}" data-index="${i}" class="${i===index?'current ':''}${s.map}" title="${esc(s.label)}">${q.label}<span class="map-mark">${s.mark}</span></button>`;}).join('')}</div>`;}
 function mapLegend(){return `<div class="map-legend"><span><b>✓</b>Credit</span><span><b>✓0</b>Correct, no credit</span><span><b>…</b>In progress</span><span><b>R</b>Solution reviewed</span><span><b>•</b>Draft</span></div>`;}
 function questionSidebar(id,index){const s=activePkg.sections.find(x=>x.id===id),qs=sectionQuestions(id);return `<aside class="side-panel"><details class="side-map-details" open><summary class="mobile-map-summary">Question map · ${sectionDone(id)}/${qs.length} complete</summary><div class="side-label"><span>${esc(s.label)}</span><span>${sectionDone(id)}/${qs.length}</span></div>${questionGrid(id,index)}${mapLegend()}<p class="map-help">Every question is open. Navigation never uses a try.</p><button class="text-btn" data-action="jump">All topics & questions →</button></details></aside>`;}
 function groupInfo(q,r,key){return scoringFor(q,r).groups.find(g=>g.key===key);}
 function componentNote(q,r,key){const g=groupInfo(q,r,key);if(!g)return'';let t;if(r.revealed)t='Solution reviewed. No credit.';else if(g.solved)t=`✓ Correct ${key==='choice'?'choice':'answer'} saved on try ${g.correctAt}. ${g.earned?'This part qualifies for credit.':'This part earns no credit.'}`;else t=`${g.remaining} credit-bearing ${g.remaining===1?'try':'tries'} remaining. ${g.remaining?'A valid incorrect submission uses one try.':'Continue trying for practice, without credit.'}`;return `<p class="part-credit ${g.solved?'saved':''}">${t}</p>`;}
 function choiceHTML(q,r){const g=groupInfo(q,r,'choice'),locked=r.done||g?.solved;return `<fieldset><legend>${q.type==='trip'?'1. Choose the equation':'Choose your answer'} <span class="muted small">· ${creditLimit(q,'choice')} credit try</span></legend><div class="choices">${q.choices.map((c,i)=>{const correct=locked&&i===q.correct,wrong=r.done&&r.draft.choice===i&&!correct;return `<button type="button" class="choice ${r.draft.choice===i?'selected ':''}${correct?'correct-answer ':''}${wrong?'incorrect-answer':''}" data-action="choose" data-index="${i}" ${locked?'disabled':''}><span class="choice-key">${c.label}</span><span class="choice-text">${math(c.html)}</span>${correct?'<span class="choice-status">Correct</span>':''}</button>`;}).join('')}</div>${componentNote(q,r,'choice')}</fieldset>`;}
 function fieldsHTML(q,r){const g=groupInfo(q,r,'fields'),locked=r.done||g?.solved;return `<fieldset><legend>${q.type==='trip'?'2. Complete the typed answer':q.type==='scientific'?'Write coefficient × 10^exponent':'Enter your answer'} <span class="muted small">· ${creditLimit(q,'fields')} credit tries</span></legend><div class="field-grid ${q.fields.length===3?'three':''}">${q.fields.map(f=>`<div><label class="field-label" for="answer-${f.key}">${f.label}</label><input class="text-input answer-input" id="answer-${f.key}" data-field="${f.key}" type="text" maxlength="160" autocomplete="off" placeholder="${esc(f.placeholder||'Answer')}" value="${esc(r.draft.values[f.key]||'')}" ${locked?'readonly':''} ${inputError?.field===f.key?'aria-invalid="true"':''}>${f.suffix?`<span class="field-hint">${f.suffix}</span>`:''}</div>`).join('')}</div>${componentNote(q,r,'fields')}</fieldset>`;}
 function workHTML(q,r){return `<details class="work-area" id="work-area" ${r.workOpen?'open':''}><summary>Work it out <span class="muted small">· optional, not graded</span></summary><div class="work-inner"><div class="work-guide"><ol>${(q.guide||[]).map(x=>`<li>${x}</li>`).join('')}</ol></div><label class="field-label" for="scratchpad">Your workspace</label><textarea id="scratchpad" maxlength="5000">${esc(r.notes)}</textarea><p class="scratch-note">Notes stay with this question when you move around.</p></div></details>`;}
 function hintsHTML(q,r){return r.hints?`<div class="hint-box">${(q.hints||[]).slice(0,r.hints).map((h,i)=>`<p><strong>Hint ${i+1}</strong>${h}</p>`).join('')}</div>`:'';}
 function solutionHTML(q,open=true){return `<details class="solution" ${open?'open':''}><summary>Worked solution</summary><div class="solution-inner"><div class="solution-answer">${math(q.answerHTML)}</div><ol>${(q.solution||[]).map(x=>`<li>${x}</li>`).join('')}</ol>${q.check?`<div class="check"><strong>Check:</strong> ${q.check}</div>`:''}</div></details>`;}
 function creditRule(q,r){const sc=scoringFor(q,r);let t;if(sc.credit)t='Credit earned: 1 / 1 point.';else if(r.revealed)t='Worked solution reviewed: 0 / 1 point.';else if(sc.solved)t='Correct for practice: 0 / 1 point.';else if(!sc.possible)t='Credit limit used. Continue trying for practice.';else if(q.choices&&q.fields)t='One point total: the multiple-choice part must be correct within 1 try and the fill-in part within 2 tries.';else t=q.choices?'One point available on the first valid multiple-choice submission.':'One point available for a correct answer within the first two valid fill-in submissions.';return `<div class="credit-rule">${t}</div>`;}
 function feedbackHTML(q,r){if(!r.feedback)return'';const sc=scoringFor(q,r);let title,verdict,message,cls='',symbol='✓';if(r.revealed){title='SOLUTION REVIEWED';verdict='0 points awarded';message='This exercise is complete without independent credit.';cls='reviewed-feedback';symbol='i';}else if(sc.solved&&sc.credit){title='CORRECT · CREDIT EARNED';verdict='+1 point toward your lesson score';message='Your answer was solved within its credit-bearing attempt limit.';}else if(sc.solved){title='CORRECT · PRACTICE ONLY';verdict='0 points awarded';message='You solved the exercise after the credit limit was used.';cls='practice-only';}else{title='INCORRECT · TRY AGAIN';verdict='No point awarded for this submission';message=sc.possible?'Credit is still available where a group has remaining tries.':'Keep trying for practice; the point is no longer available.';cls='wrong';symbol='✕';}const pulse=feedbackPulseFor===q.id&&course.prefs.motion;return `<div id="answer-feedback" class="feedback answer-feedback ${cls} ${pulse?'feedback-pulse':''}" tabindex="-1" role="status"><div class="feedback-head"><span class="feedback-symbol">${symbol}</span><div><h3>${title}</h3><span class="credit-verdict">${verdict}</span></div></div><p>${message}</p><p class="small">${r.attempts.length} valid ${r.attempts.length===1?'submission':'submissions'} · ${r.hints} ${r.hints===1?'hint':'hints'} used</p></div>`;}
 function questionView(id){const qs=sectionQuestions(id),index=lessonState.indices[id],q=qs[index],r=rec(q),status=statusInfo(q,r),s=activePkg.sections.find(x=>x.id===id);return `<div class="layout">${questionSidebar(id,index)}<article class="card"><div class="card-topline"><p class="eyebrow">${esc(s.label)} · ${index+1} OF ${qs.length}</p><span class="tag ${r.done?'':'neutral'}">${status.label}</span></div><div class="question-tools"><button class="text-btn" data-action="jump">Jump elsewhere</button><button class="text-btn" data-action="lesson-stage" data-view="results">${allDone()?'Final results':'Progress report'}</button></div><h2 class="question-heading">${q.heading||q.skill}</h2><div class="question-subtitle">${q.skill} · ${q.page?'Source page '+q.page+' · ':''}1 possible point</div><div class="question-prompt">${q.prompt}</div>${activePkg.renderQuestionAsset?activePkg.renderQuestionAsset(q):''}${creditRule(q,r)}<form id="answer-form">${q.define?`<div class="notice info"><strong>Define the variable:</strong> ${q.define}</div>`:''}${q.choices?choiceHTML(q,r):''}${q.fields?fieldsHTML(q,r):''}<p class="answer-help">${q.answerHelp||(q.choices?'Choose an answer, then submit it.':'Fractions, decimals, mixed numbers, and sqrt(...) are supported.')}</p>${inputError?`<div class="error-inline" role="alert">${esc(inputError.error)} No try was used.</div>`:''}${workHTML(q,r)}${hintsHTML(q,r)}<div class="answer-dock"><div class="submit-row"><button class="btn" type="submit" ${r.done?'disabled':''}>${r.done?'Answer recorded':r.attempts.length?'Submit revised answer':'Submit answer'} →</button>${!r.done?`<button class="btn secondary" type="button" data-action="hint" ${r.hints>=(q.hints?.length||0)?'disabled':''}>${r.hints?'Next hint':'Get a hint'}</button>`:''}<button class="text-btn" type="button" data-action="concept" data-id="${q.lesson}">Review concept</button></div>${feedbackHTML(q,r)}${!r.done?'<button class="text-btn" type="button" data-action="reveal">Reveal worked solution & finish without credit</button>':''}</div>${r.done?solutionHTML(q,r.solutionOpen):''}<div class="question-nav"><button class="text-btn" type="button" data-action="previous-question" ${index===0?'disabled':''}>← Previous</button><span class="small">${r.done?'Result saved.':'You may leave this unfinished.'}</span><button class="btn secondary" type="button" data-action="next-question">${index===qs.length-1?'Next section / report':'Next question'} →</button></div></form></article></div>`;}
 function resultRow(q){const r=rec(q),sc=scoringFor(q,r),label=sc.credit?'Credit earned · 1 pt':sc.solved?'Correct · 0 pts':r.revealed?'Solution reviewed · 0 pts':'Unfinished',first=r.attempts[0];return `<details class="result-row"><summary><span class="result-title"><strong>${q.label}</strong><span class="muted">${q.skill}</span></span><span class="status-pill ${sc.credit?'':'retry'}">${label}</span></summary><div class="result-detail"><p><strong>Submissions:</strong> ${r.attempts.length} · <strong>Hints:</strong> ${r.hints}</p>${first?`<p><strong>First submission:</strong> ${esc(draftText(q,first.draft))}</p>`:''}${r.notes?`<p><strong>Workspace:</strong></p><p style="white-space:pre-wrap">${esc(r.notes)}</p>`:''}${solutionHTML(q,false)}</div></details>`;}
 function draftText(q,d){const a=[];if(q.choices&&Number.isInteger(d.choice)&&q.choices[d.choice])a.push(q.choices[d.choice].label+'. '+plain(q.choices[d.choice].html));for(const f of q.fields||[])a.push(f.label.replace(/ =$/,'')+': '+(d.values?.[f.key]||'not entered'));return a.join(' · ');}
 function resultsView(){const st=lessonStats(activePkg,lessonState),filtered=questions.filter(q=>lessonState.reportFilter==='all'||lessonState.reportFilter===q.section||(lessonState.reportFilter==='missed'&&!scoringFor(q,rec(q)).credit)||(lessonState.reportFilter==='unfinished'&&!rec(q).done));return `<section><div class="results-top"><div><div class="eyebrow">${st.complete?'FINAL LESSON REPORT':'PROVISIONAL LESSON REPORT'}</div><h1>${st.complete?'Lesson complete.':'Progress so far.'}</h1><p class="lesson-intro">${st.complete?'All exercises are complete.':'You can open this report at any time; unfinished exercises are not treated as incorrect.'}</p><p class="small muted">Lesson ${activePkg.number} · ${esc(activePkg.title)}</p></div><div class="score-panel"><div class="score-big">${st.percent}%</div><div class="score-fraction">${st.credit}/${st.total} points</div><div class="score-label">${st.complete?'Final lesson score':'Provisional score'}</div></div></div><div class="result-stats"><div class="result-stat"><span class="number">${st.done}/${st.total}</span><span class="label">Exercises complete</span></div><div class="result-stat"><span class="number">${st.solved}/${st.total}</span><span class="label">Solved</span></div><div class="result-stat"><span class="number">${lessonState.read.length}/${activePkg.topics.length}</span><span class="label">Topics read</span></div><div class="result-stat"><span class="number">${st.credit}</span><span class="label">Points earned</span></div></div><div class="btn-row"><button class="btn" data-action="export-lesson">Save Lesson ${activePkg.number} progress</button><button class="btn secondary" data-action="jump">Return to a topic or problem</button><button class="btn secondary" data-action="course-home">Course dashboard</button></div><div class="report-filter">${[['all','All'],['missed','No-credit / unfinished'],['unfinished','Unfinished'],...activePkg.sections.map(s=>[s.id,s.label])].map(([k,t])=>`<button class="btn secondary small ${lessonState.reportFilter===k?'selected':''}" data-action="filter-report" data-filter="${k}">${esc(t)}</button>`).join('')}</div><div class="result-list">${filtered.map(resultRow).join('')}</div></section>`;}

 function jumpModal(){openModal('Go to any topic or problem',`<p>No prerequisites or locked questions. Moving elsewhere saves your draft without submitting it.</p><section class="jump-section"><h3>Guided topics · ${lessonState.read.length}/${activePkg.topics.length} marked read</h3><div class="lesson-menu">${activePkg.topics.map((t,i)=>`<button data-action="topic" data-index="${i}"><span class="menu-num">${lessonState.read.includes(t.id)?'✓':i+1}</span><span>${t.short}</span></button>`).join('')}</div></section>${activePkg.sections.map(s=>`<section class="jump-section"><h3>${esc(s.label)} · ${sectionDone(s.id)}/${sectionQuestions(s.id).length}</h3>${questionGrid(s.id,lessonState.view===s.id?lessonState.indices[s.id]:-1)}</section>`).join('')}${mapLegend()}`,`<button class="btn secondary" data-action="lesson-stage" data-view="results">View progress report</button><button class="btn" data-action="close-modal">Return</button>`);}
 function conceptModal(id){const t=activePkg.topics.find(t=>t.id===id);if(!t)return;openModal(t.title,`<p class="lesson-intro">${t.intro}</p>${t.body||''}${worked(t,true)}${(t.after||'').replace(/<div id="pattern-lab"><\/div>/g,'')}<p class="small muted">This review does not use a try.</p>`);}
 function scoreHelp(){return `<p><strong>One point per exercise.</strong> Multiple-choice groups have one valid credit-bearing try. Fill-in groups have two. Mixed questions require every group to qualify for the exercise’s single point.</p><p>After the credit limit, correct answers still count as solved but add no point. Blank or unreadable inputs do not use a try. Hints do not deduct points.</p><p>Revealing the complete worked solution before solving finishes the exercise with zero credit.</p>`;}

 function captureDraft(){if(mode!=='lesson'||!activePkg.sections.some(s=>s.id===lessonState.view))return;const q=getQuestion(),r=rec(q);if(!r.done&&!groupInfo(q,r,'fields')?.solved)$$('.answer-input').forEach(i=>r.draft.values[i.dataset.field]=i.value.slice(0,160));const scratch=$('#scratchpad');if(scratch)r.notes=scratch.value.slice(0,5000);}
 function doSubmit(){const q=getQuestion(),r=rec(q);if(r.done)return;captureDraft();const res=grade(q,r.draft);if(!res.valid){inputError=res;saveCourse();render();(res.field?$('#answer-'+res.field):$('.choice'))?.focus();announce(res.error+' No try was used.');return;}inputError=null;r.attempts.push({draft:clone(r.draft),correct:res.correct,parts:res.parts,at:new Date().toISOString(),hints:r.hints});const sc=syncRecord(q,r);r.feedback=sc.solved?'correct':'wrong';if(sc.solved)r.solutionOpen=true;if(allDone()&&!lessonState.completedAt)lessonState.completedAt=new Date().toISOString();playCue(sc.solved?'correct':'wrong');feedbackPulseFor=q.id;saveCourse();render();$('#answer-feedback')?.scrollIntoView({block:'center',behavior:course.prefs.motion?'smooth':'auto'});}
 function chooseAnswer(i){const q=getQuestion(),r=rec(q);if(r.done||groupInfo(q,r,'choice')?.solved||!Number.isInteger(i)||i<0||i>=q.choices.length)return;captureDraft();r.draft.choice=i;inputError=null;saveCourse();render();}
 function resumeLesson(){if(!lessonState.startedAt)lessonState.startedAt=new Date().toISOString();if(lessonState.lastLocation?.view&&['learn',...activePkg.sections.map(s=>s.id)].includes(lessonState.lastLocation.view)){if(lessonState.lastLocation.view==='learn')lessonState.topicIndex=Math.max(0,Math.min(activePkg.topics.length-1,lessonState.lastLocation.topicIndex||0));else lessonState.indices[lessonState.lastLocation.view]=Math.max(0,Math.min(sectionQuestions(lessonState.lastLocation.view).length-1,lessonState.lastLocation.index||0));setLessonView(lessonState.lastLocation.view);return;}if(allDone())setLessonView('results');else if(lessonState.read.length<activePkg.topics.length)setLessonView('learn');else{const s=activePkg.sections.find(x=>sectionDone(x.id)<sectionQuestions(x.id).length);setLessonView(s?s.id:'results');}}
 function renderLesson(){header();footer();const main=$('#main');main.innerHTML=lessonWorkflow()+overallProgress()+(lessonState.view==='home'?lessonHome():lessonState.view==='learn'?learnView():lessonState.view==='results'?resultsView():lessonState.view.endsWith('-intro')?sectionIntro(lessonState.view.replace('-intro','')):questionView(lessonState.view));if(lessonState.view==='learn'&&activePkg.mountTopicExtras)activePkg.mountTopicExtras(main,lessonState,{save:saveCourse,render});document.title=`Lesson ${activePkg.number} · ${activePkg.title} · Algebra 2 Studio`;updateSoundButton();}
 function render(){header();footer();const main=$('#main');if(mode==='dashboard'){main.innerHTML=course._report?courseReport():dashboard();document.title='Algebra 2 Studio';}else renderLesson();updateSaveStatus();}

 function download(content,name,type){const b=new Blob([content],{type}),u=URL.createObjectURL(b),a=document.createElement('a');a.href=u;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),30000);}
 function stamp(){return new Date().toISOString().replace(/[:.]/g,'-').slice(0,19);}
 function exportCourse(){captureDraft();saveCourse();download(JSON.stringify(course,null,2),'algebra2_course_progress_'+stamp()+'.json','application/json');toast('Course progress backup prepared.');}
 function exportLesson(){captureDraft();saveCourse();download(JSON.stringify(lessonState,null,2),`lesson_${activePkg.number}_course_progress_${stamp()}.json`,'application/json');}
 function importStandalone(raw){
  const pkg=registry.get('lesson-089');if(!pkg||!pkg.migrateStandalone)throw Error('The Lesson 89 migration adapter is unavailable.');
  const migrated=pkg.migrateStandalone(raw,{normalizeLessonState,grade,scoringFor,syncRecord,cleanDraft,blankRecord,clone});
  activeProfile().lessons[pkg.id]=migrated;saveCourse();return pkg;
 }

 document.addEventListener('click',e=>{
  const el=e.target.closest('[data-action]');if(!el||el.disabled)return;const a=el.dataset.action;if(el.tagName==='BUTTON'&&el.type!=='submit')e.preventDefault();
  if(a==='course-home'){captureDraft();course._report=false;leaveLesson();}
  else if(a==='course-report'){captureDraft();if(mode==='lesson')saveCourse();mode='dashboard';activeLessonId=null;activePkg=null;lessonState=null;questions=[];course._report=true;render();focusMain();}
  else if(a==='open-lesson'){course._report=false;openLesson(el.dataset.lesson);}
  else if(a==='lesson-report-card'){openLesson(el.dataset.lesson);setLessonView('results');}
  else if(a==='catalog-filter'){course.dashboard.filter=el.dataset.filter;saveCourse();render();}
  else if(a==='new-profile'){openModal('Add a student profile','<label class="field-label" for="new-profile-name">Student name</label><input id="new-profile-name" class="text-input" maxlength="80" placeholder="Student name">','<button class="btn" data-action="confirm-new-profile">Add profile</button><button class="btn secondary" data-action="close-modal">Cancel</button>');}
  else if(a==='confirm-new-profile'){const name=$('#new-profile-name')?.value.trim()||`Student ${Object.keys(course.profiles).length+1}`,p=freshProfile(name);course.profiles[p.id]=p;course.activeProfileId=p.id;closeModal();saveCourse();leaveLesson();}
  else if(a==='lesson-stage'){closeModal();const v=el.dataset.view;if(v==='learn')setLessonView('learn');else if(v==='results')setLessonView('results');else setLessonView(sectionDone(v)?v:v+'-intro');}
  else if(a==='resume-lesson')resumeLesson();
  else if(a==='topic'){closeModal();lessonState.topicIndex=Number(el.dataset.index);setLessonView('learn');}
  else if(a==='previous-topic'){lessonState.topicIndex=Math.max(0,lessonState.topicIndex-1);setLessonView('learn');}
  else if(a==='mark-topic'){const t=activePkg.topics[lessonState.topicIndex];if(!lessonState.read.includes(t.id))lessonState.read.push(t.id);if(lessonState.topicIndex<activePkg.topics.length-1)lessonState.topicIndex++;saveCourse();render();focusMain();}
  else if(a==='next-step'){const t=activePkg.topics.find(x=>x.id===el.dataset.id);lessonState.stepCounts[t.id]=Math.min(t.steps.length,(lessonState.stepCounts[t.id]||1)+1);saveCourse();render();}
  else if(a==='mini'){lessonState.mini[el.dataset.id]=Number(el.dataset.index);saveCourse();render();}
  else if(a==='start-section'){setLessonView(el.dataset.section);}
  else if(a==='question'){closeModal();captureDraft();lessonState.indices[el.dataset.section]=Number(el.dataset.index);setLessonView(el.dataset.section);}
  else if(a==='choose')chooseAnswer(Number(el.dataset.index));
  else if(a==='hint'){const q=getQuestion(),r=rec(q);if(r.done)return;captureDraft();r.hints=Math.min(q.hints.length,r.hints+1);saveCourse();render();}
  else if(a==='reveal'){const q=getQuestion(),r=rec(q);captureDraft();confirmDialog('Reveal the worked solution?',`<p>This finishes the exercise with <strong>0 points</strong>. Existing work and attempts stay recorded.</p>`,'Reveal solution',()=>{r.revealed=true;r.feedback='revealed';syncRecord(q,r);if(allDone())lessonState.completedAt=new Date().toISOString();saveCourse();render();},false);}
  else if(a==='previous-question'){captureDraft();lessonState.indices[lessonState.view]=Math.max(0,lessonState.indices[lessonState.view]-1);setLessonView(lessonState.view);}
  else if(a==='next-question'){captureDraft();const id=lessonState.view,qs=sectionQuestions(id);if(lessonState.indices[id]<qs.length-1){lessonState.indices[id]++;setLessonView(id);}else{const si=activePkg.sections.findIndex(s=>s.id===id);if(si<activePkg.sections.length-1)setLessonView(activePkg.sections[si+1].id+'-intro');else setLessonView('results');}}
  else if(a==='jump')jumpModal();
  else if(a==='concept')conceptModal(el.dataset.id);
  else if(a==='reference')openModal('Reference sheet',activePkg.referenceHtml());
  else if(a==='how-score')openModal('How scoring works',scoreHelp());
  else if(a==='settings')settingsModal();
  else if(a==='toggle-sound'){course.prefs.sound=!course.prefs.sound;saveCourse();updateSoundButton();}
  else if(a==='test-sound')playCue(el.dataset.kind==='wrong'?'wrong':'correct');
  else if(a==='filter-report'){lessonState.reportFilter=el.dataset.filter;saveCourse();render();}
  else if(a==='export-course')exportCourse();
  else if(a==='export-lesson')exportLesson();
  else if(a==='load-progress')$('#progress-file').click();
  else if(a==='about-course')openModal('About the Algebra 2 course foundation',`<p>This course foundation keeps lesson content modular while using a shared progress, navigation, scoring, feedback, and backup system.</p><p><strong>Current validated content:</strong> Lesson 89 · ${esc(registry.get('lesson-089')?.title||'Standard Forms')}.</p><p>Lessons without supplied source material remain unavailable. The app does not infer missing textbook organization or exercise content.</p><p>Multiple choice has one credit-bearing try; fill-in has two. Students may navigate freely without consuming attempts.</p>`);
  else if(a==='close-modal')closeModal();
  else if(a==='confirm-modal'){const fn=modalAction;closeModal();if(fn)fn();}
  else if(activePkg?.handleAction&&activePkg.handleAction(a,el,lessonState,{save:saveCourse,render,toast,announce})){}
 });
 document.addEventListener('submit',e=>{if(e.target.id==='answer-form'){e.preventDefault();doSubmit();}});
 document.addEventListener('input',e=>{
  const el=e.target;
  if(el.id==='lesson-search'&&mode==='dashboard'){course.dashboard.search=el.value.slice(0,50);saveCourse();const pos=el.selectionStart;render();const n=$('#lesson-search');if(n){n.focus();n.setSelectionRange(pos,pos);}}
  else if(el.classList.contains('answer-input')&&mode==='lesson'&&activePkg.sections.some(s=>s.id===lessonState.view)){const q=getQuestion(),r=rec(q);if(!r.done){r.draft.values[el.dataset.field]=el.value.slice(0,160);saveCourse();}}
  else if(el.id==='scratchpad'&&mode==='lesson'){rec(getQuestion()).notes=el.value.slice(0,5000);saveCourse();}
  else if(el.id==='setting-volume'){course.prefs.volume=Math.max(0,Math.min(30,Number(el.value)));$('#volume-value').textContent=course.prefs.volume+'%';saveCourse();}
  else if(activePkg?.handleInput&&activePkg.handleInput(el,lessonState,{save:saveCourse,render,toast,announce})){}
 });
 document.addEventListener('change',e=>{
  if(e.target.id==='profile-select'){captureDraft();saveCourse();course.activeProfileId=e.target.value;course._report=false;leaveLesson();}
  else if(e.target.id==='setting-sound'){course.prefs.sound=e.target.checked;saveCourse();updateSoundButton();}
  else if(e.target.id==='setting-motion'){course.prefs.motion=e.target.checked;saveCourse();}
 });
 $('#progress-file').addEventListener('change',async e=>{
  const file=e.target.files?.[0];if(!file)return;e.target.value='';
  try{
   if(file.size>5_000_000)throw Error('That progress file is unexpectedly large.');
   const raw=JSON.parse(await file.text());
   if(raw.format===COURSE_FORMAT){const restored=validateCourse(raw);confirmDialog('Restore this course backup?',`<p>This backup contains <strong>${Object.keys(restored.profiles).length}</strong> student profile(s). Restoring replaces the course progress currently saved in this browser.</p>`,'Restore course',()=>{course=restored;saveCourse();leaveLesson();});}
   else if(['1.0.0','1.1.0','1.2.0'].includes(raw.version)){const pkg=registry.get('lesson-089');confirmDialog('Import standalone Lesson 89 progress?',`<p>The file appears to be from the standalone Lesson 89 app, version <strong>${esc(raw.version)}</strong>.</p><p>It will be migrated into the active course profile <strong>${esc(activeProfile().name)}</strong>. Existing Lesson 89 course progress for this profile will be replaced.</p>`,'Import Lesson 89',()=>{try{const imported=importStandalone(raw);closeModal();toast(`Lesson ${imported.number} progress imported.`);course._report=false;openLesson(imported.id);}catch(err){openModal('Import failed',`<p>${esc(err.message)}</p>`);}});}
   else if(raw.schema==='algebra2-lesson-state-v1'&&raw.lessonId){const pkg=registry.get(raw.lessonId);if(!pkg)throw Error('That lesson is not installed in this course build.');const normalized=normalizeLessonState(pkg,raw);confirmDialog('Restore this lesson progress?',`<p>Restore Lesson ${pkg.number} into <strong>${esc(activeProfile().name)}</strong>?</p>`,'Restore lesson',()=>{activeProfile().lessons[pkg.id]=normalized;saveCourse();openLesson(pkg.id);});}
   else throw Error('This is not a recognized Algebra 2 progress file.');
  }catch(err){openModal('Progress was not restored',`<p>${esc(err.message)}</p><p>Your current saved work has not been changed.</p>`);}
 });
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&$('#modal-root .modal'))closeModal();});
 window.addEventListener('beforeunload',()=>{captureDraft();saveCourse();});
 render();
 return{getCourse:()=>course,getActiveLesson:()=>lessonState,openLesson,registry,normalizeLessonState,lessonStats,grade,scoringFor};
}

const registry=(function(){const map=new Map();return{register(pkg){if(!pkg?.id)throw Error('Lesson package requires an id.');map.set(pkg.id,pkg);},get:id=>map.get(id),available:()=>Array.from(map.values()).sort((a,b)=>a.number-b.number)};})();

global.Algebra2CourseRegistry=registry;
global.Algebra2Engine={version:COURSE_VERSION,scorePolicy:SCORE_POLICY,helpers:{esc,math,pow,frac,root,display,panel,callout,choice,mono,letters,makeChoices,clone,plain,parseNumber,grade,blankRecord,scoringFor,syncRecord,cleanDraft},createApp,normalizeLessonState,lessonStats};
})(window);
