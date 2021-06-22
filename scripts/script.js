const input = document.getElementById("task-input");
const totalTasks = document.getElementById("total");
const completedTasks = document.getElementById("completed");
const modal = document.getElementById("modal");
const maxRecentlyDeleted = 4;

const _totalTasks = "TotalTasks";
const _completedTasks = "CompletedTasks";
const _toDoTheme =  "ToDoTheme";

loadData(_totalTasks) || saveData(_totalTasks, 0);
loadData(_completedTasks) || saveData(_completedTasks, 0);
loadData(_toDoTheme) || saveData(_toDoTheme, "light");

function updateTask(task, _task) {
    task.innerHTML = loadData(_task);
}
updateTask(totalTasks,_totalTasks);
updateTask(completedTasks,_completedTasks);

input.addEventListener("keydown", function(e) {
    if(e.keyCode === 13) {
        let task = new Task(input.value);
        input.value = "";
        if(task.title.length === 0) { return }
        addTask(taskStore, task, function() {
            let amountOfTasks = Number(loadData(_totalTasks)) + 1;
            saveData(_totalTasks, amountOfTasks);
            updateTask(totalTasks,_totalTasks)
            updateTaskList();
        });
    }
});


function updateTaskList() {
    readTasks(taskStore, function(tasks) {
        let list = document.getElementById("task-list");
        let innerHTML = "";
        for(let i = 0; i < tasks.length; i++) {
            innerHTML += `
                <li data-id='${tasks[i].id}' onclick='deleteTaskOnClick(this)'>
                    ${tasks[i].title}
                </li>
            `;
        }
        list.innerHTML = innerHTML;
    });

    readTasks(completedTaskStore, function(tasks) {
        let list = document.getElementById("completed-task-list");
        let innerHTML = "";
        tasks.reverse();
        for(let i = 0; i < Math.min(tasks.length, maxRecentlyDeleted); i++) {
            innerHTML += `<li class='invert'>${tasks[i].title}: <span>${tasks[i].completedDate}</span></li>`;
        }
        list.innerHTML = innerHTML;
    });
}