(function () {
  'use strict';

  const STORAGE_USER  = 'todo_user';
  const STORAGE_TASKS = 'todo_tasks';

  const userEmail = localStorage.getItem(STORAGE_USER);
  if (!userEmail) {
    window.location.href = 'index.html';
    return;
  }

  // ── DOM refs ─────────────────────────────────────────────
  const emailEl    = document.getElementById('userEmail');
  const taskInput  = document.getElementById('taskInput');
  const btnAdd     = document.getElementById('btnAdd');
  const taskList   = document.getElementById('taskList');
  const erroTask   = document.getElementById('erroTask');
  const btnLogout  = document.getElementById('btnLogout');

  emailEl.textContent = userEmail;

  let tasks = loadTasks();
  renderList();

  btnAdd.addEventListener('click', addTask);

  taskInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') addTask();
  });

  taskInput.addEventListener('input', function () {
    clearTaskError();
  });

  btnLogout.addEventListener('click', function () {
    localStorage.removeItem(STORAGE_USER);
    window.location.href = 'index.html';
  });

  function addTask() {
    const text = taskInput.value.trim();
    if (!text) {
      showTaskError('Please enter a task before adding.');
      return;
    }

    tasks.push({ id: Date.now(), text: text, done: false });
    saveTasks();
    renderList();
    taskInput.value = '';
    taskInput.focus();
  }

  function renderList() {
    taskList.innerHTML = '';

    if (tasks.length === 0) {
      const li = document.createElement('li');
      li.className = 'task-vazia';
      li.textContent = 'No tasks yet. Add one above! ✅';
      taskList.appendChild(li);
      return;
    }

    tasks.forEach(function (task) {
      const li = document.createElement('li');
      li.className = 'task-item' + (task.done ? ' task-item--concluida' : '');
      li.dataset.id = task.id;

      // Checkbox
      const check = document.createElement('input');
      check.type = 'checkbox';
      check.className = 'task-item__checkbox';
      check.checked = task.done;
      check.setAttribute('aria-label', 'Mark task as done');
      check.addEventListener('change', function () {
        toggleTask(task.id);
      });

      // Label
      const label = document.createElement('span');
      label.className = 'task-item__label';
      label.textContent = task.text;

      // Remove button
      const removeBtn = document.createElement('button');
      removeBtn.className = 'task-item__remove';
      removeBtn.type = 'button';
      removeBtn.setAttribute('aria-label', 'Remove task');
      removeBtn.textContent = '✕';
      removeBtn.addEventListener('click', function () {
        removeTask(task.id);
      });

      li.appendChild(check);
      li.appendChild(label);
      li.appendChild(removeBtn);
      taskList.appendChild(li);
    });
  }

  function toggleTask(id) {
    tasks = tasks.map(function (t) {
      return t.id === id ? { id: t.id, text: t.text, done: !t.done } : t;
    });
    saveTasks();
    renderList();
  }

  function removeTask(id) {
    tasks = tasks.filter(function (t) { return t.id !== id; });
    saveTasks();
    renderList();
  }

  function saveTasks() {
    localStorage.setItem(STORAGE_TASKS, JSON.stringify(tasks));
  }

  function loadTasks() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_TASKS)) || [];
    } catch (e) {
      return [];
    }
  }

  function showTaskError(msg) {
    erroTask.textContent = msg;
    taskInput.classList.add('input-erro');
  }

  function clearTaskError() {
    erroTask.textContent = '';
    taskInput.classList.remove('input-erro');
  }

})();