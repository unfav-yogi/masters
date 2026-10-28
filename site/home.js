(() => {
  const COUNT = window.MG_FRAME_COUNT;
  const src = window.MG_FRAME;          // index (0-based) -> image url
  const SMOOTH = 0.12;

  const canvas = document.getElementById('c');
  const ctx = canvas.getContext('2d');
  const track = document.getElementById('track');
  const loader = document.getElementById('loader');
  const loadbar = document.getElementById('loadbar');
  const loadtxt = document.getElementById('loadtxt');
  const prog = document.getElementById('prog');
  const hint = document.getElementById('hint');
  const captions = [...document.querySelectorAll('.caption')];

  const frames = new Array(COUNT);
  let loaded = 0, current = 0, target = 0, lastDrawn = -1;

  function load(i) {
    return new Promise(res => {
      const img = new Image();
      img.onload = img.onerror = () => {
        loaded++;
        const pct = Math.round(loaded / COUNT * 100);
        loadbar.style.width = pct + '%';
        loadtxt.textContent = 'Loading ' + pct + '%';
        res();
      };
      img.src = src(i);
      frames[i] = img;
    });
  }
  Promise.all(Array.from({ length: COUNT }, (_, i) => load(i))).then(() => {
    resize();
    loader.classList.add('done');
    requestAnimationFrame(tick);
  });

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(canvas.clientWidth * dpr);
    canvas.height = Math.round(canvas.clientHeight * dpr);
    lastDrawn = -1;
    draw(Math.round(current));
  }
  function draw(i) {
    const img = frames[i];
    if (!img || !img.naturalWidth || !canvas.width) return;
    const cw = canvas.width, ch = canvas.height;
    const s = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
    const w = img.naturalWidth * s, h = img.naturalHeight * s;
    ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
    lastDrawn = i;
  }
  function scrollProgress() {
    const rect = track.getBoundingClientRect();
    const total = track.offsetHeight - window.innerHeight;
    if (total <= 0) return 0;
    return Math.min(1, Math.max(0, -rect.top / total));
  }
  function updateUI(p) {
    prog.style.height = (p * 100) + '%';
    hint.classList.toggle('off', p > 0.02);
    captions.forEach(c => c.classList.toggle('on', p >= +c.dataset.from && p < +c.dataset.to));
  }
  function tick() {
    const p = scrollProgress();
    target = p * (COUNT - 1);
    current += (target - current) * SMOOTH;
    if (Math.abs(target - current) < 0.01) current = target;
    const idx = Math.round(current);
    if (idx !== lastDrawn) draw(idx);
    updateUI(p);
    requestAnimationFrame(tick);
  }
  window.addEventListener('resize', resize);
  window.MG_homeResize = resize;
})();
