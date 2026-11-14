// The "!" info button: a small round button beside a control or a section title. Clicking it opens a short, plain-language note; clicking it
// again, pressing Escape or clicking anywhere else closes it. One note is open at a time across the whole app: the rover screens build the
// button as an HTML string with info(), and the globe's React panels render the same button through components/InfoTip.tsx.
// The note is one element appended to <body> (styles in atlas.css, which is always loaded); the button's look is in atlas.css and rsim.css.

const esc = (x) => String(x).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

let pop = null;       // the open note, if any
let owner = null;     // the button that opened it
let watch = 0;        // timer that closes the note if its button is removed from the page
let installed = false;

/** HTML of one info button. `text` is the note (1 to 3 short sentences); `label` is what a screen reader announces for the button. */
export function info(text, label = 'More information') {
  return `<button type="button" class="info-btn" aria-label="${esc(label)}" aria-expanded="false" data-info="${esc(text)}">!</button>`;
}

function place() {
  if (!pop || !owner) return;
  const r = owner.getBoundingClientRect(), w = pop.offsetWidth, h = pop.offsetHeight, m = 8;
  let left = r.left + r.width / 2 - w / 2;
  left = Math.max(m, Math.min(window.innerWidth - w - m, left));
  let top = r.bottom + 8;
  if (top + h > window.innerHeight - m && r.top - 8 - h >= m) top = r.top - 8 - h;   // no room below: open above
  pop.style.left = `${Math.round(left)}px`;
  pop.style.top = `${Math.round(Math.max(m, top))}px`;
}

/** Closes the open note, if any. */
export function closeInfo(refocus = false) {
  clearInterval(watch);
  if (pop) pop.remove();
  if (owner) { owner.setAttribute('aria-expanded', 'false'); owner.removeAttribute('aria-controls'); if (refocus && owner.isConnected) owner.focus(); }
  pop = null; owner = null;
}

function openInfo(btn) {
  closeInfo();
  owner = btn;
  pop = document.createElement('div');
  pop.className = 'info-pop';
  pop.id = 'info-pop';
  pop.setAttribute('role', 'note');
  pop.textContent = btn.dataset.info || '';
  document.body.appendChild(pop);
  btn.setAttribute('aria-expanded', 'true');
  btn.setAttribute('aria-controls', pop.id);
  place();
  // Panels repaint their HTML often (the rover panel, React re-renders): a note whose button is gone is closed.
  watch = setInterval(() => { if (owner && !owner.isConnected) closeInfo(); }, 400);
}

/** Installs the page-wide listeners once. Safe to call many times. */
export function installInfo() {
  if (installed) return;
  installed = true;
  document.addEventListener('click', (e) => {
    const btn = e.target instanceof Element ? e.target.closest('.info-btn') : null;
    if (btn) {
      // The button may sit inside a label or a summary: do not let the click toggle those as well.
      e.preventDefault(); e.stopPropagation();
      if (btn === owner) closeInfo(); else openInfo(btn);
      return;
    }
    if (pop && !(e.target instanceof Node && pop.contains(e.target))) closeInfo();
  }, true);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && pop) { e.stopPropagation(); e.preventDefault(); closeInfo(true); }
  }, true);
  window.addEventListener('resize', () => place());
  document.addEventListener('scroll', () => place(), true);
}
