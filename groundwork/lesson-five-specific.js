// ═══════════════════════════════════════════════════════════════════════════════
// LESSON FIVE — MULTIPLICATIVE RELATIONS
// Fractional is mastered (L4) → review starts at T.
// Multiplicative is new → INSTRUCT steps start at D.
// ═══════════════════════════════════════════════════════════════════════════════

const NUM_WORDS=['two','three','four','five'];
function numWord(n){return NUM_WORDS[n-2]||String(n);}

function genFrac(unknownRole=null){
  const wC=randColor(),pC=randColor([wC.name]);
  const d=FRAC_DENOMS[Math.floor(Math.random()*FRAC_DENOMS.length)];
  const fi=Math.floor(Math.random()*d);
  const wW=BASE*(0.7+Math.random()*0.2);
  return{wholeColor:wC,partColor:pC,denominator:d,filledIndex:fi,unknownRole:unknownRole||'part',wholeW:wW,isFractional:true};
}

function renderModel(m){
  if(m.isFractional) return renderFractional(m);
  if(m.whole&&m.p1) return renderPW(m);
  return renderEqual(m);
}

// ── INSTRUCT ──────────────────────────────────────────────────────────────────
const INSTRUCT=[
  {
    // New: the whole is N times the part — starts at D
    initialMode:'D',
    build(){return{wholeColor:COLORS[2],partColor:COLORS[0],denominator:2,filledIndex:0,unknownRole:null,wholeW:360,isFractional:true};},
    audio(){return`You know that blue is one half of green. Now look the other way. Green holds two equal blue parts. So green is two times blue.`;},
    guide(){return`Count the equal parts below the whole bar. How many are there?`;},
    question:`Green is how many times blue?`,
    opts:['Green is two times blue.','Green is three times blue.','Green is one half of blue.'],
    fu(){return`Two parts means two times. Green is two times blue. The whole is always N times the part.`;},
    fuQ:`If a whole had three equal parts, the whole would be how many times the part?`,
    fuOpts:['The whole would be three times the part.','The whole would be two times the part.','The whole would be four times the part.'],
    fuGuide(){return`Count the parts. Three parts — so the whole is three times the part.`;},
  },
  {
    // New: name the multiplicative relation — starts at D
    initialMode:'D',
    build(){return genFrac('whole');},
    audio(m){return`The ${m.wholeColor.name} whole is unknown. There are ${m.denominator} equal ${m.partColor.name} parts. So ${m.wholeColor.name} is ${numWord(m.denominator)} times ${m.partColor.name}.`;},
    guide(m){return`Count the equal parts. How many ${m.partColor.name} boxes are there?`;},
    question(m){return`${m.wholeColor.name} is how many times ${m.partColor.name}?`;},
    opts(m){const n=numWord(m.denominator),alt=numWord(m.denominator===2?3:m.denominator===3?4:2);return[`${m.wholeColor.name} is ${n} times ${m.partColor.name}.`,`${m.wholeColor.name} is ${alt} times ${m.partColor.name}.`,`${m.partColor.name} is one ${fracName(m.denominator)} of ${m.wholeColor.name}.`];},
    fu(m){return`${m.wholeColor.name} is ${numWord(m.denominator)} times ${m.partColor.name}. Count the parts — that number is the times.`;},
    fuQ(m){return`Name the fractional relation — ${m.partColor.name} is one what of ${m.wholeColor.name}?`;},
    fuOpts(m){const altF=fracName(m.denominator===2?3:2);return[`${m.partColor.name} is one ${fracName(m.denominator)} of ${m.wholeColor.name}.`,`${m.partColor.name} is one ${altF} of ${m.wholeColor.name}.`,`${m.wholeColor.name} is one ${fracName(m.denominator)} of ${m.partColor.name}.`];},
    fuGuide(m){return`The fractional says the part is one fraction of the whole. What fraction matches ${m.denominator} equal parts?`;},
  },
  {
    // New: both directions from the same picture — starts at D
    initialMode:'D',
    build(){return genFrac('part');},
    audio(m){return`The ${m.partColor.name} part is unknown. Two true relations: ${m.partColor.name} is one ${fracName(m.denominator)} of ${m.wholeColor.name}. And: ${m.wholeColor.name} is ${numWord(m.denominator)} times ${m.partColor.name}. Both are true.`;},
    guide(m){return`Look at the whole and the equal parts. Can you name one true relation?`;},
    question(m){return`Name a true relation between ${m.wholeColor.name} and ${m.partColor.name}.`;},
    opts(m){return[`${m.partColor.name} is one ${fracName(m.denominator)} of ${m.wholeColor.name}.`,`${m.wholeColor.name} is ${numWord(m.denominator)} times ${m.partColor.name}.`,`${m.wholeColor.name} is one ${fracName(m.denominator)} of ${m.partColor.name}.`].slice(0,3);},
    fu(m){return`Both are true: fractional and multiplicative. The same picture has two names.`;},
    fuQ(m){return`Now name the other direction. ${m.wholeColor.name} is how many times ${m.partColor.name}?`;},
    fuOpts(m){const n=numWord(m.denominator),alt=numWord(m.denominator===2?3:2);return[`${m.wholeColor.name} is ${n} times ${m.partColor.name}.`,`${m.wholeColor.name} is ${alt} times ${m.partColor.name}.`,`${m.partColor.name} is ${n} times ${m.wholeColor.name}.`];},
    fuGuide(m){return`Count the equal parts — that is the number for times.`;},
  },
];

