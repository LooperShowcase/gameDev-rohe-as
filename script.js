const cardsContainer = document.querySelector(".cards");
let firstCard, secondCard;
let cards = [];
let card;
let score = 0;
let lockBoard = false;

document.querySelector(".Score").textContent = score;

fetch("./data/cards.json")
  .then((res) => res.json())
  .then((data) => {
    cards = [...data, ...data];
    shuffleCards();
    GenerateCards();
    console.log(cards);
  });

function shuffleCards() {
  let currentIndex = cards.length;
  let randomIndex;
  let temporaryValue;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = cards[currentIndex];
    cards[currentIndex] = cards[randomIndex];
    cards[randomIndex] = temporaryValue;
  }
}

function GenerateCards() {
  for (card of cards) {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");
    cardElement.setAttribute("data-name", card.name);
    cardElement.innerHTML = `
        <div class="front">
            <img class="front-image" src=${card.image} />
        </div>
        <div class="back"></div>
        `;
    cardElement.addEventListener("click", flipCard); // add this
    cardElement.addEventListener("touchstart", flipCard);
    cardsContainer.appendChild(cardElement);
  }
}

function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;

  this.classList.add("flipped");

  if (!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;
  document.querySelector(".Score").textContent = score;
  lockBoard = true;
  checkForMatch(); // add this
}

function checkForMatch() {
  let isMatch = firstCard.dataset.name === secondCard.dataset.name;
  if (isMatch) {
    disableCards();
  } else {
    unflipCards();
  }
}
function unlockBoard() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}
function disableCards() {
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);
  firstCard.removeEventListener("touchstart", flipCard);
  secondCard.removeEventListener("touchstart", flipCard);
  score = score + 1;
  unlockBoard();
}

function unflipCards() {
  setTimeout(() => {
    firstCard.classList.remove("flipped");
    secondCard.classList.remove("flipped");
    unlockBoard();
  }, 1000);
}

function restart() {
  score = 0;
  unlockBoard();
  shuffleCards();
  document.querySelector(".Score").textContent = score;
  cardsContainer.innerHTML = "";
  GenerateCards();
}
