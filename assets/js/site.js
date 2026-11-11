/* r3c0n — the three-line menu. Without JavaScript the links stay visible in the header. */
(function(){
  var mast=document.querySelector('.mast'),btn=mast&&mast.querySelector('.menu-btn'),nav=document.getElementById('site-nav');
  if(!btn||!nav)return;
  function isOpen(){return nav.classList.contains('is-open')}
  function set(open){
    nav.classList.toggle('is-open',open);
    btn.setAttribute('aria-expanded',open?'true':'false');
    btn.setAttribute('aria-label',open?'Close menu':'Open menu');
  }
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
    btn.setAttribute('aria-label',dark?'Switch to light mode':'Switch to dark mode');
    if(metaTheme)metaTheme.setAttribute('content',dark?'#0b0a18':'#eeeef2');
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
  show();
})();
