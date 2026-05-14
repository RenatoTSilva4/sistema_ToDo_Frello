// ── Toggle de senha ───────────────────────────────────────
export function criarToggle(btn, input) {
  btn.addEventListener('click', function () {
    const hidden = input.type === 'password';
    input.type = hidden ? 'text' : 'password';
    btn.innerHTML = hidden
      ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none">
             <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20C5 20 1 12 1 12a18.45 18.45 0 0 1 5.06-5.94" stroke="#9CA3AF" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
             <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" stroke="#9CA3AF" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
             <line x1="1" y1="1" x2="23" y2="23" stroke="#9CA3AF" stroke-width="1.8"/>
           </svg>`
      : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none">
             <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="#9CA3AF" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
             <circle cx="12" cy="12" r="3" stroke="#9CA3AF" stroke-width="1.8"/>
           </svg>`;
  });
}
