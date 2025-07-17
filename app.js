document.addEventListener("DOMContentLoaded", () => {
  const addTaskBtn = document.getElementById("addTaskBtn");
  const taskModal = document.getElementById("taskModal");
  const closeModal = document.getElementById("closeModal");
  const saveTaskBtn = document.getElementById("saveTaskBtn");
  const taskTitle = document.getElementById("taskTitle");
  const taskDescription = document.getElementById("taskDescription");

  addTaskBtn.addEventListener("click", () => {
    taskModal.style.display = "flex";
  });

  closeModal.addEventListener("click", () => {
    taskModal.style.display = "none";
    taskTitle.value = "";
    taskDescription.value = "";
  });

  saveTaskBtn.addEventListener("click", () => {
    const title = taskTitle.value.trim();
    const description = taskDescription.value.trim();

    if (title !== "") {
      const task = { id: Date.now(), title, description, status: "todo" };
      saveTask(task);
      renderTasks();
      taskModal.style.display = "none";
      taskTitle.value = "";
      taskDescription.value = "";
    }
  });

  function saveTask(task) {
    let tasks = JSON.parse(localStorage.getItem("kanbanTasks")) || [];
    tasks.push(task);
    localStorage.setItem("kanbanTasks", JSON.stringify(tasks));
  }

  function deleteTask(id) {
    let tasks = JSON.parse(localStorage.getItem("kanbanTasks")) || [];
    tasks = tasks.filter((task) => task.id !== id);
    localStorage.setItem("kanbanTasks", JSON.stringify(tasks));
  }

  function renderTasks() {
    document
      .querySelectorAll(".task-list")
      .forEach((list) => (list.innerHTML = ""));
    let tasks = JSON.parse(localStorage.getItem("kanbanTasks")) || [];
    tasks.forEach((task) => {
      const taskDiv = document.createElement("div");
      taskDiv.classList.add("task");
      taskDiv.setAttribute("draggable", "true");
      taskDiv.dataset.id = task.id;

      taskDiv.innerHTML = `
                <strong>${task.title}</strong>
                <p>${task.description}</p>
                <small style="color:#777;">(Double-click to delete)</small>
            `;

      taskDiv.addEventListener("dblclick", () => {
        if (confirm("Delete this task?")) {
          deleteTask(task.id);
          renderTasks();
        }
      });

      taskDiv.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", task.id);
      });

      if (task.status === "todo") {
        document.getElementById("todoList").appendChild(taskDiv);
      } else if (task.status === "in-progress") {
        document.getElementById("inProgressList").appendChild(taskDiv);
      } else if (task.status === "done") {
        document.getElementById("doneList").appendChild(taskDiv);
      }
    });
  }

  document.querySelectorAll(".task-list").forEach((list) => {
    list.addEventListener("dragover", (e) => e.preventDefault());
    list.addEventListener("drop", (e) => {
      e.preventDefault();
      const id = e.dataTransfer.getData("text/plain");
      let tasks = JSON.parse(localStorage.getItem("kanbanTasks")) || [];
      tasks = tasks.map((task) => {
        if (task.id == id) {
          task.status =
            list.id === "todoList"
              ? "todo"
              : list.id === "inProgressList"
              ? "in-progress"
              : "done";
        }
        return task;
      });
      localStorage.setItem("kanbanTasks", JSON.stringify(tasks));
      renderTasks();
    });
  });

  renderTasks();
});
