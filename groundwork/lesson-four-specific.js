// ═══════════════════════════════════════════════════════════════════════════════
// LESSON FOUR — FRACTIONAL RELATIONS
// Comparison is mastered (L3) → review starts at T.
// Fractional is new → INSTRUCT steps start at D.
// ═══════════════════════════════════════════════════════════════════════════════

function genCompReview(){
  const lC=randColor(),sC=randColor([lC.name]),dC=randColor([lC.name,sC.name]);
  const lW=BASE*(0.55+Math.random()*0.3),dW=lW*(0.2+Math.random()*0.3),sW=lW-dW;
  return{larger:{color:lC,w:lW},smaller:{color:sC,w:sW},diff:{color:dC,w:dW},
    diffStyle:'bar',unknownRole:'diff'};
}
function genFrac(unknownRole=null){
  const wC=randColor(),pC=randColor([wC.name]);
  const d=FRAC_DENOMS[Math.floor(Math.random()*FRAC_DENOMS.length)];
  const fi=Math.floor(Math.random()*d);
  const wW=BASE*(0.7+Math.random()*0.2);
  return{wholeColor:wC,partColor:pC,denominator:d,filledIndex:fi,unknownRole:unknownRole||'part',wholeW:wW,isFractional:true};
}
function genNEFrac(){
  const wC=randColor(),pC=randColor([wC.name]);
  const d=2+Math.floor(Math.random()*4);
  const wW=BASE*(0.7+Math.random()*0.2);
  const types=['unequal','mismatch','nowhole'];
  const neType=types[Math.floor(Math.random()*types.length)];
  return{wholeColor:wC,partColor:pC,denominator:d,wholeW:wW,isFractional:false,neType};
}

function renderNEFrac(m){
  const{wholeColor,partColor,denominator,wholeW,neType}=m;
  const boxW=wholeW/denominator;
  const wBar=sbar(wholeColor.hex,wholeColor.name,wholeW);
  let boxes='';
  if(neType==='unequal'){
    const widths=[wholeW*0.4,wholeW*0.35,...Array(denominator-2).fill(wholeW*0.25/(denominator-2))];
    for(let i=0;i<denominator;i++){const bg=i===0?partColor.hex:partColor.hex+'33';boxes+=`<div style="width:${Math.round(widths[i]||boxW)}px;height:${BH}px;background:${bg};border:${i===0?'none':'2px dashed #9B9591'};border-radius:${i===0?'6px 0 0 6px':i===denominator-1?'0 6px 6px 0':'0'};flex-shrink:0"></div>`;}
    return`<div style="display:flex;flex-direction:column;gap:8px">${wBar}<div style="display:flex">${boxes}</div></div>`;
  }
  if(neType==='mismatch'){
    const mW=boxW*0.6;
    for(let i=0;i<denominator;i++) boxes+=`<div style="width:${boxW}px;height:${BH}px;background:${partColor.hex}33;border:2px dashed #9B9591;flex-shrink:0"></div>`;
    return`<div style="display:flex;flex-direction:column;gap:8px">${wBar}<div style="display:flex;gap:12px;align-items:center"><div style="display:flex">${boxes}</div>${sbar(partColor.hex,partColor.name,Math.round(mW))}</div></div>`;
  }
  // nowhole
  for(let i=0;i<denominator;i++){const iF=i===0;boxes+=`<div style="width:${boxW}px;height:${BH}px;background:${iF?partColor.hex:partColor.hex+'33'};border:${iF?'none':'2px dashed #9B9591'};border-radius:${i===0?'6px 0 0 6px':i===denominator-1?'0 6px 6px 0':'0'};flex-shrink:0"></div>`;}
  return`<div style="display:flex">${boxes}</div>`;
}

function renderModel(m){
  if(m.isFractional===true) return renderFractional(m);
  if(m.isFractional===false) return renderNEFrac(m);
  if(m.larger) return renderComparison(m);
  if(m.whole&&m.p1) return renderPW(m);
  return renderEqual(m);
}

