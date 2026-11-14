(() => {
  const app = document.getElementById('app');
  if (!app) return;

  const addStyle = () => {
    if (document.querySelector('link[data-ui-upgrade]')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'upgrade.css';
    link.dataset.uiUpgrade = 'true';
    document.head.append(link);
  };

  function enhanceWorkout() {
    const list = app.querySelector('.exercise-list');
    if (!list) return;
    const cards = [...list.querySelectorAll('.exercise-card')];
    if (!cards.length) return;

    let panel = app.querySelector('.guided-panel');
    if (!panel) {
      panel = document.createElement('section');
      panel.className = 'guided-panel';
      panel.setAttribute('aria-label', 'Guided workout');
      panel.innerHTML = '<div class="guided-copy"><strong>Guided session</strong><span>One drill at a time. Your checkmarks save automatically.</span></div><span class="guided-count"></span><div class="guided-progress"></div><button type="button" class="guided-next">Start workout</button>';
      list.before(panel);
    }

    const firstOpen = cards.findIndex(card => !card.classList.contains('checked'));
    const complete = firstOpen < 0;
    cards.forEach((card, index) => {
      card.classList.toggle('current-step', !complete && index === firstOpen);
      if (index === firstOpen && !complete) card.setAttribute('aria-current', 'step');
      else card.removeAttribute('aria-current');
    });
    const count = panel.querySelector('.guided-count');
    const progress = panel.querySelector('.guided-progress');
    const button = panel.querySelector('.guided-next');
    const done = cards.length - (complete ? 0 : cards.length - firstOpen);
    count.textContent = `${complete ? cards.length : firstOpen} / ${cards.length}`;
    progress.innerHTML = `<div class="progress-line" role="progressbar" aria-label="Guided session progress" aria-valuenow="${Math.round((complete ? 1 : firstOpen) / cards.length * 100)}" aria-valuemin="0" aria-valuemax="100"><span style="width:${Math.round((complete ? 1 : firstOpen) / cards.length * 100)}%"></span></div>`;
    panel.classList.toggle('done', complete);
    button.textContent = complete ? 'Workout complete — review steps' : firstOpen === 0 ? 'Start workout' : 'Go to next step';
    button.setAttribute('aria-label', complete ? 'Review completed workout' : `${firstOpen === 0 ? 'Start' : 'Go to'} step ${firstOpen + 1}: ${cards[firstOpen].querySelector('h3')?.textContent || 'exercise'}`);
    if (!button.dataset.bound) {
      button.dataset.bound = 'true';
      button.addEventListener('click', () => {
        const currentCards = [...list.querySelectorAll('.exercise-card')];
        const nextIndex = currentCards.findIndex(card => !card.classList.contains('checked'));
        if (nextIndex < 0) {
          currentCards[0]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          return;
        }
        const card = currentCards[nextIndex];
        if (nextIndex === 0) {
          card.scrollIntoView({ behavior: 'smooth', block: 'center' });
          card.querySelector('.exercise-check')?.focus({ preventScroll: true });
          return;
        }
        currentCards[nextIndex - 1]?.querySelector('.exercise-check')?.click();
        requestAnimationFrame(() => {
          const updated = [...list.querySelectorAll('.exercise-card')];
          const next = updated.find(item => !item.classList.contains('checked'));
          next?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          next?.querySelector('.exercise-check')?.focus({ preventScroll: true });
        });
      });
    }
  }

  addStyle();
  const observer = new MutationObserver(enhanceWorkout);
  observer.observe(app, { childList: true, subtree: true });
  enhanceWorkout();
})();
