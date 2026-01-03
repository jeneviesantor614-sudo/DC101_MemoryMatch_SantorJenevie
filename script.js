let flippedCards = [];
let symbols = [];
let matched = 0;
let timeLeft = 60;
let timerInterval;
let busy = false;
let levelClass = "medium"; 

const flipS = document.getElementById("flip-sound");
const matchS = document.getElementById("match-sound");
const wrongS = document.getElementById("wrong-sound");
const winS = document.getElementById("win-sound");
const loseS = document.getElementById("lose-sound");
const sparkleS = document.getElementById("sparkle-sound");

function showTab(tabId) {
  document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));
  document.getElementById(tabId).classList.add('active');
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function createSymbols(amount) {
  const items = ['🍎','🍌','🍇','🍉','🥝','🥑','🍓','🍒','🍑','🥥'];
  return shuffle([...items.slice(0, amount), ...items.slice(0, amount)]);
}

function startGame() {
  const difficulty = document.getElementById("difficulty").value;

  let pairs;
  if (difficulty === "easy") {
    pairs = 6;     
    levelClass = "easy";
    timeLeft = 50;
  }
  else if (difficulty === "medium") {
    pairs = 8;     
    levelClass = "medium";
    timeLeft = 60;
  }
  else {
    pairs = 10;    
    levelClass = "hard";
    timeLeft = 70;
  }

  symbols = createSymbols(pairs);
  flippedCards = [];
  matched = 0;
  busy = false;

  clearInterval(timerInterval);
  document.getElementById("timer").textContent = timeLeft;
  document.getElementById("progress-bar").style.width = "100%";

  const board = document.getElementById("game-board");
  board.className = levelClass;
  board.innerHTML = "";

  symbols.forEach((_, i) => {
    const card = document.createElement("div");
    card.className = "card";
    card.dataset.index = i;
    card.onclick = () => flipCard(card);
    board.appendChild(card);
  });

  timerInterval = setInterval(() => {
    timeLeft--;
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      endGame(false);
    }
    document.getElementById("timer").textContent = timeLeft;
    document.getElementById("progress-bar").style.width = (timeLeft / 60 * 100) + "%";
  }, 1000);

  showTab("game-tab");
}

function flipCard(card) {
  if (busy || card.classList.contains("flipped") || card.classList.contains("matched")) return;

  flipS.play();

  let idx = card.dataset.index;
  card.classList.add("flipped");
  card.textContent = symbols[idx];

  flippedCards.push(card);

  if (flippedCards.length === 2) {
    busy = true;
    const [c1, c2] = flippedCards;

    if (c1.textContent === c2.textContent) {
      matchS.play();
      c1.classList.add("matched");
      c2.classList.add("matched");
      matched += 2;
      flippedCards = [];
      busy = false;

      if (matched === symbols.length) {
        clearInterval(timerInterval);
        endGame(true);
      }

    } else {
      wrongS.play();
      setTimeout(() => {
        c1.classList.remove("flipped");
        c2.classList.remove("flipped");
        c1.textContent = "";
        c2.textContent = "";
        flippedCards = [];
        busy = false;
      }, 800);
    }
  }
}

function endGame(win) {
  if (win) {
    winS.play();
    document.getElementById("result-text").textContent = "🎉 You Win!";
    createSparkles(30);
  } else {
    loseS.play();
    document.getElementById("result-text").textContent = "⏳ Time's Up!";
  }
  showTab("results-tab");
}

function playAgain() {
  showTab("start-tab");
}

function createSparkles(amount = 30) {
  const gameTab = document.getElementById("game-tab");
  for (let i = 0; i < amount; i++) {
    const s = document.createElement("div");
    s.classList.add("sparkle");
    s.style.left = Math.random() * window.innerWidth + "px";
    s.style.top = Math.random() * window.innerHeight + "px";
    gameTab.appendChild(s);
    s.addEventListener("animationend", () => s.remove());
  }
}
