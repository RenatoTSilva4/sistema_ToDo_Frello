(function () {
  'use strict';

  const API_URL = 'http://localhost:3001/users';

  // ── DOM refs ──────────────────────────────────────────────
  const form           = document.getElementById('formCadastro');
  const nameInput      = document.getElementById('name');
  const emailInput     = document.getElementById('email');
  const passInput      = document.getElementById('password');
  const confirmInput   = document.getElementById('confirmPassword');
  const btnVerSenha    = document.getElementById('btnVerSenha');
  const btnVerConfirm  = document.getElementById('btnVerConfirm');
  const forcaFill      = document.getElementById('forcaPreenchimento');
  const forcaRotulo    = document.getElementById('forcaRotulo');
  const erroName       = document.getElementById('erroName');
  const erroEmail      = document.getElementById('erroEmail');
  const erroPass       = document.getElementById('erroPassword');
  const erroConfirm    = document.getElementById('erroConfirm');
  const btnCadastrar   = document.getElementById('btnCadastrar');

  // ── Toggle de senha ───────────────────────────────────────
  function criarToggle(btn, input) {
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

  criarToggle(btnVerSenha, passInput);
  criarToggle(btnVerConfirm, confirmInput);

  // ── Força da senha ────────────────────────────────────────
  const NIVEIS = [
    { pct: '0%',   cor: '#e5e7eb', texto: '' },
    { pct: '25%',  cor: '#ef4444', texto: 'Weak' },
    { pct: '50%',  cor: '#f97316', texto: 'Fair' },
    { pct: '75%',  cor: '#eab308', texto: 'Good' },
    { pct: '90%',  cor: '#22c55e', texto: 'Strong' },
    { pct: '100%', cor: '#16a34a', texto: 'Very Strong' },
  ];

  passInput.addEventListener('input', function () {
    const val   = passInput.value;
    let score   = 0;
    if (val.length >= 8)              score++;
    if (val.length >= 12)             score++;
    if (/[A-Z]/.test(val))            score++;
    if (/[0-9]/.test(val))            score++;
    if (/[^A-Za-z0-9]/.test(val))    score++;

    const nivel = val.length === 0 ? NIVEIS[0] : NIVEIS[Math.min(score, 5)];
    forcaFill.style.width      = nivel.pct;
    forcaFill.style.background = nivel.cor;
    forcaRotulo.textContent    = nivel.texto;
    forcaRotulo.style.color    = nivel.cor;

    clearError(passInput, erroPass);
  });

  // ── Limpar erros ao digitar ───────────────────────────────
  nameInput.addEventListener('input',    () => clearError(nameInput,    erroName));
  emailInput.addEventListener('input',   () => clearError(emailInput,   erroEmail));
  confirmInput.addEventListener('input', () => clearError(confirmInput, erroConfirm));

  // ── SUBMIT ────────────────────────────────────────────────
  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    if (!validate()) return;

    const name     = nameInput.value.trim();
    const email    = emailInput.value.trim();
    const password = passInput.value;

    btnCadastrar.disabled    = true;
    btnCadastrar.textContent = 'Creating account…';

    try {
      // 1️⃣  GET — verifica email duplicado
      const checkRes   = await fetch(`${API_URL}?email=${encodeURIComponent(email)}`);
      const existentes = await checkRes.json();

      if (existentes.length > 0) {
        showError(emailInput, erroEmail, 'This email is already registered.');
        return;
      }

      // 2️⃣  POST — cria o usuário
      const createRes = await fetch(API_URL, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ name, email, password }),
      });

      if (!createRes.ok) {
        throw new Error('Server error on create.');
      }

      // 3️⃣  Redireciona para o login com flag de sucesso
      window.location.href = 'index.html?registered=true';

    } catch (err) {
      console.error(err);
      showError(confirmInput, erroConfirm, 'Server error. Please try again.');
    } finally {
      btnCadastrar.disabled    = false;
      btnCadastrar.textContent = 'Create Account';
    }
  });

  // ── Validação local ───────────────────────────────────────
  function validate() {
    let valid = true;

    const nameVal    = nameInput.value.trim();
    const emailVal   = emailInput.value.trim();
    const passVal    = passInput.value;
    const confirmVal = confirmInput.value;

    if (!nameVal) {
      showError(nameInput, erroName, 'Full name is required.');
      valid = false;
    }

    if (!emailVal) {
      showError(emailInput, erroEmail, 'Email is required.');
      valid = false;
    } else if (!isValidEmail(emailVal)) {
      showError(emailInput, erroEmail, 'Enter a valid email address.');
      valid = false;
    }

    if (!passVal) {
      showError(passInput, erroPass, 'Password is required.');
      valid = false;
    } else if (passVal.length < 8) {
      showError(passInput, erroPass, 'Password must be at least 8 characters.');
      valid = false;
    }

    if (!confirmVal) {
      showError(confirmInput, erroConfirm, 'Please confirm your password.');
      valid = false;
    } else if (passVal !== confirmVal) {
      showError(confirmInput, erroConfirm, 'Passwords do not match.');
      valid = false;
    }

    return valid;
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function showError(input, span, message) {
    input.closest('.grupo-campo').classList.add('campo-erro');
    span.textContent = message;
  }

  function clearError(input, span) {
    input.closest('.grupo-campo').classList.remove('campo-erro');
    span.textContent = '';
  }

})();