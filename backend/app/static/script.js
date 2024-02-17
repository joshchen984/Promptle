let wordComp = [];
let wordCompString = '';
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
  const wordButtonsContainer = document.querySelector('.word-buttons');

  const button = document.createElement('button');
  button.textContent = words;
  button.classList.add('btn-word', colorClass);
  button.dataset.word = words.toLowerCase();
  wordButtonsContainer.appendChild(button);
}

async function checkSimilarity(word){
  const simResult = await similarity(word, wordCompString);
  let parts = simResult.split(' ');
  const score = parseFloat(parts[0]);
  const closeWord = parts[1];

  console.log(score);
  console.log(closeWord);

  if (score > gThresh) {
    //green
    createWordButtons(word, 'btn-great');
  } else if (score > yThresh) {
    //yellow
    createWordButtons(word, 'btn-meh');
  } else {
    //red
    createWordButtons(word, 'btn-bad');
  }
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

  document.querySelector('.btn-prompt').addEventListener('click', function () {
    submitHandler();
  });

  document.querySelector('.btn-start').addEventListener('click', function () {
    startHandler();
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
  // Initial setup
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
      // You can add any action here that should occur when the timer ends
      openModal("endModal");
    }
  }, 1000);
};

document.addEventListener('DOMContentLoaded', function () {
  openModal("startModal");

});

function closeModal() {
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