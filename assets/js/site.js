/* r3con — the three-line menu. Without JavaScript the links stay visible in the header. */
(function(){
  function ko(){return document.documentElement.getAttribute('data-lang')==='ko'}
  var mast=document.querySelector('.mast'),btn=mast&&mast.querySelector('.menu-btn'),nav=document.getElementById('site-nav');
  if(!btn||!nav)return;
  function isOpen(){return nav.classList.contains('is-open')}
  function set(open){
    nav.classList.toggle('is-open',open);
    btn.setAttribute('aria-expanded',open?'true':'false');
    label();
  }
  function label(){btn.setAttribute('aria-label',isOpen()?(ko()?'메뉴 닫기':'Close menu'):(ko()?'메뉴 열기':'Open menu'))}
  document.addEventListener('langchange',label);label();
  function inside(n){return !!n&&(btn.contains(n)||nav.contains(n))}
  function away(e){if(isOpen()&&!inside(e.target))set(false)}
  btn.addEventListener('click',function(){set(!isOpen())});
  nav.addEventListener('click',function(e){if(e.target.closest('a'))set(false)});
  /* close on a press anywhere else (pointerdown also covers iOS), and when keyboard focus leaves */
  document.addEventListener('pointerdown',away);document.addEventListener('click',away);
  mast.addEventListener('focusout',function(e){if(isOpen()&&e.relatedTarget&&!inside(e.relatedTarget))set(false)});
  document.addEventListener('keydown',function(e){
    if(e.key!=='Escape'||!isOpen())return;
    var a=document.activeElement,back=inside(a)||a===document.body;
    set(false);if(back)btn.focus({preventScroll:true});
  });
})();

/* The skip link moves focus into the content without adding a history entry. */
(function(){
  var skip=document.querySelector('.skip'),main=document.getElementById('main');
  if(skip&&main)skip.addEventListener('click',function(e){e.preventDefault();main.setAttribute('tabindex','-1');main.focus()});
})();

/* Dark mode: the button in the header switches it and the choice is remembered on this device.
   The page starts light; the saved choice is applied in the head, before the first paint. */
(function(){
  var root=document.documentElement,btn=document.querySelector('.theme-btn');
  if(!btn)return;
  var metaTheme=document.querySelector('meta[name="theme-color"]');
  function isDark(){return root.getAttribute('data-theme')==='dark'}
  function show(){
    var dark=isDark();
    var ko=root.getAttribute('data-lang')==='ko';
    btn.setAttribute('aria-label',dark?(ko?'밝은 화면으로 전환':'Switch to light mode'):(ko?'다크 모드로 전환':'Switch to dark mode'));
    if(metaTheme)metaTheme.setAttribute('content',getComputedStyle(root).getPropertyValue('--ground').trim()||(dark?'#0b0a18':'#eeeef2'));
  }
  btn.addEventListener('click',function(){
    var dark=!isDark();
    if(dark)root.setAttribute('data-theme','dark');else root.removeAttribute('data-theme');
    try{localStorage.setItem('theme',dark?'dark':'light')}catch(e){}
    show();
  });
  /* another tab changed it */
  window.addEventListener('storage',function(e){
    if(e.key!=='theme')return;
    if(e.newValue==='dark')root.setAttribute('data-theme','dark');else root.removeAttribute('data-theme');
    show();
  });
  document.addEventListener('langchange',show);
  show();
})();

/* Language: the KR/EN button in the header switches between English and Korean and the choice is remembered on
   this device. The page starts in English; a saved choice of Korean is applied in the head, before the first
   paint. Both texts are in the page (.l-en / .l-ko); this only says which one shows and keeps labels in step. */
(function(){
  var root=document.documentElement,btn=document.querySelector('.lang-btn');
  if(!btn)return;
  function isKo(){return root.getAttribute('data-lang')==='ko'}
  function show(){
    var ko=isKo(),t=root.getAttribute(ko?'data-title-ko':'data-title-en')||root.getAttribute('data-title-en');
    root.lang=ko?'ko':'en';
    if(t)document.title=t;
    /* the button offers the other language, in that language */
    btn.setAttribute('aria-label',ko?'View in English':'한국어로 보기');btn.lang=ko?'en':'ko';
    var els=document.querySelectorAll('[data-label-ko]');
    for(var i=0;i<els.length;i++){
      var el=els[i];
      if(!el.hasAttribute('data-label-en'))el.setAttribute('data-label-en',el.getAttribute('aria-label')||'');
      el.setAttribute('aria-label',el.getAttribute(ko?'data-label-ko':'data-label-en'));
    }
    document.dispatchEvent(new Event('langchange'));
  }
  function set(ko){if(ko)root.setAttribute('data-lang','ko');else root.removeAttribute('data-lang');show()}
  btn.addEventListener('click',function(){
    var ko=!isKo();
    try{localStorage.setItem('lang',ko?'ko':'en')}catch(e){}
    set(ko);
  });
  /* another tab changed it */
  window.addEventListener('storage',function(e){if(e.key==='lang')set(e.newValue==='ko')});
  show();
})();

/* the glass bar at the foot of the main page: one lighter pill marks the label under the pointer or finger,
   and glides to the next label instead of jumping. Without this script each label lights up in place. */
(function(){
  var nav=document.querySelector('.home-nav');
  if(!nav||!window.PointerEvent)return;
  var links=nav.querySelectorAll('a');
  if(!links.length)return;
  var pill=document.createElement('span'),cur=null,timer=0;
  pill.className='pill';pill.setAttribute('aria-hidden','true');
  nav.insertBefore(pill,nav.firstChild);
  nav.classList.add('has-pill');
  function place(a){pill.style.width=a.offsetWidth+'px';pill.style.transform='translateX('+a.offsetLeft+'px)'}
  function show(a){
    clearTimeout(timer);
    if(cur===a)return;
    if(cur){cur.classList.remove('is-on');place(a)}
    else{
      /* appearing: start on the label itself rather than flying in from the edge of the bar */
      pill.style.transition='opacity .22s ease';place(a);pill.getBoundingClientRect();pill.style.transition='';
    }
    cur=a;a.classList.add('is-on');pill.classList.add('on');
  }
  function hide(){
    clearTimeout(timer);
    if(!cur)return;
    cur.classList.remove('is-on');cur=null;pill.classList.remove('on');
  }
  function keyboard(a){try{return a.matches(':focus-visible')}catch(e){return true}}
  Array.prototype.forEach.call(links,function(a){
    a.addEventListener('pointerenter',function(e){if(e.pointerType!=='touch')show(a)});
    a.addEventListener('pointerdown',function(e){if(e.pointerType==='touch')show(a)});
    a.addEventListener('focus',function(){if(keyboard(a))show(a)});
  });
  nav.addEventListener('pointerleave',function(e){if(e.pointerType!=='touch')hide()});
  nav.addEventListener('pointerup',function(e){if(e.pointerType==='touch'){clearTimeout(timer);timer=setTimeout(hide,400)}});
  nav.addEventListener('pointercancel',hide);
  nav.addEventListener('focusout',function(e){if(!nav.contains(e.relatedTarget)&&!nav.matches(':hover'))hide()});
  window.addEventListener('resize',function(){if(cur)place(cur)});
  /* coming back with the browser's Back button: start clean */
  window.addEventListener('pageshow',function(e){if(e.persisted)hide()});
})();
