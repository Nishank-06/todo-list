// Theme setup
const darkToggle = document.getElementById("darkModeToggle");
const body = document.body;
darkToggle.checked = localStorage.getItem("darkMode") === "on";
if (darkToggle.checked) body.classList.add("dark");

darkToggle.addEventListener("change", () => {
  body.classList.toggle("dark");
  localStorage.setItem("darkMode", darkToggle.checked ? "on" : "off");
});

// DOM references
const taskInput = document.getElementById("taskInput");
const categorySelect = document.getElementById("category");
const taskList = document.getElementById("taskList");
const clearBtn = document.getElementById("clearBtn");

// Utility functions
const getTasks = () => JSON.parse(localStorage.getItem("tasks")) || [];
const saveTasks = (tasks) => localStorage.setItem("tasks", JSON.stringify(tasks));

// Load tasks
const loadTasks = () => {
  const tasks = getTasks();
  taskList.innerHTML = "";

  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    if (task.done) li.classList.add("done");

    li.innerHTML = `
      <div>
        <span class="tag ${task.category.toLowerCase()}">${task.category}</span>
        ${task.text}
      </div>
      <small>${task.timestamp}</small>
    `;

    // Toggle task status
    li.onclick = () => {
      tasks[index].done = !tasks[index].done;
      saveTasks(tasks);
      loadTasks();
    };

    // Delete button
    const delBtn = document.createElement("button");
    delBtn.innerHTML = '<i class="fas fa-trash"></i>';
    delBtn.className = "delete-btn";
    delBtn.onclick = (e) => {
      e.stopPropagation();
      if (confirm("Delete this task?")) {
        tasks.splice(index, 1);
        saveTasks(tasks);
        loadTasks();
      }
    };

    li.appendChild(delBtn);
    taskList.appendChild(li);
  });
};

// Add task
const addTask = () => {
  const text = taskInput.value.trim();
  const category = categorySelect.value;
  if (!text) return alert("Please enter a task.");

  const newTask = {
    text,
    category,
    done: false,
    timestamp: new Date().toLocaleString()
  };

  const tasks = getTasks();
  tasks.push(newTask);
  saveTasks(tasks);
  taskInput.value = "";
  loadTasks();
};

// Clear all tasks
clearBtn.onclick = () => {
  if (confirm("Delete all tasks?")) {
    localStorage.removeItem("tasks");
    loadTasks();
  }
};

// Load tasks on page load
window.onload = loadTasks;
