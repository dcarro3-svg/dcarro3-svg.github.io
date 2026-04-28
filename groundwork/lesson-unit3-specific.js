// ═══════════════════════════════════════════════════════════════════════════════
// LESSON UNIT 3 — COMPLEX RELATIONS
// Two-step models: part-whole (step 1) → fractional (step 2)
// Complex relations are new → all INSTRUCT steps start at D.
// ═══════════════════════════════════════════════════════════════════════════════

const NUM_WORDS=['two','three','four','five'];
function numWord(n){return NUM_WORDS[n-2]||String(n);}

// ── Generator ──────────────────────────────────────────────────────────────────
function genComplex(unknownStep=null){
  const c1=randColor([]);
  const c2=randColor([c1.name]);
  const c3=randColor([c1.name,c2.name]);
  const c4=randColor([c1.name,c2.name,c3.name]);

  const tw=BASE*(0.65+Math.random()*0.2);
  const sp=0.35+Math.random()*0.3;
  const d=FRAC_DENOMS[Math.floor(Math.random()*FRAC_DENOMS.length)];
  const fi=Math.floor(Math.random()*d);

  const step=unknownStep||(Math.random()<0.5?1:2);

  const step1Roles=['whole','p1','p2'];
  const step1UnkRole=step===1?step1Roles[Math.floor(Math.random()*step1Roles.length)]:null;

  const step1={
    whole:{color:c3,w:tw},
    p1:{color:c1,w:tw*sp},
    p2:{color:c2,w:tw*(1-sp)},
    unknownRole:step1UnkRole,
    confirmed:true,
  };

  const step2={
    wholeColor:c3,
    partColor:c4,
    denominator:d,
    filledIndex:fi,
    unknownRole:step===2?'part':null,
    wholeW:tw,
    isFractional:true,
  };

  let correct;
  if(step===1){
    if(step1UnkRole==='whole') correct=[c1.name,'plus',c2.name,'equals','unknown'];
    else if(step1UnkRole==='p1') correct=[c3.name,'minus',c2.name,'equals','unknown'];
    else correct=[c3.name,'minus',c1.name,'equals','unknown'];
  } else {
    correct=['one',fracName(d),'of',c3.name,'equals','unknown'];
  }

  return{step1,step2,c1,c2,c3,c4,d,fi,tw,sp,correct,unknownStep:step};
}

// ── Renderer ───────────────────────────────────────────────────────────────────
function renderComplex(m){
  const r1=renderPW(m.step1);
  const r2=renderFractional(m.step2);
  return `<div style="display:flex;flex-direction:column;gap:14px;align-items:flex-start">
    ${r1}
    <div style="display:flex;align-items:center;gap:8px;padding-left:4px">
      <div style="width:20px;height:2px;background:#9B9591;border-radius:1px"></div>
      <span style="font-size:11px;font-weight:600;color:#9B9591;text-transform:uppercase;letter-spacing:0.8px">then</span>
      <div style="width:20px;height:2px;background:#9B9591;border-radius:1px"></div>
    </div>
    ${r2}
  </div>`;
}

function renderModel(m){return renderComplex(m);}

