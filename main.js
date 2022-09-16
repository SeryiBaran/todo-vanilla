import "./sb.min.css";
import "./main.scss";

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
  todos.forEach((todo) => {
    todosContainer.insertAdjacentHTML('afterbegin', `<div class="todo" id="${todo[0]}">
          <button class="todo__remove-btn">Удалить</button>
          <p class="todo__text">${todo[1]}</p>
        </div>`);
  });

  document.querySelectorAll(".todo__remove-btn").forEach((btn) => {
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

  if (controls.text.value.trim() === "") return;

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
