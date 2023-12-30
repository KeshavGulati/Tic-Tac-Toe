"use strict";

// index.html
// export {game, choice};

const xDiv = document.querySelector(".x-div");
const oDiv = document.querySelector(".o-div");
const iconDiv = document.querySelector(".choice-div__icon-div");
const iconBgDiv = document.querySelector(".icon-bg-div");
// const cpuBtn = document.querySelector(".new-game-cpu-btn");
// const playerBtn = document.querySelector(".new-game-player-btn");
const newGameDiv = document.querySelector(".new-game-div");
let choice, game;

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

    } else {
	    iconBgDiv.style.transform = "translateX(0%)";

    }
    xDiv.classList.toggle("active");
    oDiv.classList.toggle("active");

}

newGameDiv.addEventListener('click', (e) => {
    choice = iconBgDiv.contains(".x-active")? "x-mark": "o-mark";
    let targetBtn = e.target.closest("a");
    if (targetBtn.classList.contains("new-game-cpu-btn")) {
        // cpuGame(choice);
        game = "cpu";

    } else {
        playerGame(choice);
        game = "player";

    }

})

const expObj = {
    game: game,
    choice: choice
};

export {expObj}

// game.html