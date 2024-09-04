// Size recomended: 682, 505

function onloadDo() {
    window.addEventListener('resize', adjustButtonLayout);
    window.addEventListener('load', adjustButtonLayout);
    genNumberInRange(96);
    applyNumberToButtons();
    applyFunctionToButtons();
    startGameBySettingRandomPlayerColor();
    updateLivesCounter();
    answear = generateMathProblem();
    addListeners();
    add1PointToBlue();
    add1PointToRed();
    startTime();
    setupTable();
}



const livesStay_Container = {
    ['blue']: 3,
    ['red']: 3,
}


let HideNumbers = {};



function adjustButtonLayout() {
    const buttonRow = document.getElementById('button-row');
    const buttons = buttonRow.children;

    buttonRow.style.width = `auto`;

    let totalWidth = 0;
    let rowWidth = buttonRow.offsetWidth;


    for (let i = 0; i < buttons.length; i++) {
        const button = buttons[i];
        totalWidth += button.offsetWidth + parseInt(window.getComputedStyle(button).marginRight);

        if (totalWidth > rowWidth) {
            buttonRow.style.width = rowWidth + 'px';
            totalWidth = button.offsetWidth + parseInt(window.getComputedStyle(button).marginRight);
        }
    }
}



function setupTable() {
    const buttonRow = document.getElementById('button-row');
    const buttons = buttonRow.children;

    for (let i = 0; i < buttons.length; i++) {
        const button = buttons[i];

        HideNumbers[button.id] = button.textContent;
    }
}


function resetTable() {
    HideNumbers = {};
}



function checkTable(id) {
    console.log('Starting Checking!')
    for (let i = 0; i < 98; i++) {
        const k = HideNumbers['colorButton' + i];

        if (k == id) {
            return true;
        }
    }
}





function RandomNumber(min, max) {
    return Math.floor((Math.random() + min) * (max + 1) / 2);
}


function nextPlayerColorTurn(currentColor) {
    let list = {
        'red': 'blue', 
        'blue': 'red',
    }

    let nextColor = list[currentColor];


    if (nextColor) {
        return nextColor
    }
}


function randomNumberForButton(button) {
    let Number = RandomNumber(1, 48);

    if (button) {
        button.textContent = Number;
    }
}


function applyNumberToButtons() {
    const row = document.getElementById('button-row');
    const buttons = row.children;

    for (let i = 0; i < buttons.length; i++) {
        const button = buttons[i];
        
        if (button) {
            randomNumberForButton(button)
        }
    }
}


function getNumberFromString(string) {
    return parseInt(string);
}


let alreadyPlayed = false;
let lives = 3;

function applyFunctionToButtons() {
    const row = document.getElementById('button-row');
    const buttons = row.children;

    for (let i = 0; i < buttons.length; i++) {
        const button = buttons[i];

        if (button) {
            button.id = 'colorButton' + i;
            button.addEventListener('click', function(){
                if (alreadyPlayed === false) {
                    const colorSelected = document.getElementById('colorCircleDisplay');
                    const buttonThis = document.getElementById('colorButton' + i);
                    let enabled = true;

                    if (buttonThis.style.backgroundColor === `rgb(128, 128, 128)` || buttonThis.style.backgroundColor === '' && (onAnswearCorrect(buttonThis) || checkTable(buttonThis.id))) {
                        alreadyPlayed = true;
                        enabled = false;
                        if (colorSelected) {
                            buttonThis.style.backgroundColor = colorSelected.style.backgroundColor;

                            if (colorSelected.style.backgroundColor === 'rgb(255, 0, 0)') {
                                add1PointToRed();
                            } else if (colorSelected.style.backgroundColor === 'rgb(0, 0, 255)') {
                                add1PointToBlue();
                            }
                        } else {
                            console.warn(`Missing color display!`)
                        }
                        button.removeEventListener('click', button)
                        onButtonAnswearCorrect();
                        return
                    } else {
                        doPermanentDamage();
                    }
                } else {
                    doPermanentDamage();
                }
            })
        }
    }
}


function startGameBySettingRandomPlayerColor() {
    const colorContainer = document.getElementById('colorCircleDisplay');
    const list = {
        [1]: 'rgb(255, 0, 0)',
        [2]: 'rgb(0, 0, 255)',
    }
    const random = RandomNumber(1, 2);
    const color = list[random];

    console.log(color, random);


    colorContainer.style.backgroundColor = color;
}


