let allElem = document.querySelectorAll(".elem");
let allfullpage = document.querySelectorAll(".fullElem");
let allfullpageback = document.querySelectorAll(".back");

function openfeature() {
    allElem.forEach(function (elem) {
        elem.addEventListener('click', function () {
            allfullpage[elem.id].style.display = "block";
        });
    });
    allfullpageback.forEach(function (backelem) {
        backelem.addEventListener('click', function () {
            allfullpage[backelem.id].style.display = "none";
        });
    });
}
openfeature();


function todoList() {
    var currentTask = [];
    if (localStorage.getItem("tasks")) {
        currentTask = JSON.parse(localStorage.getItem("tasks"));
        renderTasks();
    }
    else {
        console.log("No tasks found in local storage.");
    }
    renderTasks();

    function renderTasks() {

        var allTask = document.querySelector(".right");

        var sum = "";
        currentTask.forEach(function (elem, idx) {
            sum += `<div class="task"> <h4>${elem.task} ${elem.important ? '<span class="important">IMP</span>' : ''}</h4>
        <button id =${idx} type="button">mark as complete</button>
        <div class="arrow"><i class="ri-arrow-down-s-line"></i></div>
    </div>  <div class="details"><p>${elem.details || "No details provided."}</p></div>  `
        });
        allTask.innerHTML = sum;
        localStorage.setItem("tasks", JSON.stringify(currentTask));

        document.querySelectorAll(".task .arrow").forEach(function (arrow, idx) {
            arrow.addEventListener('click', function () {
                let details = document.querySelectorAll(".details")[idx];
                details.classList.toggle("active");
            });
        });

        document.querySelectorAll(".task button").forEach(function (btn) {
            btn.addEventListener('click', function () {
                currentTask.splice(btn.id, 1);
                renderTasks();
            });
        });
    }
    renderTasks();

    let form = document.querySelector("form");
    let taskInput = document.querySelector(".todo-input");
    let detailsInput = document.querySelector("#textarea");
    let importantCheckbox = document.querySelector("#imp-checkbox");

    form.addEventListener('submit', function (e) {
        e.preventDefault()
        currentTask.push({
            task: taskInput.value,
            important: importantCheckbox.checked,
            details: detailsInput.value
        });

        renderTasks()

        taskInput.value = "";
        importantCheckbox.checked = false;
        detailsInput.value = "";
    });



}
todoList();

function dailyPlanner() {
    var dailyContainer = document.querySelector(".daily-container");

    var daiyPlanData = JSON.parse(localStorage.getItem("dailyPlanData")) || {};

    var hours = Array.from({ length: 18 }, (_, idx) => `${6 + idx}:00 - ${7 + idx}:00`)

    var wholeDaySum = "";

    hours.forEach(function (elem, idx) {
        var saveData = daiyPlanData[idx] || "";
        wholeDaySum = wholeDaySum + `<div class="input-section">
                        <p>${elem}</p>
                     <input id="${idx}" value="${saveData}" type="text" placeholder="..." value="${saveData}" required>
                </div>`;
    });

    dailyContainer.innerHTML = wholeDaySum;

    var allInput = document.querySelectorAll(".input-section input")

    allInput.forEach(function (elem) {
        elem.addEventListener('input', function () {
            daiyPlanData[elem.id] = elem.value;

            localStorage.setItem("dailyPlanData", JSON.stringify(daiyPlanData));
        })
    });
}
dailyPlanner();

function motivationQuote() {
    var motivationQuotes = document.querySelector(".quote h1");
    var motivationAuthors = document.querySelector(".author h3");
    async function fetchQuote() {
        let response = await fetch("https://dummyjson.com/quotes/random");
        let data = await response.json();
        motivationQuotes.innerHTML = data.quote
        motivationAuthors.innerHTML = `~${data.author}`;
    }
    fetchQuote();
}
motivationQuote();

