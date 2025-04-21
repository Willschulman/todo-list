







const projectCountHandler = (function() {

    let projectCount = 0

    const increaseProjectCount = function() {
        projectCount += 1
    }

    const getProjectCount = function() {
        return projectCount
    }

    return {increaseProjectCount, getProjectCount}

})() 


const projectDomControls = (function() {
    
    const createProjectElement = function(project) {
        const todoArea = document.querySelector("#todoArea")
        const titleDiv = document.createElement("div")
        titleDiv.setAttribute("id", project.name.replace(/\s/g,''))
        titleDiv.setAttribute("class", "project")
        todoArea.appendChild(titleDiv)
    }

    const createSidebarElement = function(project) {
        const sidebarArea = document.querySelector("#sideBar")
        const sidebarDiv = document.createElement("div")
        sidebarDiv.setAttribute("id", "sidebar_" +project.name.replace(/\s/g,''))
        sidebarDiv.classList.add("sidebarElement")
        sidebarDiv.classList.add("selected")
        sidebarDiv.textContent = project.name
        sidebarDiv.addEventListener('click', () => {
            loadProjectElements.selectProject(project)
            loadProjectElements.syncProjectArray()
        }) 
        sidebarArea.appendChild(sidebarDiv)
    }

    const removeSelected = function(project) {
        const object = document.querySelector("#sidebar_" +project.name.replace(/\s/g,''))
        object.classList.remove("selected")
    }

    const createSidebarInput = function() {
        const sidebarArea = document.querySelector("#sideBar")
        const sidebarInputContainer = document.createElement("div")
        const sidebarInput = document.createElement("input")
        sidebarInputContainer.classList.add("sidebarInputContainer")
        sidebarInput.classList.add("sidebarInput")
        
        const buttonContainer = document.createElement("div")
        buttonContainer.setAttribute("class", "buttonContainer")


        const saveButton = document.createElement("button")
        saveButton.setAttribute("class", "saveButton")
        saveButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                <polyline points="17 21 17 13 7 13 7 21"></polyline>
                <polyline points="7 3 7 8 15 8"></polyline>
            </svg>`

        saveButton.addEventListener('click', () => {
            getInputValues()
        } )

        
        const closeButton = document.createElement("button")
        closeButton.setAttribute("class", "xButton")
        closeButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>`

        closeButton.addEventListener('click', () => {
            loadProjectElements.syncProjectArray()
        }
        )

        buttonContainer.appendChild(closeButton)
        buttonContainer.appendChild(saveButton)
        
        sidebarInputContainer.appendChild(sidebarInput)
        sidebarInputContainer.appendChild(buttonContainer)
        sidebarArea.appendChild(sidebarInputContainer)
    }

    const getInputValues = function(newProject = true) {
        const nameElement = document.querySelector(".sidebarInput")
        const nameValue = nameElement.value
       
        if (nameValue === '') {
            alert("please enter all inputs before saving")
        } else {
            if (newProject === true) {
                const newProject = new project(nameValue)
                loadProjectElements.syncProjectArray()

            } else {
                arguments[1].name = nameValue
                loadProjectElements.syncProjectArray()
            }
        }
    }


    const newProjectButton = function() {
        const sidebarArea = document.querySelector("#sideBar")
        const newButton = document.createElement("button")
    
        newButton.classList.add("newProjectButton")
        newButton.textContent = "Create New Project"

        newButton.addEventListener('click', () => {
            createSidebarInput()
            newButton.remove()
        })
        sidebarArea.appendChild(newButton)
    } 

    const clearProjectsFromDom = function() {
        const sideBar = document.querySelector("#sideBar")
        while (sideBar.firstChild) {
            sideBar.removeChild(sideBar.firstChild)
        }

        const todoArea = document.querySelector("#todoArea")
        while (todoArea.firstChild) {
            todoArea.removeChild(todoArea.firstChild)
        }

    }

    const createNewProject = function(project) {
        createSidebarElement(project)
    }

    return {createNewProject, clearProjectsFromDom, createProjectElement, newProjectButton, removeSelected}

})()