// ── INSTRUCT ───────────────────────────────────────────────────────────────────
const INSTRUCT=[

  // Step 0: Identify the bridge — D
  {
    initialMode:'D',
    build(){
      const c1=COLORS[0],c2=COLORS[1],c3=COLORS[2],c4=COLORS[3];
      const tw=300,sp=0.45,d=2,fi=0;
      return{
        step1:{whole:{color:c3,w:tw},p1:{color:c1,w:tw*sp},p2:{color:c2,w:tw*(1-sp)},unknownRole:null,confirmed:true},
        step2:{wholeColor:c3,partColor:c4,denominator:d,filledIndex:fi,unknownRole:null,wholeW:tw,isFractional:true},
        c1,c2,c3,c4,d,fi,tw,sp,
        correct:[c1.name,'plus',c2.name,'equals',c3.name],
        unknownStep:null,
      };
    },
    audio(m){return`This picture has two steps. Step one: ${m.c1.name} and ${m.c2.name} combine to make ${m.c3.name}. Step two: ${m.c3.name} is split into equal parts, and one part is ${m.c4.name}. The ${m.c3.name} bar appears in both steps. It links them. We call it the bridge.`;},
    guide(m){return`Which color appears in both step one and step two?`;},
    question(m){return`What is the bridge between the two steps?`;},
    opts(m){return shuffle([`The ${m.c3.name} bar is the bridge.`,`The ${m.c1.name} bar is the bridge.`,`The ${m.c4.name} bar is the bridge.`]);},
    fu(m){return`${m.c3.name} is the bridge. It is the result of step one and the starting point for step two.`;},
    fuQ(m){return`Why is ${m.c3.name} called the bridge?`;},
    fuOpts:[`It appears in both steps — it connects them.`,`It is the smallest bar.`,`It is the final unknown.`],
    fuGuide(m){return`The bridge is in both steps. Look at both models — which color shows up in each one?`;},
  },

  // Step 1: Unknown in step 1 — D
  {
    initialMode:'D',
    build(){return genComplex(1);},
    audio(m){
      const role=m.step1.unknownRole;
      const unkColor=role==='whole'?m.c3:role==='p1'?m.c1:m.c2;
      return`The first step has an unknown — ${unkColor.name}. Name the relation to find it. Then the bridge will be known for step two.`;
    },
    guide(m){return`Look at the first step only. What are the known bars?`;},
    question:`What equals the unknown in the first step?`,
    opts(m){
      const role=m.step1.unknownRole;
      const correct=m.correct.join(' ');
      let close,far;
      if(role==='whole'){
        close=`${m.c2.name} plus ${m.c1.name} equals unknown`;
        far=`${m.c3.name} minus ${m.c1.name} equals unknown`;
      } else if(role==='p1'){
        close=`${m.c3.name} minus ${m.c1.name} equals unknown`;
        far=`${m.c1.name} plus ${m.c2.name} equals unknown`;
      } else {
        close=`${m.c3.name} minus ${m.c2.name} equals unknown`;
        far=`${m.c1.name} plus ${m.c2.name} equals unknown`;
      }
      return shuffle([correct,close,far]);
    },
    fu(m){return`${m.correct.join(' ')}. The bridge ${m.c3.name} now has a value. That unlocks the second step.`;},
    fuQ:`What does solving the first step unlock?`,
    fuOpts:[`It unlocks the second step.`,`It closes the problem.`,`It changes the bridge color.`],
    fuGuide(m){return`Solving step one gives you the bridge value. The bridge is the starting point for step two. What does that unlock?`;},
  },

  // Step 2: Unknown in step 2 — D
  {
    initialMode:'D',
    build(){return genComplex(2);},
    audio(m){return`Step one is solved. You know ${m.c3.name}. Now look at step two — ${m.c3.name} is split into ${numWord(m.d)} equal parts. The ${m.c4.name} part is unknown. What equals it?`;},
    guide(m){return`Count the equal parts in step two. How many are there?`;},
    question(m){return`What equals the unknown ${m.c4.name} part?`;},
    opts(m){
      const correct=`one ${fracName(m.d)} of ${m.c3.name} equals unknown`;
      const wrongFrac=fracName(m.d===2?3:2);
      const close=`one ${wrongFrac} of ${m.c3.name} equals unknown`;
      const far=`${m.c3.name} minus ${m.c1.name} equals unknown`;
      return shuffle([correct,close,far]);
    },
    fu(m){return`One ${fracName(m.d)} of ${m.c3.name} equals unknown. Both steps are solved. The bridge connected them.`;},
    fuQ:`What allowed you to name the second relation?`,
    fuOpts:[`Step one was solved, so the bridge was known.`,`The second step has two unknowns.`,`The unknown always appears in step two.`],
    fuGuide(m){return`The bridge was the starting point for step two. What had to happen first?`;},
  },

  // Step 3: Full problem — find which step has the unknown, then name it — D
  {
    initialMode:'D',
    build(){return genComplex(null);},
    audio(){return`Here is a full complex relation. One of the two steps has an unknown — look for the question mark bar. Find which step it is in.`;},
    guide(){return`Look at both steps. The question mark bar is in only one of them. Which one?`;},
    question:`Which step has the unknown?`,
    opts(m){
      const correct=m.unknownStep===1?`The first step has the unknown.`:`The second step has the unknown.`;
      const wrong=m.unknownStep===1?`The second step has the unknown.`:`The first step has the unknown.`;
      return shuffle([correct,wrong,`Both steps have an unknown.`]);
    },
    fu(m){const stepLabel=m.unknownStep===1?'first':'second';return`The ${stepLabel} step has the unknown. Name the relation to find it: ${m.correct.join(' ')}.`;},
    fuQ:`Name the relation to find the unknown.`,
    fuOpts(m){
      const correct=m.correct.join(' ');
      let close,far;
      if(m.unknownStep===1){
        const role=m.step1.unknownRole;
        if(role==='whole'){
          close=`${m.c2.name} plus ${m.c1.name} equals unknown`;
          far=`one ${fracName(m.d)} of ${m.c3.name} equals unknown`;
        } else if(role==='p1'){
          close=`${m.c3.name} minus ${m.c1.name} equals unknown`;
          far=`one ${fracName(m.d)} of ${m.c3.name} equals unknown`;
        } else {
          close=`${m.c3.name} minus ${m.c2.name} equals unknown`;
          far=`one ${fracName(m.d)} of ${m.c3.name} equals unknown`;
        }
      } else {
        const wrongFrac=fracName(m.d===2?3:2);
        close=`one ${wrongFrac} of ${m.c3.name} equals unknown`;
        far=`${m.c1.name} plus ${m.c2.name} equals unknown`;
      }
      return shuffle([correct,close,far]);
    },
    fuGuide(m){return`Look only at the step with the unknown. What are the known bars in that step?`;},
  },
];

