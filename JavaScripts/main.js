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

function updateTasks() {
    console.log("updated");
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
