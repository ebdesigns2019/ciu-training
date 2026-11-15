(() => {
  const app = document.getElementById('app');
  if (!app || !Array.isArray(window.workouts)) return;

  const filesByTitle = new Map(window.workouts.map(routine => [normalize(routine.title), routine]));
  const aliases = new Map([
    ['total body flexibility cooldown', 'total body flexibility cooldown finisher'],
    ['medicine ball warm-up', 'med ball warm-up'],
    ['volt speed / agility / quickness', 'volt speed / agility / quickness — tier iii']
  ]);

  function normalize(value) {
    return String(value || '').toLowerCase().replace(/[–—]/g, '-').replace(/[^a-z0-9]+/g, ' ').trim();
  }

  function findRoutine(title) {
    let key = normalize(title);
    key = aliases.get(key) || key;
    return filesByTitle.get(key) || window.workouts.find(routine => normalize(routine.title).startsWith(key) || key.startsWith(normalize(routine.title)));
  }

  function safePath(path) {
    return path.split('/').map(encodeURIComponent).join('/');
  }

  function addImage(container, routine, className, alt) {
    if (!routine?.pageImage || container.querySelector(`[data-source-image="${routine.id}"]`)) return;
    const figure = document.createElement('figure');
    figure.className = className;
    figure.dataset.sourceImage = routine.id;
    figure.innerHTML = `<figcaption><span>ORIGINAL SHEET · SOURCE OF TRUTH</span><a href="${safePath(routine.pageImage)}" target="_blank" rel="noopener">Open full size ↗</a></figcaption><img src="${safePath(routine.pageImage)}" alt="${alt}" loading="lazy">`;
    container.append(figure);
  }

  function enhance() {
    const heading = app.querySelector('.routine-heading');
    if (heading) {
      const title = heading.querySelector('h1')?.textContent;
      addImage(heading, findRoutine(title), 'source-sheet', `Original training sheet for ${title || 'workout'}`);
    }

    app.querySelectorAll('.routine-row').forEach(row => {
      const title = row.querySelector('.routine-copy strong')?.textContent;
      const routine = findRoutine(title);
      if (!routine?.pageImage || row.querySelector('.sheet-thumb')) return;
      const thumb = document.createElement('img');
      thumb.className = 'sheet-thumb';
      thumb.src = safePath(routine.pageImage);
      thumb.alt = '';
      thumb.loading = 'lazy';
      row.prepend(thumb);
    });

    const planTitle = app.querySelector('.page-heading h1')?.textContent;
    if (normalize(planTitle).includes('12 week conditioning')) {
      const source = window.workouts.find(routine => routine.id === 'conditioning-odd');
      const anchor = app.querySelector('.week-strip');
      if (anchor && !app.querySelector('[data-conditioning-source]')) {
        const wrapper = document.createElement('div');
        wrapper.dataset.conditioningSource = 'true';
        addImage(wrapper, source, 'source-sheet source-sheet-plan', 'Original soccer 12-week off-season conditioning sheet');
        anchor.before(wrapper.firstElementChild);
      }
    }
  }

  const style = document.createElement('style');
  style.textContent = `.source-sheet{margin:18px 0 24px;padding:12px;background:#fff;border:1px solid #e6e9e2;border-radius:16px;box-shadow:0 10px 28px rgba(27,47,35,.06)}.source-sheet figcaption{display:flex;justify-content:space-between;align-items:center;gap:12px;margin:0 0 10px;font:700 11px/1.3 'DM Sans',sans-serif;letter-spacing:.08em;color:#536158}.source-sheet figcaption a{font-size:12px;letter-spacing:0;color:#204e3a;text-decoration:none;white-space:nowrap}.source-sheet img{display:block;width:100%;height:auto;border-radius:8px}.sheet-thumb{width:52px;height:68px;object-fit:cover;object-position:top;border-radius:8px;flex:0 0 auto}@media(min-width:700px){.source-sheet{padding:18px}.sheet-thumb{width:60px;height:78px}}`;
  document.head.append(style);
  new MutationObserver(enhance).observe(app, { childList: true, subtree: true });
  enhance();
})();