function remove1Life() {  
    lives -= 1;
    onLiveTextChanged();
    updateLivesCounter();
}

function add1Life() {
    lives += 1;
    updateLivesCounter();
}

function setLives(num) {
    lives = num;
    updateLivesCounter();
}

function getLivesEmoji() {
    return '❤️';
}

function getBrokenLivesEmoji() {
    return '💔';
}

let defaultTime = 15;

function maxForLivesAndDoOnLivesLost() {
    if (lives < 0) {
        lives = 0;
        onButtonAnswearCorrect();
    } 
    updateLivesCounter();
}


function updateLivesCounter() {
    console.log(checkTable(answear))


    const livesDisplay = document.getElementById('livesCounter');

    if (livesDisplay) {
        if (livesToggled == true) {
            if (isLivesHidden == false) {
                livesDisplay.textContent = '';

                for (let i = 0; i < lives; i++) {
                    livesDisplay.textContent += getLivesEmoji();
                }

                for (let i = 0; i < (-lives + 3); i++) {
                    livesDisplay.textContent += getBrokenLivesEmoji();
                }

                console.log(lives, lives - 3)

                livesDisplay.textContent += ` - Lives: ${lives}`;
            } else {
                livesDisplay.textContent = '- Lives: ?';
            }
        } else {
            livesDisplay.textContent = '🔒Disabled by Host';
            lives = 3;
        }
    } else {
        console.warn(`Missing LivesCounter!`)
    }
}

function doStringMath(num1, sym, num2) {
    if (sym == '+') {
        return num1 + num2
    } else if (sym == '-') {
        return num1 - num2
    } else if (sym == '*') {
        return num1 * num2
    }
}


let answear;

function generateMathProblem() {
    while (true) {
        const symbolList = {
            [1]: '+',
            [2]: '-',
        }
        let randomNumber = RandomNumber(1, 2);
        const symbol = symbolList[randomNumber];
        const displayLabel = document.getElementById('nextTurnAndProblemDisplay');
        const [num1, num2] = (function(){
            const num1 = RandomNumber(1, 24);
            const num2 = RandomNumber(1, 24);

            return [num1, num2];
        })();

        displayLabel.textContent = (num1) + ' ' + symbol + ' ' + (num2);

        const number = doStringMath(num1, symbol, num2);


        if (doesNumberButtonExsist(number)) {
            return number
        } else {
            continue;
        }
    }
}


function addListeners() {
    const livesDisplay = document.getElementById('livesCounter');
    const questionButton = document.getElementById('nextTurnAndProblemDisplay');

    const livesObserver = new MutationObserver(function(muntains) {
        console.log(muntains.length);
    });


    livesObserver.observe(livesDisplay, {
        characterData: true,
        subtree: false,
        childList: false,
    });
}

function onLiveTextChanged() {
    maxForLivesAndDoOnLivesLost();
}

function genNumberInRange(amount) {
    if (amount) {
        for (let i = 0; i < amount; i++) {
            const instance = document.createElement('button');
            const container = document.getElementById('button-row');

            container.appendChild(instance);
        }
    }
}


function onAnswearCorrect(button) {
    if (button) {
        if (parseInt(button.textContent) == answear) {
            return true;
        }
    }
}


function buttonCooldownToNextTeam(currentColor) {
    const list = {
        'rgb(255, 0, 0)': 'red',
        'rgb(0, 0, 255)': 'blue',
    }

    const listE = list[currentColor];
    console.log(currentColor, listE);

    if (listE) {
        if (listE == 'red') {
            return 'rgb(0, 0, 255)'; // this is Blue
        } else if (listE == 'blue') {
            return 'rgb(255, 0, 0)'; // this is Red
        }
    }
}



function doesNumberButtonExsist(num) {
    const buttonContainer = document.getElementById('button-row');
    const buttons = buttonContainer.children;


    for (let i = 0; i < buttons.length; i++) {
        const button = buttons[i];

        if (parseInt(button.textContent) === num && (button.style.backgroundColor == 'rgb(128, 128, 128)' || button.style.backgroundColor == '')) {
            return true;
        }
    }

    return false;
}


function toggleAlreadyPlayed() {
    alreadyPlayed = false;
}