// ── Phase functions ─────────────────────────────────────────────────────────────
function showIntro(){
  S.phase='intro';setPhase('Introduction');setProgress(2);
  const audio=`You have learned simple and compound relations. Now you will learn complex relations. A complex relation has two steps. Each step builds on the one before it. A bridge color links the steps.`;
  render(`<div class="instruct-text neutral" id="instructBox">${audioBtn()}<span id="instructAnim" class="typed-text"></span></div>`,
    `<div id="instructBtns" style="display:none"><button class="btn-continue" onclick="startInstructIntro()">Let's see it</button></div>`);
  speak(audio);
  animateText(audio,'instructAnim',()=>{const b=document.getElementById('instructBtns');if(b)b.style.display='block';});
}

function startInstructIntro(){
  S.phase='instruction';setPhase('Instruction');setProgress(14);
  const audio=`Each picture shows two models with a "then" between them. Look for the bridge color — it appears in both steps.`;
  render(`<div class="instruct-text" id="instructBox">${audioBtn()}<span id="instructAnim" class="typed-text"></span></div>`,
    `<div id="instructBtns" style="display:none"><button class="btn-continue" onclick="showInstruct(0)">Show me</button></div>`);
  speak(audio);
  animateText(audio,'instructAnim',()=>{const b=document.getElementById('instructBtns');if(b)b.style.display='block';});
}

function afterInstruct(){showIdentIntro();}

// ── Identification phase ────────────────────────────────────────────────────────
function showIdentIntro(){
  S.phase='ident';S.identStep=0;setPhase('Practice');setProgress(42);
  const audio=`Tell me which step has the unknown. Look at both steps and find the question mark bar.`;
  render(`<div class="instruct-text" id="instructBox">${audioBtn()}<span id="instructAnim" class="typed-text"></span></div>`,
    `<div id="instructBtns" style="display:none"><button class="btn-continue" onclick="nextIdent()">Ready</button></div>`);
  speak(audio);
  animateText(audio,'instructAnim',()=>{const b=document.getElementById('instructBtns');if(b)b.style.display='block';});
}

