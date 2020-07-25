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
                            ${tasks[i].title} : <span>${tasks[i].completedDate}</span>
                          </li>`;
        }
        list.innerHTML = innerHTML;
    });
}

function onLoad() {
    updateTasks();
    updateTheme(loadData("ToDoTheme"));
    document.body.style.display = 'flex';
}

function deleteTaskOnClick(element) {
    let id = Number(element.dataset.id);
    let task = readOneTask(taskStore,id,function(task) {

        let completedTask = new CompletedTask(task.title);
        addTask(completedTaskStore,completedTask,function() {
            element.classList.add("exit");

            element.addEventListener("animationend",function() {
                deleteTask(taskStore,id,function() {
                    let amountOfTasks = Number(loadData("TotalTasks")) - 1;
                    saveData("TotalTasks",amountOfTasks);
                    totalTasks.innerHTML = loadData("TotalTasks");
                    let completedAmountOfTasks = Number(loadData("CompletedTasks")) + 1;
                    saveData("CompletedTasks",completedAmountOfTasks);
                    completedTasks.innerHTML = loadData("CompletedTasks");
                    updateTasks();
                });
            });
        });
    });
}

function updateTheme(theme){
    if (theme == 'light') {
        var bgcolor = "255,255,255";
        var textcolor = "12,12,12";
        var shadowcolor = "0,0,0";
        var gradient1 = "108,29,103";
        var gradient2 = "100,25,148";
        var sidebargradient1 = "255,255,255";
        var sidebargradient2 = "251,247,247";
    }
    else{
        var bgcolor = "19,19,19";
        var textcolor = "255,255,255";
        var shadowcolor ="255,255,255";
        var gradient1 = "34,208,163";
        var gradient2 = "32,73,11";
        var sidebargradient1 = "35,35,35";
        var sidebargradient2 = "46,46,46";
    }

    let root = document.documentElement;

    root.style.setProperty("--bg-color",bgcolor);
    root.style.setProperty("--text-color",textcolor);
    root.style.setProperty("--shadow-color",shadowcolor);
    root.style.setProperty("--gradient-1",gradient1);
    root.style.setProperty("--gradient-2",gradient2);
    root.style.setProperty("--sidebar-gradient-1",sidebargradient1);
    root.style.setProperty("--sidebar-gradient-2",sidebargradient2);


    document.getElementsByClassName('current-theme')[0].classList.remove("current-theme");

    let activateClass = theme == "light"? "light" : "dark";
    document.getElementById(activateClass).classList.add("current-theme");

    saveData("ToDoTheme",theme);

    let invertStrength = (theme == 'light')? "0%" : "100%";
    let icons = document.getElementsByClassName('icon');
    for (var i = 0; i < icons.length; i++) {
        icons[i].style.filter =  `brightness(100%) invert(${invertStrength})`;
    }
}

function attemptReset() {
    modal.showModal();
}

function closeModal() {
    modal.close();
}

function reset() {
    saveData('TotalTasks',0);
    totalTasks.innerHTML = loadData("TotalTasks");

    saveData('CompletedTasks',0);
    completedTasks.innerHTML = loadData("CompletedTasks");

    deleteAllTask(taskStore);
    deleteAllTask(completedTaskStore);

    updateTasks();


}
