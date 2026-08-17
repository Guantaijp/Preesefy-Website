// Shared header/footer behavior for every page that uses the redesigned dark
// chrome (about/verified/guide/cart/checkout): syncs the cart badge and wires
// the Order status popup. cart.js (loaded separately) drives the badge count;
// this only needs to exist so header links on non-homepage pages behave the
// same as the homepage.
(function(){
  var popup = document.createElement('div');
  popup.id = 'emailPopup';
  popup.style.cssText = 'display:none;position:fixed;inset:0;background:rgba(4,10,14,.72);z-index:2300;align-items:center;justify-content:center;padding:24px';
  popup.innerHTML = '<div style="background:#0c1a22;border:1px solid rgba(255,255,255,.14);border-radius:16px;max-width:420px;width:100%;padding:28px;position:relative;color:#e8f1f2;font-family:Archivo,sans-serif">'+
    '<button id="emailPopupClose" style="position:absolute;top:14px;right:16px;background:none;border:none;color:#8fa3a8;font-size:22px;cursor:pointer;line-height:1">&times;</button>'+
    '<h3 style="margin-bottom:8px">Order status</h3>'+
    '<p style="color:#8fa3a8;font-size:13px;margin-bottom:16px">Enter the email you used for your release and we will follow up with its current status.</p>'+
    '<form id="orderStatusForm" style="display:flex;gap:8px;flex-wrap:wrap">'+
      '<input type="email" required placeholder="Email" style="flex:1;min-width:180px;background:#0a141a;border:1px solid rgba(255,255,255,.18);border-radius:8px;padding:10px 12px;color:#e8f1f2">'+
      '<button type="submit" class="btn btn-amber" style="border:none;cursor:pointer">Send</button>'+
    '</form>'+
    '<p id="orderStatusMsg" style="margin-top:12px;font-size:12.5px;color:#34e6cf"></p></div>';
  document.body.appendChild(popup);

  function openOrderPopup(e){ if (e) e.preventDefault(); popup.style.display = 'flex'; }
  var link1 = document.getElementById('orderStatusLink');
  var link2 = document.getElementById('orderStatusLinkFooter');
  if (link1) link1.addEventListener('click', openOrderPopup);
  if (link2) link2.addEventListener('click', openOrderPopup);
  popup.querySelector('#emailPopupClose').addEventListener('click', function(){ popup.style.display = 'none'; });
  popup.addEventListener('click', function(e){ if (e.target === popup) popup.style.display = 'none'; });
  popup.querySelector('#orderStatusForm').addEventListener('submit', function(e){
    e.preventDefault();
    popup.querySelector('#orderStatusMsg').textContent = "Thanks — we'll email your order status shortly.";
    this.reset();
  });
})();