function nextIdent(){
  if(S.identStep>=S.totalIdent){showNamingIntro();return;}
  setProgress(44+(S.identStep/S.totalIdent)*18);
  S.identItemErrors=0;
  S.currentModel=genComplex(null);
  S.currentAnswer=S.currentModel.unknownStep===1?'first':'second';
  startTimer();
  render(
    `<div class="canvas">${renderComplex(S.currentModel)}</div>
     <div class="question-prompt">Which step has the unknown?</div>`,
    `<div class="response-buttons">
       <button class="btn" onclick="submitIdent('first')">First step</button>
       <button class="btn" onclick="submitIdent('second')">Second step</button>
     </div>`
  );
  speak('Which step has the unknown?');
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
    audio=`The unknown is in the ${S.currentAnswer} step. Look for the bar without a color label.`;
  } else {
    audio=`Find the bar with the question mark. It is in only one of the two steps.`;
  }
  render(
    `<div class="canvas">${renderComplex(S.currentModel)}</div>
     <div class="instruct-text correction">${audioBtn()}<span id="instructAnim" class="typed-text"></span></div>`,
    `<div class="response-buttons">
       <button class="btn" onclick="submitIdent('first')">First step</button>
       <button class="btn" onclick="submitIdent('second')">Second step</button>
     </div>`
  );
  speak(audio);animateText(audio,'instructAnim');
}

// ── Naming phase ───────────────────────────────────────────────────────────────
function showNamingIntro(){
  S.phase='naming';S.namingStep=0;setPhase('Relation Naming');setProgress(64);
  const audio=`Name the relation for the unknown bar. Use the word buttons to build your answer.`;
  render(`<div class="instruct-text" id="instructBox">${audioBtn()}<span id="instructAnim" class="typed-text"></span></div>`,
    `<div id="instructBtns" style="display:none"><button class="btn-continue" onclick="nextNaming()">Ready</button></div>`);
  speak(audio);
  animateText(audio,'instructAnim',()=>{const b=document.getElementById('instructBtns');if(b)b.style.display='block';});
}

function nextNaming(){
  if(S.namingStep>=S.totalNaming){showComplete();return;}
  setProgress(66+(S.namingStep/S.totalNaming)*28);
  S.namingItemErrors=0;
  S.currentModel=genComplex(null);
  S.assembled=[];
  startTimer();
  renderNamingItem();
}

function renderNamingItem(){
  const m=S.currentModel;
  const fn=fracName(m.d);
  const colorBtns=[m.c1,m.c2,m.c3,m.c4].map(c=>
    `<button class="wb-btn" onclick="addNaming3('${c.name}')">${c.name}</button>`
  ).join('');
  const opBtns=`
    <div class="wb-row">
      <button class="wb-btn" style="flex:1" onclick="addNaming3('plus')">plus</button>
      <button class="wb-btn" style="flex:1" onclick="addNaming3('minus')">minus</button>
    </div>
    <div class="wb-row">
      <button class="wb-btn" style="flex:1" onclick="addNaming3('one')">one</button>
      <button class="wb-btn" style="flex:1" onclick="addNaming3('${fn}')">${fn}</button>
      <button class="wb-btn" style="flex:1" onclick="addNaming3('of')">of</button>
    </div>
    <div class="wb-row">
      <button class="wb-btn" style="flex:1" onclick="addNaming3('equals')">equals</button>
      <button class="wb-btn" style="flex:1" onclick="addNaming3('unknown')">unknown</button>
    </div>
  `;
  const wordBank=`<div class="instruct-word-bank">
    <div class="wb-group">${colorBtns}</div>
    <div class="wb-div"></div>
    <div class="wb-group">${opBtns}</div>
  </div>`;

  render(
    `<div class="canvas" style="padding:24px 20px">${renderComplex(m)}</div>
     <div class="question-prompt">Name the relation for the unknown bar.</div>`,
    `<div style="display:flex;flex-direction:column;gap:10px">
       ${wordBank}
       ${strip(S.assembled,'submitNaming3','undoNaming3')}
     </div>`
  );
}

