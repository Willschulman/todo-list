import project from "../../models/project/project";

export default class projectFactory {
  createProject(name, id = name.replace(/\s/g, "")) {
    return new project(name, id);
  }
}
