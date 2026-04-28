// ═══════════════════════════════════════════════════════════════════════════════
// LESSON THREE — COMPARISONS & DIFFERENCES
// Part-whole is mastered (L2) → review starts at T.
// Comparison is new → INSTRUCT steps start at D.
// ═══════════════════════════════════════════════════════════════════════════════

function genPWReview(){
  const wC=randColor(),p1C=randColor([wC.name]),p2C=randColor([wC.name,p1C.name]);
  const tw=BASE*(0.6+Math.random()*0.3),sp=0.35+Math.random()*0.3;
  return{whole:{color:wC,w:tw},p1:{color:p1C,w:tw*sp},p2:{color:p2C,w:tw*(1-sp)},confirmed:true};
}
function genComparison(diffStyle=null,unknownRole=null){
  const lC=randColor(),sC=randColor([lC.name]),dC=randColor([lC.name,sC.name]);
  const lW=BASE*(0.55+Math.random()*0.3),dW=lW*(0.2+Math.random()*0.3),sW=lW-dW;
  const role=unknownRole||['larger','smaller','diff'][Math.floor(Math.random()*3)];
  return{larger:{color:lC,w:lW},smaller:{color:sC,w:sW},diff:{color:dC,w:dW},
    diffStyle:diffStyle||'bar',unknownRole:role};
}

function renderModel(m){
  if(m.whole&&m.p1&&m.p2) return renderPW(m);
  if(m.larger) return renderComparison(m);
  return renderEqual(m);
}

const INSTRUCT=[
  {
    // New: more and less — starts at D
    initialMode:'D',
    build(){return genComparison(null,null);},
    audio(m){return`Look at these two bars. They are different sizes — not equal. The ${m.larger.color.name} bar is more than the ${m.smaller.color.name} bar. The ${m.smaller.color.name} bar is less than the ${m.larger.color.name} bar.`;},
    guide(m){return`Look at both bars. Which one is smaller?`;},
    question(m){return`Which bar is less?`;},
    opts(m){return[`The ${m.smaller.color.name} bar is less.`,`The ${m.larger.color.name} bar is less.`,`Neither — both bars are the same size.`];},
    fu(m){return`${m.smaller.color.name} is less, so ${m.larger.color.name} is more. Naming one gives you the other for free.`;},
    fuQ(m){return`If ${m.smaller.color.name} is less — what is ${m.larger.color.name}?`;},
    fuOpts(m){return[`${m.larger.color.name} is more.`,`${m.larger.color.name} is equal.`,`${m.larger.color.name} is less.`];},
    fuGuide(m){return`If one bar is less, the other must be more. What is the ${m.larger.color.name} bar?`;},
  },
  {
    // New: the difference bar — starts at D
    initialMode:'D',
    build(){return genComparison('pale',null);},
    audio(m){return`The faded gap between the bars shows the difference. It shows how much more the ${m.larger.color.name} bar is than the ${m.smaller.color.name} bar.`;},
    guide(m){return`Look at the faded gap. What does it show?`;},
    question:`What do we call the faded gap?`,
    opts:['The faded gap is called the difference.','The faded gap is called the part.','The faded gap is called the whole.'],
    fu(m){return`Right — the difference. Smaller plus difference equals larger. That is a part-whole relation inside the comparison.`;},
    fuQ:`What relation does smaller plus difference equals larger show?`,
    fuOpts:['It shows a part-whole relation.','It shows an equal relation.','It shows a comparison that has no parts.'],
    fuGuide(){return`Smaller and difference add up to larger — just like parts add up to a whole. What kind of relation is that?`;},
  },
  {
    // New: all three relations in one picture — starts at D
    initialMode:'D',
    build(){return genComparison('bar',null);},
    audio(m){return`Here are three bars: ${m.smaller.color.name}, ${m.diff.color.name}, and ${m.larger.color.name}. They show three relations. To find the larger, add smaller plus difference. To find the difference, take the larger minus the smaller. To find the smaller, take the larger minus the difference.`;},
    guide(m){return`Look at the three bars. How do you find the ${m.diff.color.name} difference?`;},
    question(m){return`What equals the ${m.diff.color.name} difference?`;},
    opts(m){return[`${m.larger.color.name} minus ${m.smaller.color.name} equals the difference.`,`${m.smaller.color.name} minus ${m.larger.color.name} equals the difference.`,`${m.larger.color.name} plus ${m.smaller.color.name} equals the difference.`];},
    fu(m){return`${m.larger.color.name} minus ${m.smaller.color.name} equals the difference. You can find any of the three bars if you know the other two.`;},
    fuQ(m){return`What equals the ${m.smaller.color.name} smaller bar?`;},
    fuOpts(m){return[`${m.larger.color.name} minus ${m.diff.color.name} equals ${m.smaller.color.name}.`,`${m.larger.color.name} plus ${m.diff.color.name} equals ${m.smaller.color.name}.`,`${m.diff.color.name} minus ${m.larger.color.name} equals ${m.smaller.color.name}.`];},
    fuGuide(m){return`Larger minus difference gives you the smaller. What is that relation?`;},
  },
];

