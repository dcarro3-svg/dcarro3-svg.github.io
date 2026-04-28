// ═══════════════════════════════════════════════════════════════════════════════
// LESSON ONE — EQUAL RELATIONS
// All concepts new. All INSTRUCT steps start at 'D'.
// ═══════════════════════════════════════════════════════════════════════════════

// ── Generators ────────────────────────────────────────────────────────────────
function genEq(){
  const c1=randColor(),c2=randColor([c1.name]);
  const w=BASE*(0.5+Math.random()*0.4);
  const layout=Math.random()>0.5?'stacked':'dotted';
  return{c1,c2,w1:w,w2:w,isEqual:true,layout};
}
function genUneq(){
  const c1=randColor(),c2=randColor([c1.name]);
  const diff=0.18+Math.random()*0.3;
  const w1=BASE*(0.45+Math.random()*0.2);
  const w2=Math.random()>0.5?w1*(1+diff):w1*(1-diff);
  return{c1,c2,w1,w2:Math.max(w2,60),isEqual:false,layout:'stacked'};
}
function renderModel(m){return renderEqual(m);}

// ── INSTRUCT ──────────────────────────────────────────────────────────────────
const INSTRUCT=[
  {
    // New concept: equal — starts at D
    initialMode:'D',
    build(){const c1=COLORS[0],c2=COLORS[2],w=320;return{c1,c2,w1:w,w2:w,layout:'stacked',isEqual:true};},
    audio(){return`Look at these two bars. They are the same size. When two bars are the same size, we call them equal.`;},
    guide(){return`Look at both bars. Are they the same size or different sizes?`;},
    question:`What is the relation?`,
    opts:['These bars are equal.','These bars are not equal.','One bar is part of the other.'],
    fu(){return`Equal means the same size. When two bars are the same size, they are equal.`;},
    fuQ:`What do we call two bars that are the same size?`,
    fuOpts:['Two bars that are the same size are equal.','Two bars that are the same size are not equal.','Two bars that are the same size form a part-whole.'],
    fuGuide(){return`The bars are the same size. What word means "same size"?`;},
  },
  {
    // Not equal — starts at D
    initialMode:'D',
    build(){const c1=COLORS[3],c2=COLORS[1];const w=BASE*(0.6+Math.random()*0.25);return{c1,c2,w1:w,w2:w*1.4,isEqual:false,layout:'stacked'};},
    audio(){return`These two bars are different sizes. They are not equal. Two bars are only equal if they are the same size.`;},
    guide(){return`Look at both bars. Are they the same size?`;},
    question:`Are these bars equal or not equal?`,
    opts:['These bars are not equal.','These bars are equal.','These bars form a part-whole.'],
    fu(){return`Not equal means different sizes. If two bars are different sizes, they are not equal.`;},
    fuQ:`What do we call two bars that are different sizes?`,
    fuOpts:['Two bars that are different sizes are not equal.','Two bars that are different sizes are equal.','Two bars that are different sizes are a part-whole.'],
    fuGuide(){return`They are different sizes. Does "equal" mean the same size or different sizes?`;},
  },
  {
    // Picture must show equality — starts at D
    initialMode:'D',
    build(){const c1=COLORS[2],c2=COLORS[3];const w=BASE*0.65;return{c1,c2,w1:w,w2:w*1.22,isEqual:false,layout:'stacked'};},
    audio(){return`These bars look close in size — but the picture does not show they are equal. To say two bars are equal, the picture must show it. The bars must be stacked right on top, or have dotted lines at the ends.`;},
    guide(){return`Look at how the bars are shown. Does the picture prove they are the same size?`;},
    question:`Can I call these bars equal?`,
    opts:['No — the picture does not show it.','Yes — they look the same size.','Yes — any two bars that are close are equal.'],
    fu(){return`The picture must show that bars are equal. They need to be stacked or have dotted lines.`;},
    fuQ:`What must the picture show to say two bars are equal?`,
    fuOpts:['The bars must be stacked or have dotted lines.','The bars must be the same color.','The bars must be side by side.'],
    fuGuide(){return`Think about how you have seen equal bars before. What did the picture have?`;},
  },
  {
    // Dotted-line format — starts at D (new visual format)
    initialMode:'D',
    build(){const c1=COLORS[3],c2=COLORS[1];const w=BASE*0.7;return{c1,c2,w1:w,w2:w,layout:'dotted',isEqual:true};},
    audio(){return`These bars are not stacked. But the dotted lines on each end show that both bars start and end at the same point. The picture shows they are equal.`;},
    guide(){return`Look at the dotted lines on the ends. What do they show about where each bar ends?`;},
    question:`Are these bars equal or not equal?`,
    opts:['Yes — these bars are equal.','No — the picture does not show it.','These bars form a comparison.'],
    fu(){return`The dotted lines show both bars end at the same point. That means the picture shows they are equal.`;},
    fuQ:`How does the picture show equality here?`,
    fuOpts:['The dotted lines show both bars end at the same point.','The bars are stacked on top of each other.','The bars are the same color.'],
    fuGuide(){return`The dotted lines touch each end of both bars. What does that tell you about both bars?`;},
  },
];

