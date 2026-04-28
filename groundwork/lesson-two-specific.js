// ═══════════════════════════════════════════════════════════════════════════════
// LESSON TWO — PART-WHOLE RELATIONS
// Equal is mastered (L1) → review starts at T.
// Part-whole is new → INSTRUCT steps start at D.
// ═══════════════════════════════════════════════════════════════════════════════

function genEqReview(){
  const c1=randColor(),c2=randColor([c1.name]);
  const w=BASE*(0.5+Math.random()*0.4);
  const isEqual=Math.random()>0.4;
  const layout=isEqual&&Math.random()>0.5?'dotted':'stacked';
  const w2=isEqual?w:w*(0.6+Math.random()*0.5);
  return{c1,c2,w1:w,w2,isEqual,layout};
}
function genPW(unknownRole=null){
  const wC=randColor(),p1C=randColor([wC.name]),p2C=randColor([wC.name,p1C.name]);
  const tw=BASE*(0.6+Math.random()*0.3),sp=0.35+Math.random()*0.3;
  const role=unknownRole||['whole','p1','p2'][Math.floor(Math.random()*3)];
  const whole={color:wC,w:tw},p1={color:p1C,w:tw*sp},p2={color:p2C,w:tw*(1-sp)};
  return{whole,p1,p2,unknownRole:role,confirmed:true};
}
function genNE(){
  const c1=randColor(),c2=randColor([c1.name]),c3=randColor([c1.name,c2.name]);
  const w=BASE*(0.6+Math.random()*0.3),sp=0.35+Math.random()*0.3;
  const types=['solo','two_no_whole','size_compare','parts_dont_sum'];
  const nonType=types[Math.floor(Math.random()*types.length)];
  return{c1,c2,c3,w,sp,nonType,isNE:true};
}

function renderNE(m){
  const{c1,c2,c3,w,sp,nonType}=m;
  if(nonType==='solo') return sbar(c1.hex,c1.name,w);
  if(nonType==='two_no_whole') return`<div style="display:flex;flex-direction:column;gap:8px">${sbar(c1.hex,c1.name,w*sp)}${sbar(c2.hex,c2.name,w*(1-sp))}</div>`;
  if(nonType==='size_compare') return`<div style="display:flex;flex-direction:column;gap:8px">${sbar(c1.hex,c1.name,w)}${sbar(c2.hex,c2.name,w*0.6)}</div>`;
  return`<div style="position:relative;display:inline-block"><div style="display:flex;flex-direction:column;gap:8px">${sbar(c1.hex,c1.name,w)}
    <div style="display:flex">${sbar(c2.hex,c2.name,w*sp*0.9)}${sbar(c3.hex,c3.name,w*(1-sp)*0.75)}</div></div></div>`;
}

function renderModel(m){
  if(m.isNE) return renderNE(m);
  if(m.c1&&!m.whole) return renderEqual(m);
  return renderPW(m);
}

