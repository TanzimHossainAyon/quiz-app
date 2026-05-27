// ===== QUESTIONS DATABASE =====
const allQuestions = [
  // AI & ML
  {q:"What does 'GAN' stand for in deep learning?",opts:["Generative Adversarial Network","General Algorithm Network","Gradient Analysis Node","Gaussian Adaptive Neuron"],ans:0,cat:"ai",hint:"It involves two networks competing against each other."},
  {q:"Which activation function is most commonly used in hidden layers of deep neural networks?",opts:["Sigmoid","Tanh","ReLU","Softmax"],ans:2,cat:"ai",hint:"It stands for Rectified Linear Unit."},
  {q:"What is 'overfitting' in machine learning?",opts:["Model performs well on training but poorly on new data","Model trains too slowly","Model uses too much memory","Model has too few parameters"],ans:0,cat:"ai",hint:"It's when a model memorizes instead of generalizing."},
  {q:"Which framework was developed by Facebook for deep learning?",opts:["TensorFlow","Keras","PyTorch","Theano"],ans:2,cat:"ai",hint:"Named after a famous mathematician."},
  {q:"What does 'NLP' stand for?",opts:["Neural Learning Protocol","Natural Language Processing","Network Layer Protocol","Non-Linear Processing"],ans:1,cat:"ai",hint:"It deals with understanding human language by computers."},
  {q:"What is 'transfer learning'?",opts:["Moving data between servers","Using a pre-trained model on a new task","Transferring weights to another computer","None of these"],ans:1,cat:"ai",hint:"It reuses knowledge from a previously trained model."},
  {q:"Which metric measures the quality of GAN-generated images?",opts:["Accuracy","FID Score","F1 Score","BLEU Score"],ans:1,cat:"ai",hint:"FID stands for Fréchet Inception Distance."},
  {q:"What is 'knowledge distillation'?",opts:["Extracting data from databases","Compressing a large model into a smaller one","Cleaning training data","A type of data augmentation"],ans:1,cat:"ai",hint:"A teacher model transfers knowledge to a student model."},
  // Science
  {q:"What is the speed of light in vacuum?",opts:["3×10⁸ m/s","3×10⁶ m/s","3×10¹⁰ m/s","3×10⁴ m/s"],ans:0,cat:"science",hint:"It's approximately 300,000 km per second."},
  {q:"What is the chemical formula for water?",opts:["H₂O","HO₂","H₃O","OH₂"],ans:0,cat:"science",hint:"Two hydrogen atoms and one oxygen atom."},
  {q:"What is the powerhouse of the cell?",opts:["Nucleus","Ribosome","Mitochondria","Golgi apparatus"],ans:2,cat:"science",hint:"It produces ATP for cellular energy."},
  {q:"What planet is known as the Red Planet?",opts:["Venus","Jupiter","Saturn","Mars"],ans:3,cat:"science",hint:"It's the fourth planet from the Sun."},
  {q:"What is the atomic number of Carbon?",opts:["6","8","12","14"],ans:0,cat:"science",hint:"Carbon has 6 protons in its nucleus."},
  // Technology
  {q:"What does 'HTTP' stand for?",opts:["HyperText Transfer Protocol","High Transfer Technology Protocol","Hyper Terminal Text Protocol","Host Transfer Technology Protocol"],ans:0,cat:"tech",hint:"It's the foundation of data communication on the Web."},
  {q:"What does 'CPU' stand for?",opts:["Central Processing Unit","Computer Primary Unit","Core Processing Utility","Central Program Unit"],ans:0,cat:"tech",hint:"It's the brain of the computer."},
  {q:"Which company developed the Python programming language?",opts:["Google","Microsoft","Guido van Rossum (PSF)","Apple"],ans:2,cat:"tech",hint:"It was created by a Dutch programmer in 1991."},
  {q:"What does 'API' stand for?",opts:["Application Programming Interface","Automated Program Integration","Application Process Integration","Advanced Protocol Interface"],ans:0,cat:"tech",hint:"It allows different software to communicate."},
  {q:"Which language is primarily used for web styling?",opts:["HTML","JavaScript","CSS","PHP"],ans:2,cat:"tech",hint:"Cascading Style Sheets."},
  // Mathematics
  {q:"What is the value of π (pi) to 2 decimal places?",opts:["3.14","3.16","3.12","3.18"],ans:0,cat:"math",hint:"It's the ratio of circumference to diameter of a circle."},
  {q:"What is the derivative of x²?",opts:["x","2x","x²","2x²"],ans:1,cat:"math",hint:"Use the power rule: bring down the exponent."},
  {q:"What is the Fibonacci sequence?",opts:["1,2,4,8,16","1,1,2,3,5,8","1,3,5,7,9","2,4,6,8,10"],ans:1,cat:"math",hint:"Each number is the sum of the two preceding ones."},
  {q:"What is the square root of 144?",opts:["11","12","13","14"],ans:1,cat:"math",hint:"12 × 12 = ?"},
  // General
  {q:"How many bytes are in one kilobyte?",opts:["100","512","1024","2048"],ans:2,cat:"general",hint:"It's a power of 2: 2¹⁰"},
  {q:"What year was the World Wide Web invented?",opts:["1969","1989","1995","2001"],ans:1,cat:"general",hint:"It was invented by Tim Berners-Lee."},
  {q:"What is the capital of Bangladesh?",opts:["Chittagong","Sylhet","Rajshahi","Dhaka"],ans:3,cat:"general",hint:"It's located along the Buriganga River."},
  {q:"How many bits are in one byte?",opts:["4","8","16","32"],ans:1,cat:"general",hint:"It's the standard unit of digital information."},
];

