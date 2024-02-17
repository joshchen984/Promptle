document.addEventListener('DOMContentLoaded', function () {
  function clickHandler() {
    const inputField = document.getElementById('wordGuess');
    const userInput = inputField.value;
    if (userInput !== '') {
      createWordButtons(userInput);
      inputField.value = '';
    } // TODO: Add error handling saying guess can't be empty
  }

  document.querySelector('.btn-prompt').addEventListener('click', function () {
    clickHandler();
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

    //do a similarity check here

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
    }
  }, 1000);
};

document.addEventListener('DOMContentLoaded', function () {
  openModal();


  function openModal() {
    var modal = document.getElementById("modal");
    var overlay = document.getElementById("overlay");
    modal.style.display = "block";
    overlay.style.display = "block";
  }


});

function closeModal() {
  var modal = document.getElementById("modal");
  var overlay = document.getElementById("overlay");
  modal.style.display = "none";
  overlay.style.display = "none";
}