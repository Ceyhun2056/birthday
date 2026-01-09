// Typing effect function - optimized with requestAnimationFrame
function typeText(element, text, speed = 50) {
    return new Promise((resolve) => {
        let i = 0;
        let lastTime = 0;
        
        function type(currentTime) {
            if (currentTime - lastTime >= speed) {
                if (i < text.length) {
                    element.textContent += text.charAt(i);
                    i++;
                    lastTime = currentTime;
                } else {
                    element.style.borderRight = 'none';
                    element.classList.remove('typing');
                    resolve();
                    return;
                }
            }
            requestAnimationFrame(type);
        }
        
        element.classList.add('typing');
        requestAnimationFrame(type);
    });
}

// Initialize the birthday card
async function initBirthdayCard() {
    const lines = [
        { id: 'line1', text: 'Lala' },
        { id: 'line2', text: '...' },
        { id: 'line3', text: 'today is your birthday' },
        { id: 'line4', text: 'So I came up with this idea to congratulate' }
    ];

    // Remove cursor from all lines initially
    lines.forEach(line => {
        const el = document.getElementById(line.id);
        if (el) el.classList.remove('typed-text');
    });

    // Type each line sequentially
    for (let line of lines) {
        const element = document.getElementById(line.id);
        if (!element) continue;
        element.classList.add('typed-text');
        await typeText(element, line.text, 60);
        await new Promise(resolve => setTimeout(resolve, 200));
    }

    // Show wish message after typing
    setTimeout(() => {
        const wishElement = document.getElementById('wish');
        wishElement.textContent = '¯\\_(ツ)_/¯  May all your wishes come true!  (◕‿◕)';
        wishElement.classList.add('show');
    }, 6000);
}

// Create floating hearts
function createHeart() {
    const heart = document.createElement('div');
    heart.classList.add('heart');
    heart.textContent = '❤️';
    heart.style.left = Math.random() * 100 + '%';
    heart.style.animationDelay = Math.random() * 2 + 's';
    document.getElementById('hearts').appendChild(heart);
    
    setTimeout(() => {
        heart.remove();
    }, 4000);
}

// Create confetti
function createConfetti() {
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffa500', '#ff69b4'];
    const confettiCount = 100;
    
    for (let i = 0; i < confettiCount; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.classList.add('confetti');
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.top = '-10px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
            document.body.appendChild(confetti);
            
            setTimeout(() => {
                confetti.remove();
            }, 3000);
        }, i * 30);
    }
}

// Create firework effect
function createFirework(x, y) {
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffa500', '#ff69b4', '#ffffff'];
    const particleCount = 30;
    const firework = document.createElement('div');
    firework.classList.add('firework');
    firework.style.left = x + 'px';
    firework.style.top = y + 'px';
    document.body.appendChild(firework);
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('firework-particle');
        
        const angle = (Math.PI * 2 * i) / particleCount;
        const velocity = 50 + Math.random() * 100;
        const tx = Math.cos(angle) * velocity;
        const ty = Math.sin(angle) * velocity;
        
        particle.style.setProperty('--tx', tx + 'px');
        particle.style.setProperty('--ty', ty + 'px');
        particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        
        firework.appendChild(particle);
    }
    
    setTimeout(() => {
        firework.remove();
    }, 1000);
}

// Create corner text fireworks that say "Happy Birthday"
function createCornerTextFirework(corner) {
    const container = document.createElement('div');
    container.classList.add('corner-firework');
    container.classList.add(corner); // 'top-left' or 'top-right'
    document.body.appendChild(container);
    
    // Text for each corner
    const text = corner === 'top-left' ? 'Happy' : 'Birthday!';
    
    const textEl = document.createElement('div');
    textEl.classList.add('corner-text');
    textEl.textContent = text;
    container.appendChild(textEl);
    
    // Add sparkle particles (colored dots instead of emojis)
    const colors = ['#ff69b4', '#ffb6c1', '#ffd700', '#ff1493', '#ffffff', '#00ffff'];
    for (let i = 0; i < 15; i++) {
        const sparkle = document.createElement('div');
        sparkle.classList.add('corner-sparkle');
        const angle = (Math.PI * i) / 15;
        const dist = 30 + Math.random() * 50;
        sparkle.style.setProperty('--tx', (Math.cos(angle) * dist) + 'px');
        sparkle.style.setProperty('--ty', (Math.sin(angle) * dist) + 'px');
        sparkle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        sparkle.style.animationDelay = (Math.random() * 0.3) + 's';
        container.appendChild(sparkle);
    }
    
    setTimeout(() => {
        container.remove();
    }, 3000);
}

function showCornerFireworks() {
    createCornerTextFirework('top-left');
    setTimeout(() => {
        createCornerTextFirework('top-right');
    }, 300);
}

// Birthday song audio
let birthdaySong = null;
let isSongPlaying = false;

function playBirthdaySong() {
    if (!birthdaySong) {
        birthdaySong = new Audio('happy-birthday-254480.mp3');
        birthdaySong.addEventListener('ended', () => {
            isSongPlaying = false;
        });
    }
    
    if (!isSongPlaying) {
        birthdaySong.currentTime = 0;
        birthdaySong.play();
        isSongPlaying = true;
    }
}

// Start the birthday card when page loads
window.addEventListener('load', () => {
    initBirthdayCard();
    
    // Show corner fireworks after the text finishes typing
    setTimeout(() => {
        showCornerFireworks();
    }, 5000);
    
    // Repeat periodically
    setInterval(() => {
        showCornerFireworks();
    }, 8000);
    
    // Celebrate button action
    const celebrateBtn = document.getElementById('celebrateBtn');
    let celebrateMessageShown = false;
    
    if (celebrateBtn) {
        celebrateBtn.addEventListener('click', async function() {
            // Play the birthday song
            playBirthdaySong();
            
            // Create multiple hearts
            for (let i = 0; i < 20; i++) {
                setTimeout(() => createHeart(), i * 200);
            }
            
            // Create confetti
            createConfetti();
            
            // Play a little animation on the button
            this.style.transform = 'scale(0.9)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 100);
            
            // Type the special message (only once)
            if (!celebrateMessageShown) {
                celebrateMessageShown = true;
                const celebrateLine = document.getElementById('celebrate-line');
                if (celebrateLine) {
                    celebrateLine.classList.add('typed-text');
                    await typeText(celebrateLine, 'You matter to me more than you probably realize.', 50);
                }
            }
        });
    }
});

// Add fireworks on click anywhere
document.addEventListener('click', (e) => {
    createFirework(e.clientX, e.clientY);
});

// Add some periodic hearts
setInterval(() => {
    if (Math.random() > 0.7) {
        createHeart();
    }
}, 2000);