function showIntro(){
  S.phase='intro';setPhase('Introduction');setProgress(2);
  const audio=`Last time you learned part-whole. Today you will learn about comparisons. A comparison shows which bar is more and which is less. First, a quick review of part-whole.`;
  render(`<div class="instruct-text neutral" id="instructBox">${audioBtn()}<span id="instructAnim" class="typed-text"></span></div>`,
    `<div id="instructBtns" style="display:none"><button class="btn-continue" onclick="startReview()">Let's review</button></div>`);
  speak(audio);
  animateText(audio,'instructAnim',()=>{const b=document.getElementById('instructBtns');if(b)b.style.display='block';});
}
function startReview(){S.phase='review';setPhase('Review — Part-Whole');S.reviewStep=0;nextReview();}
function nextReview(){
  if(S.reviewStep>=S.totalReview){showInstructIntro();return;}
  setProgress(4+(S.reviewStep/S.totalReview)*12);
  S.reviewItemErrors=0;
  S.currentModel=genPWReview();startTimer();
  render(`<div class="canvas">${renderPW(S.currentModel)}</div><div class="question-prompt">Part-Whole or Not?</div>`,
    `<div class="response-buttons"><button class="btn" onclick="submitReview('yes')">Part-Whole</button><button class="btn" onclick="submitReview('no')">Not</button></div>`);
  speak('Part-Whole or Not?');
}
function submitReview(r){
  // Review always shows valid PW models — answer is always 'yes'
  recordResp('review',r==='yes');
  if(r==='yes'){
    document.getElementById('responseArea').innerHTML=`<div class="instruct-text positive" style="text-align:center;font-weight:700">${randPos()}</div>`;
    setTimeout(()=>{S.reviewStep++;nextReview();},400);
    return;
  }
  S.reviewItemErrors++;
  let audio;
  if(S.reviewItemErrors>=2){
    audio=`This is a part-whole. The two small bars together equal the top bar.`;
  } else {
    audio=`Look for a top bar that equals the two smaller bars below it.`;
  }
  render(`<div class="canvas">${renderPW(S.currentModel)}</div>
    <div class="instruct-text correction">${audioBtn()}<span id="instructAnim" class="typed-text"></span></div>`,
    `<div class="response-buttons"><button class="btn" onclick="submitReview('yes')">Part-Whole</button><button class="btn" onclick="submitReview('no')">Not</button></div>`);
  speak(audio);animateText(audio,'instructAnim');
}

function showInstructIntro(){
  S.phase='instruction';setPhase('Instruction');setProgress(18);
  const audio=`You know part-whole. Now look at comparisons — when one bar is more than another.`;
  render(`<div class="instruct-text" id="instructBox">${audioBtn()}<span id="instructAnim" class="typed-text"></span></div>`,
    `<div id="instructBtns" style="display:none"><button class="btn-continue" onclick="showInstruct(0)">Show me</button></div>`);
  speak(audio);
  animateText(audio,'instructAnim',()=>{const b=document.getElementById('instructBtns');if(b)b.style.display='block';});
}
function afterInstruct(){showIdentIntro();}

function showIdentIntro(){
  S.phase='ident';S.identStep=0;setPhase('Identification');setProgress(44);
  const audio=`Tell me if each picture shows a comparison or not.`;
  render(`<div class="instruct-text" id="instructBox">${audioBtn()}<span id="instructAnim" class="typed-text"></span></div>`,
    `<div id="instructBtns" style="display:none"><button class="btn-continue" onclick="nextIdent()">Ready</button></div>`);
  speak(audio);
  animateText(audio,'instructAnim',()=>{const b=document.getElementById('instructBtns');if(b)b.style.display='block';});
}
function nextIdent(){
  if(S.identStep>=S.totalIdent){showNamingIntro();return;}
  setProgress(46+(S.identStep/S.totalIdent)*20);
  S.identItemErrors=0;
  const isComp=Math.random()>0.4;
  S.currentModel=isComp?genComparison('bar',null):genPWReview();
  S.currentAnswer=isComp?'comparison':'not';
  startTimer();
  const html=isComp?renderComparison(S.currentModel):renderPW(S.currentModel);
  render(`<div class="canvas">${html}</div><div class="question-prompt">Comparison or Not?</div>`,
    `<div class="response-buttons"><button class="btn" onclick="submitIdent('comparison')">Comparison</button><button class="btn" onclick="submitIdent('not')">Not</button></div>`);
  speak('Comparison or Not?');
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
    audio=S.currentAnswer==='comparison'
      ?`This is a comparison. One bar is more than the other. Look for the difference bar between them.`
      :`This is not a comparison. It shows a part-whole — two bars that add up to one bigger bar.`;
  } else {
    audio=r==='comparison'
      ?`Look — is one bar more than another? Is there a difference bar?`
      :`Look again. Is there a larger bar with a smaller bar and a gap between them?`;
  }
  const html=S.currentAnswer==='comparison'?renderComparison(S.currentModel):renderPW(S.currentModel);
  render(`<div class="canvas">${html}</div>
    <div class="instruct-text correction">${audioBtn()}<span id="instructAnim" class="typed-text"></span></div>`,
    `<div class="response-buttons"><button class="btn" onclick="submitIdent('comparison')">Comparison</button><button class="btn" onclick="submitIdent('not')">Not</button></div>`);
  speak(audio);animateText(audio,'instructAnim');
}

