'use strict';
const menu=document.getElementById('menuButton');
const nav=document.getElementById('primaryNav');
function closeMenu(){if(!nav||!menu)return;nav.classList.remove('is-open');menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Open navigation');}
menu?.addEventListener('click',()=>{const opened=nav.classList.toggle('is-open');menu.setAttribute('aria-expanded',String(opened));menu.setAttribute('aria-label',opened?'Close navigation':'Open navigation');});
nav?.querySelectorAll('a').forEach(link=>link.addEventListener('click',closeMenu));
document.addEventListener('click',event=>{if(menu&&nav&&!menu.contains(event.target)&&!nav.contains(event.target))closeMenu();});
window.addEventListener('resize',()=>{if(window.innerWidth>1050)closeMenu();});

document.querySelectorAll('.choice').forEach(btn=>btn.addEventListener('click',()=>{
 document.querySelectorAll('.choice').forEach(b=>{b.classList.toggle('active',b===btn);b.setAttribute('aria-pressed',String(b===btn));});
 document.getElementById('recTitle').textContent=`Suggested: ${btn.dataset.rec}`;
 document.getElementById('recCopy').textContent=btn.dataset.copy;
 document.getElementById('recommendation').classList.add('show');
 const q=document.querySelector('#quoteForm select[name="equipment"]');
 if(q){for(const option of q.options){if(option.textContent.includes(btn.dataset.rec)){q.value=option.value;break;}}}
}));
const rates={dry:[2.20,3.00],reefer:[2.50,3.40],flatbed:[2.60,3.60],stepdeck:[2.80,3.90]};
document.getElementById('estimateBtn')?.addEventListener('click',()=>{
 const miles=Number(document.getElementById('miles').value);
 const equipment=document.getElementById('equipment').value;
 const urgency=document.getElementById('urgency').value;
 const stops=Number(document.getElementById('stops').value);
 const box=document.getElementById('estimateResult');
 if(!Number.isFinite(miles)||miles<1){box.querySelector('strong').textContent='Enter valid trip miles';return;}
 let [low,high]=rates[equipment];
 if(urgency==='soon'){low*=1.08;high*=1.12;}else if(urgency==='urgent'){low*=1.16;high*=1.24;}
 const extras=Math.max(0,stops-1)*175;
 const lowTotal=Math.round((miles*low+extras)/50)*50;
 const highTotal=Math.round((miles*high+extras)/50)*50;
 box.querySelector('strong').textContent=`$${lowTotal.toLocaleString()} – $${highTotal.toLocaleString()}`;
 box.querySelector('small').textContent='Illustrative planning range';
 box.querySelector('em').textContent='Not a live market rate or binding quote. Final pricing depends on the actual lane, date, capacity, load and accessorials.';
});
let lastQuickQuoteTrigger=null;
const quickModal=document.getElementById('quickModal');
function openQuickQuote(){
 if(!quickModal||quickModal.classList.contains('show'))return;
 lastQuickQuoteTrigger=document.activeElement;
 closeMenu();
 quickModal.classList.add('show');quickModal.setAttribute('aria-hidden','false');
 document.body.classList.add('modal-open');quickModal.querySelector('.close-modal').focus();
}
function closeQuickQuote(){
 if(!quickModal||!quickModal.classList.contains('show'))return;
 quickModal.classList.remove('show');quickModal.setAttribute('aria-hidden','true');
 document.body.classList.remove('modal-open');
 if(lastQuickQuoteTrigger&&typeof lastQuickQuoteTrigger.focus==='function')lastQuickQuoteTrigger.focus();
}
window.openQuickQuote=openQuickQuote;window.closeQuickQuote=closeQuickQuote;
quickModal?.addEventListener('click',event=>{if(event.target===quickModal)closeQuickQuote();});
quickModal?.addEventListener('keydown',event=>{
 if(event.key!=='Tab')return;
 const items=[...quickModal.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]):not([type="hidden"]):not([tabindex="-1"]),select:not([disabled]),textarea:not([disabled])')].filter(el=>el.getClientRects().length>0);
 if(!items.length)return;
 if(event.shiftKey&&document.activeElement===items[0]){event.preventDefault();items[items.length-1].focus();}
 else if(!event.shiftKey&&document.activeElement===items[items.length-1]){event.preventDefault();items[0].focus();}
});
document.addEventListener('keydown',event=>{if(event.key==='Escape'){if(quickModal?.classList.contains('show'))closeQuickQuote();else closeMenu();}});