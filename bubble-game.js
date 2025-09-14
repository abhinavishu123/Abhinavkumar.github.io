// Bubble Popping Game
class BubbleGame {
    constructor() {
        this.gameArea = document.getElementById('game-area');
        this.scoreElement = document.getElementById('score');
        this.timerElement = document.getElementById('timer');
        this.highScoreElement = document.getElementById('high-score');
        this.gameMessage = document.getElementById('game-message');
        this.startButton = document.getElementById('start-game');
        this.resetButton = document.getElementById('reset-game');
        
        this.score = 0;
        this.timeLeft = 30;
        this.gameActive = false;
        this.gameTimer = null;
        this.bubbleTimer = null;
        this.bubbles = [];
        
        this.highScore = localStorage.getItem('bubbleGameHighScore') || 0;
        this.highScoreElement.textContent = this.highScore;
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.createBubbleStyles();
    }
    
    bindEvents() {
        this.startButton.addEventListener('click', () => this.startGame());
        this.resetButton.addEventListener('click', () => this.resetGame());
        
        // Handle both click and touch events for better mobile support
        this.gameArea.addEventListener('click', (e) => this.handleBubbleClick(e));
        this.gameArea.addEventListener('touchstart', (e) => {
            e.preventDefault(); // Prevent scrolling
            this.handleBubbleClick(e);
        });
        
        // Prevent context menu on long press
        this.gameArea.addEventListener('contextmenu', (e) => e.preventDefault());
    }
    
