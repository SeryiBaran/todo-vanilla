import { v4 as uuidv4 } from "uuid";
import { BehaviorSubject, filter, map } from "rxjs";

import "./sb.min.css";
import "./main.scss";

const controls = document.querySelector(".controls");
const todosContainer = document.querySelector(".todos");

const LOCALSTORAGE_KEY = "vanilla-todos";

const utils = {
  generateID: uuidv4,
  protectXSS(content) {
    return encodeURIComponent(content);
  },
};

const initialState = JSON.parse(localStorage.getItem(LOCALSTORAGE_KEY)) || [];

let todos = initialState;

const todos$ = new BehaviorSubject(initialState);

const setTodos = (data) => todos$.next(data);

const todosApi = {
  create(data) {
    setTodos([...todos, { id: utils.generateID(), ...data }]);
  },
  remove(id) {
    setTodos(todos.filter((todo) => todo.id !== id));
  },
  render() {
    todosContainer.innerHTML = "";
    todos.forEach((todo) => {
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
    localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(todos));
  },
  handleTodosChange() {
    this.updateLocalStorage();
    this.render();
  },
};

todos$.subscribe((data) => {
  todos = data;
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
