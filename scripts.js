// scripts.js
document.addEventListener('DOMContentLoaded', async () => {
  document.getElementById('year').textContent = new Date().getFullYear();

  const toggle = document.getElementById('themeToggle');
  toggle?.addEventListener('click', () => {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });

  let pubs = null;
  try {
    // cache-bust + no-store to avoid stale responses
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
    // Optional: show a friendly message on the page
    const list = document.getElementById('pubList');
    list.innerHTML = '<li>Could not load publications. Check console for details.</li>';
  }
});

function renderPublications(pubs) {
  const list = document.getElementById('pubList');
  const yearSel = document.getElementById('yearFilter');
  // const showPreprints = document.getElementById('showPreprints');

  const years = Array.from(new Set(pubs.map(p => p.year))).sort((a,b) => b - a);
  years.forEach(y => {
    const opt = document.createElement('option');
    opt.value = String(y);
    opt.textContent = String(y);
    yearSel.appendChild(opt);
  });

  const draw = () => {
    const year = yearSel.value;
    // const allowPreprints = showPreprints.checked;
    list.innerHTML = '';
    pubs
      .filter(p => year === 'all' ? true : String(p.year) === year)
      // .filter(p => allowPreprints ? true : (p.venue || '').toLowerCase() !== 'arxiv')
      .sort((a,b) => (b.year - a.year) || a.title.localeCompare(b.title))
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
        const badges = (p.badges || []).map(b => `<span class="badge">${b}</span>`).join(' ');
        li.innerHTML = `${title}${badges ? ' ' + badges : ''}<br>${authors}. ${venue}. ${links}`;
        list.appendChild(li);
      });
  };

  yearSel.addEventListener('change', draw);
  // showPreprints.addEventListener('change', draw);
  draw();
}