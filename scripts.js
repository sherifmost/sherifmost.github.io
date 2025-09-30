// scripts.js
document.addEventListener('DOMContentLoaded', async () => {
  // Footer year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Theme toggle
  const toggle = document.getElementById('themeToggle');
  toggle?.addEventListener('click', () => {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });

  // Load publications (with cache-bust)
  let pubs = null;
  try {
    const res = await fetch('publications.json?v=' + Date.now(), { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
    pubs = await res.json();
  } catch (err) {
    console.warn('Failed to load publications.json:', err);
    const inline = document.getElementById('pubdata');
    if (inline?.textContent?.trim()) {
      try { pubs = JSON.parse(inline.textContent); }
      catch (e) { console.error('Inline pubdata parse error:', e); }
    }
  }

  if (Array.isArray(pubs)) {
    renderPublications(pubs);
  } else {
    const list = document.getElementById('pubList');
    if (list) list.innerHTML = '<li>Could not load publications. Check console for details.</li>';
  }
});

/* -------- Helpers for badges -------- */
function escapeHTML(s) {
  return String(s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}

function badgeHTML(badgeText) {
  const text = String(badgeText).trim();
  const lower = text.toLowerCase();

  // 🏆 Best Paper (any "best … paper" phrasing)
  if (/(^|\b)best\b.*\bpaper\b/.test(lower)) {
    return `<span class="badge badge--best" title="${escapeHTML(text)}">🏆 ${escapeHTML(text)}</span>`
    // Best&nbsp;Paper</span>`;
  }

  // 🥈 Runner-up / Honourable mention
  if (/runner.?up/.test(lower)) {
    return `<span class="badge badge--runnerup" title="${escapeHTML(text)}">🥈 Runner-up</span>`;
  }
  if (/honou?rable\s+mention/.test(lower)) {
    return `<span class="badge badge--runnerup" title="${escapeHTML(text)}">🏅 Honorable&nbsp;Mention</span>`;
  }

  // 📉 Acceptance rate (e.g., "Acceptance: 18%" or "accept 12.5%")
  const m = lower.match(/accept(?:ance)?[:\s]*([0-9]+(?:\.[0-9]+)?)\s*%/);
  if (m) {
    const rate = m[1];
    return `<span class="badge badge--accept" data-rate="${escapeHTML(rate)}" title="${escapeHTML(text)}">📉 Acceptance</span>`;
  }

  // Default badge
  return `<span class="badge" title="${escapeHTML(text)}">${escapeHTML(text)}</span>`;
}

/* -------- Renderer -------- */
function renderPublications(pubs) {
  const list = document.getElementById('pubList');
  if (!list) {
    console.error('Missing #pubList in HTML.');
    return;
  }

  const yearSel = document.getElementById('yearFilter'); // may be null if you removed the filter

  // Populate the year selector if present
  if (yearSel) {
    // prevent duplicate options if render is ever called twice
    const existing = new Set([...yearSel.querySelectorAll('option')].map(o => o.value));
    const years = Array.from(new Set(pubs.map(p => p.year))).sort((a, b) => b - a);
    years.forEach(y => {
      const val = String(y);
      if (!existing.has(val)) {
        const opt = document.createElement('option');
        opt.value = val;
        opt.textContent = val;
        yearSel.appendChild(opt);
      }
    });
  }

  const draw = () => {
    const year = yearSel?.value ?? 'all';

    list.innerHTML = '';
    pubs
      .filter(p => year === 'all' ? true : String(p.year) === year)
      .sort((a, b) => (b.year - a.year) || a.title.localeCompare(b.title))
      .forEach(p => {
        const li = document.createElement('li');
        const title = `<span class="pub-title">${p.title}</span>`;
        const authors = (p.authors || []).join(', ');
        const venue = `<span class="pub-venue">${p.venue || ''} ${p.year || ''}</span>`;
        const links = [
          p.doi ? `<a href="https://doi.org/${p.doi}" target="_blank" rel="noopener">DOI</a>` : '',
          p.pdf ? `<a href="${p.pdf}" target="_blank" rel="noopener">PDF</a>` : '',
          p.code ? `<a href="${p.code}" target="_blank" rel="noopener">Code</a>` : '',
          p.poster ? `<a href="${p.poster}" target="_blank" rel="noopener">Poster</a>` : '',
          p.video ? `<a href="${p.video}" target="_blank" rel="noopener">Video</a>` : ''
        ].filter(Boolean).join(' · ');

        const badges = (p.badges || []).map(badgeHTML).join(' ');
        li.innerHTML = `${title}${badges ? ' ' + badges : ''}<br>${authors}. ${venue}. ${links}`;
        list.appendChild(li);
      });
  };

  // Attach listeners only if the control exists
  yearSel?.addEventListener('change', draw);

  draw();
}