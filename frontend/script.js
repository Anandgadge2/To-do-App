const backend = 'http://localhost:5000';

document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');

  if (document.getElementById('registerForm')) {
    // Register
    document.getElementById('registerForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('regEmail').value;
      const password = document.getElementById('regPassword').value;
      const res = await fetch(`${backend}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      alert(await res.text());
    });

    // Login
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('loginEmail').value;
      const password = document.getElementById('loginPassword').value;
      const res = await fetch(`${backend}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.token) {
        localStorage.setItem('token', data.token);
        window.location.href = 'dashboard.html';
      } else {
        alert('Login failed');
      }
    });
  }

  if (document.getElementById('addTaskBtn')) {
    // Load Tasks
    async function loadTasks() {
      const res = await fetch(`${backend}/api/tasks`, {
        headers: { 'Authorization': localStorage.getItem('token') }
      });
      const tasks = await res.json();
      const list = document.getElementById('taskList');
      list.innerHTML = '';
      tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = "flex justify-between items-center border p-2 rounded";
        li.innerHTML = `
          <span>${task.text}</span>
          <button class="bg-red-500 hover:bg-red-700 text-white px-2 py-1 rounded" data-id="${task._id}">Delete</button>
        `;
        list.appendChild(li);
      });
    }

    // Add Task
    document.getElementById('addTaskBtn').addEventListener('click', async () => {
      const text = document.getElementById('taskInput').value;
      if (!text) return;
      await fetch(`${backend}/api/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token')
        },
        body: JSON.stringify({ text })
      });
      document.getElementById('taskInput').value = '';
      loadTasks();
    });

    // Delete Task
    document.getElementById('taskList').addEventListener('click', async (e) => {
      if (e.target.tagName === 'BUTTON') {
        const id = e.target.getAttribute('data-id');
        await fetch(`${backend}/api/tasks/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': localStorage.getItem('token') }
        });
        loadTasks();
      }
    });

    // Logout
    document.getElementById('logoutBtn').addEventListener('click', () => {
      localStorage.removeItem('token');
      window.location.href = 'index.html';
    });

    loadTasks();
  }
});
// Redirect to dashboard if already logged in