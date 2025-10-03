// Array base con emojis para los pares (8 pares = 16 cartas)
const cardValues = ['😈', '💀', '🤡', '👀', '👑', '🗿', '🔥', '❄️'];

// Variables del juego
let cards = [];           // Array con todas las cartas mezcladas
let flippedCards = [];    // Cartas volteadas en el turno actual
let moves = 0;            // Contador de movimientos
let pairsFound = 0;       // Pares encontrados
let isLocked = false;     // Bloqueo para evitar múltiples clics

// Referencias al DOM
let gameBoard;
let movesDisplay;
let pairsDisplay;
let restartBtn;

// Conectar con elementos del DOM
gameBoard = document.getElementById('gameBoard');
movesDisplay = document.getElementById('moves');
pairsDisplay = document.getElementById('pairs');
restartBtn = document.getElementById('restartBtn');

// Crear el array completo de cartas (con pares duplicados)
function createCards() {
    // Duplicar cada valor para crear pares
    cards = [...cardValues, ...cardValues];
    
    // Mezclar las cartas
    shuffleArray(cards);
}


// Función para mezclar un array (algoritmo de Fisher-Yates)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Generar el tablero de cartas en el DOM
function generateBoard() {
    gameBoard.innerHTML = ''; // Limpiar el tablero anterior
    
    cards.forEach((cardValue, index) => {
        // Crear el contenedor de la carta
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.value = cardValue; // Guardar el valor en un atributo de datos
        
        // Crear el contenido interno de la carta
        const cardInner = document.createElement('div');
        cardInner.className = 'card-inner';
        
        // Cara trasera (oculta - muestra el emoji)
        const cardFront = document.createElement('div');
        cardFront.className = 'card-front';
        cardFront.textContent = cardValue;
        
        // Cara delantera (visible inicialmente - fondo azul)
        const cardBack = document.createElement('div');
        cardBack.className = 'card-back';
        cardBack.textContent = '?';
        
        // Construir la carta
        cardInner.appendChild(cardFront);
        cardInner.appendChild(cardBack);
        card.appendChild(cardInner);
        
        // Agregar event listener a la carta
        card.addEventListener('click', () => flipCard(card, cardValue));
        
        // Agregar la carta al tablero
        gameBoard.appendChild(card);
    });
}

// Voltear una carta
function flipCard(card, cardValue) {
    // Si el juego está bloqueado o la carta ya está volteada, no hacer nada
    if (isLocked || card.classList.contains('flipped')) {
        return;
    }
    
    // Voltear la carta visualmente
    card.classList.add('flipped');
    
    // Agregar la carta al array de cartas volteadas
    flippedCards.push({ element: card, value: cardValue });
    
    // Si se han volteado 2 cartas, verificar si coinciden
    if (flippedCards.length === 2) {
        isLocked = true; // Bloquear el juego temporalmente
        moves++;
        movesDisplay.textContent = moves;
        
        setTimeout(checkForMatch, 1000); // Esperar 1 segundo antes de verificar
    }
}

// Verificar si las dos cartas volteadas coinciden
function checkForMatch() {
    const [firstCard, secondCard] = flippedCards;
    
    if (firstCard.value === secondCard.value) {
        // ¡Par encontrado!
        pairsFound++;
        pairsDisplay.textContent = pairsFound;
        
        // Mantener las cartas volteadas (no hacer nada, ya están volteadas)
        
        // Verificar si se ganó el juego
        if (pairsFound === cardValues.length) {
            setTimeout(() => {
                alert(`¡Felicidades! Completaste el juego en ${moves} movimientos.`);
            }, 500);
        }
    } else {
        // No coinciden - volver a voltear las cartas
        setTimeout(() => {
            firstCard.element.classList.remove('flipped');
            secondCard.element.classList.remove('flipped');
        }, 500);
    }
    
    // Resetear para el próximo turno
    flippedCards = [];
    isLocked = false;
}

// Reiniciar el juego
function restartGame() {
    flippedCards = [];
    moves = 0;
    pairsFound = 0;
    isLocked = false;
    
    movesDisplay.textContent = '0';
    pairsDisplay.textContent = '0';
    
    createCards();
    generateBoard();
}

// Agregar event listener al botón de reinicio
restartBtn.addEventListener('click', restartGame);

// Inicializar el juego
createCards();
generateBoard();