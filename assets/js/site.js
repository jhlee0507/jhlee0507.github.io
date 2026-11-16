/* r3con — the small scripts of the site. */
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
      /* a tooltip, where there is one, says the same */
      if(el.hasAttribute('title'))el.setAttribute('title',el.getAttribute('aria-label'));
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

/* the glass bar at the foot of every page: one lighter pill rests on the tab of the page being read, glides
   to the tab under the pointer or finger instead of jumping, and glides back when that leaves. On a touch
   screen the finger can press, slide along the bar with the pill following it, and let go on another tab to
   open that page; letting go away from the bar opens nothing. Without this script the tabs light up in place. */
(function(){
  var nav=document.querySelector('.tabbar');
  if(!nav||!window.PointerEvent)return;
  var links=Array.prototype.slice.call(nav.querySelectorAll('a'));
  if(!links.length)return;
  var rest=nav.querySelector('a[aria-current="page"]');
  var pill=document.createElement('span'),cur=null,timer=0;
  var finger=null,slid=false,mute=false;
  pill.className='pill';pill.setAttribute('aria-hidden','true');
  nav.insertBefore(pill,nav.firstChild);
  nav.classList.add('has-pill');
  function place(a){pill.style.width=a.offsetWidth+'px';pill.style.transform='translateX('+a.offsetLeft+'px)'}
  function show(a){
    clearTimeout(timer);
    if(cur===a)return;
    if(cur){cur.classList.remove('is-on');place(a)}
    else{
      /* appearing: start on the tab itself rather than flying in from the edge of the bar */
      pill.style.transition='opacity .22s ease';place(a);pill.getBoundingClientRect();pill.style.transition='';
    }
    cur=a;a.classList.add('is-on');pill.classList.add('on');
  }
  /* nothing is pointed at any more: back to the tab of this page, or away if this page has no tab */
  function hide(){
    clearTimeout(timer);
    if(rest){show(rest);return}
    if(!cur)return;
    cur.classList.remove('is-on');cur=null;pill.classList.remove('on');
  }
  function keyboard(a){try{return a.matches(':focus-visible')}catch(e){return true}}
  /* the tab under a finger at x,y: the nearest column while the finger stays on or close to the bar */
  function under(x,y){
    var r=nav.getBoundingClientRect(),i,q;
    if(y<r.top-44||y>r.bottom+44||x<r.left-24||x>r.right+24)return null;
    for(i=0;i<links.length;i++){q=links[i].getBoundingClientRect();if(x<q.right||i===links.length-1)return links[i]}
    return null;
  }
  links.forEach(function(a){
    a.setAttribute('draggable','false');
    a.addEventListener('pointerenter',function(e){if(e.pointerType!=='touch')show(a)});
    a.addEventListener('pointerdown',function(e){if(e.pointerType==='touch'){finger=e.pointerId;slid=false;show(a)}});
    a.addEventListener('focus',function(){if(keyboard(a))show(a)});
  });
  nav.addEventListener('pointerleave',function(e){if(e.pointerType!=='touch')hide()});
  /* a touch stays tied to the tab it began on, so the bar itself works out where the finger is now */
  nav.addEventListener('pointermove',function(e){
    if(e.pointerId!==finger)return;
    var a=under(e.clientX,e.clientY);
    if(a===cur||(!a&&cur===rest))return;
    slid=true;
    if(a)show(a);else hide();
  });
  nav.addEventListener('pointerup',function(e){
    if(e.pointerId!==finger)return;
    finger=null;
    if(!slid){clearTimeout(timer);timer=setTimeout(hide,400);return}
    /* the finger moved to another tab (or off the bar): the tap that follows belongs to where it began, so
       swallow it and open the tab it ended on, unless that is the page already being read */
    mute=true;setTimeout(function(){mute=false},450);
    var a=under(e.clientX,e.clientY);
    if(a&&a!==rest)window.location.href=a.href;else hide();
  });
  nav.addEventListener('pointercancel',function(e){if(e.pointerId===finger){finger=null;hide()}});
  nav.addEventListener('click',function(e){if(mute){e.preventDefault();e.stopPropagation()}},true);
  /* no link menu and no dragging the link away while a finger is held on the bar */
  nav.addEventListener('contextmenu',function(e){if(finger!==null)e.preventDefault()});
  nav.addEventListener('dragstart',function(e){e.preventDefault()});
  nav.addEventListener('focusout',function(e){if(!nav.contains(e.relatedTarget)&&!nav.matches(':hover'))hide()});
  window.addEventListener('resize',function(){if(cur)place(cur)});
  /* coming back with the browser's Back button: start clean */
  window.addEventListener('pageshow',function(e){if(e.persisted){finger=null;hide()}});
  if(rest)show(rest);
})();
