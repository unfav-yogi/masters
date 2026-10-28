(() => {
  const btn = document.getElementById('menuBtn');
  const nav = document.getElementById('glassNav');
  if (btn && nav) {
    btn.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', open);
      btn.textContent = open ? 'Close' : 'Menu';
    });
    nav.addEventListener('click', e => {
      if (e.target.closest('a')) { nav.classList.remove('open'); btn.setAttribute('aria-expanded', false); btn.textContent = 'Menu'; }
    });
  }

  // reviews: endless belt. Speed is fixed (px per second) so every screen size moves at the same pace.
  const SPEED = 55;
  const rails = [...document.querySelectorAll('[data-rev] .rev-rail')];
  const setSpeed = () => rails.forEach(rail => {
    const set = rail.querySelector('.rev-set');
    const w = set ? set.getBoundingClientRect().width : 0;
    if (w > 0) rail.style.animationDuration = ((w + 20) / SPEED).toFixed(1) + 's';
  });
  setSpeed();
  window.addEventListener('resize', setSpeed);
  window.addEventListener('load', setSpeed);
  window.addEventListener('hashchange', () => setTimeout(setSpeed, 60));

  // ---- WhatsApp: opens directly on the real site; inside a frame (e.g. a preview) WhatsApp refuses to load, so show a copy-and-send panel instead
  const embedded = (() => { try { return window.self !== window.top; } catch (e) { return true; } })();
  const WA = '919491347496';
  const waUrl = text => 'https://wa.me/' + WA + (text ? '?text=' + encodeURIComponent(text) : '');
  const help = document.getElementById('waHelp');
  function showHelp(text) {
    if (!help) return;
    document.getElementById('waText').value = text;
    document.getElementById('waOpen').href = waUrl(text);
    help.classList.add('show');
    help.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  const copyBtn = document.getElementById('waCopy');
  if (copyBtn) copyBtn.addEventListener('click', async () => {
    const ta = document.getElementById('waText');
    try { await navigator.clipboard.writeText(ta.value); }
    catch (e) { ta.focus(); ta.select(); try { document.execCommand('copy'); } catch (_) {} }
    copyBtn.textContent = 'Copied';
    setTimeout(() => { copyBtn.textContent = 'Copy message'; }, 2000);
  });
  document.querySelectorAll('.wa-btn').forEach(a => a.addEventListener('click', e => {
    if (embedded) { e.preventDefault(); showHelp('Hello Master Gym,'); }
  }));

  const form = document.getElementById('enquiry');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const d = new FormData(form);
      const text = [
        'Hello Master Gym,',
        'Name: ' + (d.get('name') || '').toString().trim(),
        'Phone: ' + (d.get('phone') || '').toString().trim(),
        'Interested in: ' + d.get('interest'),
        (d.get('message') || '').toString().trim() ? 'Message: ' + d.get('message').toString().trim() : ''
      ].filter(Boolean).join('\n');
      const url = waUrl(text);
      form.style.display = 'none';
      if (embedded) { showHelp(text); return; }
      const link = document.getElementById('waLink');
      if (link) link.href = url;
      const w = window.open(url, '_blank');
      if (w) { try { w.opener = null; } catch (_) {} } else { window.location.href = url; }
      document.getElementById('thanks').classList.add('show');
    });
  }
})();
