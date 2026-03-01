
function openfeature() {
    let allElem = document.querySelectorAll(".elem");
let allfullpage = document.querySelectorAll(".fullElem");
let allfullpageback = document.querySelectorAll(".back");


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

function header(){
    var key = "375132970db642d9b8e81221262802";
var city = "Burhanpur";


let temp = document.querySelector(".header2 h1")
let humidity = document.querySelector(".header2 h2")
let wind = document.querySelector(".header2 h3")
let weather = document.querySelector(".header2 h4")
let weatherDesc = document.querySelector(".header2 h5")


async function weatherfnc() {
    let response = await fetch(" https://api.weatherapi.com/v1/current.json?key=" + key + "&q=" + city);
    let weatherdata = await response.json();
    temp.innerHTML = weatherdata.current.temp_c + "°C";
    humidity.innerHTML = "Humidity: " + weatherdata.current.humidity + "%";
    wind.innerHTML = "Wind: " + weatherdata.current.wind_kph + " kph";
    weather.innerHTML = weatherdata.current.condition.text;
    weatherDesc.innerHTML = `<img src="${weatherdata.current.condition.icon}" alt="Weather Icon">`;
}
weatherfnc();

function timedate() {
        const header = document.querySelector("header");

    const totodayDaysOfweek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const now = new Date();
    const dayOfWeek = totodayDaysOfweek[now.getDay()];
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const date = now.getDate();
    const month = now.toLocaleString('default', { month: 'long' });
    const year = now.getFullYear();
    document.querySelector(".header1 h3").textContent = ` ${date} ${month} ${year}`;

    if (hours > 12) {
        document.querySelector(".header1 h1").textContent = `${dayOfWeek}, ${hours - 12}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} PM`;
    } else {
        document.querySelector(".header1 h1").textContent = `${dayOfWeek},${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} AM`;
    }

     if (hours >= 6 && hours < 18) {
        header.style.backgroundImage =
            "url('https://images.unsplash.com/photo-1502082553048-f009c37129b9')";
     }
    else if (hours >= 18 && hours < 20) {
        header.style.backgroundImage =
            "url('https://images.unsplash.com/photo-1681281258770-2d85d18672e8?q=80&w=1529&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')";
    }
     
    else{
        header.style.backgroundImage =
        "url('https://images.unsplash.com/photo-1576037790350-89c26155ee0d?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')";
    }

    header.style.backgroundSize = "cover";
    header.style.backgroundPosition = "center";
}
setInterval(() => {
    timedate();
}, 1000);

function themeToggle() {

    const lightBtn = document.getElementById("light-mode"); 
    const darkBtn = document.getElementById("dark-mode");   
    const root = document.documentElement;

    function setLightMode() {
        root.style.setProperty("--pri", "#F6F0D7");
        root.style.setProperty("--sec", "#C5D89D");
        root.style.setProperty("--tri1", "#9CAB84");
        root.style.setProperty("--tri2", "#89986D");

        localStorage.setItem("theme", "light");
        lightBtn.classList.remove("active");
        darkBtn.classList.add("active");

    }

    function setDarkMode() {
        root.style.setProperty("--pri", "#65747b");
        root.style.setProperty("--sec", "#4c5e67");
        root.style.setProperty("--tri1", "#334753");
        root.style.setProperty("--tri2", "#1a313f");

        localStorage.setItem("theme", "dark");

        darkBtn.classList.remove("active");
        lightBtn.classList.add("active");
     
        lightBtn.classList.add("rotate");
    setTimeout(() => lightBtn.classList.remove("rotate"), 360);
        
    }

    if (localStorage.getItem("theme") === "dark") {
        setDarkMode();
    } else {
        setLightMode();
    }

    lightBtn.addEventListener("click", setLightMode);
    darkBtn.addEventListener("click", setDarkMode);
    
}

themeToggle();
}
header();