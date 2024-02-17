let wordComp = [];
let wordCompString = '';
const gThresh = 0.8;
const yThresh = 0.6;
let gameImage = {};

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function similarity(word1, word2) {
  const url = `http://localhost:5000/similarity?word1=${word1}&word2=${word2}`;
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

function createWordButtons(words, colorClass) {
  const wordButtonsContainer = document.querySelector('.word-buttons');

  const button = document.createElement('button');
  button.textContent = words;
  button.classList.add('btn-word', colorClass);
  button.dataset.word = words.toLowerCase();
  wordButtonsContainer.appendChild(button);
}

async function checkSimilarity(word) {
  const simResult = await similarity(word, wordCompString);
  let parts = simResult.split(' ');
  const simScore = parseFloat(parts[0]).toFixed(2);
  const closeWord = parts[1];

  const scoreDiv = document.querySelector('.score');
  let scoreText = scoreDiv.textContent;
  let score = parseFloat(scoreText.split(' ')[1]);

  if (simScore > gThresh) {
    //green
    createWordButtons(word, 'btn-great');
    score += 100 * simScore;
  } else if (simScore > yThresh) {
    //yellow
    createWordButtons(word, 'btn-meh');
    score += 75 * simScore;
  } else {
    //red
    createWordButtons(word, 'btn-bad');
  }
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
  // Initial setup
  const timerElement = document.querySelector('.timer');
  let timeRemaining = 60; // 60 seconds for 1 minute

  // Update the timer display every second
  const countdown = setInterval(() => {
    timeRemaining--;
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    timerElement.textContent = `${minutes}:${
      seconds < 10 ? '0' : ''
    }${seconds}`;

    if (timeRemaining <= 0) {
      clearInterval(countdown);
      timerElement.textContent = "Time's up!";
      // You can add any action here that should occur when the timer ends
      openModal('endModal');
    }
  }, 1000);
}

function startHandler() {
  fetch('/images')
    .then((response) => response.json())
    .then((data) => {
      const len = Object.keys(data).length;
      gameImage = data[getRandomInt(len)];
      document.getElementById('game-image').src =
        'data:image/png;base64,' + gameImage.image['$binary'].base64;
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
