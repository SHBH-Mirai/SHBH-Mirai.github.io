// motion.js: cinematic scroll effects. The CSS does the animating; this file only adds classes and numbers.
//   1. scroll progress bar        3. stagger: cards in the same row arrive one after another
//   2. headings split into letters 4. skill chips get a pop-in order   5. timeline stars "ignite"
// Runs after site.js (which builds the chips, cards and projects and adds the .in class on scroll).
(() => {
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 1. Progress bar: a thin line at the top showing how far down the page you are.
  const bar = document.getElementById('progress');
  let queued = false;
  function updateBar() {
    queued = false;
    if (!bar) return;
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? Math.min(scrollY / max, 1) : 0})`;
  }
  addEventListener('scroll', () => { if (!queued) { queued = true; requestAnimationFrame(updateBar); } }, { passive: true });
  updateBar();

  if (reduceMotion) return; // everything below is decorative motion

  // 2. Split each section heading into letter spans. Screen readers still get the whole word via aria-label.
  document.querySelectorAll('section h2').forEach((heading) => {
    const text = heading.textContent;
    let index = 0;
    heading.setAttribute('aria-label', text);
    heading.innerHTML = text.split(/(\s+)/).map((part) => {
      if (/^\s+$/.test(part)) return part;
      const letters = [...part].map((ch) => `<span class="ch" style="--i:${Math.min(index++, 18)}">${ch.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</span>`).join('');
      return `<span class="w" aria-hidden="true">${letters}</span>`;
    }).join('');
    heading.classList.add('split');
  });

  // 3. Stagger: elements that reveal side by side get growing delays (max ~480ms in total).
  const groups = new Map();
  document.querySelectorAll('.rv').forEach((el) => {
    const parent = el.parentElement;
    if (!groups.has(parent)) groups.set(parent, []);
    groups.get(parent).push(el);
  });
  groups.forEach((items) => items.forEach((el, i) => el.style.setProperty('--d', `${Math.min(i, 6) * 80}ms`)));

  // 4. Skill chips: number them so they pop in one by one.
  document.querySelectorAll('.perks').forEach((group) => {
    [...group.children].forEach((chip, i) => chip.style.setProperty('--i', String(Math.min(i, 12))));
  });

  // 5. Timeline: a star lights up when the dotted line (drawn by site.js) reaches it.
  const chapters = [...document.querySelectorAll('.chap')];
  let starQueued = false;
  function igniteStars() {
    starQueued = false;
    const reach = innerHeight * 0.7; // the line's tip sits at 70% of the screen height
    chapters.forEach((c) => { if (c.getBoundingClientRect().top + 36 < reach) c.classList.add('lit'); });
  }
  addEventListener('scroll', () => { if (!starQueued) { starQueued = true; requestAnimationFrame(igniteStars); } }, { passive: true });
  igniteStars();
})();
