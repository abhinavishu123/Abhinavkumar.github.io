// GSAP Animations
gsap.registerPlugin(ScrollTrigger);

gsap.to(document.querySelectorAll('.skill-fill'), {
    width: function() {
        return this.targets()[0].dataset.width + '%';
    },
    duration: 2,
    ease: 'power2.out',
    stagger: 0.2,
    scrollTrigger: {
        trigger: '#skills',
        start: 'top 80%'
    }
});

gsap.utils.toArray('.fade-in').forEach((el) => {
    gsap.fromTo(el, { opacity: 0, y: 50 }, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: el,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        }
    });
});

gsap.utils.toArray('.parallax').forEach((section, i) => {
    ScrollTrigger.create({
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
        onUpdate: (self) => {
            gsap.to(section, {
                y: self.progress * -100,
                ease: 'none'
            });
        }
    });
});

// Three.js Background
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('bg'), alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);

const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
const material = new THREE.MeshBasicMaterial({ color: 0x00ffff, wireframe: true });
const torus = new THREE.Mesh(geometry, material);
scene.add(torus);

const stars = [];
for (let i = 0; i < 1000; i++) {
    const geometry = new THREE.SphereGeometry(0.1, 24, 24);
    const material = new THREE.MeshBasicMaterial({ color: 0xff00ff });
    const star = new THREE.Mesh(geometry, material);
    star.position.set(
        (Math.random() - 0.5) * 1000,
        (Math.random() - 0.5) * 1000,
        (Math.random() - 0.5) * 1000
    );
    scene.add(star);
    stars.push(star);
}

camera.position.z = 30;

const animate = function () {
    requestAnimationFrame(animate);
    torus.rotation.x += 0.01;
    torus.rotation.y += 0.005;
    stars.forEach(star => star.rotateX(0.005));
    renderer.render(scene, camera);
};
animate();

// Resize handling
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Chatbot Functionality
class Chatbot {
    constructor() {
        this.isOpen = false;
        this.conversationState = 'greeting';
        this.userInfo = {
            name: '',
            email: '',
            message: '',
            connectionType: ''
        };
        this.init();
    }

    init() {
        this.bindEvents();
        this.addWelcomeMessage();
    }

    bindEvents() {
        const chatToggle = document.getElementById('chat-toggle');
        const chatClose = document.getElementById('chat-close');
        const chatSend = document.getElementById('chat-send');
        const chatInput = document.getElementById('chat-input');

        chatToggle.addEventListener('click', () => this.toggleChat());
        chatClose.addEventListener('click', () => this.closeChat());
        chatSend.addEventListener('click', () => this.sendMessage());
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
    }

    toggleChat() {
        this.isOpen = !this.isOpen;
        const chatWindow = document.getElementById('chat-window');
        chatWindow.classList.toggle('hidden');
        
        if (this.isOpen) {
            document.getElementById('chat-input').focus();
        }
    }

    closeChat() {
        this.isOpen = false;
        document.getElementById('chat-window').classList.add('hidden');
    }

    addWelcomeMessage() {
        this.addBotMessage("Hi! I'm here to help you connect with Abhinav. What would you like to discuss?");
    }

    addBotMessage(message) {
        const messagesContainer = document.getElementById('chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'flex justify-start';
        messageDiv.innerHTML = `
            <div class="bg-gray-700 rounded-lg p-3 max-w-xs">
                <p class="text-sm">${message}</p>
            </div>
        `;
        messagesContainer.appendChild(messageDiv);
        this.scrollToBottom();
    }

    addUserMessage(message) {
        const messagesContainer = document.getElementById('chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'flex justify-end';
        messageDiv.innerHTML = `
            <div class="bg-gradient-to-r from-pink-500 to-cyan-500 rounded-lg p-3 max-w-xs">
                <p class="text-sm text-white">${message}</p>
            </div>
        `;
        messagesContainer.appendChild(messageDiv);
        this.scrollToBottom();
    }

    sendMessage() {
        const input = document.getElementById('chat-input');
        const message = input.value.trim();
        
        if (!message) return;

        this.addUserMessage(message);
        input.value = '';

        // Process the message based on conversation state
        setTimeout(() => this.processMessage(message), 500);
    }

    processMessage(message) {
        const lowerMessage = message.toLowerCase();

        switch (this.conversationState) {
            case 'greeting':
                this.handleGreeting(lowerMessage);
                break;
            case 'collecting_name':
                this.handleNameCollection(message);
                break;
            case 'collecting_email':
                this.handleEmailCollection(message);
                break;
            case 'collecting_connection_type':
                this.handleConnectionType(message);
                break;
            case 'collecting_message':
                this.handleFinalMessage(message);
                break;
            case 'confirmation':
                this.handleConfirmation(lowerMessage);
                break;
        }
    }

    handleGreeting(message) {
        if (message.includes('connect') || message.includes('contact') || message.includes('hire') || 
            message.includes('work') || message.includes('project') || message.includes('collaborate')) {
            this.addBotMessage("Great! I'd love to help you connect with Abhinav. Let me gather some information from you.");
            this.addBotMessage("What's your name?");
            this.conversationState = 'collecting_name';
        } else if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
            this.addBotMessage("Hello! How can I help you connect with Abhinav today?");
        } else {
            this.addBotMessage("I'm here to help you connect with Abhinav. Are you interested in working together, hiring him, or just want to chat?");
        }
    }

    handleNameCollection(name) {
        this.userInfo.name = name;
        this.addBotMessage(`Nice to meet you, ${name}! What's your email address?`);
        this.conversationState = 'collecting_email';
    }

    handleEmailCollection(email) {
        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailRegex.test(email)) {
            this.userInfo.email = email;
            this.addBotMessage("Perfect! What type of connection are you looking for?");
            this.addBotMessage("Please choose one:\n• Work opportunity\n• Project collaboration\n• General inquiry\n• Networking");
            this.conversationState = 'collecting_connection_type';
        } else {
            this.addBotMessage("Please enter a valid email address.");
        }
    }