const todoDomControls = (function(){

    const createTodoElement = function(todo) {
        
        const containerDiv = document.createElement("div")
        const titleContainer = document.createElement("div")
        const buttonContainer = document.createElement("div")
        const topContainerDiv = document.createElement("div")
        const titleDiv = document.createElement("div")
        const descriptionDiv = document.createElement("div")
        const dueDateDiv = document.createElement("div")
        const projectSelection = document.querySelector("#"+todo.project.replace(/\s/g,''))
    
        const editButton = document.createElement("button")
        editButton.setAttribute("class", "editButton")
        editButton.setAttribute("id", todo.name.replace(/\s/g,'')+"Edit")
        editButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
            </svg>
        `

        editButton.addEventListener('click', function() {
            editTodo(todo)
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
                todo.deleteTodo()
                loadTodoElements.syncArray()

            } )

        titleDiv.textContent = todo.name
        descriptionDiv.textContent = todo.description
        dueDateDiv.textContent = todo.dueDate
    
        containerDiv.setAttribute("id", todo.name.replace(/\s/g,'')+"ContainerDiv" )
        titleContainer.setAttribute("id", todo.name.replace(/\s/g,'')+"TitleContainerDiv" )
        buttonContainer.setAttribute("id", todo.name.replace(/\s/g,'')+"ButtonContainerDiv" )
        topContainerDiv.setAttribute("id", todo.name.replace(/\s/g,'')+"TopContainerDiv" )



        titleDiv.setAttribute("id", todo.name.replace(/\s/g,''))
        descriptionDiv.setAttribute("id", todo.name.replace(/\s/g,'')+"Desc")
        dueDateDiv.setAttribute("id", todo.name.replace(/\s/g,'')+"Date")
    
        titleDiv.setAttribute("class", "title")
        descriptionDiv.setAttribute("class", "description")
        dueDateDiv.setAttribute("class", "dueDate")
        containerDiv.classList.add("todoContainer", "existingTodo")
        topContainerDiv.setAttribute("class", "topContainerDiv")
        titleContainer.setAttribute("class", "titleContainer")
        buttonContainer.setAttribute("class", "buttonContainer")


        titleContainer.appendChild(titleDiv)
        titleContainer.appendChild(buttonContainer)

        buttonContainer.appendChild(editButton)
        buttonContainer.appendChild(deleteButton)

        topContainerDiv.appendChild(titleContainer)
        topContainerDiv.appendChild(descriptionDiv)

        containerDiv.appendChild(topContainerDiv)
        containerDiv.appendChild(dueDateDiv)
        projectSelection.appendChild(containerDiv)

    }

    const getInputValues = function(project, newTodo = true) {
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
            
            if (newTodo === true) {
                const newTodo = new todoItem(nameValue, descValue, project.name ,dueValue)
                loadTodoElements.syncArray()

            } else {
                arguments[2].name = nameValue
                arguments[2].description = descValue
                arguments[2].dueDate = dueValue
                loadTodoElements.syncArray()
            }
        }

    }

    const createNewTodo = function(project) {

        const containerDiv = document.createElement("div")
        const titleContainer = document.createElement("div")
        const buttonContainer = document.createElement("div")
        const topContainerDiv = document.createElement("div")
        const titleInput = document.createElement("input")
    
        const descriptionInput = document.createElement("input")
        const dueDateInput = document.createElement("input")
        dueDateInput.setAttribute("type", "date")
        const projectSelection = document.querySelector("#"+project.name.replace(/\s/g,''))

        const saveButton = document.createElement("button")
        saveButton.setAttribute("class", "saveButton")
        saveButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                <polyline points="17 21 17 13 7 13 7 21"></polyline>
                <polyline points="7 3 7 8 15 8"></polyline>
            </svg>`

        saveButton.addEventListener('click', function() {
            getInputValues(project)
            
        })
        
        const closeButton = document.createElement("button")
        closeButton.setAttribute("class", "xButton")
        closeButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>`

        closeButton.addEventListener('click', function() {
            loadTodoElements.syncArray()
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
        projectSelection.appendChild(containerDiv)

    }

    const todoCreationButton = function(project) {
        // Create container div that will be the same size as a todo card
        const containerDiv = document.createElement("div")
        containerDiv.classList.add("todo-button-container")
        
        const plusButton = document.createElement("button")
        plusButton.classList.add("new-todo-button")
        
        plusButton.innerHTML = `
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="50" height="50">
        <circle cx="50" cy="50" r="45" fill="#4CAF50" />
        <line x1="25" y1="50" x2="75" y2="50" stroke="white" stroke-width="8" stroke-linecap="round" />
        <line x1="50" y1="25" x2="50" y2="75" stroke="white" stroke-width="8" stroke-linecap="round" />
      </svg>`;
    
        plusButton.addEventListener('click', () => {
            createNewTodo(project)
            containerDiv.remove() 
        })
    
        containerDiv.appendChild(plusButton)
        
        const projectSelection = document.querySelector("#"+project.name.replace(/\s/g,''))
        
        projectSelection.appendChild(containerDiv)
    }

    const clearTodosFromDom = function() {
        const project = document.querySelector(".project")
        while (project.firstChild) {
            project.removeChild(project.firstChild)
        }

    }

    const editTodo = function(todo) {
        const containerDiv = document.querySelector("#"+todo.name.replace(/\s/g,'')+"ContainerDiv")
        containerDiv.classList.remove("existingTodo")
        containerDiv.classList.add("newTodoCreator")
        const buttonContainer = document.querySelector("#"+todo.name.replace(/\s/g,'')+"ButtonContainerDiv")
        
        while (buttonContainer.firstChild) {
            buttonContainer.removeChild(buttonContainer.firstChild)
        }
        
        const saveButton = document.createElement("button")
        saveButton.setAttribute("class", "saveButton")
        saveButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                <polyline points="17 21 17 13 7 13 7 21"></polyline>
                <polyline points="7 3 7 8 15 8"></polyline>
            </svg>`

        saveButton.addEventListener('click', function() {
            getInputValues(todo.project, false, todo)
        })

        buttonContainer.appendChild(saveButton)

        const titleElement = document.querySelector("#" + todo.name.replace(/\s/g,''))
        const titleInput = document.createElement("input")
        titleElement.parentNode.replaceChild(titleInput,titleElement)

        const descriptionElement = document.querySelector("#" + todo.name.replace(/\s/g,'')+"Desc")
        const descriptionInput = document.createElement("input")
        descriptionElement.parentNode.replaceChild(descriptionInput,descriptionElement)

        const dueDateElement = document.querySelector("#" + todo.name.replace(/\s/g,'')+"Date")
        const dueDateInput = document.createElement("input")
        dueDateElement.parentNode.replaceChild(dueDateInput,dueDateElement)

        titleInput.setAttribute('placeholder', todo.name )
        titleInput.value = todo.name
        descriptionInput.setAttribute('placeholder', todo.description)
        dueDateInput.setAttribute('placeholder', todo.dueDate)
        dueDateInput.setAttribute("type", "date")
        descriptionInput.value = todo.description
        dueDateInput.value = todo.dueDate
    
        titleInput.setAttribute("id", "createBlockTitle")
        descriptionInput.setAttribute("id", "createBlockDescription")
        dueDateInput.setAttribute("id", "createBlockDueDate")
    
        titleInput.setAttribute("class", "title")
        descriptionInput.setAttribute("class", "description")
        dueDateInput.setAttribute("class", "dueDate")

        
     }

    return {createTodoElement, createNewTodo, clearTodosFromDom, editTodo, todoCreationButton}

})()



