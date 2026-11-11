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
