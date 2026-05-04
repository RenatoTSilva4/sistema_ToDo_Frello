(function () {
  'use strict';

  const API_URL = 'http://localhost:3001/users';

  const form        = document.getElementById('formLogin');
  const emailInput  = document.getElementById('email');
  const passInput   = document.getElementById('password');
  const erroEmail   = document.getElementById('erroEmail');
  const erroPass    = document.getElementById('erroPassword');
  const btnVerSenha = document.getElementById('btnVerSenha');
  const msgSucesso  = document.getElementById('msgSucesso');

  const params = new URLSearchParams(window.location.search);
  if (params.get('registered') === 'true') {
    msgSucesso.textContent = 'Account created successfully! You can now log in.';
  }

  // ── Mostrar/ocultar senha ─────────────────────────────
  btnVerSenha.addEventListener('click', function () {
    const isPassword = passInput.type === 'password';
    passInput.type = isPassword ? 'text' : 'password';

    btnVerSenha.innerHTML = isPassword
      ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20C5 20 1 12 1 12a18.45 18.45 0 0 1 5.06-5.94" stroke="#9CA3AF" stroke-width="1.8"/>
          <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" stroke="#9CA3AF" stroke-width="1.8"/>
          <line x1="1" y1="1" x2="23" y2="23" stroke="#9CA3AF" stroke-width="1.8"/>
        </svg>`
      : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="#9CA3AF" stroke-width="1.8"/>
          <circle cx="12" cy="12" r="3" stroke="#9CA3AF" stroke-width="1.8"/>
        </svg>`;
  });

  // ── Remove erro ao digitar ────────────────────────────
  emailInput.addEventListener('input', () => clearError(emailInput, erroEmail));
  passInput.addEventListener('input', () => clearError(passInput, erroPass));

  // submi(login com API fake)
  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    if (!validate()) return;

    const email = emailInput.value.trim();
    const password = passInput.value;

    try {
      // busca apenas pelo email
      const res = await fetch(`${API_URL}?email=${encodeURIComponent(email)}`);
      const users = await res.json();

      if (users.length === 0) {
        showError(emailInput, erroEmail, 'User not found');
        return;
      }

      const user = users[0];

      // valida senha no js
      if (user.password !== password) {
        showError(passInput, erroPass, 'Invalid password');
        return;
      }

      // ✅ Login OK
      localStorage.setItem('todo_user', user.email);
      window.location.href = 'dashboard.html';

    } catch (err) {
      console.error(err);
      showError(passInput, erroPass, 'Server error. Try again.');
    }
  });


  // ── Validação ─────────────────────────────────────────
  function validate() {
    let valid = true;

    const emailVal = emailInput.value.trim();
    if (!emailVal) {
      showError(emailInput, erroEmail, 'Email is required.');
      valid = false;
    } else if (!isValidEmail(emailVal)) {
      showError(emailInput, erroEmail, 'Enter a valid email address.');
      valid = false;
    }

    const passVal = passInput.value;
    if (!passVal) {
      showError(passInput, erroPass, 'Password is required.');
      valid = false;
    } else if (passVal.length < 8) {
      showError(passInput, erroPass, 'Password must be at least 8 characters.');
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