const INSTRUCT=[
  {
    // New: what is a whole, what are parts — starts at D
    initialMode:'D',
    build(){return genPW();},
    audio(m){return`Look at this picture. The ${m.whole.color.name} bar is on top. The ${m.p1.color.name} and ${m.p2.color.name} bars are below. Together, the two bottom bars equal the top bar. The top bar is called the whole. The two bottom bars are called the parts.`;},
    guide(m){return`Look at the bars. One bar is on top. Two smaller bars are below. Which bar equals both others put together?`;},
    question(m){return`What color is the whole?`;},
    opts(m){return[`The ${m.whole.color.name} bar is the whole.`,`The ${m.p1.color.name} bar is the whole.`,`The ${m.p2.color.name} bar is the whole.`];},
    fu(m){return`${m.whole.color.name} is the whole — it equals both parts together. Now look at the two parts.`;},
    fuQ(m){return`What colors are the two parts?`;},
    fuOpts(m){return[`${m.p1.color.name} and ${m.p2.color.name} are the parts.`,`${m.whole.color.name} and ${m.p1.color.name} are the parts.`,`${m.whole.color.name} and ${m.p2.color.name} are the parts.`];},
    fuGuide(m){return`The parts are the two smaller bars that are not on top. What colors are they?`;},
  },
  {
    // New: take away a part → minus — starts at D
    initialMode:'D',
    build(){const m=genPW();m.fadedPart='p1';return m;},
    audio(m){return`The ${m.p1.color.name} part is faded — picture it gone. What is left of the whole? Whole minus one part equals the other part. When we take away, we use minus.`;},
    guide(m){return`Look at the part that is not faded. That is what is left when the ${m.p1.color.name} part is removed.`;},
    question(m){return`If the ${m.p1.color.name} part is removed, what remains?`;},
    opts(m){return[`The ${m.p2.color.name} part remains.`,`The ${m.whole.color.name} part remains.`,`Nothing remains.`];},
    fu(m){return`Whole minus part equals the other part. When we take away, we say minus.`;},
    fuQ:`What word do we use when we take away?`,
    fuOpts:['We use minus.','We use plus.','We use times.'],
    fuGuide(){return`Think about what "take away" means. What word do we use for that?`;},
  },
  {
    // New: plus vs minus to find whole vs part — starts at D
    initialMode:'D',
    build(){return genPW(null);},
    audio(m){return`To find the whole, add the parts: part plus part equals whole. To find a missing part, take away from the whole: whole minus known part equals unknown. What do we use to find the whole?`;},
    guide(m){return`To get the whole, do you add the parts or take one away?`;},
    question:`What do we use to find the whole?`,
    opts:['We use plus — add the parts together.','We use minus — take a part away.','We use times — multiply the parts.'],
    fu(m){return`Plus finds the whole. Minus finds a missing part. Two rules from the same picture.`;},
    fuQ:`What do we use to find a missing part?`,
    fuOpts:['We use minus — take away from the whole.','We use plus — add to the whole.','We use times — multiply.'],
    fuGuide(){return`Finding a part means something is missing from the whole. Do you add or take away?`;},
  },
];

function showIntro(){
  S.phase='intro';setPhase('Introduction');setProgress(2);
  const audio=`Last time you learned equal relations. Today you will learn part-whole. First, a quick review of equal relations.`;
  render(`<div class="instruct-text neutral" id="instructBox">${audioBtn()}<span id="instructAnim" class="typed-text"></span></div>`,
    `<div id="instructBtns" style="display:none"><button class="btn-continue" onclick="startReview()">Let's review</button></div>`);
  speak(audio);
  animateText(audio,'instructAnim',()=>{const b=document.getElementById('instructBtns');if(b)b.style.display='block';});
}

function startReview(){S.phase='review';setPhase('Review — Equal');S.reviewStep=0;nextReview();}
function nextReview(){
  if(S.reviewStep>=S.totalReview){showInstructIntro();return;}
  setProgress(4+(S.reviewStep/S.totalReview)*14);
  S.reviewItemErrors=0;
  S.currentModel=genEqReview();startTimer();
  render(`<div class="canvas">${renderEqual(S.currentModel)}</div><div class="question-prompt">Equal or Not Equal?</div>`,
    `<div class="response-buttons"><button class="btn" onclick="submitReview('equal')">Equal</button><button class="btn" onclick="submitReview('notequal')">Not Equal</button></div>`);
  speak('Equal or Not Equal?');
}
function submitReview(r){
  const ok=(S.currentModel.isEqual&&r==='equal')||(!S.currentModel.isEqual&&r==='notequal');
  recordResp('review',ok);
  if(ok){
    document.getElementById('responseArea').innerHTML=`<div class="instruct-text positive" style="text-align:center;font-weight:700">${randPos()}</div>`;
    setTimeout(()=>{S.reviewStep++;nextReview();},400);
    return;
  }
  S.reviewItemErrors++;
  let audio;
  if(S.reviewItemErrors>=2){
    audio=S.currentModel.isEqual
      ?`These bars are the same size. That means they are equal.`
      :`These bars are different sizes. That means they are not equal.`;
  } else {
    audio=`Look at both bars. Are they the same size or different sizes?`;
  }
  render(`<div class="canvas">${renderEqual(S.currentModel)}</div>
    <div class="instruct-text correction">${audioBtn()}<span id="instructAnim" class="typed-text"></span></div>`,
    `<div class="response-buttons"><button class="btn" onclick="submitReview('equal')">Equal</button><button class="btn" onclick="submitReview('notequal')">Not Equal</button></div>`);
  speak(audio);animateText(audio,'instructAnim');
}