function addNaming3(w){S.assembled.push(w);renderNamingItem();}
function undoNaming3(){S.assembled.pop();renderNamingItem();}

function submitNaming3(){
  const m=S.currentModel;
  const s=S.assembled.join(' ');
  const cor=m.correct.join(' ');
  const ok=s===cor;
  recordResp('naming',ok);
  if(ok){
    S.assembled=[];
    document.getElementById('responseArea').innerHTML=`<div class="instruct-text positive" style="text-align:center;font-weight:700">${randPos()}</div>`;
    setTimeout(()=>{S.namingStep++;nextNaming();},500);
    return;
  }
  S.namingItemErrors++;
  let fb;
  const qi=S.assembled.indexOf('unknown');
  if(qi>=0&&qi<S.assembled.length-1){
    fb=`Put the unknown at the end. Try: ${cor}`;
  } else if(S.namingItemErrors>=2){
    fb=`The relation is: ${cor}.`;
  } else if(m.unknownStep===1){
    const role=m.step1.unknownRole;
    const hasPlus=S.assembled.includes('plus'),hasMinus=S.assembled.includes('minus');
    if(role==='whole'&&hasMinus) fb=`The unknown is the whole — add the parts. Use plus.`;
    else if(role!=='whole'&&hasPlus) fb=`The unknown is a part — subtract from the whole. Use minus.`;
    else fb=`Look at the first step only. What are the known bars?`;
  } else {
    const spokenFrac=FRAC_NAMES.find(f=>S.assembled.includes(f));
    if(spokenFrac&&spokenFrac!==fracName(m.d)) fb=`Count the equal parts — there are ${m.d}. Use ${fracName(m.d)}.`;
    else fb=`Name the fractional relation for the second step. The whole is ${m.c3.name}.`;
  }
  S.assembled=[];
  const fn=fracName(m.d);
  const colorBtns=[m.c1,m.c2,m.c3,m.c4].map(c=>
    `<button class="wb-btn" onclick="addNaming3('${c.name}')">${c.name}</button>`
  ).join('');
  const opBtns=`
    <div class="wb-row">
      <button class="wb-btn" style="flex:1" onclick="addNaming3('plus')">plus</button>
      <button class="wb-btn" style="flex:1" onclick="addNaming3('minus')">minus</button>
    </div>
    <div class="wb-row">
      <button class="wb-btn" style="flex:1" onclick="addNaming3('one')">one</button>
      <button class="wb-btn" style="flex:1" onclick="addNaming3('${fn}')">${fn}</button>
      <button class="wb-btn" style="flex:1" onclick="addNaming3('of')">of</button>
    </div>
    <div class="wb-row">
      <button class="wb-btn" style="flex:1" onclick="addNaming3('equals')">equals</button>
      <button class="wb-btn" style="flex:1" onclick="addNaming3('unknown')">unknown</button>
    </div>
  `;
  const wordBank=`<div class="instruct-word-bank">
    <div class="wb-group">${colorBtns}</div>
    <div class="wb-div"></div>
    <div class="wb-group">${opBtns}</div>
  </div>`;
  render(
    `<div class="canvas" style="padding:24px 20px">${renderComplex(m)}</div>
     <div class="instruct-text correction">${audioBtn()}<span id="instructAnim" class="typed-text"></span></div>`,
    `<div style="display:flex;flex-direction:column;gap:10px">
       ${wordBank}
       ${strip(S.assembled,'submitNaming3','undoNaming3')}
     </div>`
  );
  speak(fb);animateText(fb,'instructAnim');
}
