const TASKS_API = 'http://localhost:3000/tasks';

export async function addTask(userId, text) {
  const response = await fetch(TASKS_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId: String(userId), text, done: false }),
  });

  if (!response.ok) {
    throw new Error('Failed to add task.');
  }

  return await response.json();
}

export async function toggleTask(id, done) {
  const response = await fetch(`${TASKS_API}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ done: !done }),
  });

  if (!response.ok) {
    throw new Error('Failed to update task.');
  }

  return await response.json();
}

export async function removeTask(id) {
  const response = await fetch(`${TASKS_API}/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to remove task.');
  }
}

export async function loadTasks(userId) {
  const url = `${TASKS_API}?userId=${encodeURIComponent(userId)}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Failed to load tasks.');
  }

  return await response.json();
}
