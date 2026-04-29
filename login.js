(function () {
  'use strict';

  if (localStorage.getItem('todo_user')) {
    window.location.href = 'dashboard.html';
    return;
  }

  const form        = document.getElementById('formLogin');
  const emailInput  = document.getElementById('email');
  const passInput   = document.getElementById('password');
  const erroEmail   = document.getElementById('erroEmail');
  const erroPass    = document.getElementById('erroPassword');
  const btnVerSenha = document.getElementById('btnVerSenha');

  btnVerSenha.addEventListener('click', function () {
    const isPassword = passInput.type === 'password';
    passInput.type = isPassword ? 'text' : 'password';

    btnVerSenha.innerHTML = isPassword
      ? /* olho fechado SVG */
        `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20C5 20 1 12 1 12a18.45 18.45 0 0 1 5.06-5.94" stroke="#9CA3AF" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" stroke="#9CA3AF" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
          <line x1="1" y1="1" x2="23" y2="23" stroke="#9CA3AF" stroke-width="1.8" stroke-linecap="round"/>
        </svg>`
      : /* olho aberto SVG */
        `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="#9CA3AF" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
          <circle cx="12" cy="12" r="3" stroke="#9CA3AF" stroke-width="1.8"/>
        </svg>`;
  });

  emailInput.addEventListener('input', function () {
    clearError(emailInput, erroEmail);
  });

  passInput.addEventListener('input', function () {
    clearError(passInput, erroPass);
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (validate()) {
      localStorage.setItem('todo_user', emailInput.value.trim());
      window.location.href = 'dashboard.html';
    }
  });

  function validate() {
    let valid = true;

    // Email
    const emailVal = emailInput.value.trim();
    if (!emailVal) {
      showError(emailInput, erroEmail, 'Email is required.');
      valid = false;
    } else if (!isValidEmail(emailVal)) {
      showError(emailInput, erroEmail, 'Enter a valid email address.');
      valid = false;
    }

    // Senha
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