"use strict";

const xDiv = document.querySelector(".x-div");
const oDiv = document.querySelector(".o-div");
const iconDiv = document.querySelector(".choice-div__icon-div");
const iconBgDiv = document.querySelector(".icon-bg-div");
const newGameDiv = document.querySelector(".new-game-div");
localStorage.clear();
localStorage.setItem('choice', "o-mark");

iconBgDiv.style.height = `${oDiv.clientHeight}px`;
iconBgDiv.style.width = `${xDiv.clientWidth}px`;

window.addEventListener('resize', () => {
    iconBgDiv.style.height = `${oDiv.clientHeight}px`;
    iconBgDiv.style.width = `${xDiv.clientWidth}px`;

})

iconDiv.onclick = function() {
    iconBgDiv.classList.toggle("x-active");
    iconBgDiv.classList.toggle("o-active");
    if (iconBgDiv.classList.contains("x-active")) {
	    iconBgDiv.style.transform = "translateX(-100%)";
        localStorage.setItem("choice", "x-mark");

    } else {
	    iconBgDiv.style.transform = "translateX(0%)";
        localStorage.setItem("choice", "o-mark");

    }
    xDiv.classList.toggle("active");
    oDiv.classList.toggle("active");

}

console.log(`In main.js, choice = ${localStorage.getItem('choice')}`);