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
updateTheme(loadData(_toDoTheme));

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


function deleteTaskOnClick(element){
    let id = Number(element.dataset.id);
    readOneTask(taskStore,id,function (task) {
        let completedTask = new CompletedTask(task.title);
        addTask(completedTaskStore,completedTask,function () {
            element.classList.add("exit");
            let amountOfCompletedTask = Number(loadData(_completedTasks)) + 1;
            saveData(_completedTasks, amountOfCompletedTask);
            updateTask(completedTasks, _completedTasks);

            element.addEventListener("animationend",function () {
                deleteTask(taskStore,id,function () {
                    let amountOfTask = Number(loadData(_totalTasks)) - 1;
                    saveData(_totalTasks, amountOfTask);
                    updateTask(totalTasks, _totalTasks);

                    updateTaskList();
                });
            })
        })
    });
}
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
            innerHTML += `<li class='invert'>${tasks[i].title} : <span>${tasks[i].completedDate}</span></li>`;
        }
        list.innerHTML = innerHTML;
    });
}
function complementTheme(theme) {
    if (theme==='light'){
        return 'dark';
    }else {
        return 'light';
    }
}

function updateTheme(theme) {
    document.getElementById(theme).classList.add('current-theme');
    document.getElementById(complementTheme(theme)).classList.remove('current-theme');

    let bgColor = theme === 'light' ? "255, 255, 255" : "19, 19, 19";
    let textColor = theme === 'light' ? "12, 12, 12" : "255, 255, 255";
    let shadowColor = theme === 'light' ? "0, 0, 0" : "255, 255, 255";
    let grad1 = theme === 'light' ? "108, 29, 103" : "34, 208, 163";
    let grad2 = theme === 'light' ? "100, 25, 148" : "32, 173, 211";
    let sideGrad1 = theme === 'light' ? "255, 255, 255" : "35, 35, 35";
    let sideGrad2 = theme === 'light' ? "251, 247, 247" : "46, 46, 46";

    let root = document.documentElement;

    root.style.setProperty('--bg-color',bgColor);
    root.style.setProperty('--text-color',textColor);
    root.style.setProperty('--shadow-color',shadowColor);
    root.style.setProperty('--gradient-1',grad1);
    root.style.setProperty('--gradient-2',grad2);
    root.style.setProperty('--sidebar-gradient-1',sideGrad1);
    root.style.setProperty('--sidebar-gradient-2',sideGrad2);

    saveData(_toDoTheme,theme);
}