// Wires the homepage "Submit a request" callback form and every newsletter
// signup box (.newsletter-form on the homepage, .pf-newsletter-form on the
// dark-chrome pages) to the CMS's public contact/subscribe endpoints. Safe
// to include on every page — each block only activates if its markup exists.
(function(){
  function showMsg(el, text, ok){
    var msg = el.querySelector('.pf-form-msg');
    if (!msg) {
      msg = document.createElement('div');
      msg.className = 'pf-form-msg';
      msg.style.cssText = 'margin-top:8px;font-size:12.5px';
      el.appendChild(msg);
    }
    msg.textContent = text;
    msg.style.color = ok ? '#34e6cf' : '#ff8080';
  }

  // ---- contact / callback form ----
  var contactForm = document.querySelector('.callback-grid .form-card');
  if (contactForm) {
    var inputs = contactForm.querySelectorAll('input');
    var nameInput = inputs[0], emailInput = inputs[1], phoneInput = inputs[2], bestTimeInput = inputs[3];
    var callBtn = contactForm.querySelector('a.btn, button.btn');
    if (callBtn && nameInput && emailInput) {
      callBtn.addEventListener('click', function(e){
        e.preventDefault();
        var name = nameInput.value.trim();
        var email = emailInput.value.trim();
        if (!name || !email) { showMsg(contactForm, 'Name and email are required.', false); return; }
        callBtn.style.opacity = '.6'; callBtn.style.pointerEvents = 'none';
        fetch('/cms/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: name, email: email, phone: phoneInput ? phoneInput.value.trim() : '', best_time: bestTimeInput ? bestTimeInput.value.trim() : '' })
        }).then(function(r){ return r.json(); }).then(function(d){
          callBtn.style.opacity = ''; callBtn.style.pointerEvents = '';
          if (d && d.ok) {
            showMsg(contactForm, "Thanks — we'll call you within 20 minutes.", true);
            [nameInput, emailInput, phoneInput, bestTimeInput].forEach(function(i){ if (i) i.value = ''; });
          } else {
            showMsg(contactForm, (d && d.error) || 'Something went wrong, try again.', false);
          }
        }).catch(function(){
          callBtn.style.opacity = ''; callBtn.style.pointerEvents = '';
          showMsg(contactForm, 'Network error, try again.', false);
        });
      });
    }
  }

  // ---- newsletter signup(s) — there may be more than one on a page in theory, wire all ----
  var newsletterForms = document.querySelectorAll('.newsletter-form, .pf-newsletter-form');
  newsletterForms.forEach(function(box){
    var input = box.querySelector('input[type="email"]');
    var button = box.querySelector('button');
    if (!input || !button) return;
    function submit(e){
      if (e) e.preventDefault();
      var email = input.value.trim();
      if (!email) return;
      button.disabled = true;
      fetch('/cms/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email })
      }).then(function(r){ return r.json(); }).then(function(d){
        button.disabled = false;
        if (d && d.ok) {
          input.value = '';
          input.placeholder = "Subscribed — thanks!";
        } else {
          input.placeholder = (d && d.error) || 'Something went wrong';
        }
      }).catch(function(){
        button.disabled = false;
        input.placeholder = 'Network error, try again';
      });
    }
    button.addEventListener('click', submit);
    input.addEventListener('keydown', function(e){ if (e.key === 'Enter') submit(e); });
  });
})();
