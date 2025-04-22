export default class todoRepository {
    #todos = []
    #todoFactory
    #eventBus
    #projectRepository


    constructor(todoFactory, eventBus, projectRepository) {
        this.#todoFactory = todoFactory
        this.#eventBus = eventBus
        this.#projectRepository = projectRepository
        this.#eventBus.subscribe('todoUpdateRequested', this.handleTodoUpdateRequest.bind(this))

    }

    addTodo(name, description, dueDate, project) {
        const todo = this.#todoFactory.createTodo(
            name, description, dueDate, project.id
        );
        this.#todos.push(todo);
        this.saveTodoRepo()
        this.#eventBus.publish('todoCreated', todo)
        return todo;
    }

    getTodosByProject(projectId) {
        return this.#todos.filter(todo => 
            todo.getActive() && todo.projectId === projectId
        );
    }

    deleteTodo(todo) {
        todo.deleteTodo()
        const project = this.#projectRepository.getProjectById(todo.projectId)
        this.saveTodoRepo()
        this.#eventBus.publish('todoDeleted', project)
    }

    handleTodoUpdateRequest(data) {
        const { todo, name, description, dueDate } = data;
        
        const index = this.#todos.findIndex(t => t.id === todo.id);
        
        if (index !== -1) {
            const updatedTodo = this.#todoFactory.createTodo(
                name, description, dueDate, todo.projectId
            );
            
            updatedTodo.id = todo.id;
            
            this.#todos[index] = updatedTodo;
            
            const project = this.#projectRepository.getProjectById(todo.projectId);

            this.saveTodoRepo()
            
            this.#eventBus.publish('todoUpdated', {
                todo: updatedTodo,
                project: project
            });  
        }


    }

    saveTodoRepo() {
        const todoData = this.#todos.map(todo => ({
            name: todo.name,
            description: todo.description,
            dueDate: todo.dueDate,
            projectId: todo.projectId,
            active: todo.getActive()
        }))

        console.log(todoData)
        localStorage.setItem("todoRepo", JSON.stringify(todoData))
    }

    getTodoRepo() {
        const todoRepo = localStorage.getItem("todoRepo")
        const todoRepoJson = JSON.parse(todoRepo)
        this.#todos = []

        todoRepoJson.forEach(todoData => {
            const todo = this.#todoFactory.createTodo(todoData.name, todoData.description, todoData.dueDate, todoData.projectId)
            if (todoData.active !== true) {
                todo.deleteTodo()
            }
            this.#todos.push(todo)
        })
    }

}