// ===== STATE =====
let state = {
  questions: [], currentQ: 0, score: 0,
  correct: 0, wrong: 0, hints: 3,
  selectedCat: 'all', answered: false,
  timer: null, timeLeft: 15,
  times: [], streak: 0, bestStreak: 0,
  startTime: 0
};

// ===== CANVAS =====
const canvas = document.getElementById('bg');
const ctx = canvas.getContext('2d');
let W, H, pts = [], mouse = {x:0, y:0};
function resize(){W=canvas.width=window.innerWidth;H=canvas.height=window.innerHeight;}
resize(); window.addEventListener('resize', resize);
class Pt {
  constructor(){this.reset(true);}
  reset(init){
    this.x=Math.random()*W; this.y=init?Math.random()*H:H+10;
    this.r=Math.random()*1.2+0.3; this.vx=(Math.random()-0.5)*0.3;
    this.vy=-Math.random()*0.4-0.1; this.op=Math.random()*0.4+0.1;
    this.c=['#4f8ef7','#00e5ff','#a855f7'][Math.floor(Math.random()*3)];
    this.life=Math.random()*300+100; this.age=0;
  }
  update(){
    this.x+=this.vx; this.y+=this.vy; this.age++;
    let dx=this.x-mouse.x,dy=this.y-mouse.y,d=Math.sqrt(dx*dx+dy*dy);
    if(d<120){this.x+=dx/d*1;this.y+=dy/d*1;}
    if(this.y<-10||this.age>this.life)this.reset(false);
  }
  draw(){
    ctx.beginPath();ctx.arc(this.x,this.y,this.r,0,Math.PI*2);
    ctx.fillStyle=this.c;ctx.globalAlpha=this.op*(1-this.age/this.life);ctx.fill();
  }
}
for(let i=0;i<150;i++) pts.push(new Pt());
function animBg(){
  ctx.clearRect(0,0,W,H);
  pts.forEach(p=>{p.update();p.draw();});
  ctx.globalAlpha=1; requestAnimationFrame(animBg);
}
animBg();
document.addEventListener('mousemove',e=>{mouse.x=e.clientX;mouse.y=e.clientY;});

// ===== CURSOR =====
const cur=document.getElementById('cur'), ring=document.getElementById('cur-ring');
let mx=0,my=0,tx=0,ty=0;
document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;cur.style.left=mx+'px';cur.style.top=my+'px';});
function animCur(){tx+=(mx-tx)*0.1;ty+=(my-ty)*0.1;ring.style.left=tx+'px';ring.style.top=ty+'px';requestAnimationFrame(animCur);}
animCur();
document.querySelectorAll('button').forEach(el=>{
  el.addEventListener('mouseenter',()=>{cur.style.transform='translate(-50%,-50%) scale(2)';ring.style.transform='translate(-50%,-50%) scale(1.6)';});
  el.addEventListener('mouseleave',()=>{cur.style.transform='translate(-50%,-50%)';ring.style.transform='translate(-50%,-50%)';});
});

// ===== QUIZ LOGIC =====
function showScreen(id){
  document.querySelectorAll('.screen').forEach(s=>{s.classList.remove('active');s.style.display='none';});
  const el=document.getElementById(id);
  el.style.display='flex'; el.classList.add('active');
}

