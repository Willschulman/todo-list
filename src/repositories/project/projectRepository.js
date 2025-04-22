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
        this.saveProjectRepo()
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
        this.saveProjectRepo()
        this.#eventBus.publish('projectSelected', project)
    }

    saveProjectRepo() {
        const projectsData = this.#projects.map(project => ({
            name: project.name,
            id: project.id,
            selected: project.getSelected()
        }))

        localStorage.setItem("projectRepo", JSON.stringify(projectsData))
    }

    getProjectRepo() {
        const projectRepo = localStorage.getItem("projectRepo")
        const projectRepoJson = JSON.parse(projectRepo)
        this.#projects = []
        let selectedProjectData = null;


        projectRepoJson.forEach(projectData => {
            const project = this.#projectFactory.createProject(projectData.name)
            if (projectData.selected === true) {
                project.setSelected(true)
                //this.selectProject(project)
                this.#selectedProject = project
                selectedProjectData = projectData
            }
            this.#projects.push(project)
        })

        if (this.#selectedProject) {
            this.#eventBus.publish('projectSelected', this.#selectedProject);
        }
    }
}