function showNamingIntro(){
  S.phase='naming';S.namingStep=0;setPhase('Relation Naming');setProgress(68);
  const audio=`Now name the relation to find the unknown. Use the buttons below.`;
  render(`<div class="instruct-text" id="instructBox">${audioBtn()}<span id="instructAnim" class="typed-text"></span></div>`,
    `<div id="instructBtns" style="display:none"><button class="btn-continue" onclick="nextNaming()">Ready</button></div>`);
  speak(audio);
  animateText(audio,'instructAnim',()=>{const b=document.getElementById('instructBtns');if(b)b.style.display='block';});
}
function nextNaming(){
  if(S.namingStep>=S.totalNaming){showComplete();return;}
  setProgress(70+(S.namingStep/S.totalNaming)*26);
  S.namingItemErrors=0;
  const roles=['larger','smaller','diff'];
  const role=roles[S.namingStep%3];
  const m=genComparison('bar',role);
  S.currentModel=m;
  S.currentNaming={
    larger:m.larger.color.name,
    smaller:m.smaller.color.name,
    diff:m.diff.color.name,
    unknownRole:role
  };
  startTimer();
  if(!S.scaffoldColorLocked&&S.scaffoldColorActive) showColorScaffold();
  else if(!S.scaffoldRoleLocked&&S.scaffoldRoleActive) showRoleScaffold();
  else showNamingItem();
}
function showColorScaffold(){
  const n=S.currentNaming;
  const unk=n.unknownRole==='larger'?n.larger:n.unknownRole==='smaller'?n.smaller:n.diff;
  const opts=shuffle([...COLORS.map(c=>c.name).filter(c=>c!==unk).slice(0,3),unk]);
  render(`<div class="canvas">${renderComparison(S.currentModel)}</div><div class="question-prompt">What color is the unknown?</div>`,
    `<div class="response-buttons">${opts.map(o=>`<button class="btn" onclick="submitColorScaffold('${o}')">${o}</button>`).join('')}</div>`);
  speak('What color is the unknown?');
}
function submitColorScaffold(r){
  const n=S.currentNaming;
  const unk=n.unknownRole==='larger'?n.larger:n.unknownRole==='smaller'?n.smaller:n.diff;
  const ok=cmatch(r,unk);
  updateColorScaffold(ok);recordResp('scaffold_color',ok);
  if(ok){if(!S.scaffoldRoleLocked&&S.scaffoldRoleActive)showRoleScaffold();else showNamingItem();}
  else{
    const audio=`Find the bar with the question mark. What color is it?`;
    render(`<div class="canvas">${renderComparison(S.currentModel)}</div>
      <div class="instruct-text correction">${audioBtn()}<span id="instructAnim" class="typed-text"></span></div>`,
      `<div class="response-buttons">${shuffle([...COLORS.map(c=>c.name).filter(c=>c!==unk).slice(0,3),unk]).map(o=>`<button class="btn" onclick="submitColorScaffold('${o}')">${o}</button>`).join('')}</div>`);
    speak(audio);animateText(audio,'instructAnim');
  }
}
function showRoleScaffold(){
  const n=S.currentNaming;
  const unk=n.unknownRole==='larger'?n.larger:n.unknownRole==='smaller'?n.smaller:n.diff;
  render(`<div class="canvas">${renderComparison(S.currentModel)}</div><div class="question-prompt">Is ${unk} the larger bar, the smaller bar, or the difference?</div>`,
    `<div class="response-buttons"><button class="btn" onclick="submitRoleScaffold('larger')">Larger</button><button class="btn" onclick="submitRoleScaffold('smaller')">Smaller</button><button class="btn" onclick="submitRoleScaffold('diff')">Difference</button></div>`);
  speak(`Is ${unk} the larger, smaller, or difference?`);
}
function submitRoleScaffold(r){
  const n=S.currentNaming;
  const ok=r===n.unknownRole;
  updateRoleScaffold(ok);recordResp('scaffold_role',ok);
  if(ok){showNamingItem();return;}
  const unk=n.unknownRole==='larger'?n.larger:n.unknownRole==='smaller'?n.smaller:n.diff;
  const msg={larger:`${unk} is the longest bar — that is the larger.`,smaller:`${unk} is the shorter full bar — that is the smaller.`,diff:`${unk} is the gap bar — that is the difference.`}[n.unknownRole];
  render(`<div class="canvas">${renderComparison(S.currentModel)}</div>
    <div class="instruct-text correction">${audioBtn()}<span id="instructAnim" class="typed-text"></span></div>`,
    `<div class="response-buttons"><button class="btn" onclick="submitRoleScaffold('larger')">Larger</button><button class="btn" onclick="submitRoleScaffold('smaller')">Smaller</button><button class="btn" onclick="submitRoleScaffold('diff')">Difference</button></div>`);
  speak(msg);animateText(msg,'instructAnim');
}
function showNamingItem(){
  const n=S.currentNaming;
  const{larger,smaller,diff,unknownRole}=n;
  let correct,opts;
  if(unknownRole==='larger'){
    correct=`${smaller} plus ${diff} equals unknown`;
    opts=shuffle([correct,`${larger} minus ${diff} equals unknown`,`${smaller} minus ${diff} equals unknown`]);
  } else if(unknownRole==='smaller'){
    correct=`${larger} minus ${diff} equals unknown`;
    opts=shuffle([correct,`${smaller} plus ${diff} equals unknown`,`${diff} minus ${larger} equals unknown`]);
  } else {
    correct=`${larger} minus ${smaller} equals unknown`;
    opts=shuffle([correct,`${smaller} minus ${larger} equals unknown`,`${larger} plus ${smaller} equals unknown`]);
  }
  if(!opts.includes(correct))opts[opts.length-1]=correct;
  render(`<div class="canvas">${renderComparison(S.currentModel)}</div><div class="question-prompt">What equals the unknown?</div>`,
    `<div class="response-buttons">${shuffle(opts).map(o=>`<button class="btn" onclick="submitNaming('${o.replace(/'/g,"&#39;")}')">${o}</button>`).join('')}</div>`);
  speak('What equals the unknown?');
}
function submitNaming(r){
  const n=S.currentNaming;
  const{larger,smaller,diff,unknownRole}=n;
  let isCorrect;
  if(unknownRole==='larger') isCorrect=cmatch(r,smaller)&&cmatch(r,diff)&&r.includes('plus');
  else if(unknownRole==='smaller') isCorrect=cmatch(r,larger)&&cmatch(r,diff)&&r.includes('minus');
  else isCorrect=cmatch(r,larger)&&cmatch(r,smaller)&&r.includes('minus');
  recordResp('naming',isCorrect);updateColorScaffold(isCorrect);updateRoleScaffold(isCorrect);
  if(isCorrect){
    document.getElementById('responseArea').innerHTML=`<div class="instruct-text positive" style="text-align:center;font-weight:700">${randPos()}</div>`;
    setTimeout(()=>{S.namingStep++;nextNaming();},500);
    return;
  }
  S.namingItemErrors++;
  const correct=unknownRole==='larger'?`${smaller} plus ${diff} equals unknown`:unknownRole==='smaller'?`${larger} minus ${diff} equals unknown`:`${larger} minus ${smaller} equals unknown`;
  let audio;
  if(S.namingItemErrors>=2){
    audio=`The relation is: ${correct}.`;
  } else {
    if(unknownRole==='larger') audio=`The unknown is the larger bar. To find the larger, add smaller plus difference.`;
    else if(unknownRole==='smaller') audio=`The unknown is the smaller bar. To find the smaller, take larger minus difference.`;
    else audio=`The unknown is the difference. To find the difference, take larger minus smaller.`;
  }
  render(`<div class="canvas">${renderComparison(S.currentModel)}</div>
    <div class="instruct-text correction">${audioBtn()}<span id="instructAnim" class="typed-text"></span></div>`,
    `<div class="response-buttons">${shuffle([correct,unknownRole==='larger'?`${larger} minus ${diff} equals unknown`:unknownRole==='smaller'?`${smaller} plus ${diff} equals unknown`:`${larger} plus ${smaller} equals unknown`,`${diff} minus ${larger} equals unknown`]).slice(0,3).map(o=>`<button class="btn" onclick="submitNaming('${o.replace(/'/g,"&#39;")}')">${o}</button>`).join('')}</div>`);
  speak(audio);animateText(audio,'instructAnim');
}
