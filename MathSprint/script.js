// Pages
const gamePage = document.getElementById('game-page');
const scorePage = document.getElementById('score-page');
const splashPage = document.getElementById('splash-page');
const countdownPage = document.getElementById('countdown-page');

// Splash Page
const startForm = document.getElementById('start-form');
const radioContainers = document.querySelectorAll('.radio-container');
const radioInputs = document.querySelectorAll('input');
const bestScores = document.querySelectorAll('.best-score-value');
const bestPlayers = document.querySelectorAll('.best-score-player');

// Countdown Page
const countdown = document.querySelector('.countdown');

// Game Page
const itemContainer = document.querySelector('.item-container');

// Score Page
const finalTimeEl = document.querySelector('.final-time');
const baseTimeEl = document.querySelector('.base-time');
const penaltyTimeEl = document.querySelector('.penalty-time');
const playAgainBtn = document.querySelector('.play-again');

// Equations
let questionAmount = 0;
let equationsArray = [];
let playerGuessArray = [];
let bestScoreArray = [];
let bestPlayerArray = [];

// Game Page
let firstNumber = 0;
let secondNumber = 0;
let equationObject = {};
const wrongFormat = [];

// Time
let timer;
let timePlayed = 0;
let baseTime = 0;
let penaltyTime = 0;
let finalTime = 0;
let finalTimeDisplay = '0.0';
let playerInitials = '---';

// Scroll
let valueY = 0;


// Refresh Splash Page Best Scores
function bestScoresToDOM() {
  bestScores.forEach((bestScore, index) => {
    const bestScoreEl = bestScore;
    bestScoreEl.textContent = `${bestScoreArray[index].bestScore}s`;
  });
  bestPlayers.forEach((bestPlayer, index) => {
    const bestPlayerEl = bestPlayer;
    bestPlayerEl.textContent = `${bestScoreArray[index].bestPlayer}`;
  });
}


// Check local storage for best scores, set bestScoreArray
function getSavedBestScores() {
  if (localStorage.getItem("bestScores")) {
    bestScoreArray = JSON.parse(localStorage.bestScores);
  } else {
    bestScoreArray = [
      { questions: 10, bestScore: finalTimeDisplay, bestPlayer: '---' },
      { questions: 25, bestScore: finalTimeDisplay, bestPlayer: '---' },
      { questions: 50, bestScore: finalTimeDisplay, bestPlayer: '---' },
      { questions: 99, bestScore: finalTimeDisplay, bestPlayer: '---' }
    ];
    localStorage.setItem('bestScores', JSON.stringify(bestScoreArray));
  }
  bestScoresToDOM();
}


// Update Best Score Array
function updateBestScore() {
  bestScoreArray.forEach((score, index) => {
    // Select correct best score to update
    if (questionAmount == score.questions) {
      // Return Best Score as number with 1 decimal
      const savedBestScore = Number(bestScoreArray[index].bestScore)

      // Update if the new final score is less or replacing zero
      if (savedBestScore === 0 || savedBestScore > finalTime) {
        bestScoreArray[index].bestScore = finalTimeDisplay;
        bestScoreArray[index].bestPlayer = playerInitials;
      }
    }
  });

  // Update Splash Page
  bestScoresToDOM();

  // Save to local storage
  localStorage.setItem('bestScores', JSON.stringify(bestScoreArray));
}

// Reset Game
function playAgain() {
  gamePage.addEventListener('click', startTimer);
  scorePage.hidden = true;
  splashPage.hidden = false;
  equationsArray = [];
  playerGuessArray = [];
  valueY = 0;
  playAgainBtn.hidden = true;
}


// Show Score Page
function showScorePage() {
  // Show Play Again button after 1 second
  setTimeout(() => {
    playAgainBtn.hidden = false;
  }, 1000);
  gamePage.hidden = true;
  scorePage.hidden = false;
}


// Format & Display Time in DOM
function scoresToDOM() {
  finalTimeDisplay = finalTime.toFixed(1);
  baseTime = timePlayed.toFixed(1);
  penaltyTime = penaltyTime.toFixed(1);
  
  baseTimeEl.textContent = `Base Time: ${baseTime}s`;
  penaltyTimeEl.textContent = `Penalty: +${penaltyTime}s`;
  finalTimeEl.textContent = `${finalTimeDisplay}s`;
  updateBestScore();

  // Scroll to Top, go to score page
  itemContainer.scrollTo({ top: 0, behavior: 'instant' });
  showScorePage();
}


// Stop Timer, Process Results, go to Score Page
function checkTime() {
  if (playerGuessArray.length == questionAmount) {
    console.log('player guess array:', playerGuessArray);

    // Stop the stop watch
    clearInterval(timer);

    // Check for wrong guesses, add penalty time
    equationsArray.forEach((equation, index) => {
      if (equation.evaluated === playerGuessArray[index]) {
        // Correct Guess, No Penalty
      } else {
        // Incorrect Guess, Add Penalty
        penaltyTime += 0.5;
      }
    });

    finalTime = timePlayed + penaltyTime;
    console.log('time:', timePlayed, 'penalty:', penaltyTime, 'final:', finalTime)
    scoresToDOM();
  }
}


