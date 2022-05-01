const enterTextEl = document.getElementById("enter-text-el");
const list = document.getElementById("list");

let allTodosList = [];
let activeTodosList = [];
let completedTodosList = [];

const itemCountEl = document.getElementById("item-count-el");

const clearBtn = document.getElementById("clear-btn");

const allBtn = document.getElementById("all-btn");
const activeBtn = document.getElementById("active-btn");
const completedBtn = document.getElementById("completed-btn");
const desktopBtns = [allBtn, activeBtn, completedBtn];

const allBtnMobile = document.getElementById("all-btn-mobile");
const activeBtnMobile = document.getElementById("active-btn-mobile");
const completedBtnMobile = document.getElementById("completed-btn-mobile");
const mobileBtns = [allBtnMobile, activeBtnMobile, completedBtnMobile];

const pageBtns = [...desktopBtns, ...mobileBtns];

const pluralSEl = document.getElementById("plural-s-el");

const allTodosListFromLocalStorage = JSON.parse(localStorage.getItem("allTodosList"));
const activeTodosListFromLocalStorage = JSON.parse(localStorage.getItem("activeTodosList"));
const completedTodosListFromLocalStorage = JSON.parse(localStorage.getItem("completedTodosList"));

enterTextEl.focus();

if (allTodosListFromLocalStorage) {
    allTodosList = [...allTodosListFromLocalStorage];
    loadList(allTodosList);
}

allTodosList.forEach(todo => {
    if (todo.isActive) {
        activeTodosList.push(todo);
    } else {
        completedTodosList.push(todo);
    }
});

updateItemCount(activeTodosList.length);

enterTextEl.addEventListener("keyup", (e) => {
    if (e.key !== "Enter" || !enterTextEl.value) return;

    createNewTodo();
    enterTextEl.value = "";
});

class Todo {
    constructor(text, isActive) {
        this.text = text;
        this.isActive = isActive;
    }
}

function createNewTodo(text = enterTextEl.value, isActive = true) {
    const todo = new Todo(text, isActive);
    renderTodos(todo);

    if (todo.isActive) {
        activeTodosList.push(todo);
    } else {
        completedTodosList.push(todo);
    }
    allTodosList.push(todo);

    updateItemCount(activeTodosList.length);

    if (completedBtn.classList.contains("selected") || completedBtnMobile.classList.contains("selected")) {
        completedBtn.classList.remove("selected");
        completedBtnMobile.classList.remove("selected");
        selectAllBtn();
        loadList(allTodosList);
    }

    saveListsToLocalStorage();
}

function renderTodos(todo) {
    const todoOuterContainer = document.createElement("div");
    const todoInnerContainer = document.createElement("span");
    const todoText = document.createElement("span");
    const checkbox = document.createElement("button");
    const crossContainer = document.createElement("div");
    const crossIcon = document.createElement("img");

    list.appendChild(todoOuterContainer);
        todoOuterContainer.classList.add("todo-container");
    todoOuterContainer.appendChild(todoInnerContainer);
        todoInnerContainer.classList.add("todo");
    todoInnerContainer.appendChild(todoText);
        todoText.textContent = todo.text;
        todoText.setAttribute("title", "Click to copy");
    todoOuterContainer.appendChild(checkbox);
        checkbox.classList.add("checkbox-round");
        checkbox.classList.add("list-checkbox");
    todoOuterContainer.appendChild(crossContainer);
        crossContainer.classList.add("cross");
    crossContainer.appendChild(crossIcon);
        crossIcon.setAttribute("src", "/images/icon-cross.svg");
        crossIcon.setAttribute("draggable", "false");
        crossIcon.setAttribute("loading", "lazy");

    if (!todo.isActive) {
        addCheck(checkbox, todoText);
    }

    checkbox.addEventListener("click", () => {
        if (todo.isActive) { // switches to from unchecked to checked
            todo.isActive = !todo.isActive;

            addCheck(checkbox, todoText);
            
            const index = activeTodosList.indexOf(todo);
            activeTodosList.splice(index, 1);
            completedTodosList.push(todo);
            
            if (activeBtn.classList.contains("selected") || activeBtnMobile.classList.contains("selected")) {
                generateActiveTodos();
            }
        } else { // switches to from checked to unchecked
            todo.isActive = !todo.isActive;
            checkbox.innerHTML = "";
            checkbox.style.background = "none";
            todoText.classList.remove("strike");

            const index = completedTodosList.indexOf(todo);
            completedTodosList.splice(index, 1);
            activeTodosList.push(todo);

            if (completedBtn.classList.contains("selected") || completedBtnMobile.classList.contains("selected")) {
                generateCompletedTodos();
            }
        }
        
        updateItemCount(activeTodosList.length);

        saveListsToLocalStorage();
    });

    crossIcon.addEventListener("click", () => {
        const index = allTodosList.indexOf(todo);
        allTodosList.splice(index, 1);

        if (activeTodosList.includes(todo)) {
            const indexOfRemovedTodo = activeTodosList.indexOf(todo);
            activeTodosList.splice(indexOfRemovedTodo, 1);
        }

        if (completedTodosList.includes(todo)) {
            const indexOfRemovedTodo = completedTodosList.indexOf(todo);
            completedTodosList.splice(indexOfRemovedTodo, 1);
        }

        updateItemCount(activeTodosList.length);

        todoOuterContainer.remove();

        saveListsToLocalStorage();
    });

    todoText.addEventListener("click", () => {
        navigator.clipboard.writeText(todo.text);
    });
}

