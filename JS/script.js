const selectors = {
    boardContainer: document.querySelector(".board-container"),
    board: document.querySelector(".board"),
    moves: document.querySelector(".moves"),
    timer: document.querySelector(".timer"),
    start: document.querySelector("button"),
    win: document.querySelector(".win"),
  };
  
  const state = {
    gameStarted: false,
    flippedCards: 0,
    totalFlips: 0,
    totalTime: 0,
    loop: null,
  };
  
  const shuffle = (array) => {
    const clonedArray = [...array];
  
    for (let index = clonedArray.length - 1; index > 0; index--) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      const original = clonedArray[index];
  
      clonedArray[index] = clonedArray[randomIndex];
      clonedArray[randomIndex] = original;
    }
  
    return clonedArray;
  };
  
  const pickRandom = (array, items) => {
    const clonedArray = [...array];
    const randomPicks = [];
  
    for (let index = 0; index < items; index++) {
      const randomIndex = Math.floor(Math.random() * clonedArray.length);
  
      randomPicks.push(clonedArray[randomIndex]);
      clonedArray.splice(randomIndex, 1);
    }
  
    return randomPicks;
  };
  
  const generateGame = () => {
    const dimensions = 6;
  
    if (dimensions % 2 !== 0) {
      throw new Error("The dimension of the board must be an even number.");
    }
  
    // Define the paths to your image files
    const imagePaths = [
      "Assets/IMG/1.jpg",
      "Assets/IMG/2.jpg",
      "Assets/IMG/3.jpg",
      "Assets/IMG/4.jpg",
      "Assets/IMG/5.jpg",
      "Assets/IMG/6.jpg",
      "Assets/IMG/7.jpg",
      "Assets/IMG/8.jpg",
      "Assets/IMG/9.jpg",
      "Assets/IMG/10.jpg",
      "Assets/IMG/11.jpg",
      "Assets/IMG/12.jpg",
      "Assets/IMG/13.jpg",
      "Assets/IMG/14.jpg",
      "Assets/IMG/15.jpg",
      "Assets/IMG/16.png",
      "Assets/IMG/17.jpg",
      "Assets/IMG/18.jpg",
    ];
  
    // Shuffle the image paths
    const shuffledImagePaths = shuffle(imagePaths);
  
    // Pick random images for the game
    const pickedImages = pickRandom(
      shuffledImagePaths,
      (dimensions * dimensions) / 2
    );
  
    // Duplicate the picked images for matching pairs
    const items = shuffle([...pickedImages, ...pickedImages]);
  
    // Generate HTML for cards
    const cards = `
      <div class="board" style="grid-template-columns: repeat(${dimensions}, auto)">
        ${items.map(item => `
          <div class="card">
            <div class="card-front"></div>
            <div class="card-back"><img src="${item}" alt="Card"></div>
          </div>
        `).join("")}
      </div>
    `;      
  
    // Parse the HTML string into DOM elements
    const parser = new DOMParser().parseFromString(cards, "text/html");
  
    // Replace the existing board with the new one
    selectors.board.replaceWith(parser.querySelector(".board"));
    selectors.board = document.querySelector(".board"); // Re-select the board
  };
  
  const startGame = () => {
    state.gameStarted = true;
    selectors.start.classList.add("disabled");
  
    state.loop = setInterval(() => {
      state.totalTime++;
  
      selectors.moves.innerText = `${state.totalFlips} moves`;
      selectors.timer.innerText = `time: ${state.totalTime} sec`;
    }, 1000);
  };
  
  const flipBackCard = () => {
    document.querySelectorAll(".card:not(.matched)").forEach((card) => {
      card.classList.remove("flipped");
    });
  
    state.flippedCards = 0;
  };
  
  const flipCard = (card) => {
    state.flippedCards++;
    state.totalFlips++;
  
    if (!state.gameStarted) {
      startGame();
    }
  
    if (state.flippedCards <= 2) {
      card.classList.add("flipped");
    }
  
    if (state.flippedCards === 2) {
      const flippedCards = document.querySelectorAll(".flipped:not(.matched)");
  
      if (
        flippedCards[0].querySelector("img").src ===
        flippedCards[1].querySelector("img").src
      ) {
        flippedCards[0].classList.add("matched");
        flippedCards[1].classList.add("matched");
      }
  
      setTimeout(() => {
        flipBackCard();
      }, 1000);
    }
  
    if (!document.querySelectorAll(".card:not(.flipped)").length) {
      setTimeout(() => {
        selectors.boardContainer.classList.add("flipped");
        selectors.win.innerHTML = `
          <span class="win-text">
            You won!<br />
            with <span class="highlight">${state.totalFlips}</span> moves<br />
            under <span class="highlight">${state.totalTime}</span> seconds
          </span>
        `;
  
        clearInterval(state.loop);
      }, 1000);
    }
  };
  
  const attachEventListeners = () => {
    document.addEventListener("click", (event) => {
      const eventTarget = event.target;
      const eventParent = eventTarget.parentElement;
  
      if (
        eventTarget.className.includes("card-front") &&
        !eventParent.className.includes("flipped")
      ) {
        flipCard(eventParent);
      } else if (
        eventTarget.nodeName === "BUTTON" &&
        !eventTarget.className.includes("disabled")
      ) {
        startGame();
      }
    });
  };
  
  generateGame();
  attachEventListeners();
  