// ── Phases ────────────────────────────────────────────────────────────────────
function showIntro(){
  S.phase='intro';setPhase('Introduction');setProgress(4);
  const audio=`You are going to learn to name relations. A relation tells how two things connect. The first relation is equal. Equal means two things are the same size.`;
  render(`<div class="instruct-text neutral" id="instructBox">${audioBtn()}<span id="instructAnim" class="typed-text"></span></div>`,
    `<div id="instructBtns" style="display:none"><button class="btn-continue" onclick="startInstructIntro()">Ready</button></div>`);
  speak(audio);
  animateText(audio,'instructAnim',()=>{const b=document.getElementById('instructBtns');if(b)b.style.display='block';});
}

function startInstructIntro(){
  S.phase='instruction';setPhase('Instruction');setProgress(16);
  const audio=`Look at some examples. For each one, tell me what the relation is.`;
  render(`<div class="instruct-text" id="instructBox">${audioBtn()}<span id="instructAnim" class="typed-text"></span></div>`,
    `<div id="instructBtns" style="display:none"><button class="btn-continue" onclick="showInstruct(0)">Show me</button></div>`);
  speak(audio);
  animateText(audio,'instructAnim',()=>{const b=document.getElementById('instructBtns');if(b)b.style.display='block';});
}

function afterInstruct(){showIdentIntro();}

// ── Identification ─────────────────────────────────────────────────────────────
function showIdentIntro(){
  S.phase='ident';setPhase('Practice');setProgress(44);
  const audio=`Look at each picture. Say if the bars are equal or not equal.`;
  render(`<div class="instruct-text" id="instructBox">${audioBtn()}<span id="instructAnim" class="typed-text"></span></div>`,
    `<div id="instructBtns" style="display:none"><button class="btn-continue" onclick="nextIdent()">Ready</button></div>`);
  speak(audio);
  animateText(audio,'instructAnim',()=>{const b=document.getElementById('instructBtns');if(b)b.style.display='block';});
}

function nextIdent(){
  if(S.identStep>=S.totalIdent){showNamingIntro();return;}
  setProgress(46+(S.identStep/S.totalIdent)*18);
  S.identItemErrors=0;
  S.currentModel=Math.random()>0.45?genEq():genUneq();
  S.currentAnswer=S.currentModel.isEqual?'equal':'notequal';
  startTimer();
  render(`<div class="canvas">${renderModel(S.currentModel)}</div><div class="question-prompt">Equal or Not Equal?</div>`,
    `<div class="response-buttons"><button class="btn" onclick="submitIdent('equal')">Equal</button><button class="btn" onclick="submitIdent('notequal')">Not Equal</button></div>`);
  speak('Equal or Not Equal?');
}

function submitIdent(r){
  const ok=r===S.currentAnswer;
  recordResp('ident',ok);
  if(ok){
    document.getElementById('responseArea').innerHTML=`<div class="instruct-text positive" style="text-align:center;font-weight:700">${randPos()}</div>`;
    setTimeout(()=>{S.identStep++;nextIdent();},400);
    return;
  }
  S.identItemErrors++;
  let audio;
  if(S.identItemErrors>=2){
    // D level: tell them explicitly
    audio=S.currentModel.isEqual
      ?`These bars are the same size. That means they are equal.`
      :`These bars are different sizes. That means they are not equal.`;
  } else {
    // G level: draw attention
    audio=`Look at both bars. Are they the same size or different sizes?`;
  }
  render(`<div class="canvas">${renderModel(S.currentModel)}</div>
    <div class="instruct-text correction">${audioBtn()}<span id="instructAnim" class="typed-text"></span></div>`,
    `<div class="response-buttons"><button class="btn" onclick="submitIdent('equal')">Equal</button><button class="btn" onclick="submitIdent('notequal')">Not Equal</button></div>`);
  speak(audio);animateText(audio,'instructAnim');
}

