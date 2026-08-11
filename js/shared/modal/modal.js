/* ============================================================
   HabitFlow — Shared Modal Utilities
   ------------------------------------------------------------
   Generic helpers used by HabitFlow modals.
============================================================ */


/* ============================================================
   OPEN MODAL
============================================================ */

window.openModal = function (modal) {

  if (!modal) return;

  modal.hidden = false;
};


/* ============================================================
   CLOSE MODAL
============================================================ */

window.closeModal = function (modal) {

  if (!modal) return;

  modal.hidden = true;
};


/* ============================================================
   TOGGLE MODAL
============================================================ */

window.toggleModal = function (modal) {

  if (!modal) return;

  modal.hidden = !modal.hidden;
};