// ── INSTRUCT ──────────────────────────────────────────────────────────────────
const INSTRUCT=[
  {
    // New: halves — starts at D
    initialMode:'D',
    build(){return{wholeColor:COLORS[2],partColor:COLORS[0],denominator:2,filledIndex:0,unknownRole:null,wholeW:360,isFractional:true};},
    audio(){return`The top bar is one whole. The boxes below show it split into two equal parts. Two equal parts are called halves. The filled box is one half of the whole.`;},
    guide(){return`Count the equal boxes below the whole bar. How many are there?`;},
    question:`How many halves are in one whole?`,
    opts:['There are two halves in one whole.','There are three halves in one whole.','There are four halves in one whole.'],
    fu(){return`Two equal parts make two halves. Each part is one half of the whole.`;},
    fuQ:`What do we call two equal parts of a whole?`,
    fuOpts:['Two equal parts are called halves.','Two equal parts are called thirds.','Two equal parts are called fourths.'],
    fuGuide(){return`Two equal parts — what word names two equal parts?`;},
  },
  {
    // New: thirds — starts at D
    initialMode:'D',
    build(){return{wholeColor:COLORS[2],partColor:COLORS[1],denominator:3,filledIndex:1,unknownRole:null,wholeW:360,isFractional:true};},
    audio(){return`Now the whole is split into three equal parts. Three equal parts are called thirds. The filled box is one third of the whole.`;},
    guide(){return`Count the equal boxes below the whole bar. How many are there?`;},
    question:`What do we call each part when a whole is split into three equal parts?`,
    opts:['Each part is called a third.','Each part is called a half.','Each part is called a fourth.'],
    fu(){return`Three equal parts make thirds. Each part is one third of the whole.`;},
    fuQ:`What is the filled box equal to?`,
    fuOpts:['The filled box is equal to one third of the whole.','The filled box is equal to one half of the whole.','The filled box is equal to one fourth of the whole.'],
    fuGuide(){return`There are three equal parts. What fraction is one of those parts?`;},
  },
  {
    // New: fourths — starts at D
    initialMode:'D',
    build(){return{wholeColor:COLORS[2],partColor:COLORS[3],denominator:4,filledIndex:2,unknownRole:null,wholeW:360,isFractional:true};},
    audio(){return`Four equal parts are called fourths. The filled box is one fourth of the whole. Count the boxes — there are four.`;},
    guide(){return`Count the equal boxes. How many are there?`;},
    question:`What is the filled box equal to?`,
    opts:['The filled box is equal to one fourth of the whole.','The filled box is equal to one third of the whole.','The filled box is equal to one half of the whole.'],
    fu(){return`Four equal parts make fourths. Each filled part is one fourth of the whole.`;},
    fuQ:`How many fourths are in one whole?`,
    fuOpts:['There are four fourths in one whole.','There are three fourths in one whole.','There are two fourths in one whole.'],
    fuGuide(){return`Count all the boxes below the whole bar. That is your answer.`;},
  },
];

// ── Phases ────────────────────────────────────────────────────────────────────
function showIntro(){
  S.phase='intro';setPhase('Introduction');setProgress(2);
  const audio=`Last time you learned comparisons. Today you will learn fractional relations. A fractional relation shows equal parts of a whole. First, a quick review of comparisons.`;
  render(`<div class="instruct-text neutral" id="instructBox">${audioBtn()}<span id="instructAnim" class="typed-text"></span></div>`,
    `<div id="instructBtns" style="display:none"><button class="btn-continue" onclick="startReview()">Let's review</button></div>`);
  speak(audio);
  animateText(audio,'instructAnim',()=>{const b=document.getElementById('instructBtns');if(b)b.style.display='block';});
}
function startReview(){S.phase='review';setPhase('Review — Comparisons');S.reviewStep=0;nextReview();}
function nextReview(){
  if(S.reviewStep>=S.totalReview){showInstructIntro();return;}
  setProgress(4+(S.reviewStep/S.totalReview)*12);
  S.reviewItemErrors=0;
  S.currentModel=genCompReview();startTimer();
  render(`<div class="canvas">${renderComparison(S.currentModel)}</div><div class="question-prompt">Comparison or Not?</div>`,
    `<div class="response-buttons"><button class="btn" onclick="submitReview('yes')">Comparison</button><button class="btn" onclick="submitReview('no')">Not</button></div>`);
  speak('Comparison or Not?');
}
function submitReview(r){
  // Review always shows valid comparison models — answer is always 'yes'
  recordResp('review',r==='yes');
  if(r==='yes'){
    document.getElementById('responseArea').innerHTML=`<div class="instruct-text positive" style="text-align:center;font-weight:700">${randPos()}</div>`;
    setTimeout(()=>{S.reviewStep++;nextReview();},400);
    return;
  }
  S.reviewItemErrors++;
  let audio;
  if(S.reviewItemErrors>=2){
    audio=`This is a comparison. One bar is more than the other. There is a gap bar that shows the difference.`;
  } else {
    audio=`Look for two bars of different sizes and a gap bar between them.`;
  }
  render(`<div class="canvas">${renderComparison(S.currentModel)}</div>
    <div class="instruct-text correction">${audioBtn()}<span id="instructAnim" class="typed-text"></span></div>`,
    `<div class="response-buttons"><button class="btn" onclick="submitReview('yes')">Comparison</button><button class="btn" onclick="submitReview('no')">Not</button></div>`);
  speak(audio);animateText(audio,'instructAnim');
}

