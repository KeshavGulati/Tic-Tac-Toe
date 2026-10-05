"use strict"

// Variables
const choice = localStorage.getItem('choice');
const xPlayerEL = document.querySelector('.x-player');
const oPlayerEl = document.querySelector('.o-player');
let availableCellsIndex = [0, 1, 2, 3, 4, 5, 6, 7, 8];
const boxesParent = document.querySelector('.boxes-parent');
const cellList = boxesParent.children; //HTMLCollection
const turnDiv = document.querySelector('.turn-div');
let lastMoved;
let userMark, cpuMark;
const xMark = "<i class=\"x-mark fa-sharp fa-solid fa-xmark\"></i>";
const oMark = "<i class=\"o-mark fa-sharp fa-solid fa-o\"></i>";
// const choiceMarkMap = new Map();
let handleClickWrapper;
let cellIndex;
const oWinDiv = document.querySelector('.o-win-div');
const oWinText = document.querySelector('.o-win-text');
const xWinDiv = document.querySelector('.x-win-div');
const xWinText = document.querySelector('.x-win-text');
const tiedDiv = document.querySelector('.tied-div');
const xScoreSpan = document.querySelector('.x-score');
const oScoreSpan = document.querySelector('.o-score');
const tiesSpan = document.querySelector('ties');
let xWins = 0;
let oWins = 0;
let draws = 0;
let [tempCol, tempRow, tempDiag] = [false, false, false];
const restartBtn = document.querySelectorAll('#restartBtn');

// Checking if choice is undefined or Nan

// if (!choice) {throw new Error('Cannot retrieve choice from localStorage')};

// Rendering (You) for 'choice' and CPU for other

if (choice == 'x-mark') {
    xPlayerEL.textContent = " (You)";
    oPlayerEl.textContent = " (CPU)";

} else {
    xPlayerEL.textContent = " (CPU)";
    oPlayerEl.textContent = " (You)";

}

// Initiliazing the marks

if (choice == 'x-mark') {
    userMark = xMark;
    cpuMark = oMark;
    // choiceMarkMap.set('user', 'x-mark');
    // choiceMarkMap.set('cpu', 'o-mark');

} else {
    cpuMark = xMark;
    userMark = oMark;
    // choiceMarkMap.set('user', oMark);
    // choiceMarkMap.set('cpu', 'x-mark');

}

function collIndexOf(coll, el) {
    return (Array.from(coll)).indexOf(el);

}

async function delay(time) {
    await new Promise(res => setTimeout(res, time));

}

/**
 * 
 * @param {int} max The max value for the output
 * @return {int}    A random value between 0 and max
 */
function getRandomInt(max) {
    return Math.floor(Math.random() * max);

}

/**
 * A function that randomly picks a cell to be moved on.
 * @param {list[int]} availableCellsIndex A list containing the indices of all unmoved cells
 * @return {list<int>} The new list conataining indices of available cells
 */
function cpuMove(availableCellsIndex) {
    let randomIndex = getRandomInt(availableCellsIndex.length);
    let randomMove = availableCellsIndex[randomIndex];
    cellList[randomMove].innerHTML = cpuMark;
    cellList[randomMove].classList.add('active');
    availableCellsIndex = availableCellsIndex.filter((item) => {return item != randomMove});
    cellList[randomMove].style.cursor = 'default';
    return [availableCellsIndex, randomMove];

}

// function handleClick(resolve, event, cell) {
//     cell.removeEventListener('click', handleClickWrapper);
//     return resolve(event);

// }

// function createHandleClick(resolve, cell) {
//     return function(event) {
//         return handleClick(resolve, event, cell);

//     }

// }

function finishWait(winDiv) {
    return new Promise(resolve => {
        winDiv.addEventListener('click', (e) => {
            if ((e.target).classList.contains('restart-btn')) {
                return resolve('restart');

            } else if ((e.target).classList.contains('quit-btn')) {
                return resolve('quit');

            }

        })

    })

}

/**
 * 
 * @param {list<int>} availableCellsIndex A list containing indices of unmoved cells
 * @returns {event<click>} A click event for one of the cells
 */
function eventWait(availableCellsIndex) {
    return new Promise(resolve => {
        for (let index of availableCellsIndex) {
            let cell = cellList[index];
            // handleClickWrapper = createHandleClick(resolve, cell);
            // cell.addEventListener('click', handleClickWrapper);
            cell.addEventListener('click', (e) => {
                return resolve(e);

            })

        }

    })

}

/**
 * This functions carries out a move for the user. It waits for the user to click an available cell, and then inserts the userMark in that cell. It finally removes all the event listeners from the available cells, so that the user cannot move while the CPU is moving.
 * @param {list<int>} availableCellsIndex A list containing indices of unmoved cells 
 * @returns availableCellsIndex to update
 */
async function userMove(availableCellsIndex) {
    let event = await eventWait(availableCellsIndex);
    (event.target).innerHTML = userMark;
    (event.target).style.cursor = 'default';
    availableCellsIndex = availableCellsIndex.filter((item) => {
        return item != collIndexOf(cellList, event.target);

    })

    return [availableCellsIndex, collIndexOf(cellList, event.target)];

}

// Checks the positions of the given cell index horizontally.
// 0 -> left, 1 -> middle, 2 -> right
function getRootIndexRow(cellIndex) {
    if (cellIndex < 3) {
        return cellIndex;

    }

    return getRootIndexRow(cellIndex - 3);

}

// Checks the positions of the given cell index vertically.
// 0 -> top, 1 -> middle, 2 -> bottom
function getRootIndexCol(cellIndex) {
    if (cellIndex in [0, 1, 2]) {
        return 0;

    } else if (cellIndex in [3, 4, 5]) {
        return 1;

    }

    return 2;

}