// Add a tenth of a second to timePlayed
function addTime() {
  timePlayed += 0.1;
  checkTime();
}


// Start Timer when Game Page is clicked
function startTimer() {
  // Reset times
  timePlayed = 0;
  penaltyTime = 0;
  finalTime = 0;

  timer = setInterval(addTime, 100);
  gamePage.removeEventListener("click", startTimer);
}


// Scroll, Store user selection in playerGuessArray
function select(guessedTrue) {
  // Scroll 80 pixels
  valueY += 80;
  itemContainer.scroll(0, valueY);

  // Add player guess to array
  return guessedTrue ? playerGuessArray.push('true') : playerGuessArray.push("false");
}


// Display Game Page
function showGamePage() {
  gamePage.hidden = false;
  countdownPage.hidden = true;
}


// Get Random Number up to a max number
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max) + 1);
}


// Create Correct/Incorrect Random Equations
function createEquations() {
  // Randomly choose how many correct equations there should be
  const correctEquations = getRandomInt(questionAmount);
  console.log('correct equations:', correctEquations);
  // Set amount of wrong equations
  const wrongEquations = questionAmount - correctEquations;
  console.log('wrong equations:', wrongEquations);
  // Loop through, multiply random numbers up to 9, push to array
  for (let i = 0; i < correctEquations; i++) {
    firstNumber = getRandomInt(10);
    secondNumber = getRandomInt(10);
    const equationValue = firstNumber * secondNumber;
    const equation = `${firstNumber} x ${secondNumber} = ${equationValue}`;
    equationObject = { value: equation, evaluated: 'true' };
    equationsArray.push(equationObject);
  }
  // Loop through, mess with the equation results, push to array
  for (let i = 0; i < wrongEquations; i++) {
    firstNumber = getRandomInt(10);
    secondNumber = getRandomInt(10);
    const equationValue = firstNumber * secondNumber;
    wrongFormat[0] = `${firstNumber} x ${secondNumber + 1} = ${equationValue}`;
    wrongFormat[1] = `${firstNumber} x ${secondNumber} = ${equationValue - 1}`;
    wrongFormat[2] = `${firstNumber + 1} x ${secondNumber} = ${equationValue}`;
    const formatChoice = getRandomInt(2);
    const equation = wrongFormat[formatChoice];
    equationObject = { value: equation, evaluated: 'false' };
    equationsArray.push(equationObject);
  }
  shuffle(equationsArray);
}


// Add equations to DOM
function equationsToDOM() {
  equationsArray.forEach((equation) => {
    // Item
    const item = document.createElement("div");
    item.classList.add('item');

    // Equation Text
    const equationText = document.createElement("h1");
    equationText.textContent = equation.value;

    // Append
    item.appendChild(equationText);
    itemContainer.appendChild(item);
  });
}


// Dynamically adding correct/incorrect equations
function populateGamePage() {
  // Reset DOM, Set Blank Space Above
  itemContainer.textContent = '';
  // Spacer
  const topSpacer = document.createElement('div');
  topSpacer.classList.add('height-240');
  // Selected Item
  const selectedItem = document.createElement('div');
  selectedItem.classList.add('selected-item');
  // Append
  itemContainer.append(topSpacer, selectedItem);

  // Create Equations, Build Elements in DOM
  createEquations();
  equationsToDOM();

  // Set Blank Space Below
  const bottomSpacer = document.createElement('div');
  bottomSpacer.classList.add('height-500');
  itemContainer.appendChild(bottomSpacer);
}


// Displays 3, 2, 1, GO
function countdownStart() {
  let count = 3;
  countdown.textContent = count;
  const timeCountDown = setInterval(() => {
    count--;
    if (count === 0) {
      countdown.textContent = "GO!";
    } else if (count === -1) {
      showGamePage();
      clearInterval(timeCountDown);
    } else {
      countdown.textContent = count;
    }
  }, 1000);
}


// Navigate from Splash Page to Countdown Page
function showCountDown() {
  countdownPage.hidden = false;
  splashPage.hidden = true;
  populateGamePage();
  countdownStart();
}


// Get the value from selected radio button
function getRadioValue() {
  let radioValue;
  radioInputs.forEach(radio => {
    if (radio.checked) {
      radioValue = radio.value;
    }
  });
  return radioValue;
}


// Form that decides amount of questions
function selectQuestionAmount(e) {
  e.preventDefault();
  questionAmount = getRadioValue();
  console.log('question amount:', questionAmount);
  if (questionAmount) {
    showCountDown();
  }
}


// Event Listeners
startForm.addEventListener("click", () => {
  radioContainers.forEach(radio => {
      // Remove selected label styling
      radio.classList.remove('selected-label');

      // Add it back if radio input is checked
      if (radio.children[1].checked) {
        radio.classList.add('selected-label');
      }
  });
});


startForm.addEventListener('submit', selectQuestionAmount);
gamePage.addEventListener("click", startTimer);

// On Load
getSavedBestScores();