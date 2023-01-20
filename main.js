import { v4 as uuidv4 } from "uuid";
import { store as createStore } from "./store.js";

import "./sb.min.css";
import "./main.scss";

const controls = document.querySelector(".controls");
const todosContainer = document.querySelector(".todos");

const LOCALSTORAGE_KEY = "vanilla-todos";

const xssDictionary = {
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

const utils = {
  generateID: uuidv4,
  protectXSS(string) {
    let newString = string;

    for (let symbol in xssDictionary) {
      newString = newString.replace(
        new RegExp(symbol, "g"),
        xssDictionary[symbol]
      );
    }

    return newString;
  },
};

const initialState = JSON.parse(localStorage.getItem(LOCALSTORAGE_KEY)) || [];

const todosApi = {
  create(data) {
    store.todos.push({ id: utils.generateID(), ...data });
  },
  remove(id) {
    store.todos = store.todos.filter((todo) => todo.id !== id);
  },
  render() {
    todosContainer.innerHTML = "";
    store.todos.forEach((todo) => {
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
    localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(store.todos));
  },
  handleTodosChange() {
    this.updateLocalStorage();
    this.render();
  },
};

const store = createStore({ todos: initialState }, "todos", () => {
  todosApi.handleTodosChange();
});

function handleSubmit(e) {
  e.preventDefault();

  if (controls.text.value.trim() === "") return;

  todosApi.create({ content: utils.protectXSS(controls.text.value) });
  controls.text.value = "";
}

todosApi.render();

controls.addEventListener("submit", handleSubmit);