function checkRow(cellIndex, mark) {
    let firstIndex, secondIndex;
    if (getRootIndexRow(cellIndex) == 0) {
        [firstIndex, secondIndex] = [cellIndex + 1, cellIndex + 2];

    } else if (getRootIndexRow(cellIndex) == 1) {
        [firstIndex, secondIndex] = [cellIndex - 1, cellIndex + 1];

    } else {
        [firstIndex, secondIndex] = [cellIndex - 1, cellIndex - 2];

    }

    if (firstIndex >= 0 && secondIndex >= 0) {
        return [firstIndex, secondIndex, cellList.item(firstIndex).innerHTML == mark && cellList.item(secondIndex).innerHTML == mark];

    }

    return false;
    

}

function checkCol(cellIndex, mark) {
    let firstIndex, secondIndex;
    if (getRootIndexCol(cellIndex) == 0) {
        [firstIndex, secondIndex] = [cellIndex + 3, cellIndex + 6];

    } else if (getRootIndexCol(cellIndex) == 1) {
        [firstIndex, secondIndex] = [cellIndex - 3, cellIndex + 3];

    } else {
        [firstIndex, secondIndex] = [cellIndex - 6, cellIndex - 3];

    }
    
    if (firstIndex >= 0 && secondIndex >= 0) {
        return [firstIndex, secondIndex, cellList.item(firstIndex).innerHTML == mark && cellList.item(secondIndex).innerHTML == mark];

    }

    return [firstIndex, secondIndex, false];

}

function checkDiag(cellIndex, mark ) {
    if ([0, 4, 8].includes(cellIndex)) {
        return cellList.item(0).innerHTML == mark && cellList.item(4).innerHTML == mark && cellList.item(8).innerHTML == mark;

    }

    return cellList.item(2).innerHTML == mark && cellList.item(4).innerHTML == mark && cellList.item(6).innerHTML == mark;

}

function checkComplete(cellIndex, mark) {
    // if (checkCol(cellIndex, mark) || checkRow(cellIndex, mark) || checkDiag(cellIndex, mark)) {
    //     return true;

    // }
    tempCol = checkCol(cellIndex, mark);
    tempRow = checkRow(cellIndex, mark);
    tempDiag = checkDiag(cellIndex, mark);
    console.log(`checkCol = ${tempCol}\n
        checkRow = ${tempRow}\n
        checkDiag = ${tempDiag}`);
    if (tempCol[2]) {
        return true;

    } else if (tempRow[2]) {
        return true;

    } else if (tempDiag) {
        return true;

    } else {return false;}

}

function changeTurnDiv(lastMoved) {
    if (lastMoved == 'user') {
        turnDiv.innerHTML = `${cpuMark} 
        <b>Turn</b>`;

    } else {
        turnDiv.innerHTML = `${userMark} 
        <b>Turn</b>`;

    }
}

// Main Game

await delay(2000);

async function startGame() {
    if (choice == 'x-mark') {
        [availableCellsIndex, cellIndex] = await userMove(availableCellsIndex);
        lastMoved = 'user';
        await delay(2000);
        
    } else {
        availableCellsIndex, cellIndex = cpuMove(availableCellsIndex);
        lastMoved = 'cpu';
    
    }
    
    changeTurnDiv(lastMoved);
    
    while (availableCellsIndex.length != 0) {
        if (lastMoved == 'user') {
            await delay(2000);
            [availableCellsIndex, cellIndex] = cpuMove(availableCellsIndex);
            lastMoved = 'cpu';
            if (checkComplete(cellIndex, cpuMark)) {
                if (cpuMark == xMark) {
                    xWinText.textContent = "OH NO, YOU LOST...";
                    xWinDiv.style = `top: 50%; 
                    trasform: translateY(-50%);`
                    xWins += 1;
                    xScoreSpan.textContent = xWins;
    
                } else {
                    oWinText.textContent = "OH NO, YOU LOST...";
                    oWinDiv.style = `top: 50%; 
                    transform: translateY(-50%);`
                    oWins += 1;
                    oScoreSpan.textContent = oWins;
    
                }
    
            } else {changeTurnDiv(lastMoved);}
            // continue;
    
        } else {
            [availableCellsIndex, cellIndex] = await userMove(availableCellsIndex);
            lastMoved = 'user';
            if (checkComplete(cellIndex, userMark)) {
                if (userMark == xMark) {
                    xWinText.textContent = "YOU WON!";
                    xWinDiv.style = `top: 50%; 
                    transform: translateY(-50%);`
                    xWins += 1;
                    xScoreSpan.textContent = xWins;
                    let winClick = await finishWait(xWinDiv);
                    if (winClick == 'restart') {
                        restartGame();
                        return;

                    }
    
    
                } else {
                    oWinText.textContent = "YOU WON!";
                    oWinDiv.style = `top: 50%; 
                    transform: translateY(-50%);`
                    oWins += 1;
                    oScoreSpan.textContent = oWins;
                    let winClick = await finishWait(xWinDiv);
                    if (winClick == 'restart') {
                        restartGame();
                        return;

                    }
    
                }


    
            } else {changeTurnDiv(lastMoved);}
    
        }
    
    }
    
    tiedDiv.style = `top: 50%;
        transform: translateY(-50%);`
    
}

startGame();

function restartGame() {
    for (let cell of cellList) {
        cell.innerHTML = "";

    }

    xWinDiv.style = `top: 100%`;
    oWinDiv.style = `top: 100%`;
    tiedDiv.style = `top: 100%`;
    availableCellsIndex = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    for (let cell of cellList) {
        cell.style.cursor = 'pointer';

    }
    startGame();

}

for (let btn of restartBtn) {
    btn.addEventListener('click', restartGame);

}