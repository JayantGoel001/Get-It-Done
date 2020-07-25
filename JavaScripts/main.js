const input = document.getElementById("task-input");
const totalTasks = document.getElementById("total");
const completedTasks = document.getElementById("completed");
const modal = document.getElementById("modal");
const maxRecentlyDeleted = 4;

loadData("TotalTasks") || saveData("TotalTasks",0);
loadData("CompletedTasks") || saveData("CompletedTasks",0);
loadData("ToDoTheme") || saveData("ToDoTheme","light");

totalTasks.innerHTML = loadData("TotalTasks");
completedTasks.innerHTML = loadData("CompletedTasks");

function min(a,b) {
    if (a>b) {
        return b;
    }
    else{
        return a;
    }
}
function updateTasks() {
    readTask(taskStore,function(tasks) {
        let list = document.getElementById('task-list');
        let innerHTML = "";

        for (var i = 0; i < tasks.length; i++) {
            innerHTML += `<li data-id='${tasks[i].id}' onclick='deleteTaskOnClick(this)'>
                            ${tasks[i].title}
                        </li>`;
        }
        list.innerHTML = innerHTML;
    });

    readTask(completedTaskStore,function(tasks) {
        let list = document.getElementById('completed-task-list');
        let innerHTML = "";
        tasks.reverse();
        for (var i = 0; i < min(maxRecentlyDeleted,tasks.length); i++) {
            innerHTML += `<li class='invert'>
                            ${tasks[i].title} : <span>${tasks[i].CompletedDate}</span>
                          </li>`;
        }
        list.innerHTML = innerHTML;
    });
}

function onLoad() {
    updateTasks();
}

input.addEventListener("keydown",function(event) {
    if (event.keyCode == 13) {
        let task = new Task(input.value);
        input.value = "";
        if (task.title.length == 0) {
            return ;
        }
        else{
            addTask(taskStore,task,function() {
                let amountOfTasks = Number(loadData("TotalTasks")) + 1;
                saveData("TotalTasks",amountOfTasks);
                totalTasks.innerHTML = loadData("TotalTasks");
                updateTasks();
            })
        }
    }
})