    createBubbleStyles() {
        // Create dynamic CSS for bubbles
        const style = document.createElement('style');
        style.textContent = `
            .bubble {
                position: absolute;
                border-radius: 50%;
                cursor: pointer;
                transition: all 0.3s ease;
                animation: bubbleFloat 3s ease-in-out infinite;
                box-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
            }
            
            .bubble:hover {
                transform: scale(1.1);
                box-shadow: 0 0 30px rgba(255, 255, 255, 0.6);
            }
            
            .bubble.popped {
                animation: bubblePop 0.3s ease-out forwards;
            }
            
            @keyframes bubbleFloat {
                0%, 100% { transform: translateY(0px) scale(1); }
                50% { transform: translateY(-10px) scale(1.05); }
            }
            
            @keyframes bubblePop {
                0% { transform: scale(1); opacity: 1; }
                50% { transform: scale(1.3); opacity: 0.7; }
                100% { transform: scale(0); opacity: 0; }
            }
            
            .score-popup {
                position: absolute;
                color: #00ffff;
                font-weight: bold;
                font-size: 18px;
                pointer-events: none;
                animation: scorePopup 1s ease-out forwards;
                text-shadow: 0 0 10px #00ffff;
            }
            
            @keyframes scorePopup {
                0% { transform: translateY(0px) scale(1); opacity: 1; }
                100% { transform: translateY(-50px) scale(1.5); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
    
    startGame() {
        if (this.gameActive) return;
        
        this.gameActive = true;
        this.score = 0;
        this.timeLeft = 30;
        this.bubbles = [];
        
        this.updateDisplay();
        this.gameMessage.style.display = 'none';
        this.startButton.disabled = true;
        this.startButton.innerHTML = '<i class="fas fa-pause mr-2"></i>Game Active';
        
        // Start game timer
        this.gameTimer = setInterval(() => {
            this.timeLeft--;
            this.updateDisplay();
            
            if (this.timeLeft <= 0) {
                this.endGame();
            }
        }, 1000);
        
        // Start creating bubbles
        this.bubbleTimer = setInterval(() => {
            this.createBubble();
        }, 800);
        
        // Create initial bubbles
        for (let i = 0; i < 3; i++) {
            setTimeout(() => this.createBubble(), i * 200);
        }
    }
    
    createBubble() {
        if (!this.gameActive) return;
        
        const bubble = document.createElement('div');
        bubble.className = 'bubble';
        
        // Adjust size for mobile devices
        const isMobile = window.innerWidth <= 768;
        const minSize = isMobile ? 40 : 30;
        const maxSize = isMobile ? 70 : 80;
        const size = Math.random() * (maxSize - minSize) + minSize;
        
        bubble.style.width = size + 'px';
        bubble.style.height = size + 'px';
        
        // Random position with better mobile spacing
        const padding = isMobile ? 10 : 5;
        const x = Math.random() * (this.gameArea.offsetWidth - size - padding * 2) + padding;
        const y = Math.random() * (this.gameArea.offsetHeight - size - padding * 2) + padding;
        bubble.style.left = x + 'px';
        bubble.style.top = y + 'px';
        
        // Random color
        const colors = [
            'rgba(255, 0, 255, 0.7)', // Pink
            'rgba(0, 255, 255, 0.7)', // Cyan
            'rgba(255, 255, 0, 0.7)', // Yellow
            'rgba(0, 255, 0, 0.7)',   // Green
            'rgba(255, 0, 0, 0.7)',   // Red
            'rgba(0, 0, 255, 0.7)'    // Blue
        ];
        bubble.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        
        // Add click and touch events for better mobile support
        bubble.addEventListener('click', (e) => {
            e.stopPropagation();
            this.popBubble(bubble);
        });
        
        bubble.addEventListener('touchstart', (e) => {
            e.stopPropagation();
            e.preventDefault();
            this.popBubble(bubble);
        });
        
        this.gameArea.appendChild(bubble);
        this.bubbles.push(bubble);
        
        // Remove bubble after 5 seconds if not popped
        setTimeout(() => {
            if (bubble.parentNode) {
                bubble.remove();
                const index = this.bubbles.indexOf(bubble);
                if (index > -1) {
                    this.bubbles.splice(index, 1);
                }
            }
        }, 5000);
    }
    
    popBubble(bubble) {
        if (!this.gameActive) return;
        
        bubble.classList.add('popped');
        
        // Add score based on bubble size (smaller bubbles = more points)
        const bubbleSize = parseInt(bubble.style.width);
        const points = Math.max(1, Math.floor(80 - bubbleSize) / 10);
        this.score += points;
        
        // Show score popup
        this.showScorePopup(bubble, `+${Math.floor(points)}`);
        
        // Update display
        this.updateDisplay();
        
        // Remove bubble after animation
        setTimeout(() => {
            bubble.remove();
            const index = this.bubbles.indexOf(bubble);
            if (index > -1) {
                this.bubbles.splice(index, 1);
            }
        }, 300);
    }
    
    showScorePopup(bubble, text) {
        const popup = document.createElement('div');
        popup.className = 'score-popup';
        popup.textContent = text;
        popup.style.left = bubble.style.left;
        popup.style.top = bubble.style.top;
        
        this.gameArea.appendChild(popup);
        
        setTimeout(() => {
            popup.remove();
        }, 1000);
    }
    
    handleBubbleClick(e) {
        // This handles clicks on the game area (missed bubbles)
        if (e.target === this.gameArea && this.gameActive) {
            // Small penalty for missing bubbles
            this.score = Math.max(0, this.score - 0.5);
            this.updateDisplay();
        }
    }
    
    updateDisplay() {
        this.scoreElement.textContent = Math.floor(this.score);
        this.timerElement.textContent = this.timeLeft;
        
        // Update high score
        if (this.score > this.highScore) {
            this.highScore = this.score;
            this.highScoreElement.textContent = Math.floor(this.highScore);
            localStorage.setItem('bubbleGameHighScore', this.highScore);
        }
    }
    
    endGame() {
        this.gameActive = false;
        clearInterval(this.gameTimer);
        clearInterval(this.bubbleTimer);
        
        // Clear all bubbles
        this.bubbles.forEach(bubble => bubble.remove());
        this.bubbles = [];
        
        // Show game over message
        this.gameMessage.style.display = 'flex';
        this.gameMessage.innerHTML = `
            <div class="text-center">
                <div class="text-3xl font-bold mb-4 neon-pink">Game Over!</div>
                <div class="text-xl mb-2">Final Score: <span class="neon-cyan">${Math.floor(this.score)}</span></div>
                <div class="text-lg">Best Score: <span class="text-green-400">${Math.floor(this.highScore)}</span></div>
                <div class="text-sm text-gray-400 mt-4">Click "Start Game" to play again!</div>
            </div>
        `;
        
        this.startButton.disabled = false;
        this.startButton.innerHTML = '<i class="fas fa-play mr-2"></i>Start Game';
    }
    
    resetGame() {
        this.endGame();
        this.score = 0;
        this.timeLeft = 30;
        this.updateDisplay();
        this.gameMessage.innerHTML = 'Click "Start Game" to begin!';
    }
}

// Initialize the game when page loads
document.addEventListener('DOMContentLoaded', () => {
    new BubbleGame();
});
