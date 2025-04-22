export default class projectUI {
  constructor(projectRepository, eventBus) {
    this.projectRepository = projectRepository;
    this.eventBus = eventBus;
    this.sideBarEl = document.querySelector("#sideBar");
    this.todoAreaEl = document.querySelector("#todoArea");

    this.eventBus.subscribe(
      "projectSelected",
      this.highlightSelectedProject.bind(this),
    );
    this.eventBus.subscribe("projectCreated", this.renderProject.bind(this));
  }

  renderAllProjects() {
    while (this.sideBarEl.firstChild) {
      this.sideBarEl.removeChild(this.sideBarEl.firstChild);
    }

    this.projectRepository.getProjects().forEach((project) => {
      this.renderProject(project);
    });

    this.addNewProjectButton();
  }

  addNewProjectButton() {
    const newButton = document.createElement("svg");

    newButton.classList.add("newProjectButton");
    newButton.textContent = "Create New Project";

    newButton.innerHTML = `
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="50" height="50">
            <circle cx="50" cy="50" r="45" fill="#4CAF50" />
            <line x1="25" y1="50" x2="75" y2="50" stroke="white" stroke-width="8" stroke-linecap="round" />
            <line x1="50" y1="25" x2="50" y2="75" stroke="white" stroke-width="8" stroke-linecap="round" />
        </svg>`;

    newButton.addEventListener("click", () => {
      this.showNewProjectForm();
      newButton.remove();
    });

    this.sideBarEl.appendChild(newButton);
  }

  renderProject(project) {
    const sidebarDiv = document.createElement("div");
    sidebarDiv.setAttribute("id", "sidebar_" + project.id);
    sidebarDiv.classList.add("sidebarElement");

    if (project.getSelected()) {
      sidebarDiv.classList.add("selected");
    }

    sidebarDiv.textContent = project.name;
    sidebarDiv.addEventListener("click", () => {
      this.projectRepository.selectProject(project);
    });
    this.sideBarEl.appendChild(sidebarDiv);
  }

  showNewProjectForm() {
    const sidebarInputContainer = document.createElement("div");
    sidebarInputContainer.classList.add("sidebarInputContainer");

    const sidebarInput = document.createElement("input");
    sidebarInput.classList.add("sidebarInput");

    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("buttonContainer");

    const saveButton = document.createElement("button");
    saveButton.setAttribute("class", "saveButton");
    saveButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                <polyline points="17 21 17 13 7 13 7 21"></polyline>
                <polyline points="7 3 7 8 15 8"></polyline>
            </svg>`;

    saveButton.addEventListener("click", () => {
      const projectName = sidebarInput.value.trim();

      if (projectName) {
        this.projectRepository.addProject(projectName);
        this.renderAllProjects();
      } else {
        alert("Please enter a Project name");
      }
    });

    const closeButton = document.createElement("button");
    closeButton.setAttribute("class", "xButton");
    closeButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>`;

    closeButton.addEventListener("click", () => {
      this.renderAllProjects();
    });

    buttonContainer.appendChild(closeButton);
    buttonContainer.appendChild(saveButton);

    sidebarInputContainer.appendChild(sidebarInput);
    sidebarInputContainer.appendChild(buttonContainer);
    this.sideBarEl.appendChild(sidebarInputContainer);

    sidebarInput.focus();
  }

  highlightSelectedProject(project) {
    const projectEls = this.sideBarEl.querySelectorAll(".sidebarElement");
    projectEls.forEach((el) => {
      el.classList.remove("selected");
    });

    const selectedEl = this.sideBarEl.querySelector("#sidebar_" + project.id);
    if (selectedEl) {
      selectedEl.classList.add("selected");
    }

    while (this.todoAreaEl.firstChild) {
      this.todoAreaEl.removeChild(this.todoAreaEl.firstChild);
    }

    const projectDiv = document.createElement("div");
    projectDiv.id = project.id;
    projectDiv.classList.add("project");
    this.todoAreaEl.appendChild(projectDiv);

    this.eventBus.publish("projectContentAreaCreated", project);
  }
}
