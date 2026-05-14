// ── Força da senha ────────────────────────────────────────
import { clearError } from '../utils/uiHelpers.js';

const NIVEIS = [
  { pct: '0%', cor: '#e5e7eb', texto: '' },
  { pct: '25%', cor: '#ef4444', texto: 'Weak' },
  { pct: '50%', cor: '#f97316', texto: 'Fair' },
  { pct: '75%', cor: '#eab308', texto: 'Good' },
  { pct: '90%', cor: '#22c55e', texto: 'Strong' },
  { pct: '100%', cor: '#16a34a', texto: 'Very Strong' },
];

export function initPasswordStrength(passInput, forcaFill, forcaRotulo, erroPass) {
  passInput.addEventListener('input', function () {
    const val = passInput.value;
    let score = 0;
    if (val.length >= 8) score++;
    if (val.length >= 12) score++;
    if (/[A-Z]/.test(val)) score++;
    if (/[0-9]/.test(val)) score++;
    if (/[^A-Za-z0-9]/.test(val)) score++;

    const nivel = val.length === 0 ? NIVEIS[0] : NIVEIS[Math.min(score, 5)];
    forcaFill.style.width = nivel.pct;
    forcaFill.style.background = nivel.cor;
    forcaRotulo.textContent = nivel.texto;
    forcaRotulo.style.color = nivel.cor;

    clearError(passInput, erroPass);
  });
}