function doPermanentDamage() {
    playFinalRoundShowBoxOntop('Removed 1 LIFE!')
    console.log('Removing 1 life!')
    if (livesStayAddon == true) {
        const dis = document.getElementById('colorCircleDisplay');

        if ((lives - 1) < 0) {
            lives = 0;
        } else {
            lives--;
        }

        const team = getTeamFromColorCode(dis.style.backgroundColor);

        livesStay_Container[team] = lives;


        console.log(`TEAM: ${team} HAS: ${livesStay_Container[team]} LIVES!`)

        updateLivesCounter();
    } else {
        remove1Life();
    }
}


let endedByTime = false;

function onButtonAnswearCorrect() {
    stopTime();
    let times = 0;
    const ID = setInterval(() => {
        if (times > 0) {
            console.log('waited!')
            clearInterval(ID);
        }

        times++;
    }, 1100)
    unDoHardcore();
    const dis = document.getElementById('colorCircleDisplay');
    if (livesStayAddon == true) {
        if (endedByTime == true) {
            doPermanentDamage();
        }
    } else {
        setLives(3);
    }
    endedByTime = false;
    answear = generateMathProblem();
    toggleAlreadyPlayed();
    const newColor = buttonCooldownToNextTeam(dis.style.backgroundColor)
    dis.style.backgroundColor = newColor;
    if (livesStayAddon == true) {
        const team = getTeamFromColorCode(newColor);

        setLives(livesStay_Container[team]);
    }
    setTime(defaultTime || 15);
    startTime();
}



function getTeamFromColorCode(code) {
    if (code === `rgb(255, 0, 0)`) {
        return 'red';
    } else if (code === `rgb(0, 0, 255)`) {
        return 'blue';
    }
}



let bluePoints = 0;
let redPoints = 0;

function add1PointToBlue() {
    const counter = document.getElementById('BluePoints');

    bluePoints += 1;
    counter.textContent = `🏳️‍⚧️ Blue: ${bluePoints}`;
}

function add1PointToRed() {
    const counter = document.getElementById('RedPoints');

    redPoints += 1;
    counter.textContent = `🏳️‍🌈 Red: ${redPoints}`;
}



function setTime(t) {
    time = t;
}

let timerEnabled = false;
let time = 15; // Example starting time in seconds
let intervalId = null; // Variable to store the interval ID
let ID2;

let hiddenQuestionsHidden = false;
let isQuestionSessionOver = false;
let finished = false;

let timerIsReady = false;

function startTime() {
    // Clear any existing interval
    if (intervalId !== null) {
        clearInterval(intervalId);
        intervalId = null;
    }
    if (ID2 && ID2 !== null) {
        clearInterval(ID2);
        ID2 = null;
    }

    const timerElement = document.getElementById('Timer');
    let timeLeft = time;
    let questionCountdown = 5;

    if (isHiddenQuestions == true && isQuestionSessionOver == false) {
        // HardMode logic
        ID2 = setInterval(() => {
            if (timeToggled) {
                if (questionCountdown > 0) {
                    timerElement.textContent = '⏱️ Questions will... in: ' + questionCountdown;
                    questionCountdown--;
                } else {
                    clearInterval(ID2);
                    finished = true;
                    isQuestionSessionOver = true;
                    doHardcore();
                    startTime(); // Restart the timer for the main countdown after questions are shown
                }
            } else {
                timerElement.textContent = '🔒Disabled By Host';
            }
        }, 1000);
    } else {
        // Normal mode logic
        intervalId = setInterval(() => {
            if (timeToggled) {
                if (timeLeft > 0) {
                    timerElement.textContent = '⏱️ Time left: ' + timeLeft;
                    timeLeft--;
                } else {
                    clearInterval(intervalId);
                    stopTime();
                    endedByTime = true;
                    isQuestionSessionOver = false;
                    onButtonAnswearCorrect();
                    finished = false;
                    timerIsReady = true;
                }
            } else {
                timerElement.textContent = '🔒Disabled By Host';
            }
        }, 1000);
    }
}

function stopTime() {
    timerEnabled = false; // This will stop the interval in startTime
    if (intervalId !== null) {
        clearInterval(intervalId);
        intervalId = null;
    }
    if (ID2 !== null) {
        clearInterval(ID2);
        ID2 = null;
    }
}