function pomodoro() {
    let totalSeconds = 25 * 60;
    var currentTime = document.querySelector(".pomo-timer h1");
    var startBtn = document.getElementById("start");
    var pauseBtn = document.getElementById("pause");
    var resetBtn = document.getElementById("reset");
    var session = document.querySelector(".pomo-fullpage h4");

    var timerInterval = null;
    var isWorkSession = true;

    function updateTimer() {
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = totalSeconds % 60;
        currentTime.innerHTML =
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    function startTimer() {

        if (timerInterval) return; // prevent multiple intervals

        timerInterval = setInterval(function () {

            if (totalSeconds > 0) {
                totalSeconds--;
                updateTimer();
            } else {
                clearInterval(timerInterval);
                timerInterval = null;

                if (isWorkSession) {
                    isWorkSession = false;
                    totalSeconds = 5 * 60;
                    session.innerHTML = "Take a break.";
                    session.style.backgroundColor = "#2d97ef";
                } else {
                    isWorkSession = true;
                    totalSeconds = 25 * 60;
                    session.innerHTML = "Work Session";
                    session.style.backgroundColor = "#36fc71";
                }

                updateTimer();
            }

        }, 10); // 1 second
    }

    function pauseTimer() {
        clearInterval(timerInterval);
        timerInterval = null;
    }

    function resetTimer() {
        clearInterval(timerInterval);
        timerInterval = null;
        isWorkSession = true;
        totalSeconds = 25 * 60;

        updateTimer();
    }

    startBtn.addEventListener('click', startTimer);
    pauseBtn.addEventListener('click', pauseTimer);
    resetBtn.addEventListener('click', resetTimer);

    updateTimer();
}

pomodoro();

function dailyGoalsDashboard() {

    let goalsData = JSON.parse(localStorage.getItem("dailyGoals")) || [];

    const goalsRight = document.querySelector(".goals-right");
    const totalSpan = document.querySelector(".total-goals");
    const completedSpan = document.querySelector(".completed-goals");
    const pendingSpan = document.querySelector(".pending-goals");
    const circle = document.querySelector(".circle-progress");
    const percentText = document.querySelector(".percent");
    const addBtn = document.querySelector(".goal-add-btn");
    const input = document.querySelector(".goal-input");

    function renderGoals() {

        let completed = goalsData.filter(g => g.done).length;
        let total = goalsData.length;
        let pending = total - completed;
        let percent;
        if (total === 0) {
            percent = 0;
        } else {
            percent = Math.round((completed / total) * 100);
        }

        totalSpan.textContent = total;
        completedSpan.textContent = completed;
        pendingSpan.textContent = pending;
        percentText.textContent = percent + "% ";
        circle.style.background =
            `conic-gradient(var(--tri2) ${percent * 3.6}deg, #ddddddf8 0deg)`;

        let sum = "";

        goalsData.forEach((goal, idx) => {
            sum += `
                <div class="goal-card ${goal.done ? "done" : ""}">
                    <p>${goal.text}</p>
                    <div>
                        <button class="goal-complete" data-id="${idx}">✔</button>
                        <button class="goal-delete" data-id="${idx}">✖</button>
                    </div>
                </div>` 
        });

        goalsRight.innerHTML = sum;

        localStorage.setItem("dailyGoals", JSON.stringify(goalsData));

        document.querySelectorAll(".goal-complete").forEach(btn => {
            btn.addEventListener("click", () => {
                goalsData[btn.dataset.id].done = !goalsData[btn.dataset.id].done;
                renderGoals();
            });
        });

        document.querySelectorAll(".goal-delete").forEach(btn => {
            btn.addEventListener("click", () => {
                goalsData.splice(btn.dataset.id, 1);
                renderGoals();
            });
        });
    }

    addBtn.addEventListener("click", () => {
        if (input.value.trim() !== "") {
            goalsData.push({ text: input.value, done: false });
            input.value = "";
            renderGoals();
        }
    });

    renderGoals();
}

dailyGoalsDashboard();