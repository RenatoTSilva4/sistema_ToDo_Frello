export function showError(input, span, message) {
  input.closest('.grupo-campo').classList.add('campo-erro');
  span.textContent = message;
}

export function clearError(input, span) {
  input.closest('.grupo-campo').classList.remove('campo-erro');
  span.textContent = '';
}
