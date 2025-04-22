export default class todoItem {
  #complete = false;
  #active = true;

  constructor(name, description, projectId, dueDate) {
    this.name = name;
    this.description = description;
    this.projectId = projectId;
    this.dueDate = dueDate;
    this.id = name.replace(/\s/g, "");
  }

  getStatus() {
    return this.#complete;
  }

  getActive() {
    return this.#active;
  }

  completeStatus() {
    this.#complete = true;
  }

  deleteTodo() {
    this.#active = false;
  }
}
