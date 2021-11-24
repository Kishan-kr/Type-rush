
let paragraph = document.getElementById('paragraph');
let inputArea = document.getElementById('typeBox');
let startModal = document.getElementById('startModal');
let startButton = document.getElementById('start');
let homePage = document.getElementById('home-page');
let navbar = document.getElementById('navbar')

// Timer variables
let timer = document.getElementById('time-value');
let timerTimeOut;
let secondsLeft = 60;
let seconds = 0;

// variable to check if user has started typing 
let isTimerStart = false;

// counter variables
let wrongCharacterCount = 0;
let correctWords = 0;
let wrongWordCount = 0;
let separator = /\s+/g;

// sounds 
let rightKeyPress = document.getElementById('rightKeyPress');
let wrongKeyPress = document.getElementById('wrongKeyPress');

// let paragraphString = paragraph.innerHTML;
let paraText = texts[0];
let paragraphWords;

// fetching a text file 
getFile();

// Accessing speed viewer and accuracy viewer
let speed = document.getElementById('speed-value');
let accuracy = document.getElementById('accuracy-value');

// variables of result page 
let resultPage = document.querySelector('.result-page');
let resultAccuracy = document.getElementById('result-accuracy-value');
let resultSpeed = document.getElementById('result-speed-value');
let characterSpeed = document.getElementById('char-value');
let yourSpeed = document.getElementById('your-speed');
let again = document.getElementById('again');

// duration variables 
let duration1 = document.getElementById('duration1');
let duration2 = document.getElementById('duration2');
let duration3 = document.getElementById('duration3');

startButton.onclick = function () {
    inputArea.focus();
    startModal.style.display = 'none';
    // putting cursor on first letter 
    paragraph.children[0].classList.add('cursor');
}

// starting Timer, speed counter , and accuracy counter 
inputArea.onkeydown = function (event) {
    if (!isTimerStart) {
        startTimer();
        isTimerStart = true;
    }
    if (event.keyCode === 8) {
        eraseCharacter(event.target.value.length);
    }
    if ([37, 38, 39, 40].indexOf(event.keyCode) > -1) {
        event.preventDefault();
    }
}

inputArea.oninput = function (event) {
    stopSound();
    length = inputArea.value.length;
    let inputText = inputArea.value;
    playSound(length);
    colorize(length);
    currentCursor(length)
    wordCount(inputText, length);
    accuracyCount(inputText, length);
}

again.onclick = function() {
    restart();
    document.getElementById('duration1').checked = true;
};

duration1.onclick = changeDuration;
duration2.onclick = changeDuration;
duration3.onclick = changeDuration;

function changeDuration(event) {
    clearInterval(timerTimeOut);
    restart();
    getFile();
    value = parseInt(event.target.value);
    timer.innerHTML = value * 60;
    secondsLeft = value * 60;
}

function getFile() {
    let fileNumber = selectRandomFile();
    paraText = texts[fileNumber];
    paragraphWords = paraText.split(separator);
    toLetters();
}

function selectRandomFile() {
    let number = Math.floor(Math.random() * 10) + 1;
    return (number-1);
}

function toLetters() {
    paragraph.innerHTML = "";
    for (let i = 0; i < paraText.length; i++) {
        let span = document.createElement("span");
        span.innerText = paraText[i];
        span.classList.add('span-text');
        paragraph.appendChild(span);
    }
}

function playSound(length) {
    if(isCorrect(length)) {
        rightKeyPress.play();
    }
    else {
        wrongKeyPress.play();
    }
}

function stopSound() {
    try {
        rightKeyPress.pause();
        rightKeyPress.currentTime = 0;
        wrongKeyPress.pause();
        wrongKeyPress.currentTime = 0;
    }
    catch(error) {
        console.log(error);
    }
}

function colorize(length) {
    if(paragraph.children[length-1]) {
    if (isCorrect(length))
        paragraph.children[length - 1].classList.add('typed');
    else
        paragraph.children[length - 1].classList.add('incorrect');
    }
}

function currentCursor(length) {
    paragraph.children[length - 1].classList.remove('cursor');
    let topPos = (paragraph.children[length].offsetTop)-48;
    paragraph.scrollTop = topPos;
    if(paragraph.children[length]) 
        paragraph.children[length].classList.add('cursor');
}

function eraseCharacter(length) {
    paragraph.children[length - 1].classList.remove('typed');
    paragraph.children[length - 1].classList.remove('incorrect');
    paragraph.children[length].classList.remove('cursor');
}

function isCorrect(length) {
    if (paraText[length - 1] === inputArea.value[length - 1]) {
        return true;
    }
    else
        return false;
}

// functions for timer 
function startTimer() {
    timerTimeOut = setInterval(runTimer, 1000);
}

function runTimer() {
    --secondsLeft;
    timer.innerHTML = pad(secondsLeft);
    ++seconds;
    speedCount();
    if (secondsLeft <= 0) {
        clearInterval(timerTimeOut);
        resultAccuracy.innerHTML = accuracy.innerHTML;
        resultSpeed.innerHTML = speed.innerHTML;
        characterSpeed.innerHTML = pad(Math.floor(characterCounter()));
        yourSpeed.innerHTML = "YOUR TYPING SPEED IS " + "<span style = background-color:#79589f40; padding:8px; border-radius:4px>" + speed.innerHTML + "</span>" + " WPM";
        resultPage.style.display = "block";
        homePage.style.display = 'none';
        navbar.scrollIntoView();
    }
}

function wordCount(inputText, length) {
    wrongCharacterCount = 0;
    correctWords = 0;
    wrongWordCount = 0;
    let inputWords = inputText.split(separator);
    for (let i = 0; i < inputWords.length; i++) {
        if (inputWords[i] !== paragraphWords[i]) {
            ++wrongWordCount;
        }
        else
            ++correctWords;
    }
    speedCount();
}

// function to count speed 
function speedCount() {
    let speedCounter = correctWords / (seconds / 60);
    if (seconds === 0)
        speedCounter = 0;
    speed.innerHTML = pad(Math.ceil(speedCounter));
}

// function to count accuracy 
function accuracyCount(inputText, length) {
    for(let i = 0; i < length; i++) {
        if(inputText[i] !== paraText[i]) {
            ++wrongCharacterCount;
        }
    }
    let correctCharacters = length - wrongCharacterCount;
    correctCharacters = correctCharacters > 0 ? correctCharacters : 0;
    let accuracyCounter = (correctCharacters / length) * 100;
    if(length <= 0) {accuracyCounter = 100;}
    accuracy.innerHTML = pad(Math.floor(accuracyCounter));
}

// function to count character speed 
function characterCounter(){
    let length = inputArea.value.length;
    let correctLetters = length - wrongCharacterCount;
    return (correctLetters / (seconds / 60));
}

// function to restart the test 
function restart() {
    homePage.style.display = 'block';
    resultPage.style.display = "none";
    startModal.style.display = "flex";
    inputArea.value = "";
    deColorize();
    secondsLeft = 60;
    seconds = 0;
    speed.innerHTML = "00";
    accuracy.innerHTML = "100";
    timer.innerHTML = "60";
    isTimerStart = false;
    let topPos = (paragraph.children[0].offsetTop)-48;
    paragraph.scrollTop = topPos;
}

function deColorize(){
    for(let i = 0; i < paraText.length; i++) {
        paragraph.children[i].classList.remove('typed')
        paragraph.children[i].classList.remove('incorrect')
        paragraph.children[i].classList.remove('cursor')
    }
}

// padding function 
function pad(val) {
    val = val < 10 ? "0" + val : val;
    return val;
}