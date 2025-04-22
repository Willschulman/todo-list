import './styles.css';
import EventBus from './core/events/EventBus';
import todoUI from './ui/todo/todoUI';
import projectUI from './ui/project/projectUI';
import projectRepository from './repositories/project/projectRepository';
import todoRepository from './repositories/todo/todoRepository';
import projectFactory from './factories/project/projectFactory';
import todoFactory from './factories/todo/todoFactory';
import todoItem from './models/todo/todoItem';



class TodoApp {
    constructor() {
        this.eventBus = new EventBus();
        
        this.projectFactory = new projectFactory();
        this.todoFactory = new todoFactory();
        
        this.projectRepository = new projectRepository(this.projectFactory, this.eventBus);
        this.todoRepository = new todoRepository(
            this.todoFactory, 
            this.eventBus,
            this.projectRepository
        );        

        this.projectUI = new projectUI(this.projectRepository, this.eventBus);
        this.todoUI = new todoUI(this.todoRepository, this.projectRepository, this.eventBus);
        
        this.initialize();
    }
    
    initialize() {
        if (localStorage.getItem("projectRepo")) {

            if (localStorage.getItem("todoRepo")) {
                this.todoRepository.getTodoRepo()
            }
            
            this.projectRepository.getProjectRepo()

        } else if (this.projectRepository.getProjects().length === 0) {
            const defaultProject = this.projectRepository.addProject("Default Project");
            
            this.todoRepository.addTodo(
                "Welcome",
                "Gotta go to Will's",
                new Date().toISOString().split('T')[0],
                defaultProject
            );
            
            this.projectRepository.selectProject(defaultProject);
        }
        
        this.projectUI.renderAllProjects();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.todoApp = new TodoApp();
});