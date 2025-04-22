import todoItem from "../../models/todo/todoItem";

export default class todoFactory {
  createTodo(name, description, dueDate, projectId) {
    return new todoItem(name, description, projectId, dueDate);
  }
}
