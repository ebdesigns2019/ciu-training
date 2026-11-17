(() => {
  'use strict';

  const root = document.getElementById('app');
  const routines = Array.isArray(window.workouts) ? window.workouts : [];
  const nav = [...document.querySelectorAll('.nav-item')];
  const toast = document.getElementById('toast');
  const STORAGE_KEY = 'fieldwork-sheet-tracker-v2';
  const state = { view: 'library', selected: null, category: 'All', query: '' };
  let progress = {};
  let toastTimer;

  try {
    progress = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') || {};
  } catch {
    progress = {};
  }

  const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char]);
  const imagePath = path => String(path || '').split('/').map(encodeURIComponent).join('/');
  const steps = routine => Array.isArray(routine.exercises) ? routine.exercises : [];
  const isDone = (routine, index) => Boolean(progress[`${routine.id}:${index}`]);
  const doneCount = routine => steps(routine).filter((_, index) => isDone(routine, index)).length;

  function saveProgress() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
      return true;
    } catch {
      showToast('Progress could not be saved in this browser.');
      return false;
    }
  }

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
  }

  function sheetCard(routine) {
    const count = steps(routine).length;
    const completed = doneCount(routine);
    const image = imagePath(routine.pageImage);
    return `<button class="routine-row sheet-card" type="button" data-open="${escape(routine.id)}" aria-label="Open ${escape(routine.title)}">
      <img class="sheet-thumb" src="${image}" alt="Preview of original ${escape(routine.title)} sheet" loading="lazy" onerror="this.hidden=true">
      <span class="routine-copy"><span class="tag">${escape(routine.category)}</span><strong>${escape(routine.title)}</strong><small>${escape(routine.duration)} min · ${count} steps · ${completed}/${count} checked</small></span>
      <span class="row-arrow" aria-hidden="true">›</span>
    </button>`;
  }

  function libraryView() {
    const categories = ['All', ...new Set(routines.map(routine => routine.category).filter(Boolean))];
    const query = state.query.trim().toLowerCase();
    const filtered = routines.filter(routine =>
      (state.category === 'All' || routine.category === state.category) &&
      `${routine.title} ${routine.category} ${routine.equipment}`.toLowerCase().includes(query)
    );
    return `<section class="page-heading"><div class="eyebrow">YOUR TRAINING SHEETS</div><h1>Workout library</h1><p>Choose a sheet to see the original page and its readable workout steps.</p></section>
      <label class="search"><span aria-hidden="true">⌕</span><input id="routine-search" type="search" placeholder="Search workouts" value="${escape(state.query)}" autocomplete="off"></label>
      <div class="chips" aria-label="Filter by category">${categories.map(category => `<button type="button" class="chip ${state.category === category ? 'selected' : ''}" data-category="${escape(category)}">${escape(category)}</button>`).join('')}</div>
      <p class="result-count">${filtered.length} ${filtered.length === 1 ? 'sheet' : 'sheets'}</p>
      <div class="routine-list">${filtered.length ? filtered.map(sheetCard).join('') : '<p class="empty">No sheets match that search. Try another word or choose All.</p>'}</div>`;
  }

  function detailView(routine) {
    const image = imagePath(routine.pageImage);
    const exercises = steps(routine);
    return `<button class="back-link" type="button" data-view="library">← All sheets</button>
      <section class="page-heading"><div class="eyebrow">${escape(routine.category)}</div><h1>${escape(routine.title)}</h1>
        <p>${escape(routine.duration)} min · Equipment: ${escape(routine.equipment || 'See original sheet')}</p>
        ${routine.note ? `<p>${escape(routine.note)}</p>` : ''}</section>
      <figure class="source-sheet"><figcaption><strong>Original sheet — source of truth</strong><a href="${image}" target="_blank" rel="noopener">Open image full size ↗</a></figcaption>
        <a href="${image}" target="_blank" rel="noopener"><img class="source-image" src="${image}" alt="Original workout sheet: ${escape(routine.title)}"></a>
        <noscript>Open the original sheet using the link above.</noscript>
      </figure>
      <section class="section"><div class="section-heading"><div><div class="eyebrow">APP-FRIENDLY TRANSCRIPTION</div><h2>Workout steps</h2></div><span class="muted">${doneCount(routine)} / ${exercises.length} done</span></div>
        <p class="source-note">Use the image above if any wording or detail in this list differs from the coach's sheet.</p>
        <div class="exercise-list">${exercises.map((exercise, index) => `<label class="exercise-card ${isDone(routine, index) ? 'checked' : ''}">
          <input type="checkbox" data-check="${escape(routine.id)}" data-index="${index}" ${isDone(routine, index) ? 'checked' : ''}>
          <span class="exercise-content"><strong>${escape(exercise[0])}</strong><span class="exercise-dose">${escape(exercise[1])}</span>${exercise[2] ? `<small>${escape(exercise[2])}</small>` : ''}</span>
        </label>`).join('')}</div>
      </section>`;
  }

  function todayView() {
    const next = routines.find(routine => doneCount(routine) < steps(routine).length) || routines[0];
    const completed = routines.reduce((sum, routine) => sum + doneCount(routine), 0);
    const total = routines.reduce((sum, routine) => sum + steps(routine).length, 0);
    return `<section class="hero"><div class="eyebrow">FIELDWORK</div><h1>Your training, organized.</h1><p>Original coach sheets stay the source of truth. Browse a sheet or check off steps as you go.</p>
      <div class="hero-stats"><strong>${completed} / ${total}</strong><span>steps checked</span></div></section>
      ${next ? `<section class="section"><div class="section-heading"><h2>Pick up where you left off</h2></div>${sheetCard(next)}</section>` : ''}
      <section class="section"><div class="section-heading"><h2>All source sheets</h2><button class="text-button" type="button" data-view="library">Browse all</button></div><div class="routine-list">${routines.slice(0, 4).map(sheetCard).join('')}</div></section>`;
  }

  function progressView() {
    const total = routines.reduce((sum, routine) => sum + steps(routine).length, 0);
    const completed = routines.reduce((sum, routine) => sum + doneCount(routine), 0);
    return `<section class="page-heading"><div class="eyebrow">SAVED ON THIS DEVICE</div><h1>Your progress</h1><p>Progress is stored in this browser only. It never changes the original sheet images.</p></section>
      <article class="workout-card"><div class="big-number">${total ? Math.round(completed / total * 100) : 0}%</div><p>${completed} of ${total} steps checked across ${routines.length} sheets.</p></article>
      <div class="routine-list">${routines.map(routine => `<div class="routine-row progress-row"><strong>${escape(routine.title)}</strong><span>${doneCount(routine)} / ${steps(routine).length}</span></div>`).join('')}</div>
      <button class="reset-button" type="button" data-reset>Reset saved progress</button>`;
  }

  function render() {
    nav.forEach(button => button.classList.toggle('active', button.dataset.view === state.view));
    const routine = routines.find(item => item.id === state.selected);
    if (!routines.length) {
      root.innerHTML = '<section class="page-heading"><h1>Workout data unavailable</h1><p>Please make sure workouts.js is in the same folder as index.html.</p></section>';
      return;
    }
    if (routine) root.innerHTML = detailView(routine);
    else if (state.view === 'today') root.innerHTML = todayView();
    else if (state.view === 'progress') root.innerHTML = progressView();
    else if (state.view === 'plan') root.innerHTML = `<section class="page-heading"><div class="eyebrow">SOURCE SHEET</div><h1>12-week conditioning</h1><p>Open the conditioning sheet from the workout library. Follow the original page for its schedule and prescriptions.</p></section>${sheetCard(routines.find(item => item.id === 'conditioning-odd') || routines[0])}`;
    else root.innerHTML = libraryView();
  }

  root.addEventListener('click', event => {
    const open = event.target.closest('[data-open]');
    const view = event.target.closest('[data-view]');
    const category = event.target.closest('[data-category]');
    const reset = event.target.closest('[data-reset]');
    if (open) {
      state.selected = open.dataset.open;
      state.view = 'library';
      render();
      window.scrollTo(0, 0);
    } else if (view) {
      state.selected = null;
      state.view = view.dataset.view;
      render();
      window.scrollTo(0, 0);
    } else if (category) {
      state.category = category.dataset.category;
      render();
    } else if (reset && window.confirm('Clear all workout checkmarks saved in this browser?')) {
      progress = {};
      saveProgress();
      render();
      showToast('Saved progress cleared.');
    }
  });

  root.addEventListener('change', event => {
    const checkbox = event.target.closest('[data-check]');
    if (!checkbox) return;
    progress[`${checkbox.dataset.check}:${checkbox.dataset.index}`] = checkbox.checked;
    saveProgress();
    render();
  });

  root.addEventListener('input', event => {
    if (event.target.id !== 'routine-search') return;
    const position = event.target.selectionStart;
    state.query = event.target.value;
    render();
    const search = document.getElementById('routine-search');
    search?.focus();
    search?.setSelectionRange(position, position);
  });

  nav.forEach(button => button.addEventListener('click', () => {
    state.selected = null;
    state.view = button.dataset.view;
    render();
    window.scrollTo(0, 0);
  }));

  render();
})();
