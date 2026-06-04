(function(){
  "use strict";

  /* ---------------- state ---------------- */
  var current = 0;
  var answered = false;
  var visited = {0:true};
  var selectedDate = null;     // a Date object
  var selectedTime = null;     // e.g. "8 PM"
  var selectedCuisine = null;  // e.g. "Mexican"
  var TOTAL = 4;
  var cuisineEmoji = { "Italian":"🍝","Chinese":"🥡","Indian":"🍛","Mexican":"🌮","Thai":"🍜","American Fast Food":"🍔" };

  /* OPTIONAL backend hook. If you run the server in /server, her final answer
     gets POSTed here so you can see what she picked. On a plain static host
     (Netlify, tiiny.host, GitHub Pages) there is no server, so this request
     simply fails and is ignored — the app still works perfectly. */
  var API_ENDPOINT = '/api/response';
  var responseSent = false;

  /* ---------------- element refs ---------------- */
  var screens = document.querySelectorAll('.screen');
  var steps   = document.querySelectorAll('.step');
  var track   = document.querySelector('.progress .track');
  var fill    = document.getElementById('progressFill');
  var card    = document.querySelector('.app');

  var yesBtn  = document.getElementById('yesBtn');
  var noBtn   = document.getElementById('noBtn');
  var answerRow = document.getElementById('answerRow');
  var yesReveal = document.getElementById('yesReveal');
  var qEmoji  = document.querySelector('.q-emoji');

  var next0 = document.getElementById('next0');
  var next1 = document.getElementById('next1');
  var next2 = document.getElementById('next2');

  var dayBtn  = document.getElementById('dayBtn');
  var dayText = document.getElementById('dayText');
  var timeGrid= document.getElementById('timeGrid');
  var cuisineGrid = document.getElementById('cuisineGrid');

  var notedBtn = document.getElementById('notedBtn');
  var exitBtn  = document.getElementById('exitBtn');
  var sumWhen  = document.getElementById('sumWhen');
  var sumFood  = document.getElementById('sumFood');

  /* ---------------- floating hearts ---------------- */
  (function(){
    var bg = document.getElementById('bgHearts');
    var chars = ['💕','💖','💗','💞','✨','🌸'];
    for(var i=0;i<18;i++){
      var s = document.createElement('span');
      s.textContent = chars[i % chars.length];
      s.style.left = (Math.random()*100) + 'vw';
      s.style.fontSize = (12 + Math.random()*22) + 'px';
      s.style.animationDuration = (9 + Math.random()*10) + 's';
      s.style.animationDelay = (-Math.random()*16) + 's';
      s.style.opacity = (0.25 + Math.random()*0.5).toFixed(2);
      bg.appendChild(s);
    }
  })();

  /* ---------------- confetti / party poppers ---------------- */
  var cvs = document.getElementById('confetti');
  var ctx = cvs.getContext('2d');
  var parts = [];
  var raf = null;
  var colors = ['#ff4d8d','#ffd166','#c77dff','#06d6a0','#ff8fab','#ffffff','#ffb24d'];

  function sizeCanvas(){ cvs.width = window.innerWidth; cvs.height = window.innerHeight; }
  sizeCanvas();
  window.addEventListener('resize', function(){ sizeCanvas(); positionFill(); });

  function burst(x, y, count, baseAngle, spread, power){
    for(var i=0;i<count;i++){
      var ang = baseAngle + (Math.random()-0.5)*spread;
      var sp  = power*(0.5 + Math.random()*0.7);
      parts.push({
        x:x, y:y,
        vx: Math.cos(ang)*sp,
        vy: Math.sin(ang)*sp,
        g: 0.16 + Math.random()*0.12,
        size: 6 + Math.random()*9,
        color: colors[(Math.random()*colors.length)|0],
        rot: Math.random()*Math.PI*2,
        vr: (Math.random()-0.5)*0.3,
        life: 1,
        fade: 0.006 + Math.random()*0.006,
        shape: Math.random()<0.5 ? 'rect' : 'circ'
      });
    }
    if(!raf) loop();
  }

  function fireConfetti(){
    var W = window.innerWidth, H = window.innerHeight;
    // bottom-left popper aiming up-right
    burst(40, H-20, 90, -Math.PI/3, Math.PI/3.2, 17);
    // bottom-right popper aiming up-left
    burst(W-40, H-20, 90, -2*Math.PI/3, Math.PI/3.2, 17);
    // a celebratory pop near the middle, slightly later
    setTimeout(function(){ burst(W/2, H*0.5, 70, -Math.PI/2, Math.PI*2, 12); }, 160);
  }

  function loop(){
    ctx.clearRect(0,0,cvs.width,cvs.height);
    for(var i=0;i<parts.length;i++){
      var p = parts[i];
      p.vy += p.g; p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.life -= p.fade;
      ctx.save();
      ctx.globalAlpha = Math.max(p.life, 0);
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      if(p.shape === 'rect'){ ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size*0.6); }
      else { ctx.beginPath(); ctx.arc(0,0,p.size/2,0,Math.PI*2); ctx.fill(); }
      ctx.restore();
    }
    parts = parts.filter(function(p){ return p.life > 0 && p.y < cvs.height + 60; });
    if(parts.length){ raf = requestAnimationFrame(loop); }
    else { raf = null; ctx.clearRect(0,0,cvs.width,cvs.height); }
  }

  /* ---------------- progress ---------------- */
  function positionFill(){
    var w = track.clientWidth;
    fill.style.width = (current/(TOTAL-1)) * w + 'px';
  }
  function updateProgress(){
    for(var i=0;i<steps.length;i++){
      var idx = +steps[i].getAttribute('data-step');
      steps[i].classList.toggle('done', !!visited[idx]);
      steps[i].classList.toggle('current', idx === current);
    }
    positionFill();
  }

  /* ---------------- navigation ---------------- */
  function goTo(index){
    if(index < 0 || index >= TOTAL) return;
    current = index;
    visited[index] = true;
    for(var i=0;i<screens.length;i++){
      screens[i].classList.toggle('active', +screens[i].getAttribute('data-screen') === index);
    }
    if(index === 3){ fillSummary(); sendResponse(); }
    updateProgress();
    try{ window.scrollTo({top:0, behavior:'smooth'}); }catch(e){ window.scrollTo(0,0); }
  }

  document.querySelectorAll('.back-btn').forEach(function(b){
    b.addEventListener('click', function(){ goTo(Math.max(0, current-1)); });
  });
  next0.addEventListener('click', function(){ goTo(1); });
  next1.addEventListener('click', function(){ goTo(2); });
  next2.addEventListener('click', function(){ goTo(3); });

  function enable(btn){ btn.disabled = false; btn.classList.add('ready'); }

  /* ---------------- screen 0 : Yes / No ---------------- */
  var taunts = ['No','Nope!','Try again 😜','Catch me!','Not today!','Hehe~','Nuh-uh 💨','Keep trying!'];
  var tauntIdx = 0;

  function moveNo(){
    var pad = 12;
    var cw = card.clientWidth, ch = card.clientHeight;
    var w = noBtn.offsetWidth, h = noBtn.offsetHeight;
    var maxX = Math.max(pad, cw - w - pad);
    var maxY = Math.max(pad, ch - h - pad);
    var x = pad + Math.random()*(maxX - pad);
    var y = pad + Math.random()*(maxY - pad);
    noBtn.style.left = x + 'px';
    noBtn.style.top  = y + 'px';
    tauntIdx = (tauntIdx+1) % taunts.length;
    noBtn.textContent = taunts[tauntIdx];
  }
  function dodge(){
    if(answered || current !== 0) return;
    if(!noBtn.classList.contains('loose')){
      // capture the button's current spot relative to the card so it doesn't jump
      var br = noBtn.getBoundingClientRect();
      var cr = card.getBoundingClientRect();
      noBtn.style.left = (br.left - cr.left) + 'px';
      noBtn.style.top  = (br.top  - cr.top)  + 'px';
      noBtn.classList.add('loose');
      void noBtn.offsetWidth;            // force reflow so the move animates smoothly
      requestAnimationFrame(moveNo);
    } else {
      moveNo();
    }
  }
  noBtn.addEventListener('mouseenter', dodge);
  noBtn.addEventListener('click', function(e){ e.preventDefault(); dodge(); });
  noBtn.addEventListener('touchstart', function(e){ e.preventDefault(); dodge(); }, {passive:false});
  // desktop proximity: dodge when the cursor gets close
  document.addEventListener('mousemove', function(e){
    if(answered || current !== 0) return;
    var r = noBtn.getBoundingClientRect();
    var cx = r.left + r.width/2, cy = r.top + r.height/2;
    if(Math.hypot(e.clientX - cx, e.clientY - cy) < 95) dodge();
  });

  yesBtn.addEventListener('click', function(){
    if(answered) return;
    answered = true;
    if(qEmoji) qEmoji.textContent = '🥰💕';
    answerRow.style.display = 'none';
    noBtn.style.display = 'none';
    yesReveal.hidden = false;
    yesReveal.classList.add('show');
    fireConfetti();
    enable(next0);
  });

  /* ---------------- screen 1 : day + time ---------------- */
  function checkWhen(){
    var ok = !!(selectedDate && selectedTime);
    if(ok && next1.disabled) enable(next1);
    next1.disabled = !ok;
  }

  Array.prototype.forEach.call(timeGrid.querySelectorAll('.opt'), function(btn){
    btn.addEventListener('click', function(){
      Array.prototype.forEach.call(timeGrid.querySelectorAll('.opt'), function(b){ b.classList.remove('sel'); });
      btn.classList.add('sel');
      selectedTime = btn.getAttribute('data-time');
      checkWhen();
    });
  });

  /* ---------------- screen 2 : cuisine ---------------- */
  Array.prototype.forEach.call(cuisineGrid.querySelectorAll('.opt'), function(btn){
    btn.addEventListener('click', function(){
      Array.prototype.forEach.call(cuisineGrid.querySelectorAll('.opt'), function(b){ b.classList.remove('sel'); });
      btn.classList.add('sel');
      selectedCuisine = btn.getAttribute('data-cuisine');
      if(next2.disabled) enable(next2);
      next2.disabled = false;
    });
  });

  /* ---------------- calendar ---------------- */
  var calOverlay = document.getElementById('calOverlay');
  var calCard = document.getElementById('calCard');
  var calGrid = document.getElementById('calGrid');
  var calTitle= document.getElementById('calTitle');
  var calPrev = document.getElementById('calPrev');
  var calNext = document.getElementById('calNext');
  var calClose= document.getElementById('calClose');
  var calY, calM;

  function startOfToday(){ var t = new Date(); t.setHours(0,0,0,0); return t; }

  function renderCal(){
    calGrid.innerHTML = '';
    var wd = ['S','M','T','W','T','F','S'];
    for(var i=0;i<7;i++){ var h=document.createElement('div'); h.className='cal-wd'; h.textContent=wd[i]; calGrid.appendChild(h); }

    var first = new Date(calY, calM, 1).getDay();
    var days  = new Date(calY, calM+1, 0).getDate();
    for(var e=0;e<first;e++){ var blank=document.createElement('div'); calGrid.appendChild(blank); }

    var today = startOfToday();
    for(var day=1; day<=days; day++){
      (function(day){
        var cell = document.createElement('button');
        cell.className = 'cal-day';
        cell.textContent = day;
        var d = new Date(calY, calM, day);
        if(d < today){ cell.disabled = true; cell.classList.add('past'); }
        if(selectedDate && d.getTime() === selectedDate.getTime()){ cell.classList.add('sel'); }
        cell.addEventListener('click', function(){
          selectedDate = d;
          updateDayText();
          closeCal();
          checkWhen();
        });
        calGrid.appendChild(cell);
      })(day);
    }

    calTitle.textContent = new Date(calY, calM, 1).toLocaleDateString(undefined, {month:'long', year:'numeric'});
    var t = startOfToday();
    calPrev.disabled = (calY < t.getFullYear()) || (calY === t.getFullYear() && calM <= t.getMonth());
  }

  function updateDayText(){
    dayText.textContent = selectedDate.toLocaleDateString(undefined, {weekday:'long', month:'long', day:'numeric'});
    dayBtn.classList.add('chosen');
  }
  function openCal(){
    var base = selectedDate || new Date();
    calY = base.getFullYear(); calM = base.getMonth();
    renderCal();
    calOverlay.classList.add('show');
  }
  function closeCal(){ calOverlay.classList.remove('show'); }

  dayBtn.addEventListener('click', openCal);
  calClose.addEventListener('click', closeCal);
  calOverlay.addEventListener('click', function(e){ if(e.target === calOverlay) closeCal(); });
  calCard.addEventListener('click', function(e){ e.stopPropagation(); });
  calPrev.addEventListener('click', function(){ calM--; if(calM<0){ calM=11; calY--; } renderCal(); });
  calNext.addEventListener('click', function(){ calM++; if(calM>11){ calM=0; calY++; } renderCal(); });

  /* ---------------- final screen ---------------- */
  function fillSummary(){
    if(selectedDate && selectedTime){
      sumWhen.textContent = selectedDate.toLocaleDateString(undefined, {weekday:'long', month:'long', day:'numeric'}) + '  ·  ' + selectedTime;
    }
    if(selectedCuisine){
      sumFood.textContent = selectedCuisine + ' ' + (cuisineEmoji[selectedCuisine] || '');
    }
  }

  function sendResponse(){
    if(responseSent) return;
    responseSent = true;
    try{
      fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answer: 'Yes 💖',
          date: selectedDate ? selectedDate.toDateString() : null,
          time: selectedTime,
          cuisine: selectedCuisine,
          at: new Date().toISOString()
        })
      }).catch(function(){ /* no backend running — that's fine, ignore */ });
    }catch(e){ /* ignore */ }
  }

  notedBtn.addEventListener('click', function(){
    notedBtn.textContent = 'Noted 💖';
    enable(exitBtn);
    exitBtn.disabled = false;
  });

  var exitOverlay = document.getElementById('exitOverlay');
  document.getElementById('closeTabBtn').addEventListener('click', function(){ try{ window.close(); }catch(e){} });
  exitBtn.addEventListener('click', function(){
    if(exitBtn.disabled) return;
    exitOverlay.classList.add('show');
    fireConfetti();
    try{ window.close(); }catch(e){}
  });

  /* ---------------- init ---------------- */
  updateProgress();
})();
