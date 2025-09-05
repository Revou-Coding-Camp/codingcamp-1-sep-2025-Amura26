/* DATA */
let tasks = [];

/* VALIDASI & TAMBAH TASK */
function validateInput() {
  const inputEl = document.getElementById('task-input');
  const dateEl = document.getElementById('task-date');

  const desc = inputEl ? inputEl.value.trim() : '';
  const due = dateEl ? dateEl.value : '';

  if (!desc || !due) {
    alert('Please fill in all fields.');
    return;
  }

  addTask(desc, due);
  // reset input
  inputEl.value = '';
  dateEl.value = '';
  applyCurrentFilter();
}

function addTask(description, dueDate) {
  const newTask = {
    id: Date.now(),
    description,
    dueDate,
    completed: false
  };
  tasks.push(newTask);
}

/* HAPUS 1 TASK */
function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  applyCurrentFilter();
}

/* HAPUS SEMUA TASK */
function deleteAllTasks() {
  if (!confirm('Are you sure you want to delete ALL tasks?')) return;
  tasks = [];
  applyCurrentFilter();
}

/* TOGGLE STATUS DONE / UNDO */
function toggleTaskStatus(id) {
  tasks = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
  applyCurrentFilter();
}

/* FILTER  */
function filterTasks() {
  const sel = document.getElementById('filter-select');
  const value = sel ? sel.value : 'all';

  let filtered = tasks;
  if (value === 'pending') filtered = tasks.filter(t => !t.completed);
  if (value === 'done') filtered = tasks.filter(t => t.completed);

  renderTaskList(filtered);
}

/* helper: panggil ulang filter yang sedang aktif (dipakai setelah operasi mutasi) */
function applyCurrentFilter() {
  const sel = document.getElementById('filter-select');
  if (sel) {
    // trigger filterTasks() agar menggunakan value dropdown saat ini
    filterTasks();
  } else {
    renderTaskList(tasks);
  }
}

/* RENDER */
function renderTaskList(list = tasks) {
  const container = document.getElementById('task-list');
  container.innerHTML = '';

  if (!list || list.length === 0) {
    container.innerHTML = `<p class="text-gray-500">No tasks found.</p>`;
    return;
  }

  list.forEach(task => {
    const li = document.createElement('li');
    if (task.completed) li.classList.add('completed-task');

    li.innerHTML = `
  <div class="task-left">
    <strong>${escapeHtml(task.description)}</strong>
    <small>${task.dueDate}</small>
  </div>

  <div class="task-right">
    <button class="task-btn done" onclick="toggleTaskStatus(${task.id})">
  ${
    task.completed
      ? `
        <!-- Icon Undo -->
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" 
             stroke-width="2" stroke="currentColor" width="18" height="18">
          <path stroke-linecap="round" stroke-linejoin="round" 
                d="M9 15l-6-6m0 0l6-6m-6 6h18" />
        </svg>
        Undo
      `
      : `
        <!-- Icon Done -->
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" 
             stroke-width="2" stroke="currentColor" width="18" height="18">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        Done
      `
  }
</button>
    <button class="task-btn delete" onclick="deleteTask(${task.id})">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" 
           stroke-width="2" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
      Delete
    </button>
  </div>
`;

    container.appendChild(li);
  });
}


/* small helper untuk security: escape text saat menampilkan */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

document.addEventListener('DOMContentLoaded', () => {
  const sel = document.getElementById('filter-select');
  if (sel) sel.addEventListener('change', filterTasks);

  const delAllBtn = document.getElementById('delete-all-btn');
  if (delAllBtn) delAllBtn.addEventListener('click', deleteAllTasks);

  renderTaskList(tasks);
});
