const gameBoard = document.getElementById("game-board");
const matchesDisplay = document.getElementById("matches");
const attemptsDisplay = document.getElementById("attempts");
const restartButton = document.getElementById("restart-btn");
const message = document.getElementById("message");

// Your 10 images
const images = [
    "images/image1.jpg",
    "images/image2.jpg",
    "images/image3.jpg",
    "images/image4.jpg",
    "images/image5.jpg",
    "images/image6.jpg",
    "images/image7.jpg",
    "images/image8.jpg",
    "images/image9.jpg",
    "images/image10.jpg"
];

let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let attempts = 0;
let lockBoard = false;


// CREATE CARDS
function createCards() {

    gameBoard.innerHTML = "";

    flippedCards = [];
    matchedPairs = 0;
    attempts = 0;
    lockBoard = false;

    matchesDisplay.textContent = "0";
    attemptsDisplay.textContent = "0";
    message.textContent = "";

    /*
        Each image appears twice.
        This creates 20 cards.
    */

    let cardData = [];

    images.forEach((image, index) => {

        cardData.push({
            id: index,
            image: image,
            special: false
        });

        cardData.push({
            id: index,
            image: image,
            special: false
        });

    });

    /*
        Add the 21st special card.
    */

    cardData.push({
        id: "special",
        image: null,
        special: true
    });

    // Shuffle cards
    shuffle(cardData);

    cards = cardData;

    // Create HTML cards
    cardData.forEach((card, index) => {

        const cardElement = document.createElement("div");

        cardElement.classList.add("card");

        if (card.special) {
            cardElement.classList.add("special");
        }

        cardElement.dataset.id = card.id;
        cardElement.dataset.index = index;

        cardElement.innerHTML = `
            <div class="card-inner">

                <div class="card-front">
                    ?
                </div>

                <div class="card-back">

                    ${
                        card.special
                        ? "<span>⭐</span>"
                        : `<img src="${card.image}" alt="Card Image">`
                    }

                </div>

            </div>
        `;

        cardElement.addEventListener("click", () => flipCard(cardElement));

        gameBoard.appendChild(cardElement);
    });
}


// FLIP CARD
function flipCard(cardElement) {

    // Don't allow cards to be clicked while checking
    if (lockBoard) return;

    // Don't allow clicking the same card twice
    if (cardElement.classList.contains("flipped")) return;

    // Don't allow matched cards to be clicked
    if (cardElement.classList.contains("matched")) return;

    // Only allow 2 cards
    if (flippedCards.length >= 2) return;

    cardElement.classList.add("flipped");

    flippedCards.push(cardElement);

    // Check after 2 cards
    if (flippedCards.length === 2) {

        attempts++;

        attemptsDisplay.textContent = attempts;

        checkMatch();
    }
}


// CHECK MATCH
function checkMatch() {

    lockBoard = true;

    const firstCard = flippedCards[0];
    const secondCard = flippedCards[1];

    const firstId = firstCard.dataset.id;
    const secondId = secondCard.dataset.id;

    // Special card
    if (firstId === "special" || secondId === "special") {

        setTimeout(() => {

            firstCard.classList.remove("flipped");
            secondCard.classList.remove("flipped");

            flippedCards = [];

            lockBoard = false;

            message.textContent = "❌ Wrong! The special card has no pair.";

            setTimeout(() => {
                message.textContent = "";
            }, 1000);

        }, 800);

        return;
    }


    // MATCH
    if (firstId === secondId) {

        setTimeout(() => {

            firstCard.classList.add("matched");
            secondCard.classList.add("matched");

            matchedPairs++;

            matchesDisplay.textContent = matchedPairs;

            flippedCards = [];

            lockBoard = false;

            message.textContent = "✅ Match!";

            setTimeout(() => {
                message.textContent = "";
            }, 800);

            // WIN
            if (matchedPairs === 10) {

                message.textContent =
                    `🎉 Congratulations! You matched all 10 pairs in ${attempts} attempts!`;

            }

        }, 400);

    }

    // WRONG
    else {

        setTimeout(() => {

            firstCard.classList.remove("flipped");
            secondCard.classList.remove("flipped");

            flippedCards = [];

            lockBoard = false;

            message.textContent = "❌ Wrong! Try again.";

            setTimeout(() => {
                message.textContent = "";
            }, 1000);

        }, 1000);
    }
}


// SHUFFLE
function shuffle(array) {

    for (let i = array.length - 1; i > 0; i--) {

        const randomIndex = Math.floor(Math.random() * (i + 1));

        [array[i], array[randomIndex]] =
            [array[randomIndex], array[i]];
    }

    return array;
}


// RESTART
restartButton.addEventListener("click", createCards);


// START GAME
createCards();
