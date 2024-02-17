let wordComp = [];
let wordCompString = '';
let wordMatched = [];
const gThresh = 0.8;
const yThresh = 0.6;

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function similarity(word1, word2) {
  const url = `http://localhost:5000/similarity?word1=${word1}&word2=${word2}`;
  return fetch(url)
    .then(response => response.text())
    .then(similarityScore => {
      return similarityScore; 
    })
    .catch(error => {
      console.error('There has been a problem with your fetch operation:', error);
    });
}

function createWordButtons(words, colorClass) {
  const button = document.createElement('button');
  button.textContent = words;
  button.classList.add('btn-word', colorClass);
  button.dataset.word = words.toLowerCase();
  return button
}

async function checkSimilarity(word){
  const simResult = await similarity(word, wordCompString);
  let parts = simResult.split(' ');
  const simScore = parseFloat(parts[0]).toFixed(2);
  const closeWord = parts[1];

  const scoreDiv = document.querySelector('.score');
  let scoreText = scoreDiv.textContent; 
  let score = parseFloat(scoreText.split(' ')[1]); 
  let button

  if (simScore > gThresh) {
    button = createWordButtons(word, 'btn-great');
    score += (100 * simScore)
    wordMatched.push(closeWord);
  } else if (simScore > yThresh) {
    button = createWordButtons(word, 'btn-meh');
    score += (75 * simScore)
  } else {
    button = createWordButtons(word, 'btn-bad');
  }
  console.log(score);
  const wordButtonsContainer = document.querySelector('.word-buttons');
  wordButtonsContainer.appendChild(button);
  scoreDiv.textContent = `Score: ${score}`;
}

document.addEventListener('DOMContentLoaded', function () {
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

  document
    .getElementById('wordGuess')
    .addEventListener('keypress', function (e) {
      if (e.key === 'Enter') {
        clickHandler();
      }
    });
});

function timer() {
  const timerElement = document.querySelector('.timer');
  let timeRemaining = 5; // 60 seconds for 1 minute

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
      openEndModal();
    }
  }, 1000);
};

function startHandler() {
  fetch('/images')
    .then(response => response.json())
    .then(data => {
      const len = Object.keys(data).length;
      wordComp = data[getRandomInt(len)]["keywords"];
      wordCompString = wordComp.join(',').replace(/\s+/g, '');
      console.log(wordCompString);
    })
    .catch(error => {
      console.error('Error fetching images:', error);
    });
}

document.addEventListener('DOMContentLoaded', function () {
  openModal("startModal");
});

function closeModal() {
  startHandler();
  var modal = document.getElementById("startModal");
  var overlay = document.getElementById("overlay");
  modal.style.display = "none";
  overlay.style.display = "none";
}

function openModal(modal) {
  var modal = document.getElementById(modal);
  var overlay = document.getElementById("overlay");
  modal.style.display = "block";
  overlay.style.display = "block";
}

function openEndModal() {
  const keywordsgotElement = document.querySelector('.keywords-got-container');
  keywordsgotElement.innerHTML = ''; 

  for (let i=0; i < wordMatched.length; i++) {
    const button = createWordButtons(wordMatched[i], 'btn-great');
    keywordsgotElement.appendChild(button);
  }

  // const keywordsmissElement = document.getElementById('keywordsmissed');

  openModal("endModal");
}