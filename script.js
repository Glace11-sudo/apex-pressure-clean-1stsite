  document.getElementById('year').textContent = new Date().getFullYear();

  var navToggle = document.getElementById('navToggle');
  var navLinks = document.getElementById('navLinks');
  navToggle.addEventListener('click', function(){
    var open = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  navLinks.querySelectorAll('a').forEach(function(a){
    a.addEventListener('click', function(){ navLinks.classList.remove('open'); });
  });

  function mulberry32(seed){
    return function(){
      seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
      var t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /* ---------- before/after slider ---------- */
  (function(){
    var slider = document.getElementById('slider');
    var cvBefore = document.getElementById('layer-before');
    var cvAfter = document.getElementById('layer-after');
    var split = 46;

    function setSplit(pct){
      split = Math.max(8, Math.min(92, pct));
      slider.style.setProperty('--split', split + '%');
    }
    setSplit(split);

    function pctFromEvent(clientX){
      var r = slider.getBoundingClientRect();
      return ((clientX - r.left) / r.width) * 100;
    }
    var dragging = false;
    slider.addEventListener('pointerdown', function(e){
      dragging = true;
      slider.setPointerCapture(e.pointerId);
      setSplit(pctFromEvent(e.clientX));
    });
    slider.addEventListener('pointermove', function(e){
      if(!dragging) return;
      setSplit(pctFromEvent(e.clientX));
    });
    ['pointerup','pointercancel','pointerleave'].forEach(function(ev){
      slider.addEventListener(ev, function(){ dragging = false; });
    });

    function sizeCanvas(cv, container){
      var r = container.getBoundingClientRect();
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = r.width * dpr;
      cv.height = r.height * dpr;
      var ctx = cv.getContext('2d');
      ctx.setTransform(dpr,0,0,dpr,0,0);
      return { ctx: ctx, w: r.width, h: r.height };
    }

    function drawGrime(cv){
      var d = sizeCanvas(cv, slider), ctx = d.ctx, w = d.w, h = d.h;
      var rand = mulberry32(7);
      ctx.fillStyle = '#9a9186';
      ctx.fillRect(0,0,w,h);
      ctx.strokeStyle = 'rgba(60,54,40,0.18)';
      ctx.lineWidth = 1;
      var cell = w / 6;
      for(var x=0;x<=w;x+=cell){ ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,h); ctx.stroke(); }
      for(var y=0;y<=h;y+=cell){ ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(w,y); ctx.stroke(); }
      for(var i=0;i<140;i++){
        var gx = rand()*w, gy = rand()*h, gr = rand()*rand()*26+3;
        var tone = rand();
        ctx.fillStyle = tone < .5
          ? 'rgba(90,74,40,' + (0.10 + rand()*0.22) + ')'
          : 'rgba(60,66,44,' + (0.08 + rand()*0.18) + ')';
        ctx.beginPath(); ctx.ellipse(gx,gy,gr,gr*(0.6+rand()*0.5),rand()*Math.PI,0,Math.PI*2); ctx.fill();
      }
      for(var s=0;s<3;s++){
        var sx = w*(0.2+rand()*0.6), sy = h*(0.3+rand()*0.5);
        var grad = ctx.createRadialGradient(sx,sy,0,sx,sy,50);
        grad.addColorStop(0,'rgba(20,18,14,0.5)');
        grad.addColorStop(1,'rgba(20,18,14,0)');
        ctx.fillStyle = grad;
        ctx.beginPath(); ctx.ellipse(sx,sy,50,26,rand()*Math.PI,0,Math.PI*2); ctx.fill();
      }
      ctx.fillStyle = 'rgba(18,16,12,0.14)';
      ctx.fillRect(0,0,w,h);
    }

    function drawClean(cv){
      var d = sizeCanvas(cv, slider), ctx = d.ctx, w = d.w, h = d.h;
      var grad = ctx.createLinearGradient(0,0,w,h);
      grad.addColorStop(0,'#eaf3fd');
      grad.addColorStop(1,'#cfe6fb');
      ctx.fillStyle = grad;
      ctx.fillRect(0,0,w,h);
      ctx.strokeStyle = 'rgba(255,255,255,0.55)';
      ctx.lineWidth = 1;
      var cell = w / 6;
      for(var x=0;x<=w;x+=cell){ ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,h); ctx.stroke(); }
      for(var y=0;y<=h;y+=cell){ ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(w,y); ctx.stroke(); }
      var sheen = ctx.createLinearGradient(0,0,w,h);
      sheen.addColorStop(0.35,'rgba(255,255,255,0)');
      sheen.addColorStop(0.48,'rgba(255,255,255,0.6)');
      sheen.addColorStop(0.55,'rgba(255,255,255,0)');
      ctx.fillStyle = sheen;
      ctx.fillRect(0,0,w,h);
      var rand = mulberry32(23);
      for(var i=0;i<26;i++){
        var dx = rand()*w, dy = rand()*h, dr = rand()*2+0.6;
        ctx.fillStyle = 'rgba(4,126,242,' + (0.18+rand()*0.25) + ')';
        ctx.beginPath(); ctx.arc(dx,dy,dr,0,Math.PI*2); ctx.fill();
      }
    }

    function render(){ drawGrime(cvBefore); drawClean(cvAfter); }
    render();
    window.addEventListener('resize', render);
  })();

  /* ---------- service-area canvas ---------- */
  (function(){
    var wrap = document.querySelector('.area-canvas-wrap');
    var cv = document.getElementById('areaMap');
    var points = [
      {x:.5, y:.52, r:16, label:'PG'},
      {x:.68, y:.62, r:10, label:'AA'},
      {x:.32, y:.28, r:10, label:'MC'},
      {x:.24, y:.68, r:10, label:'CC'},
      {x:.55, y:.30, r:9,  label:'DC'}
    ];
    function draw(){
      var r = wrap.getBoundingClientRect();
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      var w = r.width - 32, h = w * 0.75;
      cv.width = w*dpr; cv.height = h*dpr;
      cv.style.width = w+'px'; cv.style.height = h+'px';
      var ctx = cv.getContext('2d');
      ctx.setTransform(dpr,0,0,dpr,0,0);
      ctx.clearRect(0,0,w,h);
      var styles = getComputedStyle(document.documentElement);
      var sky = styles.getPropertyValue('--sky-tint').trim();
      var blue = styles.getPropertyValue('--blue').trim();
      var blueDeep = styles.getPropertyValue('--blue-deep').trim();
      var lime = styles.getPropertyValue('--lime').trim();
      var limeInk = styles.getPropertyValue('--lime-ink').trim();
      ctx.fillStyle = sky;
      ctx.fillRect(0,0,w,h);
      // connective lines from HQ
      var hq = points[0];
      points.slice(1).forEach(function(p){
        ctx.beginPath();
        ctx.moveTo(hq.x*w, hq.y*h);
        ctx.lineTo(p.x*w, p.y*h);
        ctx.strokeStyle = blue; ctx.globalAlpha = .35; ctx.lineWidth = 1.5;
        ctx.stroke(); ctx.globalAlpha = 1;
      });
      points.forEach(function(p, i){
        var isHQ = i === 0;
        ctx.beginPath();
        ctx.arc(p.x*w, p.y*h, p.r, 0, Math.PI*2);
        ctx.fillStyle = isHQ ? lime : blueDeep;
        ctx.fill();
        ctx.fillStyle = isHQ ? limeInk : '#fff';
        ctx.font = '700 9px ' + getComputedStyle(document.body).fontFamily;
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(p.label, p.x*w, p.y*h);
      });
    }
    draw();
    window.addEventListener('resize', draw);
    if(window.matchMedia){
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', draw);
    }
  })();

  /* ---------- booking wizard ---------- */
  (function(){
    var state = { service:null, date:null, dateLabel:null, time:null, name:'', phone:'', address:'', notes:'' };
    var steps = document.querySelectorAll('.bstep');
    var panes = document.querySelectorAll('.bpane');

    function goTo(n){
      steps.forEach(function(s){
        var sn = +s.dataset.step;
        s.classList.toggle('active', sn === n);
        s.classList.toggle('done', sn < n);
      });
      panes.forEach(function(p){ p.classList.toggle('active', +p.dataset.pane === n); });
    }
    document.querySelectorAll('[data-back]').forEach(function(b){
      b.addEventListener('click', function(){ goTo(+b.dataset.back); });
    });

    // Step 1
    document.querySelectorAll('#servicePick input').forEach(function(r){
      r.addEventListener('change', function(){
        state.service = r.value;
        document.getElementById('toStep2').disabled = false;
      });
    });
    document.getElementById('toStep2').addEventListener('click', function(){ goTo(2); });

    // Step 2: calendar
    var calGrid = document.getElementById('calGrid');
    var calMonth = document.getElementById('calMonth');
    var slotGrid = document.getElementById('slotGrid');
    var slotsLabel = document.getElementById('slotsLabel');
    var today = new Date(); today.setHours(0,0,0,0);
    var viewYear = today.getFullYear(), viewMonth = today.getMonth();
    var dow = ['Su','Mo','Tu','We','Th','Fr','Sa'];

    function renderCalendar(){
      calGrid.innerHTML = '';
      dow.forEach(function(d){
        var el = document.createElement('div');
        el.className = 'cal-dow'; el.textContent = d;
        calGrid.appendChild(el);
      });
      var first = new Date(viewYear, viewMonth, 1);
      var startOffset = first.getDay();
      var daysInMonth = new Date(viewYear, viewMonth+1, 0).getDate();
      calMonth.textContent = first.toLocaleDateString(undefined, {month:'long', year:'numeric'});

      for(var i=0;i<startOffset;i++){
        var pad = document.createElement('div');
        pad.className = 'cal-day muted';
        calGrid.appendChild(pad);
      }
      for(var day=1; day<=daysInMonth; day++){
        var d = new Date(viewYear, viewMonth, day);
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'cal-day';
        btn.textContent = day;
        var isPast = d < today;
        var isSunday = d.getDay() === 0;
        if(isPast){ btn.classList.add('past'); btn.disabled = true; }
        else if(isSunday){ btn.classList.add('closed'); btn.disabled = true; }
        else { btn.classList.add('open'); }
        if(d.getTime() === today.getTime()) btn.classList.add('today');
        if(state.date && d.getTime() === state.date.getTime()) btn.classList.add('selected');
        (function(d, btn){
          btn.addEventListener('click', function(){
            state.date = d;
            state.dateLabel = d.toLocaleDateString(undefined, {weekday:'long', month:'long', day:'numeric'});
            state.time = null;
            document.getElementById('toStep3').disabled = true;
            renderCalendar();
            renderSlots(d);
          });
        })(d, btn);
        calGrid.appendChild(btn);
      }
    }

    function renderSlots(d){
      var rand = mulberry32(d.getFullYear()*10000 + (d.getMonth()+1)*100 + d.getDate());
      var base = ['8:00 AM','9:30 AM','11:00 AM','12:30 PM','2:00 PM','3:30 PM'];
      slotGrid.innerHTML = '';
      slotsLabel.textContent = 'Open times — ' + state.dateLabel;
      var anyOpen = false;
      base.forEach(function(t){
        var taken = rand() < 0.32;
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'slot-btn';
        b.textContent = t;
        if(taken){ b.disabled = true; }
        else{
          anyOpen = true;
          b.addEventListener('click', function(){
            slotGrid.querySelectorAll('.slot-btn').forEach(function(x){ x.classList.remove('selected'); });
            b.classList.add('selected');
            state.time = t;
            document.getElementById('toStep3').disabled = false;
          });
        }
        slotGrid.appendChild(b);
      });
      if(!anyOpen){
        var empty = document.createElement('div');
        empty.className = 'slots-empty';
        empty.textContent = 'Fully booked that day — try another date.';
        slotGrid.appendChild(empty);
      }
    }

    document.getElementById('calPrev').addEventListener('click', function(){
      viewMonth--; if(viewMonth<0){ viewMonth=11; viewYear--; }
      renderCalendar();
    });
    document.getElementById('calNext').addEventListener('click', function(){
      viewMonth++; if(viewMonth>11){ viewMonth=0; viewYear++; }
      renderCalendar();
    });
    renderCalendar();

    document.getElementById('toStep3').addEventListener('click', function(){ goTo(3); });

    // Step 3 -> 4
    var detailForm = document.getElementById('detailForm');
    document.getElementById('toStep4').addEventListener('click', function(){
      if(!detailForm.reportValidity()) return;
      state.name = detailForm.name.value.trim();
      state.phone = detailForm.phone.value.trim();
      state.address = detailForm.address.value.trim();
      state.notes = detailForm.notes.value.trim();

      document.getElementById('confirmedView').hidden = true;
      document.getElementById('confirmActions').hidden = false;
      document.getElementById('summaryCard').hidden = false;
      document.getElementById('summaryCard').innerHTML =
        '<dl>' +
        '<dt>Service</dt><dd>' + state.service + '</dd>' +
        '<dt>When</dt><dd>' + state.dateLabel + ' &middot; ' + state.time + '</dd>' +
        '<dt>Name</dt><dd>' + state.name + '</dd>' +
        '<dt>Phone</dt><dd>' + state.phone + '</dd>' +
        '<dt>Address</dt><dd>' + state.address + '</dd>' +
        (state.notes ? '<dt>Notes</dt><dd>' + state.notes + '</dd>' : '') +
        '</dl>';
      goTo(4);
    });

    document.getElementById('confirmBooking').addEventListener('click', function(){
      document.getElementById('summaryCard').hidden = true;
      document.getElementById('confirmActions').hidden = true;
      var view = document.getElementById('confirmedView');
      view.hidden = false;
      document.getElementById('confirmedText').textContent =
        'This is a demo booking flow — no request was actually sent. On the live site we’d text ' +
        (state.phone || 'you') + ' to confirm ' + state.dateLabel + ' at ' + state.time + '.';
    });
  })();

  /* ---------- chat widget ---------- */
  (function(){
    var launcher = document.getElementById('chatLauncher');
    var panel = document.getElementById('chatPanel');
    var closeBtn = document.getElementById('chatClose');
    var log = document.getElementById('chatLog');
    var quick = document.getElementById('chatQuick');
    var badge = launcher.querySelector('.chat-badge');
    var opened = false;

    function addBubble(text, who){
      var b = document.createElement('div');
      b.className = 'bubble ' + who;
      b.textContent = text;
      log.appendChild(b);
      log.scrollTop = log.scrollHeight;
    }

    function showTyping(cb){
      var t = document.createElement('div');
      t.className = 'chat-typing';
      t.innerHTML = '<span></span><span></span><span></span>';
      log.appendChild(t);
      log.scrollTop = log.scrollHeight;
      setTimeout(function(){
        t.remove();
        cb();
      }, 550 + Math.random()*400);
    }

    function setQuick(options){
      quick.innerHTML = '';
      options.forEach(function(opt){
        var b = document.createElement('button');
        b.type = 'button';
        b.textContent = opt.label;
        b.addEventListener('click', function(){
          addBubble(opt.label, 'me');
          quick.innerHTML = '';
          showTyping(function(){ opt.reply(); });
        });
        quick.appendChild(b);
      });
    }

    function mainMenu(){
      setQuick([
        { label:'Get a free estimate', reply: function(){
          addBubble('Happy to help. The fastest way is our booking form — tap "Book Now" up top, or I can text you the link. Want me to point you there?', 'bot');
          setQuick([
            { label:'Take me to booking', reply: function(){
              addBubble('Scroll down to the "Book Now" section — pick a service, a date, and you’re set. No payment needed up front.', 'bot');
              panel.classList.remove('open');
              launcher.setAttribute('aria-expanded','false');
              document.getElementById('book').scrollIntoView({ behavior:'smooth' });
            }},
            { label:'Ask something else', reply: mainMenu }
          ]);
        }},
        { label:'What services do you offer?', reply: function(){
          addBubble('Three: Power Wash (750+ PSI, great for concrete & commercial), Soft Wash (low-pressure, safe for siding & roofs), and Hybrid Wash — our own blend of both.', 'bot');
          setQuick([ { label:'Back to menu', reply: mainMenu } ]);
        }},
        { label:'Do you serve my area?', reply: function(){
          addBubble('We’re based in Prince George’s County and also run routes through Anne Arundel, Montgomery, and Charles Counties, plus Washington, D.C.', 'bot');
          setQuick([ { label:'Back to menu', reply: mainMenu } ]);
        }},
        { label:'Talk to a human', reply: function(){
          addBubble('Call or text us anytime at 443-351-8124 — that’s the fastest way to reach the team directly.', 'bot');
          setQuick([ { label:'Back to menu', reply: mainMenu } ]);
        }}
      ]);
    }

    function openChat(){
      panel.classList.add('open');
      launcher.setAttribute('aria-expanded','true');
      badge.style.display = 'none';
      if(!opened){
        opened = true;
        showTyping(function(){
          addBubble('Hey! 👋 Thanks for stopping by Apex Pressure Clean. I’m a demo assistant — ask me about services, our service area, or how to book a free estimate.', 'bot');
          mainMenu();
        });
      }
    }
    launcher.addEventListener('click', function(){
      if(panel.classList.contains('open')){
        panel.classList.remove('open');
        launcher.setAttribute('aria-expanded','false');
      } else {
        openChat();
      }
    });
    closeBtn.addEventListener('click', function(){
      panel.classList.remove('open');
      launcher.setAttribute('aria-expanded','false');
    });
  })();