function addCheck(checkbox, todoText) {
    checkbox.style.background = "linear-gradient(hsl(192, 100%, 67%), hsl(280, 87%, 65%))";
        
    const checkIcon = document.createElement("img");
        
    checkbox.appendChild(checkIcon);
        checkIcon.classList.add("check-icon");
        checkIcon.setAttribute("src", "/images/icon-check.svg");
        todoText.classList.add("strike");
}

function saveListsToLocalStorage() {
    localStorage.setItem("allTodosList", JSON.stringify(allTodosList));
    localStorage.setItem("activeTodosList", JSON.stringify(activeTodosList));
    localStorage.setItem("completedTodosList", JSON.stringify(completedTodosList));
}

function updateItemCount(itemCount) {
    itemCountEl.textContent = itemCount;
    if (itemCount === 1) {
        pluralSEl.textContent = "";
    } else {
        pluralSEl.textContent = "s";
    }
}

function loadList(arr) {
    list.innerHTML = "";

    arr.forEach(item => {
        renderTodos(item);
    });
}

// ========== BUTTONS ==========

allBtn.addEventListener("click", generateAllTodos);
allBtnMobile.addEventListener("click", generateAllTodos);

activeBtn.addEventListener("click", generateActiveTodos);
activeBtnMobile.addEventListener("click", generateActiveTodos);

completedBtn.addEventListener("click", generateCompletedTodos);
completedBtnMobile.addEventListener("click", generateCompletedTodos);

function generateAllTodos() {
    loadList(allTodosList);
}

function generateActiveTodos() {
    loadList(activeTodosList);
}

function generateCompletedTodos() {
    loadList(completedTodosList);
}

window.addEventListener("resize", () => {
    const width = document.documentElement.clientWidth;
    activateButtonsOnResize(width);
});

function activateButtonsOnResize(width) {
    let btnClassNum;

    if (width <= 680) {
        desktopBtns.forEach((btn, index) => {
            if (btn.classList.contains("selected")) {
                btnClassNum = index;
                mobileBtns[btnClassNum].classList.add("selected");
            }
        });
    } else {
        mobileBtns.forEach((btn, index) => {
            if (btn.classList.contains("selected")) {
                btnClassNum = index;
                desktopBtns[btnClassNum].classList.add("selected");
            }
        });
    }
}

function activateButtonsOnResize(width) {
    let btnClassNum;

    if (width <= 680) {
        desktopBtns.forEach((btn, index) => {
            if (btn.classList.contains("selected")) {
                btnClassNum = index;
                mobileBtns[btnClassNum].classList.add("selected");
            }
        });
    } else {
        mobileBtns.forEach((btn, index) => {
            if (btn.classList.contains("selected")) {
                btnClassNum = index;
                desktopBtns[btnClassNum].classList.add("selected");
            }
        });
    }
}

function selectAllBtn() {
    pageBtns.forEach(pageBtn => {
        pageBtn.classList.remove("selected");
    });
    allBtn.classList.add("selected");
    allBtnMobile.classList.add("selected");
}

pageBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        pageBtns.forEach(pageBtn => {
            pageBtn.classList.remove("selected");
        });
        btn.classList.add("selected");
    });
});

clearBtn.addEventListener("click", () => {
    if (completedTodosList.length === 0) return;

    completedTodosList = [];

    allTodosList = [...activeTodosList];

    selectAllBtn();

    saveListsToLocalStorage();

    loadList(activeTodosList);
});