// ── Naming ────────────────────────────────────────────────────────────────────
function showNamingIntro(){
  S.phase='naming';setPhase('Relation Naming');setProgress(66);
  const audio=`One bar has a question mark. That is the unknown. Name the relation: known color equals unknown.`;
  render(`<div class="instruct-text" id="instructBox">${audioBtn()}<span id="instructAnim" class="typed-text"></span></div>`,
    `<div id="instructBtns" style="display:none"><button class="btn-continue" onclick="nextNaming()">Ready</button></div>`);
  speak(audio);
  animateText(audio,'instructAnim',()=>{const b=document.getElementById('instructBtns');if(b)b.style.display='block';});
}

function nextNaming(){
  if(S.namingStep>=S.totalNaming){showComplete();return;}
  setProgress(68+(S.namingStep/S.totalNaming)*28);
  S.namingItemErrors=0;
  const c1=randColor(),c2=randColor([c1.name]);
  const w=260+Math.random()*80;
  const m={c1,c2,w1:w,w2:w,layout:'stacked',isEqual:true};
  const unk=Math.random()>0.5?c1.name:c2.name;
  const kn=unk===c1.name?c2.name:c1.name;
  m.unk=unk;
  S.currentModel=m;S.currentNaming={kn,unk};startTimer();
  if(!S.scaffoldColorLocked&&S.scaffoldColorActive){
    showColorScaffold();
  } else {
    showNamingItem();
  }
}

function showColorScaffold(){
  const{unk}=S.currentNaming;
  const opts=shuffle([...COLORS.map(c=>c.name).filter(n=>n!==unk).slice(0,3),unk]);
  render(`<div class="canvas">${renderModel(S.currentModel)}</div><div class="question-prompt">What color is the unknown?</div>`,
    `<div class="response-buttons">${opts.map(o=>`<button class="btn" onclick="submitColorScaffold('${o}')">${o}</button>`).join('')}</div>`);
  speak('What color is the unknown?');
}
function submitColorScaffold(r){
  const{unk}=S.currentNaming;
  const ok=cmatch(r,unk);
  updateColorScaffold(ok);recordResp('scaffold_color',ok);
  if(ok){showNamingItem();}else{
    const audio=`Find the bar with the question mark. What color is it?`;
    render(`<div class="canvas">${renderModel(S.currentModel)}</div>
      <div class="instruct-text correction">${audioBtn()}<span id="instructAnim" class="typed-text"></span></div>`,
      `<div class="response-buttons">${shuffle([...COLORS.map(c=>c.name).filter(n=>n!==unk).slice(0,3),unk]).map(o=>`<button class="btn" onclick="submitColorScaffold('${o}')">${o}</button>`).join('')}</div>`);
    speak(audio);animateText(audio,'instructAnim');
  }
}

function showNamingItem(){
  const{kn,unk}=S.currentNaming;
  const correct=`${kn} equals unknown`;
  const opts=shuffle([correct,`${unk} equals unknown`,`unknown equals ${kn}`]).slice(0,3);
  if(!opts.includes(correct))opts[opts.length-1]=correct;
  render(`<div class="canvas">${renderModel(S.currentModel)}</div><div class="question-prompt">Name the relation.</div>`,
    `<div class="response-buttons">${shuffle(opts).map(o=>`<button class="btn" onclick="submitNaming('${o}')">${o}</button>`).join('')}</div>`);
  speak('Name the relation.');
}
function submitNaming(r){
  const{kn,unk}=S.currentNaming;
  const correct=`${kn} equals unknown`;
  const ok=r===correct||(r.includes(kn)&&r.includes('equal')&&r.includes('unknown'));
  recordResp('naming',ok);updateColorScaffold(ok);
  if(ok){
    document.getElementById('responseArea').innerHTML=`<div class="instruct-text positive" style="text-align:center;font-weight:700">${randPos()}</div>`;
    setTimeout(()=>{S.namingStep++;nextNaming();},500);
    return;
  }
  S.namingItemErrors++;
  let audio;
  if(S.namingItemErrors>=2){
    // D level: give the answer
    audio=`The relation is: ${kn} equals unknown. Try that one.`;
  } else {
    // G level: draw attention
    audio=r.includes('unknown')&&!r.startsWith(kn)
      ?`Start with the known bar — the one without the question mark. That is ${kn}.`
      :`Find the bar without the question mark. Say its color first. Then say equals unknown.`;
  }
  render(`<div class="canvas">${renderModel(S.currentModel)}</div>
    <div class="instruct-text correction">${audioBtn()}<span id="instructAnim" class="typed-text"></span></div>`,
    `<div class="response-buttons">${shuffle([correct,`${unk} equals unknown`,`unknown equals ${kn}`]).slice(0,3).map(o=>`<button class="btn" onclick="submitNaming('${o}')">${o}</button>`).join('')}</div>`);
  speak(audio);animateText(audio,'instructAnim');
}
