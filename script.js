const gameBoard = document.getElementById("game-board");
const matchesDisplay = document.getElementById("matches");
const attemptsDisplay = document.getElementById("attempts");
const restartButton = document.getElementById("restart-btn");
const message = document.getElementById("message");

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

let flippedCards = [];
let matchedPairs = 0;
let attempts = 0;
let lockBoard = false;


// =========================
// CREATE GAME
// =========================

function createCards() {

    gameBoard.innerHTML = "";

    flippedCards = [];
    matchedPairs = 0;
    attempts = 0;
    lockBoard = true;

    matchesDisplay.textContent = "0";
    attemptsDisplay.textContent = "0";
    message.textContent = "👀 Memorize the cards!";

    let cardData = [];

    // Create 2 copies of each image
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

    // 21st card
    cardData.push({
        id: "special",
        image: null,
        special: true
    });

    // SHUFFLE
    shuffle(cardData);

    // Create cards
    cardData.forEach((card) => {

        const cardElement = document.createElement("div");

        cardElement.classList.add("card");

        if (card.special) {
            cardElement.classList.add("special");
        }

        cardElement.dataset.id = card.id;

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

        cardElement.addEventListener("click", () => {
            flipCard(cardElement);
        });

        gameBoard.appendChild(cardElement);
    });


    // =========================
    // REVEAL ALL CARDS
    // =========================

    const allCards = document.querySelectorAll(".card");

    allCards.forEach(card => {
        card.classList.add("flipped");
    });


    // Hide cards after 5 seconds
    setTimeout(() => {

        allCards.forEach(card => {
            card.classList.remove("flipped");
        });

        lockBoard = false;

        message.textContent = "🎯 Find all the matching pairs!";

    }, 5000);
}


// =========================
// FLIP CARD
// =========================

function flipCard(cardElement) {

    if (lockBoard) return;

    if (cardElement.classList.contains("flipped")) return;

    if (cardElement.classList.contains("matched")) return;

    if (flippedCards.length >= 2) return;

    cardElement.classList.add("flipped");

    flippedCards.push(cardElement);

    if (flippedCards.length === 2) {

        attempts++;

        attemptsDisplay.textContent = attempts;

        checkMatch();
    }
}


// =========================
// CHECK MATCH
// =========================

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

            message.textContent = "❌ Wrong!";

            setTimeout(() => {
                message.textContent = "";
            }, 800);

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
            }, 700);


            // WIN
            if (matchedPairs === 10) {

                message.textContent =
                    `🎉 You won! ${attempts} attempts.`;

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

            message.textContent = "❌ Wrong!";

            setTimeout(() => {
                message.textContent = "";
            }, 800);

        }, 1000);
    }
}


// =========================
// SHUFFLE
// =========================

function shuffle(array) {

    for (let i = array.length - 1; i > 0; i--) {

        const randomIndex =
            Math.floor(Math.random() * (i + 1));

        [array[i], array[randomIndex]] =
            [array[randomIndex], array[i]];
    }

    return array;
}


// =========================
// RESTART
// =========================

restartButton.addEventListener("click", () => {

    createCards();

});


// =========================
// START GAME
// =========================

createCards();
