// ============================================================
//  HabitFlow — dashboard.js  (refined + features)
//  • Categories, reminder time, inline edit, filter, heatmap
//  • Confetti, dark-mode, fixed streak/total logic
//  • No persistence (backend coming later)
// ============================================================

(() => {
  'use strict';

  // -------- Element refs --------
  const $ = (s, r = document) => r.querySelector(s);

  const habitInput     = $('#habit-field');
  const addBtn         = $('#btn-add-habit');
  const catSelect      = $('#habit-category');
  const timeInput      = $('#habit-time');
  const habitContainer = $('#habit-list');
  const emptyState     = $('#empty-state');

  const progressFill   = $('#progress-fill');
  const progressCount  = $('#progress-count');
  const progressMotto  = $('#progress-motto');
  const habitCountLbl  = $('#habit-count-label');

  const statStreak     = $('#stat-streak');
  const statBest       = $('#stat-best');
  const statTotal      = $('#stat-total');

  const themeToggle    = $('#theme-toggle');
  const themeIcon      = $('#theme-icon');

  const filterTabs     = document.querySelectorAll('.filter-tab');

  const editModal      = $('#edit-modal');
  const editName       = $('#edit-name');
  const editCat        = $('#edit-category');
  const editTime       = $('#edit-time');
  const editCancel     = $('#edit-cancel');
  const editSave       = $('#edit-save');

  const toastEl        = $('#toast');
  const confettiCanvas = $('#confetti-canvas');

  // -------- State --------
  /** @type {Array<{id:number,name:string,category:string,time:string,streak:number,best:number,total:number,completedToday:boolean,history:string[]}>} */
  let habits = [];
  let currentFilter = 'all';
  let editingId = null;
  let lastCelebratedAllDone = false;

  const TODAY = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  // -------- Categories --------
  const CATEGORIES = {
    health:      { icon: '💪', color: 'var(--cat-health)' },
    learning:    { icon: '📚', color: 'var(--cat-learning)' },
    fitness:     { icon: '🏃', color: 'var(--cat-fitness)' },
    mindfulness: { icon: '🧘', color: 'var(--cat-mindfulness)' },
    creativity:  { icon: '🎨', color: 'var(--cat-creativity)' },
    work:        { icon: '💼', color: 'var(--cat-work)' },
    other:       { icon: '✨', color: 'var(--cat-other)' },
  };

  // -------- Mottos --------
  const MOTTOS = [
    "You're on a roll! 🔥",
    'Stay consistent, stay unstoppable 💪',
    'Every check-off counts ✨',
    'Small steps, big results 🚀',
    'Progress over perfection 🌟',
  ];

  // -------- Date helpers --------
  const todayEl = $('#today-date');
  if (todayEl) {
    todayEl.textContent = new Date().toLocaleDateString(undefined, {
      weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
    });
  }

  function last7Dates() {
    const out = [];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      out.push(d.toISOString().slice(0, 10));
    }
    return out;
  }
  const WEEK = last7Dates();
  const WEEK_LABELS = WEEK.map((d) =>
    new Date(d).toLocaleDateString(undefined, { weekday: 'short' })
  );

  // -------- Toast --------
  let toastTimer;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('is-visible'), 2400);
  }

  // -------- Theme --------
  function applyTheme(theme) {
    document.body.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    themeIcon.textContent = theme === 'dark' ? 'light_mode' : 'dark_mode';
    try { localStorage.setItem('habitflow-theme', theme); } catch (_) {}
  }
  let savedTheme = 'light';
  try { savedTheme = localStorage.getItem('habitflow-theme') || 'light'; } catch (_) {}
  applyTheme(savedTheme);

  themeToggle.addEventListener('click', () => {
    const next = document.body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
  });

  // -------- Confetti (tiny canvas util, no deps) --------
  function fireConfetti() {
    const ctx = confettiCanvas.getContext('2d');
    const DPR = window.devicePixelRatio || 1;
    confettiCanvas.width = innerWidth * DPR;
    confettiCanvas.height = innerHeight * DPR;
    confettiCanvas.style.width = innerWidth + 'px';
    confettiCanvas.style.height = innerHeight + 'px';
    ctx.scale(DPR, DPR);

    const colors = ['#f472b6', '#8e7bff', '#9fe7ff', '#fbbf24', '#34d399', '#ec8fc3'];
    const pieces = Array.from({ length: 140 }, () => ({
      x: innerWidth / 2,
      y: innerHeight / 3,
      vx: (Math.random() - 0.5) * 14,
      vy: Math.random() * -14 - 4,
      g: 0.35 + Math.random() * 0.25,
      r: 4 + Math.random() * 5,
      rot: Math.random() * Math.PI * 2,
      vr: (Math.random() - 0.5) * 0.3,
      color: colors[Math.floor(Math.random() * colors.length)],
      life: 0,
    }));

    let start = performance.now();
    function frame(now) {
      const elapsed = now - start;
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      pieces.forEach((p) => {
        p.vy += p.g;
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.r, -p.r, p.r * 2, p.r * 1.3);
        ctx.restore();
      });
      if (elapsed < 2600) {
        requestAnimationFrame(frame);
      } else {
        ctx.clearRect(0, 0, innerWidth, innerHeight);
      }
    }
    requestAnimationFrame(frame);
  }

  // -------- Progress / stats --------
  function computeStats() {
    const total = habits.length;
    const done = habits.filter((h) => h.completedToday).length;
    const pct = total === 0 ? 0 : Math.round((done / total) * 100);

    // overall stats
    const bestStreak  = habits.reduce((m, h) => Math.max(m, h.best), 0);
    const curStreak   = habits.reduce((m, h) => Math.max(m, h.streak), 0);
    const totalDone   = habits.reduce((s, h) => s + h.total, 0);

    return { total, done, pct, bestStreak, curStreak, totalDone };
  }

  function updateProgress() {
    const { total, done, pct, bestStreak, curStreak, totalDone } = computeStats();

    progressFill.style.width  = pct + '%';
    progressCount.textContent = `${done} / ${total} done`;
    habitCountLbl.textContent = total === 1 ? '1 habit' : `${total} habits`;

    statStreak.textContent = curStreak;
    statBest.textContent   = bestStreak;
    statTotal.textContent  = totalDone;

    // empty state shows only when NO habits exist (regardless of filter)
    emptyState.classList.toggle('is-visible', total === 0);

    if (total === 0) {
      progressMotto.textContent = 'Add some habits to get started ✨';
    } else if (done === 0) {
      progressMotto.textContent = "Let's crush today's habits! 💥";
    } else if (done === total) {
      progressMotto.textContent = 'Perfect day! All habits done! 🎉';
    } else {
      progressMotto.textContent = MOTTOS[done % MOTTOS.length];
    }

    // Confetti trigger (only once per "all done" event)
    if (total > 0 && done === total) {
      if (!lastCelebratedAllDone) {
        fireConfetti();
        toast('Perfect day! 🎉');
        lastCelebratedAllDone = true;
      }
    } else {
      lastCelebratedAllDone = false;
    }
  }

  // -------- Rendering --------
  function heatmapHTML(habit) {
    return WEEK.map((d, i) => {
      const done = habit.history.includes(d);
      const isToday = d === TODAY;
      return `<span class="heat-cell${done ? ' is-done' : ''}${isToday ? ' is-today' : ''}" title="${WEEK_LABELS[i]} ${d}${done ? ' ✓' : ''}"></span>`;
    }).join('');
  }

  function cardMarkup(habit) {
    const cat = CATEGORIES[habit.category] || CATEGORIES.other;
    const timeChip = habit.time
      ? `<span class="chip chip-time">⏰ ${habit.time}</span>`
      : '';
    return `
      <span class="habit-dot" aria-hidden="true">${cat.icon}</span>
      <div class="habit-info">
        <h3 class="habit-name" data-testid="habit-name">${escapeHTML(habit.name)}</h3>
        <div class="habit-meta-row">
          <div class="habit-chips">
            <span class="chip chip-streak">🔥 ${habit.streak} day streak</span>
            <span class="chip chip-total">✓ ${habit.total} total</span>
            ${timeChip}
          </div>
        </div>
        <div class="habit-heatmap" aria-label="Last 7 days">${heatmapHTML(habit)}</div>
      </div>
      <div class="habit-actions">
        <button class="btn-edit" title="Edit habit" data-testid="edit-habit-btn">
          <span class="material-symbols-rounded">edit</span>
        </button>
        <button class="btn btn-complete" data-testid="complete-habit-btn">
          ${habit.completedToday ? 'Completed! 🔥' : 'Mark as Done'}
        </button>
        <button class="btn-delete" title="Delete habit" data-testid="delete-habit-btn">
          <span class="material-symbols-rounded">delete</span>
        </button>
      </div>
    `;
  }

  function buildCardElement(habit) {
    const cat = CATEGORIES[habit.category] || CATEGORIES.other;
    const card = document.createElement('article');
    card.className = 'habit-card entering';
    card.setAttribute('data-id', String(habit.id));
    card.setAttribute('data-testid', 'habit-card');
    card.style.setProperty('--cat-color', cat.color);
    if (habit.completedToday) card.classList.add('is-completed');
    card.innerHTML = cardMarkup(habit);
    return card;
  }

  function refreshCard(card, habit) {
    const cat = CATEGORIES[habit.category] || CATEGORIES.other;
    card.style.setProperty('--cat-color', cat.color);
    card.classList.toggle('is-completed', habit.completedToday);
    card.innerHTML = cardMarkup(habit);
  }

  function renderAll() {
    habitContainer.innerHTML = '';
    const filtered = habits.filter((h) => {
      if (currentFilter === 'active') return !h.completedToday;
      if (currentFilter === 'completed') return h.completedToday;
      return true;
    });
    filtered.forEach((h) => habitContainer.appendChild(buildCardElement(h)));
    updateProgress();
  }

  function escapeHTML(s) {
    return String(s).replace(/[&<>"']/g, (c) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])
    );
  }

  // -------- Habit CRUD --------
  function addHabit() {
    let name = habitInput.value.trim();
    if (name === '') { toast('Please enter a habit name'); habitInput.focus(); return; }
    name = name.charAt(0).toUpperCase() + name.slice(1);

    const dupe = habits.some((h) => h.name.toLowerCase() === name.toLowerCase());
    if (dupe) {
      toast("You're already crushing this habit 🔥");
      habitInput.value = '';
      return;
    }

    const habit = {
      id: Date.now(),
      name,
      category: catSelect.value || 'other',
      time: timeInput.value || '',
      streak: 0,
      best: 0,
      total: 0,
      completedToday: false,
      history: [], // YYYY-MM-DD list of completed days
    };
    habits.push(habit);
    habitInput.value = '';
    timeInput.value = '';
    catSelect.value = 'other';
    habitInput.focus();
    renderAll();
    toast('Habit added — let\'s go! ✨');
  }

  function toggleComplete(id) {
    const habit = habits.find((h) => h.id === id);
    if (!habit) return;

    if (!habit.completedToday) {
      // Complete today
      habit.completedToday = true;
      if (!habit.history.includes(TODAY)) habit.history.push(TODAY);
      habit.total += 1;
      // Streak: if last completion was yesterday-or-today, keep; else reset to 1
      habit.streak = (habit.streak || 0) + 1;
      if (habit.streak > habit.best) habit.best = habit.streak;
    } else {
      // Undo today
      habit.completedToday = false;
      habit.history = habit.history.filter((d) => d !== TODAY);
      habit.total = Math.max(0, habit.total - 1);
      habit.streak = Math.max(0, habit.streak - 1);
      // best stays (lifetime record)
    }

    const card = habitContainer.querySelector(`[data-id="${habit.id}"]`);
    if (card) refreshCard(card, habit);

    // If filter hides this now, re-render
    if (
      (currentFilter === 'active' && habit.completedToday) ||
      (currentFilter === 'completed' && !habit.completedToday)
    ) {
      renderAll();
    } else {
      updateProgress();
    }
  }

  function deleteHabit(id) {
    const ok = confirm('Delete this habit? 🌪️');
    if (!ok) return;
    const card = habitContainer.querySelector(`[data-id="${id}"]`);
    habits = habits.filter((h) => h.id !== id);
    if (card) {
      card.classList.add('deleting');
      setTimeout(() => {
        card.remove();
        updateProgress();
      }, 350);
    } else {
      renderAll();
    }
    toast('Habit removed');
  }

  // -------- Edit modal --------
  function openEdit(id) {
    const h = habits.find((x) => x.id === id);
    if (!h) return;
    editingId = id;
    editName.value = h.name;
    editCat.value = h.category;
    editTime.value = h.time || '';
    editModal.hidden = false;
    setTimeout(() => editName.focus(), 50);
  }
  function closeEdit() {
    editModal.hidden = true;
    editingId = null;
  }
  function saveEdit() {
    if (editingId == null) return;
    const h = habits.find((x) => x.id === editingId);
    if (!h) return closeEdit();
    const newName = editName.value.trim();
    if (!newName) { toast('Name cannot be empty'); return; }
    const dupe = habits.some(
      (x) => x.id !== h.id && x.name.toLowerCase() === newName.toLowerCase()
    );
    if (dupe) { toast('That name is already used'); return; }
    h.name = newName.charAt(0).toUpperCase() + newName.slice(1);
    h.category = editCat.value;
    h.time = editTime.value || '';
    const card = habitContainer.querySelector(`[data-id="${h.id}"]`);
    if (card) refreshCard(card, h);
    closeEdit();
    toast('Habit updated ✨');
  }

  editCancel.addEventListener('click', closeEdit);
  editSave.addEventListener('click', saveEdit);
  editModal.addEventListener('click', (e) => {
    if (e.target === editModal) closeEdit();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !editModal.hidden) closeEdit();
  });

  // -------- Event wiring --------
  addBtn.addEventListener('click', (e) => { e.preventDefault(); addHabit(); });
  habitInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); addHabit(); }
  });

  habitContainer.addEventListener('click', (e) => {
    const card = e.target.closest('.habit-card');
    if (!card) return;
    const id = Number(card.getAttribute('data-id'));

    if (e.target.closest('.btn-complete'))  return toggleComplete(id);
    if (e.target.closest('.btn-delete'))    return deleteHabit(id);
    if (e.target.closest('.btn-edit'))      return openEdit(id);
    if (e.target.closest('.habit-name'))    return openEdit(id);
  });

  habitContainer.addEventListener('mouseover', (e) => {
    const btn = e.target.closest('.btn-complete');
    if (!btn) return;
    if (btn.closest('.habit-card').classList.contains('is-completed')) {
      btn.innerText = 'Undo? ↩️';
    }
  });
  habitContainer.addEventListener('mouseout', (e) => {
    const btn = e.target.closest('.btn-complete');
    if (!btn) return;
    if (btn.closest('.habit-card').classList.contains('is-completed')) {
      btn.innerText = 'Completed! 🔥';
    }
  });

  // Filter tabs
  filterTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      filterTabs.forEach((t) => t.classList.remove('is-active'));
      tab.classList.add('is-active');
      currentFilter = tab.getAttribute('data-filter');
      renderAll();
    });
  });

  // -------- Initial render --------
  renderAll();
})();