import { STORAGE_USER } from './utils/storage.js';
import { loadTasks, addTask, toggleTask, removeTask } from './services/taskService.js';

(function () {
  'use strict';

  const user = JSON.parse(localStorage.getItem(STORAGE_USER));

  if (!user) {
    window.location.href = 'index.html';
    return;
  }

  const userId = String(user.id);

  // DOM
  const emailEl = document.getElementById('userEmail');
  const taskInput = document.getElementById('taskInput');
  const btnAdd = document.getElementById('btnAdd');
  const taskList = document.getElementById('taskList');
  const erroTask = document.getElementById('erroTask');
  const btnLogout = document.getElementById('btnLogout');

  emailEl.textContent = user.email;

  let tasks = [];

  btnAdd.addEventListener('click', handleAddTask);

  taskInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') handleAddTask();
  });

  taskInput.addEventListener('input', function () {
    clearTaskError();
  });

  btnLogout.addEventListener('click', function () {
    localStorage.removeItem(STORAGE_USER);
    window.location.href = 'index.html';
  });

  async function refreshTasks() {
    tasks = await loadTasks(userId);
    renderList();
  }

  async function handleAddTask() {
    const text = taskInput.value.trim();

    if (!text) {
      showTaskError('Please enter a task before adding.');
      return;
    }

    await addTask(userId, text);
    taskInput.value = '';
    clearTaskError();
    await refreshTasks();
  }

  function showTaskError(msg) {
    erroTask.textContent = msg;
    taskInput.classList.add('input-erro');
  }

  function clearTaskError() {
    erroTask.textContent = '';
    taskInput.classList.remove('input-erro');
  }

  refreshTasks();

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
        toggleTask(task.id, task.done);
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
})();
