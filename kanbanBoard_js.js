let kanbanBoard = {
    toDo: [],
    inProgress: [],
    done: []
}

document.addEventListener("DOMContentLoaded", loadStorage);
document.addEventListener("DOMContentLoaded", addTask);
document.addEventListener("DOMContentLoaded", deleteTask);

function addTask (){
    document.getElementById("addTaskSubmit").addEventListener("click", 
        function (e){
            e.preventDefault();
            let taskName = document.getElementById("addTaskName").value;
            let category = document.getElementById("selectCategory").value;
            let descr = document.getElementById("addTaskDescr").value;
            console.log("Task name: ",taskName, "Category: ",category, "Description: ",descr);

            let ulElem;
            switch (category){
                case "To Do":
                    ulElem = document.getElementById("ulToDo");
                    break;
                case "In Progress":
                    ulElem = document.getElementById("ulInProgress");
                    break;
                case "Done":
                    ulElem = document.getElementById("ulDone");
                    break;
            }
            let liElem = document.createElement("li");
            let textNode = document.createTextNode(taskName);
            liElem.appendChild(textNode);
            liElem.addEventListener("click", () => {
                handleClickByLi(taskName);
            });
            ulElem.appendChild(liElem)
            updateStorageWithNewTask(taskName, descr, category);
        }
    )
}
function handleClickByLi(liTaskName){
    console.log("Clicked li element"); 
    let allTasks = [...kanbanBoard.toDo, ...kanbanBoard.inProgress, ...kanbanBoard.done];
    let foundTask = allTasks.find(t => t.taskName === liTaskName);
    console.log(foundTask);

    let modalTaskName = document.getElementById("modalTaskName");
    let modalTaskDescr = document.getElementById("modalTaskDescr");
    let modalTaskCateg = document.getElementById("modalTaskCateg");
    modalTaskName.innerText = foundTask.taskName;
    modalTaskDescr.innerText = foundTask.descr;
    modalTaskCateg.innerText = foundTask.category;

    let popUpElem = document.getElementById("modal");
    let overlayElem = document.getElementById("overlay");
    popUpElem.classList.add("active");
    overlayElem.classList.add("active");

    let closePopUpBtn = document.getElementById("closeModal");
    closePopUpBtn.addEventListener("click", () => {
        handleClickByClosedButton();
    })
}
function handleClickByClosedButton(){
    console.log("Clicked closed button");
    let popUpElem = document.getElementById("modal");
    let overlayElem = document.getElementById("overlay");
    popUpElem.classList.remove("active");
    overlayElem.classList.remove("active");
}

function deleteTask (){
    document.getElementById("delTaskBtn").addEventListener("click", function(e){
        console.log("Clicked delete button");
        let delTaskName = document.getElementById("modalTaskName").innerText;
        let allTasks = [...kanbanBoard.toDo, ...kanbanBoard.inProgress, ...kanbanBoard.done];
        let foundTask = allTasks.find(t => t.taskName === delTaskName);
        console.log(foundTask);
        
        let arr = findArrByCategory(foundTask.category);
        let arrTasks = [...arr]
        let taskIndex = arrTasks.indexOf(foundTask);
        let firstArrTasks = arrTasks.slice(0,taskIndex);
        let secArrTasks = arrTasks.slice(taskIndex+1,arrTasks.length);
        let newArrTasks = firstArrTasks.concat(secArrTasks);

        switch (foundTask.category){
            case "To Do":
                kanbanBoard.toDo = newArrTasks;
            break;
            case "In Progress":
                kanbanBoard.inProgress = newArrTasks;
                break;
            case "Done":
                kanbanBoard.done = newArrTasks;
                break;
        }
        console.log(kanbanBoard);
        updateStorageWithKanbanBoard(kanbanBoard);
        handleClickByClosedButton();
        loadStorage();
    })
}
function findArrByCategory(category){
    let arr;
    switch (category){
        case "To Do":
            arr = kanbanBoard.toDo
            break;
        case "In Progress":
            arr = kanbanBoard.inProgress;
            break;
        case "Done":
            arr = kanbanBoard.done;
            break;
    }
    return arr;
}

// ========== Local Storage ==========
function initializeStorage () {
    for (i=0; i<3; i++){
        let n = i+1;
        let taskName = "TaskTD"+n;
        kanbanBoard.toDo[i] = {"taskName": taskName, "descr": "descr "+taskName, "category": "To Do"};
        taskName = "TaskIP"+n;
        kanbanBoard.inProgress[i] = {"taskName": taskName, "descr": "descr "+taskName, "category": "In Progress"};
        taskName = "TaskD"+n;
        kanbanBoard.done[i] = {"taskName": taskName, "descr": "descr "+taskName, "category": "Done"};
    }
    console.log(kanbanBoard);
    console.log(JSON.stringify(kanbanBoard));
    localStorage.setItem("kanbanBoard", JSON.stringify(kanbanBoard));
}
// initializeStorage()

function loadStorage (){
    kanbanBoard = JSON.parse(localStorage.getItem("kanbanBoard"));
    console.log(kanbanBoard);
    
    let ulElem = document.getElementById("ulToDo");
    let arrTasks = kanbanBoard.toDo;
    appendAllLitoUl(ulElem, arrTasks);

    ulElem = document.getElementById("ulInProgress");
    arrTasks = kanbanBoard.inProgress;
    appendAllLitoUl(ulElem, arrTasks);

    ulElem = document.getElementById("ulDone");
    arrTasks = kanbanBoard.done;
    appendAllLitoUl(ulElem, arrTasks);
}
// Βοηθητική Συνάρτηση
function appendAllLitoUl(ulElem, arrTasks){
    ulElem.replaceChildren();
    let tasksAmount = arrTasks.length;
    for (i=0; i<tasksAmount; i++){
        let liElem = document.createElement("li");
        let textNode = document.createTextNode(arrTasks[i].taskName);
        liElem.appendChild(textNode);

        let taskName = liElem.innerText;
        liElem.addEventListener("click", () => {
            handleClickByLi(taskName);
        })
        ulElem.appendChild(liElem);
    }
}

function updateStorageWithNewTask (taskName, taskDescr, taskCateg) {
    kanbanBoard = JSON.parse(localStorage.getItem("kanbanBoard"));
    console.log(kanbanBoard);

    let newTask = {"taskName": taskName, "descr": taskDescr, "category": taskCateg};
    switch(taskCateg){
        case "To Do":
            kanbanBoard.toDo.push(newTask);
            break;
        case "In Progress":
            kanbanBoard.inProgress.push(newTask);
            break;
        case "Done":
            kanbanBoard.done.push(newTask);
            break;
    }
    console.log(kanbanBoard);
    localStorage.setItem("kanbanBoard", JSON.stringify(kanbanBoard));
}
function updateStorageWithKanbanBoard (kanbanBoard){
    localStorage.setItem("kanbanBoard", JSON.stringify(kanbanBoard));
}
function renderUI (){

}
// ========== Local Storage ==========
