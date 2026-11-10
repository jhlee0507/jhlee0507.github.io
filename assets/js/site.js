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

/* A section page always lands on its section, as the menu links do: also when the address has no fragment (typed,
   shared, a search result) and on Back/Forward, where the browser brings the page back as it was left, at the top
   (the menu is up there). */
(function(){
  var sec=document.querySelector('main > section[id]');
  if(!sec)return;
  if(!location.hash)location.replace('#'+sec.id);
  window.addEventListener('pageshow',function(e){
    var n=window.performance&&performance.getEntriesByType&&performance.getEntriesByType('navigation')[0];
    if((e.persisted||(n&&n.type==='back_forward'))&&location.hash==='#'+sec.id&&sec.getBoundingClientRect().top>1)sec.scrollIntoView();
  });
})();

/* The skip link moves focus into the content without adding a history entry. */
(function(){
  var skip=document.querySelector('.skip'),main=document.getElementById('main');
  if(skip&&main)skip.addEventListener('click',function(e){e.preventDefault();main.setAttribute('tabindex','-1');main.focus()});
})();