    handleConnectionType(type) {
        const lowerType = type.toLowerCase();
        if (lowerType.includes('work') || lowerType.includes('opportunity')) {
            this.userInfo.connectionType = 'Work Opportunity';
        } else if (lowerType.includes('project') || lowerType.includes('collaboration')) {
            this.userInfo.connectionType = 'Project Collaboration';
        } else if (lowerType.includes('networking')) {
            this.userInfo.connectionType = 'Networking';
        } else {
            this.userInfo.connectionType = 'General Inquiry';
        }

        this.addBotMessage(`Got it! You're interested in: ${this.userInfo.connectionType}`);
        this.addBotMessage("Please tell me more about what you'd like to discuss or any specific details:");
        this.conversationState = 'collecting_message';
    }

    handleFinalMessage(message) {
        this.userInfo.message = message;
        this.addBotMessage("Excellent! Let me summarize what I have:");
        this.addBotMessage(`Name: ${this.userInfo.name}\nEmail: ${this.userInfo.email}\nType: ${this.userInfo.connectionType}\nMessage: ${this.userInfo.message}`);
        this.addBotMessage("Would you like me to send this connection request to Abhinav? (yes/no)");
        this.conversationState = 'confirmation';
    }

    handleConfirmation(response) {
        if (response.includes('yes') || response.includes('y') || response.includes('sure') || response.includes('ok')) {
            this.sendConnectionRequest();
        } else {
            this.addBotMessage("No problem! Would you like to start over or modify anything?");
            this.conversationState = 'greeting';
        }
    }

    async sendConnectionRequest() {
        this.addBotMessage("Sending your connection request to Abhinav...");
        
        try {
            // Send notification email to Abhinav
            const templateParams = {
                from_name: this.userInfo.name,
                from_email: this.userInfo.email,
                connection_type: this.userInfo.connectionType,
                message: this.userInfo.message,
                to_email: 'abhinav404work@gmail.com' // Your email for notifications
            };

            await emailjs.send('service_dy7i7e8', 'template_dy7i7e8', templateParams);
            
            // Trigger notification event
            const connectionEvent = new CustomEvent('connectionRequest', {
                detail: {
                    name: this.userInfo.name,
                    email: this.userInfo.email,
                    connectionType: this.userInfo.connectionType,
                    message: this.userInfo.message,
                    timestamp: new Date().toISOString()
                }
            });
            document.dispatchEvent(connectionEvent);
            
            this.addBotMessage("✅ Connection request sent successfully! Abhinav will be notified and should get back to you soon.");
            this.addBotMessage("Is there anything else I can help you with?");
            
            // Reset conversation
            this.conversationState = 'greeting';
            this.userInfo = { name: '', email: '', message: '', connectionType: '' };
            
        } catch (error) {
            this.addBotMessage("❌ Sorry, there was an error sending your request. Please try again or use the contact form below.");
            console.error('Error sending connection request:', error);
        }
    }

    scrollToBottom() {
        const messagesContainer = document.getElementById('chat-messages');
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
}

// Mobile Navigation
class MobileNavigation {
    constructor() {
        this.mobileMenuBtn = document.getElementById('mobile-menu-btn');
        this.mobileMenu = document.getElementById('mobile-menu');
        this.mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
        this.isOpen = false;
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        this.mobileMenuBtn.addEventListener('click', () => this.toggleMenu());
        
        // Close menu when clicking on nav links
        this.mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => this.closeMenu());
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isOpen && !this.mobileMenu.contains(e.target) && !this.mobileMenuBtn.contains(e.target)) {
                this.closeMenu();
            }
        });
        
        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeMenu();
            }
        });
    }

    toggleMenu() {
        this.isOpen ? this.closeMenu() : this.openMenu();
    }

    openMenu() {
        this.mobileMenu.classList.remove('hidden');
        this.mobileMenuBtn.innerHTML = '<i class="fas fa-times text-xl"></i>';
        this.isOpen = true;
        
        // Add smooth animation
        setTimeout(() => {
            this.mobileMenu.style.opacity = '1';
            this.mobileMenu.style.transform = 'translateY(0)';
        }, 10);
    }

    closeMenu() {
        this.mobileMenu.style.opacity = '0';
        this.mobileMenu.style.transform = 'translateY(-10px)';
        
        setTimeout(() => {
            this.mobileMenu.classList.add('hidden');
            this.mobileMenuBtn.innerHTML = '<i class="fas fa-bars text-xl"></i>';
            this.isOpen = false;
        }, 200);
    }
}

// Initialize mobile navigation and chatbot when page loads
document.addEventListener('DOMContentLoaded', () => {
    new MobileNavigation();
    new Chatbot();
});

// EmailJS functionality
(function(){
  emailjs.init("kjncu4Q8h7tv5gteT"); // from EmailJS dashboard
})();