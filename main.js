import { v4 as uuidv4 } from "uuid";

import "./sb.min.css";
import "./main.scss";

const controls = document.querySelector(".controls");
const todosContainer = document.querySelector(".todos");

const LOCALSTORAGE_KEY = "vanilla-todos";

const utils = {
  generateID() {
    return uuidv4();
  },
  protectXSS(content) {
    return content
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/'/g, "&#39;")
      .replace(/"/g, "&#34;");
  },
};

const todosApi = {
  todos: JSON.parse(localStorage.getItem(LOCALSTORAGE_KEY)) || [],
  create(data) {
    this.todos.push({ id: utils.generateID(), ...data });
    this.handleTodosChange();
  },
  remove(id) {
    this.todos = this.todos.filter((todo) => todo.id !== id);
    this.handleTodosChange();
  },
  handleTodosChange() {
    this.updateLocalStorage();
    this.render();
  },
  render() {
    todosContainer.innerHTML = "";
    this.todos.forEach((todo) => {
      todosContainer.insertAdjacentHTML(
        "afterbegin",
        `<div class="todo" id="${todo.id}">
          <button class="todo__remove-btn" data-todoid="${todo.id}">Удалить</button>
          <p class="todo__text">${todo.content}</p>
        </div>`
      );
    });
    document.querySelectorAll(".todo__remove-btn").forEach((btn) => {
      btn.addEventListener("click", () => this.remove(btn.dataset.todoid));
    });
  },
  updateLocalStorage() {
    localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(this.todos));
  },
};

function handleSubmit(e) {
  e.preventDefault();

  if (controls.text.value.trim() === "") return;

  todosApi.create({ content: utils.protectXSS(controls.text.value) });
  controls.text.value = "";
}

todosApi.render();

controls.addEventListener("submit", handleSubmit);
