const API_URL = 'http://localhost:3000/users';

export async function loginUser(email, password) {
  const res = await fetch(`${API_URL}?email=${encodeURIComponent(email)}`);
  if (!res.ok) {
    throw new Error('Unable to fetch user data.');
  }

  const users = await res.json();
  if (users.length === 0) {
    return { success: false, field: 'email', message: 'User not found.' };
  }

  const user = users[0];
  if (user.password !== password) {
    return { success: false, field: 'password', message: 'Invalid password.' };
  }

  return { success: true, user };
}

export async function registerUser(name, email, password) {
  const checkRes = await fetch(`${API_URL}?email=${encodeURIComponent(email)}`);
  if (!checkRes.ok) {
    throw new Error('Unable to verify email.');
  }

  const existentes = await checkRes.json();
  if (existentes.length > 0) {
    return { success: false, field: 'email', message: 'This email is already registered.' };
  }

  const createRes = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });

  if (!createRes.ok) {
    return { success: false, field: 'form', message: 'Server error on create.' };
  }

  const user = await createRes.json();
  return { success: true, user };
}