function showInstructIntro(){
  S.phase='instruction';setPhase('Instruction');setProgress(18);
  const audio=`You know comparisons. Now look at fractional relations — equal parts of a whole.`;
  render(`<div class="instruct-text" id="instructBox">${audioBtn()}<span id="instructAnim" class="typed-text"></span></div>`,
    `<div id="instructBtns" style="display:none"><button class="btn-continue" onclick="showInstruct(0)">Show me</button></div>`);
  speak(audio);
  animateText(audio,'instructAnim',()=>{const b=document.getElementById('instructBtns');if(b)b.style.display='block';});
}
function afterInstruct(){showIdentIntro();}

// ── Identification ─────────────────────────────────────────────────────────────
function showIdentIntro(){
  S.phase='ident';S.identStep=0;setPhase('Practice');setProgress(44);
  const audio=`Tell me if each picture shows a fractional relation or not.`;
  render(`<div class="instruct-text" id="instructBox">${audioBtn()}<span id="instructAnim" class="typed-text"></span></div>`,
    `<div id="instructBtns" style="display:none"><button class="btn-continue" onclick="nextIdent()">Ready</button></div>`);
  speak(audio);
  animateText(audio,'instructAnim',()=>{const b=document.getElementById('instructBtns');if(b)b.style.display='block';});
}
function nextIdent(){
  if(S.identStep>=S.totalIdent){showNamingIntro();return;}
  setProgress(46+(S.identStep/S.totalIdent)*20);
  S.identItemErrors=0;
  const isFrac=Math.random()>0.4;
  S.currentModel=isFrac?genFrac():genNEFrac();
  S.currentAnswer=isFrac?'yes':'no';startTimer();
  render(`<div class="canvas">${renderModel(S.currentModel)}</div><div class="question-prompt">Fractional Relation or Not?</div>`,
    `<div class="response-buttons"><button class="btn" onclick="submitIdent('yes')">Fractional Relation</button><button class="btn" onclick="submitIdent('no')">Not</button></div>`);
  speak('Fractional Relation or Not?');
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
    audio=S.currentAnswer==='yes'
      ?`This is a fractional relation. There is a whole bar on top. Equal boxes below show parts of that whole.`
      :`This is not a fractional relation. Look for a whole bar on top with equal boxes below it.`;
  } else {
    audio=r==='yes'
      ?`Look — are the boxes equal? Does the picture show a whole bar on top?`
      :`Look again. Is there a whole bar on top with equal boxes below?`;
  }
  render(`<div class="canvas">${renderModel(S.currentModel)}</div>
    <div class="instruct-text correction">${audioBtn()}<span id="instructAnim" class="typed-text"></span></div>`,
    `<div class="response-buttons"><button class="btn" onclick="submitIdent('yes')">Fractional Relation</button><button class="btn" onclick="submitIdent('no')">Not</button></div>`);
  speak(audio);animateText(audio,'instructAnim');
}

