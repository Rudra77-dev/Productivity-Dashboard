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
    var dailyContainer =  document.querySelector(".daily-container");

var daiyPlanData = JSON.parse(localStorage.getItem("dailyPlanData")) || {};

var hours = Array.from({length: 18}, (_,idx) =>`${6 + idx}:00 - ${7+idx}:00`)

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


