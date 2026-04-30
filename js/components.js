/* ═══════════════════════════════════════
   67SHOP — Component Loader
   ═══════════════════════════════════════ */

async function loadComponent(slotId, path) {
  const el = document.getElementById(slotId);
  if (!el) return;
  try {
    const r = await fetch(path);
    if (r.ok) {
      const html = await r.text();
      el.innerHTML = html;

      // Execute inline scripts manually (innerHTML doesn't execute scripts)
      el.querySelectorAll('script').forEach(oldScript => {
        const newScript = document.createElement('script');
        if (oldScript.src) {
          newScript.src = oldScript.src;
        } else {
          newScript.textContent = oldScript.textContent;
        }
        oldScript.parentNode.replaceChild(newScript, oldScript);
      });
    }
  } catch (e) { console.error('Component load error:', e); }
}

/* Modal helper */
function showModal(title, msg, onConfirm) {
  const overlay = document.getElementById('modalOverlay');
  document.getElementById('modalTitle').textContent = title;
  document.getElementById('modalMsg').textContent = msg;
  overlay.classList.add('show');

  const confirmBtn = document.getElementById('modalConfirm');
  const cancelBtn = document.getElementById('modalCancel');
  const close = () => overlay.classList.remove('show');

  // Clean old listeners
  const newConfirm = confirmBtn.cloneNode(true);
  confirmBtn.parentNode.replaceChild(newConfirm, confirmBtn);
  const newCancel = cancelBtn.cloneNode(true);
  cancelBtn.parentNode.replaceChild(newCancel, cancelBtn);

  newConfirm.addEventListener('click', () => { close(); if (onConfirm) onConfirm(); });
  newCancel.addEventListener('click', close);
}

/* Profit toggle utility */
function toggleProfit(el, amount) {
  const isHidden = el.getAttribute('data-hidden') !== 'false';
  if (isHidden) {
    el.textContent = '฿' + amount;
    el.setAttribute('data-hidden', 'false');
    el.classList.remove('cell-profit-hidden');
    el.style.fontWeight = '700';
    el.style.color = 'var(--secondary)';
  } else {
    el.textContent = 'ดูยอดกำไร';
    el.setAttribute('data-hidden', 'true');
    el.classList.add('cell-profit-hidden');
    el.style.fontWeight = '';
    el.style.color = '';
  }
}
