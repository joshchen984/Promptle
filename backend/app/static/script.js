let wordComp = [];
let prompt = '';
let wordCompString = '';
let wordMatched = [];
const guesses = new Set();
const gThresh = 0.8;
const yThresh = 0.6;
let gameImage = {};
let gameScore = 0;

function similarity(word1, word2) {
  const url = `/similarity-list?word1=${word1}&word2=${word2}`;
  return fetch(url)
    .then((response) => response.text())
    .then((similarityScore) => {
      return similarityScore;
    })
    .catch((error) => {
      console.error(
        'There has been a problem with your fetch operation:',
        error
      );
    });
}

function getPosition(element) {
  const rect = element.getBoundingClientRect();
  return { top: rect.top + window.scrollY, left: rect.left + window.scrollX };
}

function createWordButtons(words, colorClass) {
  const button = document.createElement('button');
  button.textContent = words;
  button.classList.add('btn-word', colorClass);
  button.dataset.word = words.toLowerCase();
  return button;
}

function scrollToBottom(element) {
  element.scrollTop = element.scrollHeight;
}

async function checkSimilarity(word) {
  word = word.toLowerCase().trim();
  if (guesses.has(word)) {
    document.getElementById('wordGuess').classList.add('error');
    return;
  }
  document.getElementById('wordGuess').classList.remove('error');
  guesses.add(word);
  const simResult = await similarity(word, wordCompString);
  let parts = simResult.split(' ');
  const simScore = parseFloat(parts[0]).toFixed(2);
  const closeWord = parts[1];

  const scoreDiv = document.querySelector('.score');
  let scoreText = scoreDiv.textContent;
  let score = parseFloat(scoreText.split(' ')[1]);
  let button;
  let addScore;
  let color;

  if (simScore > gThresh) {
    button = createWordButtons(word, 'btn-great');
    addScore = 100 * simScore;
    wordMatched.push(closeWord);
    color = '#31f663';
  } else if (simScore > yThresh) {
    button = createWordButtons(word, 'btn-meh');
    addScore = Math.floor(75 * simScore);
    color = '#ffe32f';
  } else {
    button = createWordButtons(word, 'btn-bad');
    addScore = 0;
    color = '#fb3838';
  }
  score += addScore;
  animateScore(
    addScore,
    window.innerWidth / 2,
    window.innerHeight / 2 - 230,
    color
  );

  const wordButtonsContainer = document.querySelector('.word-buttons');
  wordButtonsContainer.appendChild(button);
  scrollToBottom(wordButtonsContainer);
  gameScore = score;
  scoreDiv.textContent = `Score: ${score}`;
}

document.addEventListener('DOMContentLoaded', function () {
  const inputField = document.getElementById('wordGuess');

  inputField.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      submitHandler();
    }
  });

  function submitHandler() {
    const inputField = document.getElementById('wordGuess');
    const userInput = inputField.value;
    if (userInput !== '') {
      checkSimilarity(userInput);
      inputField.value = '';
    }
  }

  document.querySelector('.btn-prompt').addEventListener('click', function () {
    submitHandler();
  });

  document.querySelector('.btn-start').addEventListener('click', function () {
    startHandler();
  });
});

function timer() {
  const timerElement = document.querySelector('.timer');
  timerElement.classList.remove('timer-bad');

  let timeRemaining = 60; // 60 seconds for 1 minute

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  timerElement.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  // Update the timer display every second
  const countdown = setInterval(() => {
    timeRemaining--;
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    timerElement.textContent = `${minutes}:${
      seconds < 10 ? '0' : ''
    }${seconds}`;
    if (timeRemaining < 10) {
      timerElement.classList.add('timer-bad');
    }

    if (timeRemaining <= 0) {
      clearInterval(countdown);
      timerElement.textContent = "Time's up!";
      openEndModal();
    }
  }, 1000);
}

function startHandler() {
  gameScore = 0;
  guesses.clear();
  const scoreDiv = document.querySelector('.score');
  scoreDiv.textContent = `Score: ${gameScore}`;
  wordMatched = [];

  const wordButtonsContainer = document.querySelector('.word-buttons');
  wordButtonsContainer.textContent = '';

  document.getElementById('wordGuess').value = '';
  fetch('/random-image')
    .then((response) => response.json())
    .then((data) => {
      gameImage = data;
      document.getElementById('game-image').src = gameImage.image_url;
      prompt = gameImage['prompt'];
      wordComp = gameImage['keywords'];
      wordCompString = wordComp.join(',').replace(/\s+/g, '');
    })
    .catch((error) => {
      console.error('Error fetching images:', error);
    });
}

document.addEventListener('DOMContentLoaded', function () {
  openModal('startModal');
});

function closeModal() {
  startHandler();
  var modal = document.getElementById('startModal');
  var overlay = document.getElementById('overlay');
  modal.style.display = 'none';
  overlay.style.display = 'none';
}

function openModal(modal) {
  var modal = document.getElementById(modal);
  var overlay = document.getElementById('overlay');
  modal.style.display = 'block';
  overlay.style.display = 'block';
}

function openEndModal() {
  const keywordsgotElement = document.querySelector('.keywords-got-container');
  keywordsgotElement.innerHTML = '';

  for (let i = 0; i < wordMatched.length; i++) {
    const button = createWordButtons(wordMatched[i], 'btn-great');
    keywordsgotElement.appendChild(button);
  }

  const keywordsmissElement = document.querySelector(
    '.keywords-missed-container'
  );
  keywordsmissElement.innerHTML = '';
  let wordsNotMatched = wordComp.filter((word) => !wordMatched.includes(word));

  for (let i = 0; i < wordsNotMatched.length; i++) {
    const button = createWordButtons(wordsNotMatched[i], 'btn-bad');
    keywordsmissElement.appendChild(button);
  }
  const scoreText = document.querySelector('.total-score');
  scoreText.textContent = `Score: ${gameScore}`;

  const promptText = document.querySelector('.prompt');
  promptText.textContent = `${prompt}`;
  openModal('endModal');
}

function playAgain() {
  startHandler();
  var modal = document.getElementById('endModal');
  var overlay = document.getElementById('overlay');
  modal.style.display = 'none';
  overlay.style.display = 'none';
}

function playAgain() {
  startHandler();
  var modal = document.getElementById('endModal');
  var overlay = document.getElementById('overlay');
  modal.style.display = 'none';
  overlay.style.display = 'none';
}

function animateScore(scoreValue, startX, startY, color) {
  const scorePopUp = document.createElement('div');
  scorePopUp.textContent = `+${scoreValue}`;
  scorePopUp.classList.add('score-pop-up');
  scorePopUp.style.left = `${startX}px`;
  scorePopUp.style.top = `${startY}px`;
  scorePopUp.style.color = color;
  document.body.appendChild(scorePopUp);

  // Remove the pop-up after the animation completes
  scorePopUp.addEventListener('animationend', () => {
    scorePopUp.remove();
  });
}
