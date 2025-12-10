document.addEventListener('click', e => {
  if (e.target.matches('[data-confirm]')) {
    if (!confirm(e.target.getAttribute('data-confirm'))) e.preventDefault();
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const popup = document.querySelector(".popup");
  if (popup) {
    setTimeout(() => popup.remove(), 3000);
  }
});

