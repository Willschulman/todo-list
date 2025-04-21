import './styles.css';
import EventBus from './core/events/EventBus';
import todoUI from './ui/todo/todoUI';
import projectUI from './ui/project/projectUI';
import projectRepository from './repositories/project/projectRepository';
import todoRepository from './repositories/todo/todoRepository';
import projectFactory from './factories/project/projectFactory';
import todoFactory from './factories/todo/todoFactory';
import todoItem from './models/todo/todoItem';
import project from './models/project/project';



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
        if (this.projectRepository.getProjects().length === 0) {
            const defaultProject = this.projectRepository.addProject("Default Project");
            
            // Add the todo BEFORE selecting the project
            this.todoRepository.addTodo(
                "Welcome",
                "Gotta go to Will's",
                new Date().toISOString().split('T')[0],
                defaultProject
            );
            
            // Then select the project, which will trigger rendering
            this.projectRepository.selectProject(defaultProject);
        }
        
        this.projectUI.renderAllProjects();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.todoApp = new TodoApp();
});