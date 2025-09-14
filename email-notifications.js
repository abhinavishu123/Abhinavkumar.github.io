// Enhanced Email Notification System
class EmailNotificationSystem {
    constructor() {
        this.yourEmail = 'abhinavkumar@example.com'; // Replace with your actual email
        this.init();
    }

    init() {
        // Listen for connection requests
        document.addEventListener('connectionRequest', (event) => {
            this.sendDetailedNotification(event.detail);
        });
    }

    async sendDetailedNotification(connectionData) {
        try {
            // Enhanced email template with more details
            const templateParams = {
                to_email: this.yourEmail,
                to_name: 'Abhinav Kumar',
                from_name: connectionData.name,
                from_email: connectionData.email,
                connection_type: connectionData.connectionType,
                message: connectionData.message,
                timestamp: new Date().toLocaleString(),
                website_url: window.location.href,
                user_agent: navigator.userAgent,
                ip_info: 'Available in EmailJS logs'
            };

            // Send the notification email
            await emailjs.send('service_dy7i7e8', 'template_dy7i7e8', templateParams);
            
            console.log('✅ Detailed notification email sent successfully');
            
            // Also send a backup notification if the first one fails
            setTimeout(() => {
                this.sendBackupNotification(connectionData);
            }, 2000);
            
        } catch (error) {
            console.error('❌ Error sending notification email:', error);
            // Try backup method
            this.sendBackupNotification(connectionData);
        }
    }

    async sendBackupNotification(connectionData) {
        try {
            // Simpler backup notification
            const backupParams = {
                to_email: this.yourEmail,
                subject: `URGENT: New Connection Request from ${connectionData.name}`,
                from_name: connectionData.name,
                from_email: connectionData.email,
                message: `New connection request received:\n\nName: ${connectionData.name}\nEmail: ${connectionData.email}\nType: ${connectionData.connectionType}\nMessage: ${connectionData.message}\nTime: ${new Date().toLocaleString()}`
            };

            await emailjs.send('service_dy7i7e8', 'template_dy7i7e8', backupParams);
            console.log('✅ Backup notification sent');
        } catch (error) {
            console.error('❌ Backup notification also failed:', error);
        }
    }

    // Method to test email notifications
    async testEmailNotification() {
        const testData = {
            name: 'Test User',
            email: 'test@example.com',
            connectionType: 'Work Opportunity',
            message: 'This is a test connection request to verify email notifications are working.',
            timestamp: new Date().toISOString()
        };

        console.log('🧪 Testing email notification...');
        await this.sendDetailedNotification(testData);
    }

    // Method to send immediate notification (for urgent cases)
    async sendUrgentNotification(connectionData) {
        try {
            const urgentParams = {
                to_email: this.yourEmail,
                subject: `🚨 URGENT: High-Priority Connection Request`,
                from_name: connectionData.name,
                from_email: connectionData.email,
                connection_type: connectionData.connectionType,
                message: connectionData.message,
                priority: 'HIGH',
                timestamp: new Date().toLocaleString()
            };

            await emailjs.send('service_dy7i7e8', 'template_dy7i7e8', urgentParams);
            console.log('🚨 Urgent notification sent');
        } catch (error) {
            console.error('❌ Urgent notification failed:', error);
        }
    }
}

// Initialize email notification system
document.addEventListener('DOMContentLoaded', () => {
    window.emailNotificationSystem = new EmailNotificationSystem();
    
    // Add test button for development
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        const testEmailBtn = document.createElement('button');
        testEmailBtn.textContent = 'Test Email';
        testEmailBtn.className = 'fixed top-16 left-4 z-50 bg-green-500 text-white px-3 py-1 rounded text-sm';
        testEmailBtn.onclick = () => window.emailNotificationSystem.testEmailNotification();
        document.body.appendChild(testEmailBtn);
    }
});
