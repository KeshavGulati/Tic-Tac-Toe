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
const xMark = "<i class='x-mark fa-sharp fa-solid fa-xmark'></i>";
const oMark = "<i class='o-mark fa-sharp fa-solid fa-o'></i>";
const choiceMarkMap = new Map();
let handleClickWrapper;


// Checking if choice is undefined or Nan

if (!choice) {throw new Error('Cannot retrieve choice from localStorage')};

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
    choiceMarkMap.set('user', 'x-mark');
    choiceMarkMap.set('cpu', 'o-mark');

} else {
    cpuMark = xMark;
    userMark = oMark;
    choiceMarkMap.set('user', oMark);
    choiceMarkMap.set('cpu', 'x-mark');

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
    return availableCellsIndex;

}

function handleClick(resolve, event, cell) {
    cell.removeEventListener('click', handleClickWrapper);
    return resolve(event);

}

function createHandleClick(resolve, cell) {
    return function(event) {
        return handleClick(resolve, event, cell);

    }

}

/**
 * 
 * @param {list<int>} availableCellsIndex A list containing indices of unmoved cells
 * @returns {event<click>} A click event for one of the cells
 */
function eventWait(availableCellsIndex) {
    // console.log('in event wait');
    return new Promise(resolve => {
        for (let index of availableCellsIndex) {
            console.log('in for loop');
            let cell = cellList[index];
            handleClickWrapper = createHandleClick(resolve, cell);
            cell.addEventListener('click', handleClickWrapper);

        }

    })

}

/**
 * This functions carries out a move for the user. It waits for the user to click an available cell, and then inserts the userMark in that cell. It finally removes all the event listeners from the available cells, so that the user cannot move while the CPU is moving.
 * @param {list<int>} availableCellsIndex A list containing indices of unmoved cells 
 * @returns availableCellsIndex to update
 */
async function userMove(availableCellsIndex) {
    // console.log('in usermove');
    let event = await eventWait(availableCellsIndex);
    // console.log('out of event wait');
    (event.target).innerHTML = userMark;
    (event.target).style.cursor = 'default';
    availableCellsIndex = availableCellsIndex.filter((item) => {
        return item != collIndexOf(cellList, event.target);

    })
    
    return availableCellsIndex;

}

function checkComplete() {
    return;    

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

if (choice == 'x-mark') {
    availableCellsIndex = userMove(availableCellsIndex);
    lastMoved = 'user';
    
} else {
    availableCellsIndex = cpuMove(availableCellsIndex);
    console.log(availableCellsIndex);
    lastMoved = 'cpu';

}

changeTurnDiv(lastMoved);

while (availableCellsIndex.length != 0) {
    // console.log('in while loop');
    if (lastMoved == 'user') {
        // console.log('in lastmoved = user');
        await delay(2000);
        availableCellsIndex = cpuMove(availableCellsIndex);
        console.log(availableCellsIndex);
        lastMoved = 'cpu';

    } else {
        // console.log('in lastmoved = cpu');
        // console.log(`availableCellsIndex = ${availableCellsIndex}`);
        availableCellsIndex = await userMove(availableCellsIndex);
        console.log(availableCellsIndex);
        lastMoved = 'user';

    }

    changeTurnDiv(lastMoved);

    // checkComplete();

}