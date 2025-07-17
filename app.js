// app.js for Kanban Task Manager

document.addEventListener("DOMContentLoaded", () => {
  const addTaskBtn = document.getElementById("addTaskBtn");
  const taskModal = document.getElementById("taskModal");
  const closeModal = document.getElementById("closeModal");
  const saveTaskBtn = document.getElementById("saveTaskBtn");
  const taskTitle = document.getElementById("taskTitle");
  const taskDescription = document.getElementById("taskDescription");
  const todoList = document.getElementById("todoList");

  function openModal() {
    taskModal.style.display = "flex";
  }

  function closeModalFunc() {
    taskModal.style.display = "none";
    taskTitle.value = "";
    taskDescription.value = "";
  }

  addTaskBtn.addEventListener("click", openModal);
  closeModal.addEventListener("click", closeModalFunc);

  saveTaskBtn.addEventListener("click", () => {
    const title = taskTitle.value.trim();
    const description = taskDescription.value.trim();

    if (title !== "") {
      const task = { id: Date.now(), title, description, status: "todo" };
      saveTaskToLocal(task);
      addTaskToUI(task);
      closeModalFunc();
    }
  });

  function saveTaskToLocal(task) {
    let tasks = JSON.parse(localStorage.getItem("kanbanTasks")) || [];
    tasks.push(task);
    localStorage.setItem("kanbanTasks", JSON.stringify(tasks));
  }

  function loadTasks() {
    let tasks = JSON.parse(localStorage.getItem("kanbanTasks")) || [];
    tasks.forEach((task) => addTaskToUI(task));
  }

  function addTaskToUI(task) {
    const taskDiv = document.createElement("div");
    taskDiv.classList.add("task");
    taskDiv.setAttribute("draggable", "true");
    taskDiv.dataset.id = task.id;
    taskDiv.dataset.status = task.status;

    taskDiv.innerHTML = `<strong>${task.title}</strong><p>${task.description}</p>`;

    addDragEvents(taskDiv);

    if (task.status === "todo") {
      todoList.appendChild(taskDiv);
    } else if (task.status === "in-progress") {
      document.getElementById("inProgressList").appendChild(taskDiv);
    } else if (task.status === "done") {
      document.getElementById("doneList").appendChild(taskDiv);
    }
  }

  function addDragEvents(task) {
    task.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", task.dataset.id);
    });
  }

  document.querySelectorAll(".task-list").forEach((list) => {
    list.addEventListener("dragover", (e) => e.preventDefault());

    list.addEventListener("drop", (e) => {
      e.preventDefault();
      const id = e.dataTransfer.getData("text/plain");
      const taskEl = document.querySelector(`[data-id='${id}']`);
      list.appendChild(taskEl);
      updateTaskStatus(id, list.id);
    });
  });

  function updateTaskStatus(id, listId) {
    let tasks = JSON.parse(localStorage.getItem("kanbanTasks")) || [];
    tasks = tasks.map((task) => {
      if (task.id == id) {
        task.status =
          listId === "todoList"
            ? "todo"
            : listId === "inProgressList"
            ? "in-progress"
            : "done";
      }
      return task;
    });
    localStorage.setItem("kanbanTasks", JSON.stringify(tasks));
  }

  loadTasks();
});
