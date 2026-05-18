/* ═══════════════════════════════════════════════════════════
   LESSON 4 — Building Dynamic Sneaker Requests with JSON/Fetch
   GOAL: After concept loads, fetch the AI image asynchronously.
   ═══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  const $ = id => document.getElementById(id);
  const generateBtn = $('generateBtn'), formError = $('formError');
  const emptyState = $('emptyState'), loadingState = $('loadingState');
  const loaderText = $('loaderText'), result = $('result');
  const stageGroq = $('stageGroq'), stageHF = $('stageHF');
  const captchaModal = $('captchaModal'), captchaCancel = $('captchaCancel');
  const regenBtn = $('regenBtn'), regenImgBtn = $('regenImgBtn');

  let captchaWidgetId = null, currentConcept = null;
  const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

  // Chips, color sync (from Lessons 1-2)
  document.querySelectorAll('.chip-group').forEach(g => {
    const inp = $(g.dataset.field);
    g.querySelectorAll('.chip').forEach(c => c.addEventListener('click', () => {
      g.querySelectorAll('.chip').forEach(x => x.classList.remove('active'));
      c.classList.add('active');
      if (inp) inp.value = c.dataset.value;
    }));
  });
  const syncColor = (pid, tid) => {
    const p = $(pid), t = $(tid);
    if (!p || !t) return;
    p.addEventListener('input', () => t.value = p.value);
    t.addEventListener('input', () => { if (/^#[0-9A-Fa-f]{6}$/.test(t.value)) p.value = t.value; });
  };
  syncColor('primary_color','primary_color_text');
  syncColor('accent_color','accent_color_text');

  // hCaptcha (from Lesson 3)
  window.hcaptchaReady = () => {
    captchaWidgetId = hcaptcha.render('hcaptchaWidget', {
      sitekey: window.HCAPTCHA_SITE_KEY, theme: 'dark', size: 'compact',
      callback: token => { captchaModal.classList.add('hidden'); runGeneration(token); },
      'expired-callback': () => { captchaModal.classList.add('hidden'); generateBtn.disabled = false; },
    });
  };
  generateBtn?.addEventListener('click', () => {
    formError.textContent = '';
    if (typeof hcaptcha === 'undefined' || captchaWidgetId === null) { formError.textContent = 'CAPTCHA not loaded.'; return; }
    hcaptcha.reset(captchaWidgetId);
    captchaModal.classList.remove('hidden');
  });
  captchaCancel?.addEventListener('click', () => { captchaModal.classList.add('hidden'); hcaptcha?.reset(captchaWidgetId); });

  const collectPrefs = () => ({
    style: $('style').value, material: $('material').value, occasion: $('occasion').value,
    primary_color: $('primary_color').value, accent_color: $('accent_color').value,
    inspiration: $('inspiration').value.trim(),
  });

  const setUI = s => {
    [emptyState, loadingState, result].forEach(el => el.classList.add('hidden'));
    ({ empty: emptyState, loading: loadingState, result }[s])?.classList.remove('hidden');
  };

  const setStage = a => {
    stageGroq?.classList.toggle('stage-pill--active', a === 'groq');
    stageHF?.classList.toggle('stage-pill--active', a === 'hf');
    stageGroq?.classList.toggle('stage-pill--done', a === 'hf');
  };

  function renderConcept(c) {
    currentConcept = c;
    $('resultName').textContent = c.name||''; $('resultTagline').textContent = c.tagline||'';
    $('resultDesc').textContent = c.description||''; $('resultPrice').textContent = c.retail_price||'';
    $('resultAudience').textContent = c.target_audience||''; $('resultTags').textContent = (c.style_tags||[]).join(' · ');
    $('materialsList').innerHTML = (c.materials||[]).map(m=>`<li>${esc(m)}</li>`).join('');
    $('featuresList').innerHTML  = (c.features||[]).map(f=>`<li>${esc(f)}</li>`).join('');
    $('soleText').textContent = c.sole_type||'—';
  }


  // TODO 1: Write showImgLoading()
  // Show imgLoading, hide imgFrame + imgError + regenImgBtn


  // TODO 2: Write showImgResult(dataUrl)
  // Hide imgLoading + imgError, set aiImage.src = dataUrl
  // Show imgFrame + regenImgBtn


  // TODO 3: Write showImgError(msg)
  // Hide imgLoading + imgFrame, set imgErrorText content
  // Show imgError + regenImgBtn


  // TODO 4: Write async fetchImage(prompt)
  // Call setStage('hf') and showImgLoading()
  // POST to /generate-image with { image_prompt: prompt }
  // On success: call showImgResult(d.image_url)
  // On error: call showImgError(e.message)


  // TODO 5: Write async runGeneration(token)
  // Disable button, setUI('loading'), setStage('groq')
  // POST to /generate with prefs + 'h-captcha-response': token
  // On success: renderConcept, setUI('result'), call fetchImage()
  // On error: setUI('empty'), show formError
  // Finally: re-enable button, reset captcha


  regenImgBtn?.addEventListener('click', () => currentConcept && fetchImage(currentConcept.image_prompt));
  regenBtn?.addEventListener('click', () => { formError.textContent=''; setUI('empty'); currentConcept=null; });

})();
