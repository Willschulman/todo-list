export default class project {
  #active = true;
  #selected = false;

  constructor(name) {
    this.name = name;
    this.id = name.replace(/\s/g, "");
  }

  getSelected() {
    return this.#selected;
  }

  getActive() {
    return this.#active;
  }

  setSelected(selected) {
    this.#selected = selected;
  }
}
