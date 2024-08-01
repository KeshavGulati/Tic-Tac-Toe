const choice = localStorage.getItem("choice");
console.log(`choice = ${choice}`)

function cpuGame(choice) {
    let choiceEl = document.querySelector(choice);
    let youScoreDiv = document.querySelector(".you-score-div");
    let cpuScoreDiv = document.querySelector(".cpu-score-div");
    if (choice == "x-mark") {
        youScoreDiv.textContent("X (You)");
        cpuScoreDiv.textContent("O (CPU)")

    } else {
        youScoreDiv.textContent("X (CPU)");
        cpuScoreDiv.textContent("O (YOU)")

    }

}