function selectCat(btn){
  document.querySelectorAll('.cat-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  state.selectedCat = btn.dataset.cat;
}

function startQuiz(){
  let pool = state.selectedCat==='all' ? allQuestions : allQuestions.filter(q=>q.cat===state.selectedCat);
  state.questions = shuffle([...pool]).slice(0,10);
  state.currentQ=0; state.score=0; state.correct=0; state.wrong=0;
  state.hints=3; state.times=[]; state.streak=0; state.bestStreak=0;
  showScreen('quiz-screen');
  loadQuestion();
}

function shuffle(arr){return arr.sort(()=>Math.random()-0.5);}

function loadQuestion(){
  if(state.currentQ >= state.questions.length){showResult();return;}
  const q = state.questions[state.currentQ];
  state.answered = false;
  state.startTime = Date.now();

  // Update UI
  document.getElementById('q-num').textContent = `Question ${state.currentQ+1}`;
  document.getElementById('q-cat').textContent = q.cat.toUpperCase();
  document.getElementById('progress').style.width = `${(state.currentQ/state.questions.length)*100}%`;
  document.getElementById('progress-txt').textContent = `${state.currentQ}/${state.questions.length}`;
  document.getElementById('score-val').textContent = state.score;
  document.getElementById('hints-left').textContent = `(${state.hints} left)`;
  document.getElementById('hint-btn').disabled = state.hints <= 0;

  // Question
  const qCard = document.getElementById('q-card');
  qCard.style.animation='none'; qCard.offsetHeight;
  qCard.style.animation='screen-in 0.4s ease';
  document.getElementById('question-text').textContent = q.q;

  // Options
  const optContainer = document.getElementById('options');
  optContainer.innerHTML='';
  const shuffledOpts = q.opts.map((o,i)=>({text:o,idx:i})).sort(()=>Math.random()-0.5);
  shuffledOpts.forEach((opt,i)=>{
    const btn = document.createElement('button');
    btn.className='option-btn';
    btn.textContent=`${['A','B','C','D'][i]}. ${opt.text}`;
    btn.dataset.idx = opt.idx;
    btn.onclick = ()=>selectAnswer(btn, opt.idx, q.ans);
    btn.style.animationDelay=`${i*0.08}s`;
    btn.style.animation='screen-in 0.4s ease both';
    optContainer.appendChild(btn);
  });

  startTimer();
}

function startTimer(){
  clearInterval(state.timer);
  state.timeLeft=15;
  document.getElementById('timer-num').textContent=15;
  document.getElementById('timer-circle').style.strokeDashoffset=0;

  state.timer=setInterval(()=>{
    state.timeLeft--;
    document.getElementById('timer-num').textContent=state.timeLeft;
    const offset=163*(1-state.timeLeft/15);
    document.getElementById('timer-circle').style.strokeDashoffset=offset;
    if(state.timeLeft<=5) document.getElementById('timer-num').style.color='#ef4444';
    else document.getElementById('timer-num').style.color='var(--txt)';
    if(state.timeLeft<=0){
      clearInterval(state.timer);
      if(!state.answered) timeUp();
    }
  },1000);
}

function selectAnswer(btn, chosen, correct){
  if(state.answered) return;
  state.answered=true;
  clearInterval(state.timer);
  const elapsed=(Date.now()-state.startTime)/1000;
  state.times.push(elapsed);

  const allBtns=document.querySelectorAll('.option-btn');
  allBtns.forEach(b=>b.disabled=true);

  if(chosen===correct){
    btn.classList.add('correct');
    const timeBonus=Math.max(0,Math.round((state.timeLeft/15)*50));
    const pts=100+timeBonus;
    state.score+=pts;
    state.correct++;
    state.streak++;
    if(state.streak>state.bestStreak) state.bestStreak=state.streak;
    showToast(`✅ Correct! +${pts} pts ${timeBonus>0?'(+'+timeBonus+' speed bonus)':''}`,'green');
    // Highlight correct answer
    allBtns.forEach(b=>{if(parseInt(b.dataset.idx)===correct) b.classList.add('correct');});
  } else {
    btn.classList.add('wrong');
    state.wrong++;
    state.streak=0;
    allBtns.forEach(b=>{if(parseInt(b.dataset.idx)===correct) b.classList.add('correct');});
    showToast('❌ Wrong! The correct answer is highlighted.','red');
  }
  document.getElementById('score-val').textContent=state.score;
  setTimeout(()=>{state.currentQ++;loadQuestion();},1800);
}

function timeUp(){
  state.streak=0;
  const allBtns=document.querySelectorAll('.option-btn');
  const q=state.questions[state.currentQ];
  allBtns.forEach(b=>{b.disabled=true;if(parseInt(b.dataset.idx)===q.ans) b.classList.add('correct');});
  showToast("⏰ Time's up!",'purple');
  setTimeout(()=>{state.currentQ++;loadQuestion();},1800);
}

function useHint(){
  if(state.hints<=0||state.answered) return;
  const q=state.questions[state.currentQ];
  state.hints--;
  document.getElementById('hints-left').textContent=`(${state.hints} left)`;
  if(state.hints<=0) document.getElementById('hint-btn').disabled=true;
  showToast(`💡 Hint: ${q.hint}`,'yellow');
}

function skipQuestion(){
  clearInterval(state.timer);
  state.streak=0;
  state.currentQ++;
  loadQuestion();
}

function showToast(msg, color){
  const existing=document.querySelector('.toast');
  if(existing) existing.remove();
  const t=document.createElement('div');
  t.className='toast';
  t.textContent=msg;
  const colors={green:'rgba(16,185,129,0.15)',red:'rgba(239,68,68,0.1)',purple:'rgba(168,85,247,0.1)',yellow:'rgba(245,158,11,0.1)'};
  const borders={green:'rgba(16,185,129,0.3)',red:'rgba(239,68,68,0.25)',purple:'rgba(168,85,247,0.25)',yellow:'rgba(245,158,11,0.25)'};
  t.style.background=colors[color]||colors.green;
  t.style.borderColor=borders[color]||borders.green;
  document.body.appendChild(t);
  setTimeout(()=>t.remove(),2000);
}

function showResult(){
  clearInterval(state.timer);
  showScreen('result-screen');
  const pct=Math.round((state.correct/state.questions.length)*100);
  const avgTime=state.times.length?Math.round(state.times.reduce((a,b)=>a+b,0)/state.times.length):0;

  let emoji='🏆',title='Excellent!',msg='Outstanding performance!';
  if(pct>=90){emoji='🏆';title='Legendary!';msg='You are a quiz master!';}
  else if(pct>=70){emoji='🎯';title='Great Job!';msg='Impressive knowledge!';}
  else if(pct>=50){emoji='👍';title='Good Effort!';msg='Keep practicing!';}
  else{emoji='💪';title='Keep Going!';msg='Practice makes perfect!';}

  document.getElementById('result-emoji').textContent=emoji;
  document.getElementById('result-title').textContent=title;
  document.getElementById('result-msg').textContent=msg;
  document.getElementById('r-score').textContent=state.score;
  document.getElementById('r-correct').textContent=`${state.correct}/${state.questions.length}`;
  document.getElementById('r-time').textContent=`${avgTime}s`;
  document.getElementById('r-streak').textContent=state.bestStreak;
  document.getElementById('result-pct').textContent=`${pct}%`;

  setTimeout(()=>{
    document.getElementById('result-bar-fill').style.width=`${pct}%`;
  },300);

  if(pct>=70) launchConfetti();
}

function launchConfetti(){
  const colors=['#4f8ef7','#00e5ff','#a855f7','#f472b6','#10b981','#f59e0b'];
  for(let i=0;i<80;i++){
    setTimeout(()=>{
      const c=document.createElement('div');
      c.className='confetti-piece';
      c.style.left=Math.random()*100+'vw';
      c.style.background=colors[Math.floor(Math.random()*colors.length)];
      c.style.animationDuration=(2+Math.random()*2)+'s';
      c.style.animationDelay=(Math.random()*0.5)+'s';
      c.style.width=c.style.height=(6+Math.random()*6)+'px';
      document.body.appendChild(c);
      setTimeout(()=>c.remove(),4000);
    },i*30);
  }
}

function restartQuiz(){startQuiz();}
function goHome(){showScreen('start-screen');}

// ===== MUSIC =====
let musicPlaying = false;
const music = document.getElementById('bg-music');
music.volume = 0.25;

function toggleMusic(){
  const btn = document.getElementById('music-btn');
  if(musicPlaying){
    music.pause();
    btn.textContent = '🎵';
    btn.classList.remove('playing');
    musicPlaying = false;
  } else {
    music.play().catch(()=>{});
    btn.textContent = '🔊';
    btn.classList.add('playing');
    musicPlaying = true;
  }
}

// Auto-start music on first interaction
document.addEventListener('click', function autoPlay(){
  if(!musicPlaying){
    music.play().then(()=>{
      document.getElementById('music-btn').textContent='🔊';
      document.getElementById('music-btn').classList.add('playing');
      musicPlaying=true;
    }).catch(()=>{});
  }
  document.removeEventListener('click', autoPlay);
}, {once:true});
