
const cards = document.querySelectorAll('.card');
let flippedCards = [];
let score = 0;
let gameStarted = false;
const SCORE_INCREMENT = 10;

const scoreButton = document.getElementById("score");
const highestScoreDisplay = document.getElementById("highest-score");
const startButton = document.getElementById("start-button");
const restartButton = document.getElementById("restart-button");
const endButton = document.getElementById("end-button");

// Retrieve the lowest and highest scores from local storage or set them to default values
let lowestScore = localStorage.getItem("lowestScore");
let highestScore = localStorage.getItem("highestScore");
if (lowestScore === null) {
  lowestScore = Infinity;
}
if (highestScore === null) {
  highestScore = 0;
}

function updateScore() {
  scoreButton.textContent = "Score: " + score;
}

function increaseScore() {
  score += SCORE_INCREMENT;
  updateScore();
}

function checkMatch() {
  const card1 = flippedCards[0];
  const card2 = flippedCards[1];

  if (card1.getAttribute('data-card') === card2.getAttribute('data-card')) {
    increaseScore();

    // Disable matched cards by removing their click event listeners
    flippedCards.forEach(card => {
      card.removeEventListener('click', handleCardClick);
    });
    flippedCards = [];

    // Check if the current score is higher than the highest score
    if (score > highestScore) {
      highestScore = score;
      // Update the highest score in local storage
      localStorage.setItem("highestScore", highestScore);
      updateHighestScoreDisplay(); // Update highest score display
    }
    // Check if the current score is lower than the lowest score
    if (score < lowestScore) {
      lowestScore = score;
      // Update the lowest score in local storage
      localStorage.setItem("lowestScore", lowestScore);
    }
  } else {
    setTimeout(() => {
      // Flip back the non-matching cards
      flippedCards.forEach(card => {
        card.classList.remove('flipped');
      });
      flippedCards = [];
    }, 1000);
  }
}

function handleCardClick() {
  const card = this;

  if (gameStarted && !card.classList.contains('flipped') && flippedCards.length < 2) {
    card.classList.add('flipped');
    flippedCards.push(card);

    if (flippedCards.length === 2) {
      checkMatch();
    }
  }
}
/* flip all the cards to their front side once game ended or restarted*/
function flipAllCardsToFront() {
  cards.forEach(card => {
    card.classList.remove('flipped');
  });
}

function updateHighestScoreDisplay() {
  highestScoreDisplay.textContent = "Highest Score: " + highestScore;
}

cards.forEach(card => {
  card.addEventListener('click', handleCardClick);
});

startButton.addEventListener('click', () => {
  gameStarted = true;
  startButton.disabled = true;
});

restartButton.addEventListener('click', () => {
  // Flip back all the cards to their front side
  flipAllCardsToFront();

  // Reset the score
  score = 0;
  updateScore();

  // Reset game status
  gameStarted = true; // Allow restarting after pressing the "End" button
  startButton.disabled = true; // Disable the "Start" button after restart
  flippedCards = [];
/* saving highest score to local storage*/
  highestScore = localStorage.getItem("highestScore");
  if (highestScore === null) {
    highestScore = 0;
  }
  scoreButton.textContent = "Score: " + score + " (Highest: " + highestScore + ")";


  // Add event listeners to the cards again once the game is over
  cards.forEach(card => {
    card.addEventListener('click', handleCardClick);
  });
});

endButton.addEventListener('click', () => {
  // Flip back all the cards to their front side
  flipAllCardsToFront();

  // Reset game state
  gameStarted = false;
  startButton.disabled = false;
  flippedCards = [];
  // Perform any other tasks needed to end the game
});






