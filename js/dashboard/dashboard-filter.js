/* =========================
   FILTER LOGIC
========================= */
window.applyFilter = function () {
  const cards = document.querySelectorAll(".habit-card");

  cards.forEach((card) => {
    const id = card.getAttribute("data-id");

    const habit = window.habits.find((h) => h.id == id);

    if (!habit) return;

    let show = true;

    if (window.currentFilter === "active") {
      show = !habit.completedToday;
    } 
    
    else if (window.currentFilter === "completed") {
      show = habit.completedToday;
    }

    card.style.display = show ? "flex" : "none";
  });
};


/* =========================
   FILTER COUNTS
========================= */
window.updateFilterCounts = function () {

  const filterTabs = document.querySelectorAll(".filter-tab");

  const all = window.habits.length;

  const active = window.habits.filter(
    (h) => !h.completedToday
  ).length;

  const completed = window.habits.filter(
    (h) => h.completedToday
  ).length;

  filterTabs.forEach((tab) => {

    const type = tab.dataset.filter;

    const countEl = tab.querySelector(".count");

    if (!countEl) return;

    if (type === "all") countEl.textContent = all;

    if (type === "active") countEl.textContent = active;

    if (type === "completed") countEl.textContent = completed;
  });
};


/* =========================
   FILTER TAB EVENTS
========================= */
window.initFilters = function () {

  const filterTabs = document.querySelectorAll(".filter-tab");

  filterTabs.forEach((tab) => {

    tab.addEventListener("click", () => {

      filterTabs.forEach((t) =>
        t.classList.remove("is-active")
      );

      tab.classList.add("is-active");

      window.currentFilter = tab.dataset.filter;

      window.applyFilter();
    });

  });

};