function doHardcore() {
    let buttonContainer = document.getElementById('button-row');
    let buttons = buttonContainer.children;

    for (let i = 0; i < buttons.length; i++) {
        const button = buttons[i];

        button.textContent = `?`;
    }
}


function unDoHardcore() {
    let buttonContainer = document.getElementById('button-row');
    let buttons = buttonContainer.children;

    for (let i = 0; i < buttons.length; i++) {
        const button = buttons[i];

        button.textContent = HideNumbers[button.id];
    }
}



let livesToggled = true;
let timeToggled = true;

let livesStayAddon = false;
let isLivesHidden = false;

let hardcoreMode = false;

let isHiddenQuestions = false;



function HostPanel() {
    const HostPanel = document.getElementById('hostPanel-Panel');
    const Module = {}


    Module.ToggleLives = function(on_off) {
        livesToggled = on_off;
    }

    Module.Start = function() {
        HostPanel.style.visibility = 'Hidden';
        onloadDo();
    }

    Module.ToggleTime = function(on_off) {
        timeToggled = on_off;
    }

    Module.LivesStay = function(on_off) {
        livesStayAddon = on_off;
    }

    Module.ToggleHiddenLives = function(on_off) {
        isLivesHidden = on_off;
    }

    Module.Hardmode = function(on_off) {
        hardcoreMode = on_off;
    }

    Module.setTimer = function(time) {
        setTime(time);
        defaultTime = time;
    }

    Module.ToggleHiddenQuestions = function(on_off) {
        isHiddenQuestions = on_off;
    }


    return Module
}


function setUpHostPanel() {
    const LivesToggle = document.getElementById('LivesToggle');
    const StartButton = document.getElementById('StartButton-Button');
    const TimeToggle = document.getElementById('TimeToggle');

    const TimerLabel = document.getElementById('Timer');
    const timeInput = document.getElementById('hostPanel-TimeInput');
    const confirmInputButton = document.getElementById('hostPanel-TimeInput-Button');

    const LivesStay = document.getElementById('hostPanel-LivesStay-Toggle');
    const hiddenLives = document.getElementById('hostPanel-LivesHidden-Toggle');

    const hardcoreModeE = document.getElementById('HardcoreModeToggle');
    const HideQustions = document.getElementById('HideQustionsToggle');



    LivesToggle.addEventListener('click', function() {
        if (LivesToggle.textContent === 'Toggle Lives: ON') {
            LivesToggle.textContent = 'Toggle Lives: OFF';
            HostPanel().ToggleLives(false);
            LivesStay.style.visibility = `Hidden`;
            hiddenLives.style.visibility = `Hidden`;
        } else {
            LivesToggle.textContent = 'Toggle Lives: ON';
            HostPanel().Hardmode(true);
        }
    });

    hardcoreModeE.addEventListener('click', function() {
        if (hardcoreModeE.textContent === 'Toggle HardMode: ON') {
            hardcoreModeE.textContent = 'Toggle HardMode: OFF';
            HostPanel().ToggleLives(false);

            doHardcoreModeModes();
        } else {
            hardcoreModeE.textContent = 'Toggle HardMode: ON';
            HostPanel().Hardmode(true);
        }
    });

    HideQustions.addEventListener('click', function() {
        if (HideQustions.textContent === 'Toggle Hide Questions: ON') {
            HideQustions.textContent = 'Toggle Hide Questions: OFF';
            HostPanel().ToggleHiddenQuestions(false);
        } else {
            HideQustions.textContent = 'Toggle Hide Questions: ON';
            HostPanel().ToggleHiddenQuestions(true);
        }
    });

    
    hiddenLives.addEventListener('click', function() {
        if (hiddenLives.textContent === 'Lives Hidden: ON') {
            hiddenLives.textContent = 'Lives Hidden: OFF';
            HostPanel().ToggleHiddenLives(false);
        } else {
            hiddenLives.textContent = 'Lives Hidden: ON';
            HostPanel().ToggleHiddenLives(true);
        }
    });


    LivesStay.addEventListener('click', function() {
        if (LivesStay.textContent === 'Lives Stay: ON [HARD]') {
            LivesStay.textContent = 'Lives Stay: OFF [HARD]';
            HostPanel().LivesStay(false);
        } else {
            LivesStay.textContent = 'Lives Stay: ON [HARD]';
            HostPanel().LivesStay(true);
        }
    });

    TimeToggle.addEventListener('click', function() {
        if (TimeToggle.textContent === 'Toggle Time: ON') {
            TimeToggle.textContent = 'Toggle Time: OFF';
            HostPanel().ToggleTime(false);
            TimerLabel.style.width = `20.5%`;
            timeInput.style.visibility = `Hidden`;
            confirmInputButton.style.visibility = `Hidden`;
        } else {
            TimeToggle.textContent = 'Toggle Time: ON';
            HostPanel().ToggleTime(true);
            TimerLabel.style.width = `16.5%`;
            timeInput.style.visibility = `unset`;
            confirmInputButton.style.visibility = `unset`;
        }
    });


    confirmInputButton.addEventListener('click', function() {
        if (parseInt(timeInput.value)) {
            const time = parseInt(timeInput.value);

            if ((time < 5) || (time > 30)) {
                alert('The input must be between: more than 5 and less than 30');
                return;
            }
            setTime(time);
            defaultTime = time;
        } else {
            alert('The input must be a Number')
        }
    });


    StartButton.addEventListener('click', function(){
        HostPanel().Start();
    });
}



