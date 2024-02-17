document.addEventListener("DOMContentLoaded", function() {
    document.querySelector('.btn-prompt').addEventListener('click', function() {
        const userInput = document.getElementById('wordGuess').value;
        createWordButtons(userInput);
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

document.addEventListener("DOMContentLoaded", function() {
    // Initial setup
    const timerElement = document.querySelector('.timer');
    let timeRemaining = 60; // 60 seconds for 1 minute

    // Update the timer display every second
    const countdown = setInterval(() => {
        timeRemaining--;
        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;
        timerElement.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

        if (timeRemaining <= 0) {
            clearInterval(countdown);
            timerElement.textContent = "Time's up!";
            // You can add any action here that should occur when the timer ends
        }
    }, 1000);
});
document.addEventListener("DOMContentLoaded", function() {
    const timerElement = document.querySelector('.timer');
    let timeRemaining = 60; // 60 seconds for 1 minute

    const countdown = setInterval(() => {
        timeRemaining--;
        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;
        timerElement.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

        if (timeRemaining <= 0) {
            clearInterval(countdown);
            timerElement.textContent = "Time's up!";
        }
    }, 1000);
});


