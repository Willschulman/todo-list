export default class projectRepository {
    #projects = []
    #selectedProject = null
    #projectFactory
    #eventBus


    constructor(projectFactory, eventBus) {
        this.#projectFactory = projectFactory
        this.#eventBus = eventBus
    }

    addProject(name) {
        const project = this.#projectFactory.createProject(name)
        this.#projects.push(project)
        this.selectProject(project)

        return project
    }
    
    getProjectCount() {
        const projectCount = this.#projects.length()
    }

    getProjects() {
        return this.#projects
    }

    getProjectById(projectId) {
        return this.#projects.find(project => project.id === projectId)
    }

    selectProject(project) {
        this.#projects.forEach(p => {
            p.setSelected(false)
        });

        this.#selectedProject = project;
        project.setSelected(true);
        this.#eventBus.publish('projectSelected', project)
    }
}