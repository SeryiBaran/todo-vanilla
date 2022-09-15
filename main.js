import "./sb.min.css";
import "./style.css";

const controls = document.querySelector(".controls");
const todosContainer = document.querySelector(".todos");

let todos = JSON.parse(localStorage.getItem("todos")) || [];

function generateKey(prefix) {
  return `TODO_${new Date().getTime()}_${Math.random()}`;
}

function updateLocalStorage() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

function removeTodo(e) {
  const btn = e.target;
  const todo = btn.parentNode;
  const index = todos.map((e) => e[0]).indexOf(todo.id);
  btn.parentNode.parentNode.removeChild(btn.parentNode);
  todos.splice(index, 1);
  updateLocalStorage();
}

function renderTodos() {
  todosContainer.innerHTML = "";
  todos
    .slice()
    .reverse()
    .forEach((todo) => {
      todosContainer.innerHTML += `<div class="todo" id="${todo[0]}">
          ${todo[1]}
          <button class="todo__close-btn">X</button>
        </div>`;
    });

  document.querySelectorAll(".todo__close-btn").forEach((btn) => {
    btn.addEventListener("click", removeTodo);
  });
}

function createTodo(text) {
  todos.push([generateKey(), text]);
  updateLocalStorage();
  renderTodos();
}

function handleSubmit(e) {
  e.preventDefault();
  createTodo(
    controls.text.value
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/'/g, "&#39;")
      .replace(/"/g, "&#34;")
  );
  controls.text.value = "";
}

renderTodos();

controls.addEventListener("submit", handleSubmit);
