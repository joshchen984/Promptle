let wordComp = '';

document.addEventListener('DOMContentLoaded', function () {
  function submitHandler() {
    const inputField = document.getElementById('wordGuess');
    const userInput = inputField.value;
    if (userInput !== '') {
      createWordButtons(userInput);
      const word2 = 'check';

      const url = `http://localhost:5000/similarity?word1=${userInput}&word2=${word2}`;
      
      fetch(url)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.text();
        })
        .then(similarityScore => {
          console.log('Similarity score:', similarityScore);
        })
        .catch(error => {
          console.error('There has been a problem with your fetch operation:', error);
        });

      inputField.value = '';
    } 
  }

  function startHandler() {
    fetch('/images')
      .then(response => response.json())
      .then(data => {
        console.log(wordComp);
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

  function createWordButtons(words) {
    const wordButtonsContainer = document.querySelector('.word-buttons');

    const button = document.createElement('button');
    button.textContent = words;
    button.classList.add('btn-word');
    button.dataset.word = words.toLowerCase();
    wordButtonsContainer.appendChild(button);
  }
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