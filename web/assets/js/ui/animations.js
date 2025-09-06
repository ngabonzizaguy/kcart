// Small, focused animations using Anime.js

window.addEventListener('DOMContentLoaded', () => {
  if (typeof anime === 'undefined') return;

  // Soft entrance for cards
  const cards = document.querySelectorAll('.card, .menu-item, .item');
  anime({
    targets: cards,
    translateY: [8, 0],
    opacity: [0, 1],
    delay: anime.stagger(40),
    duration: 500,
    easing: 'easeOutQuad'
  });

  // Micro-interaction for FAB
  const fab = document.querySelector('.fab');
  if (fab) {
    fab.addEventListener('mouseenter', () => anime({ targets: fab, scale: 1.06, duration: 160, easing: 'easeOutSine' }));
    fab.addEventListener('mouseleave', () => anime({ targets: fab, scale: 1.0, duration: 160, easing: 'easeOutSine' }));
  }
});

