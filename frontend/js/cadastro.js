import { criarToggle } from './ui/passwordToggle.js';
import { initPasswordStrength } from './ui/passwordStrength.js';
import { showError, clearError } from './utils/uiHelpers.js';
import { isValidEmail } from './utils/validation.js';
import { registerUser } from './services/authService.js';

(function () {
  'use strict';

  // ── DOM refs ──────────────────────────────────────────────
  const form = document.getElementById('formCadastro');
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const passInput = document.getElementById('password');
  const confirmInput = document.getElementById('confirmPassword');
  const btnVerSenha = document.getElementById('btnVerSenha');
  const btnVerConfirm = document.getElementById('btnVerConfirm');
  const forcaFill = document.getElementById('forcaPreenchimento');
  const forcaRotulo = document.getElementById('forcaRotulo');
  const erroName = document.getElementById('erroName');
  const erroEmail = document.getElementById('erroEmail');
  const erroPass = document.getElementById('erroPassword');
  const erroConfirm = document.getElementById('erroConfirm');
  const btnCadastrar = document.getElementById('btnCadastrar');

  criarToggle(btnVerSenha, passInput);
  criarToggle(btnVerConfirm, confirmInput);
  initPasswordStrength(passInput, forcaFill, forcaRotulo, erroPass);

  // ── Limpar erros ao digitar ───────────────────────────────
  nameInput.addEventListener('input', () => clearError(nameInput, erroName));
  emailInput.addEventListener('input', () => clearError(emailInput, erroEmail));
  confirmInput.addEventListener('input', () => clearError(confirmInput, erroConfirm));

  // ── SUBMIT ────────────────────────────────────────────────
  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    if (!validate()) return;

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passInput.value;

    btnCadastrar.disabled = true;
    btnCadastrar.textContent = 'Creating account…';

    try {
      const result = await registerUser(name, email, password);

      if (!result.success) {
        showError(emailInput, erroEmail, result.message);
        return;
      }

      window.location.href = 'index.html?registered=true';
    } catch (err) {
      console.error(err);
      showError(confirmInput, erroConfirm, 'Server error. Please try again.');
    } finally {
      btnCadastrar.disabled = false;
      btnCadastrar.textContent = 'Create Account';
    }
  });

  // ── Validação local ───────────────────────────────────────
  function validate() {
    let valid = true;

    const nameVal = nameInput.value.trim();
    const emailVal = emailInput.value.trim();
    const passVal = passInput.value;
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
})();