const EasingFunctions = {
    linear: (t) => t,
    easeInQuad: (t) => t * t,
    easeOutQuad: (t) => t * (2 - t),
    easeInOutQuad: (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
    // Add more easing functions as needed
};


function tween(element, properties, duration, easing = 'linear', callback) {
    const start = {};
    const change = {};
    const startTime = performance.now();
    const easingFunc = EasingFunctions[easing];

    // Capture the initial values of the properties to animate
    for (let prop in properties) {
        start[prop] = parseFloat(getComputedStyle(element)[prop]);
        change[prop] = properties[prop] - start[prop];
    }

    function animate(time) {
        const elapsedTime = time - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        const easedProgress = easingFunc(progress);

        // Update each property based on the easing function
        for (let prop in properties) {
            element.style[prop] = start[prop] + change[prop] * easedProgress + (prop === "opacity" ? "" : "px");
        }

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else if (callback) {
            callback(); // Animation complete, call the callback function
        }
    }

    requestAnimationFrame(animate);
}





function adjustTextDisplay(element) {
    const div = element;

    if (div.offsetWidth < div.scrollWidth) {
        const max = Math.floor(div.offsetWidth / 20); // Adjust 20 based on heart size or desired character width
        const heartsDisplay = '❤️'.repeat(max);
    }
}



function getMaxEmoji(element, num) {
    if (element && num) {

    }
}



function playFinalRoundShowBoxOntop(text) {
    const topbarBox = document.getElementById('topbarBoxNotification');
    console.log("playFinalRoundShowBoxOntop called");

    topbarBox.style.visibility = 'unset';
    tweenTextService(topbarBox, text, 0.05);

    const displayTime = (text.length * 0.5 * 1000) / 3;

    // Use setTimeout to delay the execution of hiding the topbar
    setTimeout(() => {
        console.log("playFinalRoundShowBoxOntop timeout fired");
        topbarBox.style.visibility = 'hidden';
    }, displayTime); // Example delay based on text length
}






function tweenTextService(div, string, time) {
    /*
    for (let i = 0; i < string.length; i++) {
        div.textContent += string.substring(i, i + 1);

        let times = 0;
        let ID = setInterval(() => {
            if (times > 0) {
                console.log('waited!')
                clearInterval(ID);
            }
    
            times++;
            console.log(time + 1)
        }, 1000);
    }
    */
    let subbedFirst = 0;
    let subbedLast = string.length;
    time *= 1000;

    function displayNextChar() {
        if (subbedFirst < subbedLast) {
            div.textContent += string.substring(subbedFirst, subbedFirst + 1);
            subbedFirst++;
            setTimeout(displayNextChar, time || 1000);
        }
    }

    displayNextChar(); // Start the recursive timeout chain
}


function doHardcoreModeModes() {
    const panel = HostPanel();

    panel.ToggleLives(true);
    panel.LivesStay(true);
    panel.ToggleHiddenLives(true);
    panel.ToggleTime(true);
    panel.setTimer(8);
    panel.Start();

    //playFinalRoundShowBoxOntop('HardMode has enabled the followed MODES:\n\nLives: ON\nLives Stay: ON\nHidden Lives: ON\nTime: ON')
}


document.addEventListener('DOMContentLoaded', () => {
    setUpHostPanel();
})