const loadTodoElements = (function() {
    const todoArray = []


    const addNewTodo = function(todo) {
        todoArray.push(todo)
    }


    const syncArray = function() {
        const selectedProject = loadProjectElements.getSelectedProject()

        todoDomControls.clearTodosFromDom()

        for (let todo in todoArray) {
            if (todoArray[todo].getActive() === true && todoArray[todo].project === selectedProject.name) {
                todoDomControls.createTodoElement(todoArray[todo])
            }
        }
        
        //todoDomControls.createNewTodo(defaultProject)
        console.log(selectedProject)
        todoDomControls.todoCreationButton(selectedProject)

    }

    return {addNewTodo, syncArray}
})()

const loadProjectElements = (function() {
    const projectArray = []

    const getSelectedStatus = function(projectName) {
        const foundProject = projectArray.find((project) => {
            return project.name === projectName
        })
        return foundProject && foundProject.getSelected()
    }

    const getSelectedProject = function() {
        return projectArray.find(project => project.getSelected() === true)
    }

    const addNewProject = function(project) {
        projectArray.push(project)
        selectProject(project)
    }

    const selectProject = function(project) {
        for (let item in projectArray) {
            if (projectArray[item] != project) {
                projectArray[item].setSelected(false)
            }

            if (projectArray[item] === project) {
                projectArray[item].setSelected(true)
            }
        }
    }

    const syncProjectArray = function() {

        try {
            projectDomControls.clearProjectsFromDom()
            projectDomControls.createProjectElement(getSelectedProject())
        } catch {

        }

        for (let project in projectArray) {
            if (projectArray[project].getActive() === true) {
                projectDomControls.createNewProject(projectArray[project])
            }

            if (projectArray[project].getSelected() === false) {
                projectDomControls.removeSelected(projectArray[project])
            }

            console.log(projectCountHandler.getProjectCount())
        }
        //todoDomControls.createNewTodo(defaultProject)
        projectDomControls.newProjectButton()
        loadTodoElements.syncArray()

    }

    return {addNewProject, syncProjectArray, getSelectedStatus, getSelectedProject, selectProject}
})()


const defaultProject = new project("Default Project")
const defaultTodo = new todoItem("default", "gotta go to will's", "Default Project", "2025-04-03")

//todoDomControls.createTodoElement(defaultTodo)
loadProjectElements.syncProjectArray()

loadTodoElements.syncArray()

