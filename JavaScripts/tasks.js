let database;

const taskStore = "Tasks";
const completedTaskStore = "CompletedTasks";

function Task(title) {
    this.title = title;
}

function CompletedTask(title) {
    this.title = title;
    this.completedDate = getCurrentDate();
}

window.onload = function() {
    let req = window.indexedDB.open("GetItDoneAppDB",1);

    req.onsuccess = function() {
        database = req.result;
        onLoad();
    }
    req.onerror = function(event) {
        alert("There was an error ",event);
    }

    req.onupgradeneeded = function(event) {
        let db = req.result;
        let objectStore = db.createObjectStore(taskStore,{ keyPath:"id",autoIncrement:true });
        let objectStore2 = db.createObjectStore(completedTaskStore,{ keyPath:"id",autoIncrement:true });
    }

}

let defaultError = function() {
    console.log("Something went wrong");
}

function addTask(store,task,success,error=defaultError) {
    let transaction = database.transaction([store],"readwrite");
    let objectStore = transaction.objectStore(store);

    let request = objectStore.add(task);
    request.onerror = error;
    request.onsuccess = success;
}

function readTask(store,success,error=defaultError) {
    let transaction = database.transaction([store],"readonly");
    let objectStore = transaction.objectStore(store);

    let request = objectStore.openCursor();
    request.onerror = error;
    let tasks = [];

    request.onsuccess = function(event) {
        let cursor = event.target.result;
        if (cursor) {
            let task = cursor.value;
            tasks.push(task);
            cursor.continue();
        }
        else{
            success(tasks);
        }
    };
}


function readOneTask(store,id,success,error=defaultError) {
    let transaction = database.transaction([store],"readonly");
    let objectStore = transaction.objectStore(store);

    let request = objectStore.get(id);
    request.onerror = error;
    request.onsuccess = function() {
        success(request.result);
    };
}


function deleteTask(store,id,success,error=defaultError) {
    let transaction = database.transaction([store],"readwrite");
    let objectStore = transaction.objectStore(store);

    let request = objectStore.delete(id);
    request.onerror = error;
    request.onsuccess = success;
}

function deleteAllTask(store,success,error=defaultError) {
    success = success || function() {
        console.log("Deleted All Tasks");
    }
    let transaction = database.transaction([store],"readwrite");
    let objectStore = transaction.objectStore(store);

    let request = objectStore.clear();
    request.onerror = error;
    request.onsuccess = success;
}
