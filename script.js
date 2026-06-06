// Form aur Input
const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");

// List aur Counters
const taskList = document.getElementById("taskList");
const pendingTasks = document.getElementById("pendingTasks");
const completedTasks = document.getElementById("completedTasks");
const emptyText = document.getElementById("emptyText");

// Edit Popup
const editPopup = document.getElementById("editPopup");
const editTaskInput = document.getElementById("editTaskInput");
const updateTask = document.getElementById("updateTask");
const closeEdit = document.getElementById("closeEdit");

// Theme Button
const themeBtn = document.getElementById("themeBtn");

let taskCollection =
    JSON.parse(localStorage.getItem("taskCollection"))
    || [];

let selectedTaskId = null;

function storeTasks() {
    localStorage.setItem(
        "taskCollection",
        JSON.stringify(taskCollection)
    );
}

function displayTasks() {

    taskList.innerHTML = "";

    taskCollection.forEach(task => {

        const listItem = document.createElement("li");

        listItem.className = "task-item";

        listItem.innerHTML = `
      <div>

        <input
          type="checkbox"
          ${task.completed ? "checked" : ""}
          onchange="toggleTaskStatus(${task.id})"
        >

        <span class="${task.completed ? "completed" : ""}">
          ${task.text}
        </span>

      </div>

      <div class="task-buttons">

        <button
          class="edit-btn"
          onclick="openEditPopup(${task.id})"
        >
          Edit
        </button>

        <button
          class="delete-btn"
          onclick="removeTask(${task.id})"
        >
          Delete
        </button>

      </div>
    `;

        taskList.appendChild(listItem);

    });

    updateTaskCounters();

    emptyText.style.display =
        taskCollection.length === 0
            ? "block"
            : "none";
}

taskForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();

        const taskText =
            taskInput.value.trim();

        if (taskText === "") return;

        const newTask = {
            id: Date.now(),
            text: taskText,
            completed: false
        };

        taskCollection.push(newTask);

        storeTasks();

        displayTasks();

        taskInput.value = "";

    }
);

function toggleTaskStatus(id) {

    taskCollection =
        taskCollection.map(task => {

            if (task.id === id) {

                return {
                    ...task,
                    completed: !task.completed
                };

            }

            return task;

        });

    storeTasks();
    displayTasks();
}

function removeTask(id) {

    const confirmDelete =
        confirm(
            "Do you want to delete this task?"
        );

    if (confirmDelete) {

        taskCollection =
            taskCollection.filter(
                task => task.id !== id
            );

        storeTasks();
        displayTasks();
    }
}

function openEditPopup(id) {

    const task =
        taskCollection.find(
            task => task.id === id
        );

    selectedTaskId = id;

    editTaskInput.value = task.text;

    editPopup.classList.add("show");
}

updateTask.addEventListener(
    "click",
    function () {

        const updatedText =
            editTaskInput.value.trim();

        if (updatedText === "") {

            alert("Task cannot be empty");

            return;
        }

        taskCollection =
            taskCollection.map(task => {

                if (
                    task.id === selectedTaskId
                ) {

                    return {
                        ...task,
                        text: updatedText
                    };
                }

                return task;
            });

        storeTasks();

        displayTasks();

        closePopup();

    }
);

closeEdit.addEventListener(
    "click",
    closePopup
);

function closePopup() {

    editPopup.classList.remove("show");

    selectedTaskId = null;

}

function updateTaskCounters() {

    const completed =
        taskCollection.filter(
            task => task.completed
        ).length;

    const pending =
        taskCollection.length - completed;

    completedTasks.textContent =
        completed;

    pendingTasks.textContent =
        pending;
}

themeBtn.addEventListener(
    "click",
    function () {

        document.body.classList.toggle(
            "dark-mode"
        );

        const isDark =
            document.body.classList.contains(
                "dark-mode"
            );

        localStorage.setItem(
            "themeMode",
            isDark ? "dark" : "light"
        );

        themeBtn.textContent =
            isDark ? "☀️" : "🌙";

    }
);

function loadTheme() {

    const savedTheme =
        localStorage.getItem("themeMode");

    if (savedTheme === "dark") {

        document.body.classList.add(
            "dark-mode"
        );

        themeBtn.textContent = "☀️";

    } else {

        themeBtn.textContent = "🌙";

    }
}

loadTheme();
displayTasks();