function showInstructIntro(){
  S.phase='instruction';setPhase('Instruction');setProgress(20);
  const audio=`You know equal relations. Now look at something new — part-whole. Two parts together equal one whole.`;
  render(`<div class="instruct-text" id="instructBox">${audioBtn()}<span id="instructAnim" class="typed-text"></span></div>`,
    `<div id="instructBtns" style="display:none"><button class="btn-continue" onclick="showInstruct(0)">Show me</button></div>`);
  speak(audio);
  animateText(audio,'instructAnim',()=>{const b=document.getElementById('instructBtns');if(b)b.style.display='block';});
}

function afterInstruct(){showIdentIntro();}

function showIdentIntro(){
  S.phase='ident';S.identStep=0;setPhase('Identification');setProgress(44);
  const audio=`Tell me if each picture shows a part-whole relation or not.`;
  render(`<div class="instruct-text" id="instructBox">${audioBtn()}<span id="instructAnim" class="typed-text"></span></div>`,
    `<div id="instructBtns" style="display:none"><button class="btn-continue" onclick="nextIdent()">Ready</button></div>`);
  speak(audio);
  animateText(audio,'instructAnim',()=>{const b=document.getElementById('instructBtns');if(b)b.style.display='block';});
}
function nextIdent(){
  if(S.identStep>=S.totalIdent){showNamingIntro();return;}
  setProgress(46+(S.identStep/S.totalIdent)*20);
  S.identItemErrors=0;
  const isPW=Math.random()>0.4;
  S.currentModel=isPW?genPW():genNE();
  S.currentAnswer=isPW?'partwhole':'not';
  startTimer();
  const html=isPW?renderPW(S.currentModel):renderNE(S.currentModel);
  render(`<div class="canvas">${html}</div><div class="question-prompt">Part-Whole or Not?</div>`,
    `<div class="response-buttons"><button class="btn" onclick="submitIdent('partwhole')">Part-Whole</button><button class="btn" onclick="submitIdent('not')">Not</button></div>`);
  speak('Part-Whole or Not?');
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
  const m=S.currentModel;
  let audio;
  if(S.identItemErrors>=2){
    audio=m.isNE
      ?`This is not a part-whole. The two bars do not add up to one bigger bar.`
      :`This is a part-whole. The two small bars together equal the big bar on top.`;
  } else {
    audio=r==='partwhole'
      ?`Look — do the two smaller bars add up to the top bar?`
      :`Look again. Is there one bar that equals two smaller bars together?`;
  }
  const html=m.isNE?renderNE(m):renderPW(m);
  render(`<div class="canvas">${html}</div>
    <div class="instruct-text correction">${audioBtn()}<span id="instructAnim" class="typed-text"></span></div>`,
    `<div class="response-buttons"><button class="btn" onclick="submitIdent('partwhole')">Part-Whole</button><button class="btn" onclick="submitIdent('not')">Not</button></div>`);
  speak(audio);animateText(audio,'instructAnim');
}