// ── Naming ────────────────────────────────────────────────────────────────────
function showNamingIntro(){
  S.phase='naming';S.namingStep=0;setPhase('Relation Naming');setProgress(66);
  const audio=`The filled box is the unknown. Name the relation: one fraction of the whole equals unknown.`;
  render(`<div class="instruct-text" id="instructBox">${audioBtn()}<span id="instructAnim" class="typed-text"></span></div>`,
    `<div id="instructBtns" style="display:none"><button class="btn-continue" onclick="nextNaming()">Ready</button></div>`);
  speak(audio);
  animateText(audio,'instructAnim',()=>{const b=document.getElementById('instructBtns');if(b)b.style.display='block';});
}
function nextNaming(){
  if(S.namingStep>=S.totalNaming){showComplete();return;}
  setProgress(68+(S.namingStep/S.totalNaming)*28);
  S.namingItemErrors=0;
  S.currentModel=genFrac('part');
  const n=S.currentModel;
  S.currentNaming={whole:n.wholeColor.name,part:n.partColor.name,d:n.denominator,fracN:fracName(n.denominator)};
  startTimer();
  if(!S.scaffoldColorLocked&&S.scaffoldColorActive) showColorScaffold();
  else if(!S.scaffoldRoleLocked&&S.scaffoldRoleActive) showFracScaffold();
  else showNamingItem();
}
function showColorScaffold(){
  const n=S.currentNaming;
  const opts=shuffle([...COLORS.map(c=>c.name).filter(c=>c!==n.part).slice(0,3),n.part]);
  render(`<div class="canvas">${renderModel(S.currentModel)}</div><div class="question-prompt">What color is the unknown?</div>`,
    `<div class="response-buttons">${opts.map(o=>`<button class="btn" onclick="submitColorScaffold('${o}')">${o}</button>`).join('')}</div>`);
  speak('What color is the unknown?');
}
function submitColorScaffold(r){
  const n=S.currentNaming;const ok=cmatch(r,n.part);
  updateColorScaffold(ok);recordResp('scaffold_color',ok);
  if(ok){if(!S.scaffoldRoleLocked&&S.scaffoldRoleActive)showFracScaffold();else showNamingItem();}
  else{
    const audio=`Find the filled box with the question mark. What color is it?`;
    render(`<div class="canvas">${renderModel(S.currentModel)}</div>
      <div class="instruct-text correction">${audioBtn()}<span id="instructAnim" class="typed-text"></span></div>`,
      `<div class="response-buttons">${shuffle([...COLORS.map(c=>c.name).filter(c=>c!==n.part).slice(0,3),n.part]).map(o=>`<button class="btn" onclick="submitColorScaffold('${o}')">${o}</button>`).join('')}</div>`);
    speak(audio);animateText(audio,'instructAnim');
  }
}
function showFracScaffold(){
  const n=S.currentNaming;
  render(`<div class="canvas">${renderModel(S.currentModel)}</div><div class="question-prompt">How many equal parts are there?</div>`,
    `<div class="response-buttons">${FRAC_DENOMS.map(d=>`<button class="btn" onclick="submitFracScaffold(${d})">${d}</button>`).join('')}</div>`);
  speak('How many equal parts are there?');
}
function submitFracScaffold(d){
  const n=S.currentNaming;const ok=d===n.d;
  updateRoleScaffold(ok);recordResp('scaffold_frac',ok);
  if(ok){showNamingItem();return;}
  const audio=`Count the equal boxes below the whole bar. How many are there?`;
  render(`<div class="canvas">${renderModel(S.currentModel)}</div>
    <div class="instruct-text correction">${audioBtn()}<span id="instructAnim" class="typed-text"></span></div>`,
    `<div class="response-buttons">${FRAC_DENOMS.map(d=>`<button class="btn" onclick="submitFracScaffold(${d})">${d}</button>`).join('')}</div>`);
  speak(audio);animateText(audio,'instructAnim');
}
function showNamingItem(){
  const n=S.currentNaming;
  const correct=`one ${n.fracN} of ${n.whole} equals unknown`;
  const opts=shuffle([correct,`one ${n.fracN} of ${n.part} equals unknown`,`one ${fracName(n.d===2?3:2)} of ${n.whole} equals unknown`]).slice(0,3);
  if(!opts.includes(correct))opts[opts.length-1]=correct;
  render(`<div class="canvas">${renderModel(S.currentModel)}</div><div class="question-prompt">What equals the unknown?</div>`,
    `<div class="response-buttons">${shuffle(opts).map(o=>`<button class="btn" onclick="submitNaming('${o.replace(/'/g,"&#39;")}')">${o}</button>`).join('')}</div>`);
  speak('What equals the unknown?');
}
function submitNaming(r){
  const n=S.currentNaming;
  const correct=`one ${n.fracN} of ${n.whole} equals unknown`;
  const ok=r===correct||(cmatch(r,n.whole)&&r.includes(n.fracN));
  recordResp('naming',ok);updateColorScaffold(ok);updateRoleScaffold(ok);
  if(ok){
    document.getElementById('responseArea').innerHTML=`<div class="instruct-text positive" style="text-align:center;font-weight:700">${randPos()}</div>`;
    setTimeout(()=>{S.namingStep++;nextNaming();},500);
    return;
  }
  S.namingItemErrors++;
  let audio;
  if(S.namingItemErrors>=2){
    audio=`The relation is: ${correct}.`;
  } else {
    const spokenFrac=FRAC_NAMES&&FRAC_NAMES.find(f=>r.includes(f));
    audio=spokenFrac&&spokenFrac!==n.fracN
      ?`Count the equal boxes — there are ${n.d}, so use ${n.fracN}.`
      :`Name the whole too. Start with one ${n.fracN} of the whole color.`;
  }
  render(`<div class="canvas">${renderModel(S.currentModel)}</div>
    <div class="instruct-text correction">${audioBtn()}<span id="instructAnim" class="typed-text"></span></div>`,
    `<div class="response-buttons">${shuffle([correct,`one ${n.fracN} of ${n.part} equals unknown`,`one ${fracName(n.d===2?3:2)} of ${n.whole} equals unknown`]).slice(0,3).map(o=>`<button class="btn" onclick="submitNaming('${o.replace(/'/g,"&#39;")}')">${o}</button>`).join('')}</div>`);
  speak(audio);animateText(audio,'instructAnim');
}