// ── Phases ────────────────────────────────────────────────────────────────────
function showIntro(){
  S.phase='intro';setPhase('Introduction');setProgress(2);
  const audio=`Last time you learned fractional relations. Today you will learn multiplicative relations. Same picture — different direction. First, a quick review of fractional relations.`;
  render(`<div class="instruct-text neutral" id="instructBox">${audioBtn()}<span id="instructAnim" class="typed-text"></span></div>`,
    `<div id="instructBtns" style="display:none"><button class="btn-continue" onclick="startReview()">Let's review</button></div>`);
  speak(audio);
  animateText(audio,'instructAnim',()=>{const b=document.getElementById('instructBtns');if(b)b.style.display='block';});
}
function startReview(){S.phase='review';setPhase('Review — Fractional');S.reviewStep=0;nextReview();}
function nextReview(){
  if(S.reviewStep>=S.totalReview){showInstructIntro();return;}
  setProgress(4+(S.reviewStep/S.totalReview)*14);
  S.reviewItemErrors=0;
  S.currentModel=genFrac(null);startTimer();
  const m=S.currentModel;
  const correct=`one ${fracName(m.denominator)} of ${m.wholeColor.name}`;
  const opts=shuffle([correct,`one ${fracName(m.denominator===2?3:2)} of ${m.wholeColor.name}`,`one ${fracName(m.denominator)} of ${m.partColor.name}`]).slice(0,3);
  render(`<div class="canvas">${renderFractional({...m,unknownRole:null})}</div><div class="question-prompt">Name the fractional relation.</div>`,
    `<div class="response-buttons">${opts.map(o=>`<button class="btn" onclick="submitReview('${o.replace(/'/g,"&#39;")}')">${o}</button>`).join('')}</div>`);
  speak('Name the fractional relation.');
}
function submitReview(r){
  const m=S.currentModel;
  const correct=`one ${fracName(m.denominator)} of ${m.wholeColor.name}`;
  const ok=cmatch(r,m.wholeColor.name)&&r.includes(fracName(m.denominator));
  recordResp('review',ok);
  if(ok){
    document.getElementById('responseArea').innerHTML=`<div class="instruct-text positive" style="text-align:center;font-weight:700">${randPos()}</div>`;
    setTimeout(()=>{S.reviewStep++;nextReview();},400);
    return;
  }
  S.reviewItemErrors++;
  let audio;
  if(S.reviewItemErrors>=2){
    audio=`The relation is: ${correct}.`;
  } else {
    audio=`Count the equal boxes — that tells you the fraction name. Then name the whole color.`;
  }
  const opts=shuffle([correct,`one ${fracName(m.denominator===2?3:2)} of ${m.wholeColor.name}`,`one ${fracName(m.denominator)} of ${m.partColor.name}`]).slice(0,3);
  render(`<div class="canvas">${renderFractional({...m,unknownRole:null})}</div>
    <div class="instruct-text correction">${audioBtn()}<span id="instructAnim" class="typed-text"></span></div>`,
    `<div class="response-buttons">${opts.map(o=>`<button class="btn" onclick="submitReview('${o.replace(/'/g,"&#39;")}')">${o}</button>`).join('')}</div>`);
  speak(audio);animateText(audio,'instructAnim');
}

function showInstructIntro(){
  S.phase='instruction';setPhase('Instruction');setProgress(20);
  const audio=`You know fractional relations. Now look at the same pictures from the other direction — multiplicative relations.`;
  render(`<div class="instruct-text" id="instructBox">${audioBtn()}<span id="instructAnim" class="typed-text"></span></div>`,
    `<div id="instructBtns" style="display:none"><button class="btn-continue" onclick="showInstruct(0)">Show me</button></div>`);
  speak(audio);
  animateText(audio,'instructAnim',()=>{const b=document.getElementById('instructBtns');if(b)b.style.display='block';});
}
function afterInstruct(){showNamingIntro();}

// ── Naming ────────────────────────────────────────────────────────────────────
function showNamingIntro(){
  S.phase='naming';S.namingStep=0;setPhase('Relation Naming');setProgress(44);
  const audio=`Name the relation to find the unknown. The unknown could be the whole or the part. Use fractional or multiplicative — both are correct.`;
  render(`<div class="instruct-text" id="instructBox">${audioBtn()}<span id="instructAnim" class="typed-text"></span></div>`,
    `<div id="instructBtns" style="display:none"><button class="btn-continue" onclick="nextNaming()">Ready</button></div>`);
  speak(audio);
  animateText(audio,'instructAnim',()=>{const b=document.getElementById('instructBtns');if(b)b.style.display='block';});
}
function nextNaming(){
  if(S.namingStep>=S.totalNaming){showFreeIntro();return;}
  setProgress(46+(S.namingStep/S.totalNaming)*24);
  S.namingItemErrors=0;
  const unkRole=S.namingStep%2===0?'whole':'part';
  S.currentModel=genFrac(unkRole);
  const m=S.currentModel;
  S.currentNaming={whole:m.wholeColor.name,part:m.partColor.name,d:m.denominator,fracN:fracName(m.denominator),numW:numWord(m.denominator),unkRole};
  startTimer();
  if(!S.scaffoldColorLocked&&S.scaffoldColorActive) showColorScaffold();
  else if(!S.scaffoldRoleLocked&&S.scaffoldRoleActive) showRoleScaffold();
  else showNamingItem();
}
function showColorScaffold(){
  const n=S.currentNaming;const unk=n.unkRole==='whole'?n.whole:n.part;
  const opts=shuffle([...COLORS.map(c=>c.name).filter(c=>c!==unk).slice(0,3),unk]);
  render(`<div class="canvas">${renderModel(S.currentModel)}</div><div class="question-prompt">What color is the unknown?</div>`,
    `<div class="response-buttons">${opts.map(o=>`<button class="btn" onclick="submitColorScaffold('${o}')">${o}</button>`).join('')}</div>`);
  speak('What color is the unknown?');
}
function submitColorScaffold(r){
  const n=S.currentNaming;const unk=n.unkRole==='whole'?n.whole:n.part;
  const ok=cmatch(r,unk);updateColorScaffold(ok);recordResp('scaffold_color',ok);
  if(ok){if(!S.scaffoldRoleLocked&&S.scaffoldRoleActive)showRoleScaffold();else showNamingItem();}
  else{
    const audio=`Find the bar with the question mark. What color is it?`;
    render(`<div class="canvas">${renderModel(S.currentModel)}</div>
      <div class="instruct-text correction">${audioBtn()}<span id="instructAnim" class="typed-text"></span></div>`,
      `<div class="response-buttons">${shuffle([...COLORS.map(c=>c.name).filter(c=>c!==unk).slice(0,3),unk]).map(o=>`<button class="btn" onclick="submitColorScaffold('${o}')">${o}</button>`).join('')}</div>`);
    speak(audio);animateText(audio,'instructAnim');
  }
}
function showRoleScaffold(){
  const n=S.currentNaming;const unk=n.unkRole==='whole'?n.whole:n.part;
  render(`<div class="canvas">${renderModel(S.currentModel)}</div><div class="question-prompt">Is ${unk} the whole bar or the part?</div>`,
    `<div class="response-buttons"><button class="btn" onclick="submitRoleScaffold('whole')">The Whole</button><button class="btn" onclick="submitRoleScaffold('part')">The Part</button></div>`);
  speak(`Is ${unk} the whole bar or the part?`);
}
function submitRoleScaffold(r){
  const n=S.currentNaming;const ok=r===n.unkRole;
  updateRoleScaffold(ok);recordResp('scaffold_role',ok);
  if(ok){showNamingItem();return;}
  const unk=n.unkRole==='whole'?n.whole:n.part;
  const audio=n.unkRole==='whole'?`The ${unk} bar is the full top bar — it is the whole.`:`The ${unk} bar is the filled box below — it is the part.`;
  render(`<div class="canvas">${renderModel(S.currentModel)}</div>
    <div class="instruct-text correction">${audioBtn()}<span id="instructAnim" class="typed-text"></span></div>`,
    `<div class="response-buttons"><button class="btn" onclick="submitRoleScaffold('whole')">The Whole</button><button class="btn" onclick="submitRoleScaffold('part')">The Part</button></div>`);
  speak(audio);animateText(audio,'instructAnim');
}
function showNamingItem(){
  const n=S.currentNaming;
  let correctMult,correctFrac,opts;
  if(n.unkRole==='whole'){
    correctMult=`${n.numW} times ${n.part} equals unknown`;
    correctFrac=`one ${n.fracN} of unknown equals ${n.part}`;
    opts=shuffle([correctMult,correctFrac,`one ${n.fracN} of ${n.part} equals unknown`]).slice(0,3);
  } else {
    correctFrac=`one ${n.fracN} of ${n.whole} equals unknown`;
    correctMult=`${n.numW} times unknown equals ${n.whole}`;
    opts=shuffle([correctFrac,correctMult,`${n.numW} times ${n.whole} equals unknown`]).slice(0,3);
  }
  const correct=n.unkRole==='whole'?correctMult:correctFrac;
  if(!opts.includes(correct))opts[opts.length-1]=correct;
  render(`<div class="canvas">${renderModel(S.currentModel)}</div><div class="question-prompt">What equals the unknown?</div>`,
    `<div class="response-buttons">${shuffle(opts).map(o=>`<button class="btn" onclick="submitNaming('${o.replace(/'/g,"&#39;")}')">${o}</button>`).join('')}</div>`);
  speak('What equals the unknown?');
}
function submitNaming(r){
  const n=S.currentNaming;
  const hasTimes=r.includes('times');const hasFrac=FRAC_NAMES.some(f=>r.includes(f));
  const ok=n.unkRole==='whole'
    ?(hasTimes&&cmatch(r,n.part))||(cmatch(r,n.whole)&&cmatch(r,n.part)&&(hasTimes||hasFrac))
    :(hasFrac&&cmatch(r,n.whole))||(cmatch(r,n.whole)&&cmatch(r,n.part)&&(hasTimes||hasFrac));
  recordResp('naming',ok);updateColorScaffold(ok);updateRoleScaffold(ok);
  if(ok){
    document.getElementById('responseArea').innerHTML=`<div class="instruct-text positive" style="text-align:center;font-weight:700">${randPos()}</div>`;
    setTimeout(()=>{S.namingStep++;nextNaming();},500);
    return;
  }
  S.namingItemErrors++;
  const correct=n.unkRole==='whole'?`${n.numW} times ${n.part} equals unknown`:`one ${n.fracN} of ${n.whole} equals unknown`;
  let audio;
  if(S.namingItemErrors>=2){
    audio=`The relation is: ${correct}.`;
  } else {
    audio=n.unkRole==='whole'
      ?`The unknown is the whole. Count the parts — the whole is that many times the part.`
      :`The unknown is the part. It is one ${n.fracN} of the whole.`;
  }
  render(`<div class="canvas">${renderModel(S.currentModel)}</div>
    <div class="instruct-text correction">${audioBtn()}<span id="instructAnim" class="typed-text"></span></div>`,
    `<div class="response-buttons">${shuffle([correct,n.unkRole==='whole'?`one ${n.fracN} of ${n.part} equals unknown`:`${n.numW} times ${n.whole} equals unknown`,`one ${fracName(n.d===2?3:2)} of ${n.whole} equals unknown`]).slice(0,3).map(o=>`<button class="btn" onclick="submitNaming('${o.replace(/'/g,"&#39;")}')">${o}</button>`).join('')}</div>`);
  speak(audio);animateText(audio,'instructAnim');
}

// ── Free Relation Practice ────────────────────────────────────────────────────
function showFreeIntro(){
  S.phase='free';S.freeStep=0;setPhase('Free Relations');setProgress(72);
  const audio=`Now name a relation for each picture. Say either the fractional or the multiplicative relation — both are correct.`;
  render(`<div class="instruct-text bridge" id="instructBox">${audioBtn()}<span id="instructAnim" class="typed-text"></span></div>`,
    `<div id="instructBtns" style="display:none"><button class="btn-continue" onclick="nextFree()">Ready</button></div>`);
  speak(audio);
  animateText(audio,'instructAnim',()=>{const b=document.getElementById('instructBtns');if(b)b.style.display='block';});
}
function nextFree(){
  if(S.freeStep>=S.totalFree){showComplete();return;}
  setProgress(74+(S.freeStep/S.totalFree)*22);
  S.freeModel=genFrac(null);
  showFreeItem();
}
function showFreeItem(){
  const m=S.freeModel;
  const wN=m.wholeColor.name,pN=m.partColor.name,d=m.denominator,fN=fracName(d),nW=numWord(d);
  const fracOpt=`one ${fN} of ${wN}`;
  const multOpt=`${nW} times ${pN}`;
  const wrongOpt=`one ${fracName(d===2?3:2)} of ${wN}`;
  // fracOpt and multOpt both accepted — present as 3 buttons
  const opts=shuffle([fracOpt,multOpt,wrongOpt]);
  render(`<div class="canvas">${renderFractional({...m,unknownRole:null})}</div>
    <div class="question-prompt">Name a true relation.</div>`,
    `<div class="response-buttons">${opts.map(o=>`<button class="btn" onclick="submitFree('${o.replace(/'/g,"&#39;")}')">${o}</button>`).join('')}</div>`);
  speak('Name a true relation.');
}
function submitFree(r){
  const m=S.freeModel;
  const wN=m.wholeColor.name,pN=m.partColor.name,d=m.denominator,fN=fracName(d),nW=numWord(d);
  const isFrac=cmatch(r,wN)&&r.includes(fN);
  const isMult=(cmatch(r,pN)||cmatch(r,wN))&&r.includes(nW);
  if(isFrac||isMult){
    recordResp('free',true);
    document.getElementById('responseArea').innerHTML=`<div class="instruct-text positive" style="text-align:center;font-weight:700">${randPos()}</div>`;
    setTimeout(()=>{S.freeStep++;nextFree();},500);
  } else {
    recordResp('free',false);
    const audio=`Try: one ${fN} of ${wN}, or ${nW} times ${pN}.`;
    const opts=shuffle([`one ${fN} of ${wN}`,`${nW} times ${pN}`,`one ${fracName(d===2?3:2)} of ${wN}`]);
    render(`<div class="canvas">${renderFractional({...m,unknownRole:null})}</div>
      <div class="instruct-text correction">${audioBtn()}<span id="instructAnim" class="typed-text"></span></div>`,
      `<div class="response-buttons">${opts.map(o=>`<button class="btn" onclick="submitFree('${o.replace(/'/g,"&#39;")}')">${o}</button>`).join('')}</div>`);
    speak(audio);animateText(audio,'instructAnim');
  }
}
