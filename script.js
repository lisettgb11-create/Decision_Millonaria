const QUESTIONS = [
  {
    text: "¿Cuál es la capital de Francia?",
    options: ["Madrid", "París", "Roma", "Berlín"],
    answer: 1,
  },
  {
    text: "¿Cuántos continentes hay en el mundo?",
    options: ["5", "6", "7", "8"],
    answer: 2,
  },
  {
    text: "¿Quién escribió 'Cien años de soledad'?",
    options: ["Pablo Neruda", "Gabriel García Márquez", "Mario Vargas Llosa", "Jorge Luis Borges"],
    answer: 1,
  },
  {
    text: "¿Cuál es el planeta más grande del sistema solar?",
    options: ["Tierra", "Saturno", "Júpiter", "Marte"],
    answer: 2,
  },
  {
    text: "¿En qué año llegó el hombre a la Luna?",
    options: ["1965", "1969", "1972", "1958"],
    answer: 1,
  },
  {
    text: "¿Cuál es el océano más grande del mundo?",
    options: ["Atlántico", "Índico", "Ártico", "Pacífico"],
    answer: 3,
  },
  {
    text: "¿Cuántos huesos tiene el cuerpo humano adulto?",
    options: ["186", "206", "226", "246"],
    answer: 1,
  },
  {
    text: "¿Qué elemento químico tiene el símbolo 'O'?",
    options: ["Oro", "Osmio", "Oxígeno", "Olivina"],
    answer: 2,
  },
];

const PRIZE_LADDER = [
  100, 200, 300, 500, 1000, 2000, 4000, 8000, 16000, 32000, 64000, 125000,
  250000, 500000, 1000000,
];

const HIGH_SCORE_KEY = "decisionMillonaria.highScore";

let currentQuestionIndex = 0;
let currentPrize = 0;

const progressEl = document.getElementById("progress");
const questionTextEl = document.getElementById("question-text");
const optionsEl = document.getElementById("options");
const currentPrizeEl = document.getElementById("current-prize");
const highScoreEl = document.getElementById("high-score");
const questionScreenEl = document.getElementById("question-screen");
const endScreenEl = document.getElementById("end-screen");
const endTitleEl = document.getElementById("end-title");
const endMessageEl = document.getElementById("end-message");
const restartBtn = document.getElementById("restart-btn");

function formatPrize(amount) {
  return `$${amount.toLocaleString("es-ES")}`;
}

function getHighScore() {
  return Number(localStorage.getItem(HIGH_SCORE_KEY)) || 0;
}

function saveHighScore(amount) {
  localStorage.setItem(HIGH_SCORE_KEY, String(amount));
}

// TODO: add a 50:50 lifeline that removes two incorrect options
// TODO: add a countdown timer per question that auto-fails when it runs out

function renderQuestion() {
  const question = QUESTIONS[currentQuestionIndex];
  progressEl.textContent = `Pregunta ${currentQuestionIndex + 1} de ${QUESTIONS.length}`;
  questionTextEl.textContent = question.text;
  currentPrizeEl.textContent = formatPrize(currentPrize);

  optionsEl.innerHTML = "";
  question.options.forEach((optionText, index) => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.textContent = optionText;
    btn.addEventListener("click", () => handleAnswer(index));
    optionsEl.appendChild(btn);
  });
}

function handleAnswer(selectedIndex) {
  const question = QUESTIONS[currentQuestionIndex];
  const buttons = optionsEl.querySelectorAll(".option-btn");
  buttons.forEach((btn) => (btn.disabled = true));

  const isCorrect = selectedIndex === question.answer;
  buttons[question.answer].classList.add("correct");
  if (!isCorrect) {
    buttons[selectedIndex].classList.add("incorrect");
  }

  setTimeout(() => {
    if (isCorrect) {
      currentPrize = PRIZE_LADDER[currentQuestionIndex];
      currentQuestionIndex += 1;
      if (currentQuestionIndex >= QUESTIONS.length) {
        endGame(true);
      } else {
        renderQuestion();
      }
    } else {
      endGame(false);
    }
  }, 900);
}

function endGame(won) {
  questionScreenEl.classList.add("hidden");
  endScreenEl.classList.remove("hidden");

  if (currentPrize > getHighScore()) {
    saveHighScore(currentPrize);
  }
  highScoreEl.textContent = formatPrize(getHighScore());

  if (won) {
    endTitleEl.textContent = "¡Felicidades, eres millonario!";
    endMessageEl.textContent = `Ganaste ${formatPrize(currentPrize)}.`;
  } else {
    endTitleEl.textContent = "Juego terminado";
    endMessageEl.textContent = `Te llevas ${formatPrize(currentPrize)}.`;
  }
}

function startGame() {
  currentQuestionIndex = 0;
  currentPrize = 0;
  questionScreenEl.classList.remove("hidden");
  endScreenEl.classList.add("hidden");
  highScoreEl.textContent = formatPrize(getHighScore());
  renderQuestion();
}

restartBtn.addEventListener("click", startGame);

startGame();
