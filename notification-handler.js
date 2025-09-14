// Notification Handler for Connection Requests
class NotificationHandler {
    constructor() {
        this.notifications = [];
        this.init();
    }

    init() {
        this.createNotificationContainer();
        this.bindEvents();
    }

    createNotificationContainer() {
        // Create notification container if it doesn't exist
        if (!document.getElementById('notification-container')) {
            const container = document.createElement('div');
            container.id = 'notification-container';
            container.className = 'fixed top-4 right-4 z-50 space-y-2';
            document.body.appendChild(container);
        }
    }

    bindEvents() {
        // Listen for connection requests from chatbot
        document.addEventListener('connectionRequest', (event) => {
            this.showNotification(event.detail);
        });
    }

    showNotification(connectionData) {
        const notification = this.createNotificationElement(connectionData);
        const container = document.getElementById('notification-container');
        
        container.appendChild(notification);
        this.notifications.push(notification);

        // Auto-remove after 10 seconds
        setTimeout(() => {
            this.removeNotification(notification);
        }, 10000);

        // Play notification sound (if supported)
        this.playNotificationSound();
    }

    createNotificationElement(data) {
        const notification = document.createElement('div');
        notification.className = 'notification glassmorphism p-4 max-w-sm transform transition-all duration-300 translate-x-full opacity-0';
        
        notification.innerHTML = `
            <div class="flex items-start space-x-3">
                <div class="flex-shrink-0">
                    <div class="w-8 h-8 bg-gradient-to-r from-pink-500 to-cyan-500 rounded-full flex items-center justify-center">
                        <i class="fas fa-user-plus text-white text-sm"></i>
                    </div>
                </div>
                <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-white">New Connection Request</p>
                    <p class="text-xs text-gray-300 mt-1">
                        <strong>${data.name}</strong> wants to connect
                    </p>
                    <p class="text-xs text-gray-400 mt-1">
                        Type: ${data.connectionType}
                    </p>
                    <div class="mt-2 flex space-x-2">
                        <button class="accept-btn text-xs bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded transition">
                            Accept
                        </button>
                        <button class="decline-btn text-xs bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded transition">
                            Decline
                        </button>
                    </div>
                </div>
                <button class="close-notification text-gray-400 hover:text-white">
                    <i class="fas fa-times text-xs"></i>
                </button>
            </div>
        `;

        // Add event listeners
        this.addNotificationEventListeners(notification, data);

        // Animate in
        setTimeout(() => {
            notification.classList.remove('translate-x-full', 'opacity-0');
        }, 100);

        return notification;
    }

    addNotificationEventListeners(notification, data) {
        const acceptBtn = notification.querySelector('.accept-btn');
        const declineBtn = notification.querySelector('.decline-btn');
        const closeBtn = notification.querySelector('.close-notification');

        acceptBtn.addEventListener('click', () => {
            this.handleAcceptConnection(data);
            this.removeNotification(notification);
        });

        declineBtn.addEventListener('click', () => {
            this.handleDeclineConnection(data);
            this.removeNotification(notification);
        });

        closeBtn.addEventListener('click', () => {
            this.removeNotification(notification);
        });
    }

    handleAcceptConnection(data) {
        // Send acceptance email
        this.sendEmailNotification(data, 'accepted');
        
        // Show success message
        this.showToast('Connection request accepted! Email sent to ' + data.email, 'success');
        
        // Log the acceptance
        console.log('Connection accepted:', data);
    }

    handleDeclineConnection(data) {
        // Send decline email
        this.sendEmailNotification(data, 'declined');
        
        // Show info message
        this.showToast('Connection request declined. Email sent to ' + data.email, 'info');
        
        // Log the decline
        console.log('Connection declined:', data);
    }

    async sendEmailNotification(data, status) {
        try {
            const templateParams = {
                to_email: data.email,
                to_name: data.name,
                from_name: 'Abhinav Kumar',
                status: status,
                connection_type: data.connectionType,
                message: data.message
            };

            // Use a different template for responses
            const templateId = status === 'accepted' ? 'template_accepted' : 'template_declined';
            
            await emailjs.send('service_dy7i7e8', templateId, templateParams);
            console.log(`${status} email sent successfully`);
        } catch (error) {
            console.error(`Error sending ${status} email:`, error);
        }
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `fixed bottom-20 right-4 z-50 p-3 rounded-lg text-white text-sm max-w-sm transform transition-all duration-300 translate-y-full opacity-0`;
        
        // Set background color based on type
        switch (type) {
            case 'success':
                toast.classList.add('bg-green-500');
                break;
            case 'error':
                toast.classList.add('bg-red-500');
                break;
            case 'info':
            default:
                toast.classList.add('bg-blue-500');
                break;
        }
        
        toast.textContent = message;
        document.body.appendChild(toast);

        // Animate in
        setTimeout(() => {
            toast.classList.remove('translate-y-full', 'opacity-0');
        }, 100);

        // Auto-remove after 3 seconds
        setTimeout(() => {
            toast.classList.add('translate-y-full', 'opacity-0');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }

    removeNotification(notification) {
        notification.classList.add('translate-x-full', 'opacity-0');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
            const index = this.notifications.indexOf(notification);
            if (index > -1) {
                this.notifications.splice(index, 1);
            }
        }, 300);
    }

    playNotificationSound() {
        // Create a simple notification sound using Web Audio API
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.2);
        } catch (error) {
            console.log('Audio notification not supported');
        }
    }

    // Method to manually trigger a notification (for testing)
    triggerTestNotification() {
        const testData = {
            name: 'Test User',
            email: 'test@example.com',
            connectionType: 'Work Opportunity',
            message: 'This is a test connection request'
        };
        
        this.showNotification(testData);
    }
}

// Initialize notification handler
document.addEventListener('DOMContentLoaded', () => {
    window.notificationHandler = new NotificationHandler();
    
    // Add test button for development (remove in production)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        const testBtn = document.createElement('button');
        testBtn.textContent = 'Test Notification';
        testBtn.className = 'fixed top-4 left-4 z-50 bg-blue-500 text-white px-3 py-1 rounded text-sm';
        testBtn.onclick = () => window.notificationHandler.triggerTestNotification();
        document.body.appendChild(testBtn);
    }
});
