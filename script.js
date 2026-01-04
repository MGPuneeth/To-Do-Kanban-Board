let tasksData = {};

const todo = document.querySelector("#todo");
const progress = document.querySelector("#progress");
const completed = document.querySelector("#completed");
const createNewTaskBtn = document.querySelector("#toggle-modal");
const modal = document.querySelector(".modal");
const addNewTaskBtn = document.querySelector("#add-new-task");
const titleInput = document.querySelector("#title");
const descriptionInput = document.querySelector("#description");
const modalBg = document.querySelector(".bg");

let draggedElement = null;

if (!localStorage.getItem("tasks")) {
  modal.classList.toggle("active");
} else {
  const data = JSON.parse(localStorage.getItem("tasks"));

  if (
    data.todo.length === 0 &&
    data.progress.length === 0 &&
    data.completed.length === 0
  ) {
    modal.classList.toggle("active");
  }
  for (const col in data) {
    const column = document.querySelector(`#${col}`);

    data[col].forEach((item) => {
      const task = createTask(item.title, item.description);
      column.appendChild(task);
    });
  }
  countTasks();
}
// console.log(typeof tasks);

const taskDivs = document.querySelectorAll(".task");

function createTask(title, description) {
  const task = document.createElement("div");
  task.innerHTML = `
  <h3>${title}</h3>
  <p>${description}</p>
            <button>Delete</button>
  `;
  task.setAttribute("draggable", "true");
  task.classList.add("task");

  const deleteBtn = task.querySelector("button");

  deleteBtn.addEventListener("click", () => {
    // console.log(e);
    task.remove();
    countTasks();
  });

  return task;
}

taskDivs.forEach((task) => {
  task.addEventListener("drag", (e) => {
    // console.log("dragging", e);
    draggedElement = task;
    // console.log(task);
  });
});

function addDragEvents(column) {
  column.addEventListener("dragenter", (e) => {
    //   console.log("Drag enter", e);
    e.preventDefault();
    column.classList.add("hover-over");
  });

  column.addEventListener("dragleave", (e) => {
    //   console.log("Drag leave", e);
    e.preventDefault();
    column.classList.remove("hover-over");
  });

  column.addEventListener("dragover", (e) => {
    e.preventDefault();
  });

  column.addEventListener("drop", (e) => {
    column.appendChild(draggedElement);
    column.classList.remove("hover-over");
    countTasks();
  });
}

function countTasks() {
  const columns = [todo, progress, completed];
  columns.forEach((col) => {
    const tasks = col.querySelectorAll(".task");
    const count = col.querySelector(".right");

    tasksData[col.id] = Array.from(tasks).map((t) => {
      return {
        title: t.querySelector("h3").innerText,
        description: t.querySelector("p").innerText,
      };
    });
    // console.log(tasksData);

    localStorage.setItem("tasks", JSON.stringify(tasksData));

    count.innerText = tasks.length;
  });
}

addDragEvents(todo);
addDragEvents(progress);
addDragEvents(completed);

createNewTaskBtn.addEventListener("click", () => {
  modal.classList.toggle("active");
});

modalBg.addEventListener("click", () => {
  modal.classList.toggle("active");
});

addNewTaskBtn.addEventListener("click", () => {
  const newTask = createTask(titleInput.value, descriptionInput.value);
  todo.appendChild(newTask);

  newTask.addEventListener("drag", (e) => {
    draggedElement = newTask;
  });
  titleInput.value = "";
  descriptionInput.value = "";

  countTasks();

  modal.classList.remove("active");
});

//
