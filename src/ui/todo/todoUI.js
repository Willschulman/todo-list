export default class todoUI {
    constructor(todoRepository, projectRepository, eventBus) {
        this.todoRepository = todoRepository;
        this.projectRepository = projectRepository;
        this.eventBus = eventBus;

        this.sideBarEl = document.querySelector("#sideBar");
        this.todoAreaEl = document.querySelector("#todoArea");

        this.eventBus.subscribe('todoCreated', this.renderTodo.bind(this));
        this.eventBus.subscribe('todoDeleted', this.renderProjectTodos.bind(this));
        this.eventBus.subscribe('todoUpdated', this.handleTodoUpdated.bind(this));
        this.eventBus.subscribe('projectSelected', this.renderProjectTodos.bind(this));
        this.eventBus.subscribe('projectContentAreaCreated', this.renderProjectTodos.bind(this));
    }

    handleTodoUpdated(data) {
        const {  project } = data;
        this.renderProjectTodos(project);
    }

    renderProjectTodos(project) {
        if (!project || !project.id) {
            console.log("Project not provided or invalid");
            return;
        }
    
        const todos = this.todoRepository.getTodosByProject(project.id);
        
        const projectEl = document.querySelector(`#${project.id}`);
        if (!projectEl) {
            console.log(`Project element #${project.id} not found in the DOM`);
            return;
        }
        
        while (projectEl.firstChild) {
            projectEl.removeChild(projectEl.firstChild);
        }
        
        todos.forEach(todo => {
            if (todo.getActive() === true) {
                this.renderTodo(todo);
            }
        });
        
        this.addNewTodoButton(project);
}

    renderTodo(todo) {
        const existingTodo = document.querySelector(`#${todo.id}ContainerDiv`);
        if (existingTodo) {
            existingTodo.remove();
        }

        const projectEl = document.querySelector(`#${todo.projectId}`)
        if (!projectEl) return;

        const containerDiv = document.createElement("div")
        containerDiv.id = `${todo.id}ContainerDiv`;
        containerDiv.classList.add("todoContainer", "existingTodo");

        const topContainerDiv = document.createElement("div");
        topContainerDiv.id = `${todo.id}TopContainerDiv`;
        topContainerDiv.classList.add("topContainerDiv");
        
        const titleContainer = document.createElement("div");
        titleContainer.id = `${todo.id}TitleContainerDiv`;
        titleContainer.classList.add("TitleContainer");

        const titleDiv = document.createElement("div");
        titleDiv.id = todo.id;
        titleDiv.classList.add("title");
        titleDiv.textContent = todo.name;

        const buttonContainer = document.createElement("div")
        buttonContainer.setAttribute("id", todo.id+"ButtonContainerDiv" )
        buttonContainer.classList.add("buttonContainer")


        const editButton = document.createElement("button")
        editButton.setAttribute("class", "editButton")
        editButton.setAttribute("id", todo.name.replace(/\s/g,'')+"Edit")
        editButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
            </svg>
        `

        editButton.addEventListener('click', () => {
            this.showEditTodoForm(todo);
        })


        const deleteButton = document.createElement("button")
        deleteButton.setAttribute("class", "deleteButton")
        deleteButton.setAttribute("id", todo.name.replace(/\s/g,'')+"Delete")
        deleteButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
        `
        deleteButton.addEventListener('click', () => {
                this.todoRepository.deleteTodo(todo);

            } )

        //deleteButton.setAttribute("data-todo-delete", todo.id)

        const descriptionDiv = document.createElement("div");
        descriptionDiv.id = `${todo.id}Desc`;
        descriptionDiv.classList.add("description");
        descriptionDiv.textContent = todo.description;
        
        const dueDateDiv = document.createElement("div");
        dueDateDiv.id = `${todo.id}Date`;
        dueDateDiv.classList.add("dueDate");
        dueDateDiv.textContent = todo.dueDate;
        
        buttonContainer.appendChild(editButton);
        buttonContainer.appendChild(deleteButton);
        
        titleContainer.appendChild(titleDiv);
        titleContainer.appendChild(buttonContainer);
        
        topContainerDiv.appendChild(titleContainer);
        topContainerDiv.appendChild(descriptionDiv);
        
        containerDiv.appendChild(topContainerDiv);
        containerDiv.appendChild(dueDateDiv);
        
        projectEl.appendChild(containerDiv);

    }

    addNewTodoButton(project) {
        const projectEl = document.querySelector(`#${project.id}`);
        if (!projectEl) return;

        const buttonContainer = document.createElement("div");
        buttonContainer.classList.add("todo-button-container");
        
        const button = document.createElement("button");
        button.classList.add("new-todo-button");
        button.innerHTML = `
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="50" height="50">
                <circle cx="50" cy="50" r="45" fill="#4CAF50" />
                <line x1="25" y1="50" x2="75" y2="50" stroke="white" stroke-width="8" stroke-linecap="round" />
                <line x1="50" y1="25" x2="50" y2="75" stroke="white" stroke-width="8" stroke-linecap="round" />
            </svg>`;
        
        button.addEventListener('click', () => {
            this.showNewTodoForm(project);
            buttonContainer.remove();
        });
        
        buttonContainer.appendChild(button);
        projectEl.appendChild(buttonContainer);
    }
        
    showNewTodoForm(project) {
        const projectEl = document.querySelector(`#${project.id}`);
        if (!projectEl) return;
        
        const containerDiv = document.createElement("div");
        containerDiv.classList.add("todoContainer", "newTodoCreator")
        
        const titleContainer = document.createElement("div")
        
        const buttonContainer = document.createElement("div")
        
        const topContainerDiv = document.createElement("div")
        
        const titleInput = document.createElement("input")
    
        const descriptionInput = document.createElement("input")
        const dueDateInput = document.createElement("input")
        dueDateInput.setAttribute("type", "date")

        const saveButton = document.createElement("button")
        saveButton.setAttribute("class", "saveButton")
        saveButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                <polyline points="17 21 17 13 7 13 7 21"></polyline>
                <polyline points="7 3 7 8 15 8"></polyline>
            </svg>`

        saveButton.addEventListener('click', () => {
            const nameElement = document.querySelector("#createBlockTitle")
            const nameValue = nameElement.value
            const descElement = document.querySelector("#createBlockDescription")
            const descValue = descElement.value
            const dueElement = document.querySelector("#createBlockDueDate")
            const dueValue = dueElement.value

            if (nameValue === '' || descValue === '' || dueValue === '') {
                alert("please enter all inputs before saving")
            } else {
                const newTodoCreator = document.querySelector(".newTodoCreator")
                
                if (newTodoCreator) {
                    newTodoCreator.remove()
                }

                this.todoRepository.addTodo(nameValue, descValue, dueValue, project);
                this.renderProjectTodos(project);
            }
        })
        
        const closeButton = document.createElement("button")
        closeButton.setAttribute("class", "xButton")
        closeButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>`

        closeButton.addEventListener('click', () => {
            containerDiv.remove()
            this.addNewTodoButton(project)
        })

        buttonContainer.setAttribute("class", "buttonContainer")

        titleInput.setAttribute('placeholder',"enter title here" )
        descriptionInput.setAttribute('placeholder',"enter description here" )
        dueDateInput.setAttribute('placeholder',"select due date" )
    
        titleInput.setAttribute("id", "createBlockTitle")
        descriptionInput.setAttribute("id", "createBlockDescription")
        dueDateInput.setAttribute("id", "createBlockDueDate")
    
        titleInput.setAttribute("class", "title")
        descriptionInput.setAttribute("class", "description")
        dueDateInput.setAttribute("class", "dueDate")
        containerDiv.classList.add("todoContainer", "newTodoCreator")
        topContainerDiv.setAttribute("class", "topContainerDiv")
        titleContainer.setAttribute("class", "titleContainer")


        titleContainer.appendChild(titleInput)
        titleContainer.appendChild(buttonContainer)

        buttonContainer.appendChild(closeButton)
        buttonContainer.appendChild(saveButton)
        

        topContainerDiv.appendChild(titleContainer)
        topContainerDiv.appendChild(descriptionInput)

        containerDiv.appendChild(topContainerDiv)
        containerDiv.appendChild(dueDateInput)
        projectEl.appendChild(containerDiv)
    }
    

    showEditTodoForm(todo) {
        const originalTodo = todo;
        
        const containerDiv = document.querySelector("#"+todo.id+"ContainerDiv");
        containerDiv.classList.remove("existingTodo");
        containerDiv.classList.add("newTodoCreator");
        
        const buttonContainer = document.querySelector("#"+todo.id+"ButtonContainerDiv");
        
        while (buttonContainer.firstChild) {
            buttonContainer.removeChild(buttonContainer.firstChild);
        }
        
        const saveButton = document.createElement("button");
        saveButton.setAttribute("class", "saveButton");
        saveButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                <polyline points="17 21 17 13 7 13 7 21"></polyline>
                <polyline points="7 3 7 8 15 8"></polyline>
            </svg>`;
    
        const cancelButton = document.createElement("button");
        cancelButton.setAttribute("class", "xButton");
        cancelButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>`;
        
        cancelButton.addEventListener('click', () => {
            const project = this.projectRepository.getProjectById(originalTodo.projectId);
            
            this.renderProjectTodos(project);
        });
    
        saveButton.addEventListener('click', () => {
            const nameElement = document.querySelector("#createBlockTitle");
            const nameValue = nameElement.value;
            const descElement = document.querySelector("#createBlockDescription");
            const descValue = descElement.value;
            const dueElement = document.querySelector("#createBlockDueDate");
            const dueValue = dueElement.value;
    
            if (nameValue === '' || descValue === '' || dueValue === '') {
                alert("Please enter all inputs before saving");
            } else {
                this.eventBus.publish('todoUpdateRequested', {
                    todo: originalTodo,
                    name: nameValue,
                    description: descValue,
                    dueDate: dueValue
                });
            }
        });
        
        
        buttonContainer.appendChild(cancelButton);
        buttonContainer.appendChild(saveButton);
    
        const titleElement = document.querySelector("#" + todo.id);
        const titleInput = document.createElement("input");
        titleElement.parentNode.replaceChild(titleInput, titleElement);
    
        const descriptionElement = document.querySelector("#" + todo.id + "Desc");
        const descriptionInput = document.createElement("input");
        descriptionElement.parentNode.replaceChild(descriptionInput, descriptionElement);
    
        const dueDateElement = document.querySelector("#" + todo.id + "Date");
        const dueDateInput = document.createElement("input");
        dueDateElement.parentNode.replaceChild(dueDateInput, dueDateElement);
    
        titleInput.setAttribute('placeholder', todo.name);
        titleInput.value = todo.name;
        descriptionInput.setAttribute('placeholder', todo.description);
        descriptionInput.value = todo.description;
        dueDateInput.setAttribute('placeholder', todo.dueDate);
        dueDateInput.setAttribute("type", "date");
        dueDateInput.value = todo.dueDate;
    
        titleInput.setAttribute("id", "createBlockTitle");
        descriptionInput.setAttribute("id", "createBlockDescription");
        dueDateInput.setAttribute("id", "createBlockDueDate");
    
        titleInput.setAttribute("class", "title");
        descriptionInput.setAttribute("class", "description");
        dueDateInput.setAttribute("class", "dueDate");
    }
}