function showNamingIntro(){
  S.phase='naming';S.namingStep=0;setPhase('Relation Naming');setProgress(68);
  const audio=`Now name the relation to find the unknown. The unknown could be the whole or a part.`;
  render(`<div class="instruct-text" id="instructBox">${audioBtn()}<span id="instructAnim" class="typed-text"></span></div>`,
    `<div id="instructBtns" style="display:none"><button class="btn-continue" onclick="nextNaming()">Ready</button></div>`);
  speak(audio);
  animateText(audio,'instructAnim',()=>{const b=document.getElementById('instructBtns');if(b)b.style.display='block';});
}
function nextNaming(){
  if(S.namingStep>=S.totalNaming){showComplete();return;}
  setProgress(70+(S.namingStep/S.totalNaming)*26);
  S.namingItemErrors=0;
  const roles=['whole','p1','p2'];
  const role=roles[S.namingStep%3];
  const m=genPW(role);
  S.currentModel=m;
  S.currentNaming={whole:m.whole.color.name,p1:m.p1.color.name,p2:m.p2.color.name,unknownRole:role};
  startTimer();
  if(!S.scaffoldColorLocked&&S.scaffoldColorActive) showColorScaffold();
  else if(!S.scaffoldRoleLocked&&S.scaffoldRoleActive) showRoleScaffold();
  else showNamingItem();
}
function showColorScaffold(){
  const n=S.currentNaming;
  const unk=n.unknownRole==='whole'?n.whole:n.unknownRole==='p1'?n.p1:n.p2;
  const opts=shuffle([...COLORS.map(c=>c.name).filter(c=>c!==unk).slice(0,3),unk]);
  render(`<div class="canvas">${renderPW(S.currentModel)}</div><div class="question-prompt">What color is the unknown?</div>`,
    `<div class="response-buttons">${opts.map(o=>`<button class="btn" onclick="submitColorScaffold('${o}')">${o}</button>`).join('')}</div>`);
  speak('What color is the unknown?');
}
function submitColorScaffold(r){
  const n=S.currentNaming;
  const unk=n.unknownRole==='whole'?n.whole:n.unknownRole==='p1'?n.p1:n.p2;
  const ok=cmatch(r,unk);
  updateColorScaffold(ok);recordResp('scaffold_color',ok);
  if(ok){if(!S.scaffoldRoleLocked&&S.scaffoldRoleActive)showRoleScaffold();else showNamingItem();}
  else{
    const audio=`Find the bar with the question mark. What color is it?`;
    render(`<div class="canvas">${renderPW(S.currentModel)}</div>
      <div class="instruct-text correction">${audioBtn()}<span id="instructAnim" class="typed-text"></span></div>`,
      `<div class="response-buttons">${shuffle([...COLORS.map(c=>c.name).filter(c=>c!==unk).slice(0,3),unk]).map(o=>`<button class="btn" onclick="submitColorScaffold('${o}')">${o}</button>`).join('')}</div>`);
    speak(audio);animateText(audio,'instructAnim');
  }
}
function showRoleScaffold(){
  const n=S.currentNaming;
  const unk=n.unknownRole==='whole'?n.whole:n.unknownRole==='p1'?n.p1:n.p2;
  render(`<div class="canvas">${renderPW(S.currentModel)}</div><div class="question-prompt">Is the ${unk} bar the whole or a part?</div>`,
    `<div class="response-buttons"><button class="btn" onclick="submitRoleScaffold('whole')">The Whole</button><button class="btn" onclick="submitRoleScaffold('part')">A Part</button></div>`);
  speak(`Is the ${unk} bar the whole or a part?`);
}
function submitRoleScaffold(r){
  const n=S.currentNaming;
  const ok=(r==='whole'&&n.unknownRole==='whole')||(r==='part'&&n.unknownRole!=='whole');
  updateRoleScaffold(ok);recordResp('scaffold_role',ok);
  if(ok){showNamingItem();return;}
  const isW=n.unknownRole==='whole';
  const unk=isW?n.whole:n.unknownRole==='p1'?n.p1:n.p2;
  const audio=isW
    ?`The ${unk} bar is on top. It equals both smaller bars together. That makes it the whole.`
    :`The ${unk} bar is one of the smaller bars. That makes it a part.`;
  render(`<div class="canvas">${renderPW(S.currentModel)}</div>
    <div class="instruct-text correction">${audioBtn()}<span id="instructAnim" class="typed-text"></span></div>`,
    `<div class="response-buttons"><button class="btn" onclick="submitRoleScaffold('whole')">The Whole</button><button class="btn" onclick="submitRoleScaffold('part')">A Part</button></div>`);
  speak(audio);animateText(audio,'instructAnim');
}
function showNamingItem(){
  const n=S.currentNaming;
  const{whole,p1,p2,unknownRole}=n;
  const kp=unknownRole==='p1'?p2:p1;
  const correct=unknownRole==='whole'?`${p1} plus ${p2} equals unknown`:`${whole} minus ${kp} equals unknown`;
  const opts=unknownRole==='whole'
    ?shuffle([correct,`${p1} minus ${p2} equals unknown`,`${p2} plus ${whole} equals unknown`])
    :shuffle([correct,`${whole} plus ${kp} equals unknown`,`${kp} minus ${whole} equals unknown`]);
  if(!opts.includes(correct))opts[opts.length-1]=correct;
  render(`<div class="canvas">${renderPW(S.currentModel)}</div><div class="question-prompt">What equals the unknown?</div>`,
    `<div class="response-buttons">${shuffle(opts).map(o=>`<button class="btn" onclick="submitNaming('${o.replace(/'/g,"&#39;")}')">${o}</button>`).join('')}</div>`);
  speak('What equals the unknown?');
}
function submitNaming(r){
  const n=S.currentNaming;
  const{whole,p1,p2,unknownRole}=n;
  const kp=unknownRole==='p1'?p2:p1;
  const isCorrect=unknownRole==='whole'
    ?(cmatch(r,p1)&&cmatch(r,p2)&&(r.includes('plus')||r.includes('and')))
    :(cmatch(r,whole)&&cmatch(r,kp)&&(r.includes('minus')||r.includes('without')));
  recordResp('naming',isCorrect);updateColorScaffold(isCorrect);updateRoleScaffold(isCorrect);
  if(isCorrect){
    document.getElementById('responseArea').innerHTML=`<div class="instruct-text positive" style="text-align:center;font-weight:700">${randPos()}</div>`;
    setTimeout(()=>{S.namingStep++;nextNaming();},500);
    return;
  }
  S.namingItemErrors++;
  const correct=unknownRole==='whole'?`${p1} plus ${p2} equals unknown`:`${whole} minus ${kp} equals unknown`;
  let audio;
  if(S.namingItemErrors>=2){
    audio=unknownRole==='whole'
      ?`The unknown is the whole. Add the parts: ${p1} plus ${p2} equals unknown.`
      :`The unknown is a part. Take away from the whole: ${whole} minus ${kp} equals unknown.`;
  } else {
    audio=unknownRole==='whole'
      ?`The unknown is the whole. To find the whole, you add the parts together.`
      :`The unknown is a part. To find a part, you take it away from the whole.`;
  }
  render(`<div class="canvas">${renderPW(S.currentModel)}</div>
    <div class="instruct-text correction">${audioBtn()}<span id="instructAnim" class="typed-text"></span></div>`,
    `<div class="response-buttons">${shuffle([correct,unknownRole==='whole'?`${p1} minus ${p2} equals unknown`:`${whole} plus ${kp} equals unknown`,`${kp} minus ${whole} equals unknown`]).slice(0,3).map(o=>`<button class="btn" onclick="submitNaming('${o.replace(/'/g,"&#39;")}')">${o}</button>`).join('')}</div>`);
  speak(audio);animateText(audio,'instructAnim');
}
