# Chatbot Setup Guide

## Overview
I've successfully built a comprehensive chatbot system for your portfolio website that can send you notifications when someone wants to connect. The chatbot includes:

- **Interactive Chat Interface**: Modern, responsive chat widget that matches your portfolio's design
- **Smart Conversation Flow**: Collects user information (name, email, connection type, message)
- **Email Notifications**: Sends you immediate notifications when someone wants to connect
- **Visual Notifications**: Browser notifications with accept/decline options
- **EmailJS Integration**: Uses your existing EmailJS setup for sending emails

## Features

### 🤖 Chatbot Capabilities
- **Greeting & Introduction**: Welcomes visitors and explains its purpose
- **Information Collection**: Systematically collects:
  - Visitor's name
  - Email address (with validation)
  - Type of connection (Work Opportunity, Project Collaboration, General Inquiry, Networking)
  - Detailed message
- **Confirmation**: Shows summary before sending
- **Error Handling**: Graceful error handling with fallback options

### 🔔 Notification System
- **Real-time Notifications**: Instant browser notifications when connection requests are received
- **Visual Indicators**: Animated notification cards with user details
- **Action Buttons**: Accept/Decline options for each request
- **Email Responses**: Automatic email responses to visitors
- **Sound Notifications**: Optional audio alerts

### 🎨 Design Integration
- **Glassmorphism Effect**: Matches your portfolio's modern aesthetic
- **Neon Accents**: Uses your pink/cyan color scheme
- **Responsive Design**: Works on all device sizes
- **Smooth Animations**: Professional transitions and hover effects

## Setup Instructions

### 1. EmailJS Configuration

You already have EmailJS set up, but you'll need to create additional email templates for the chatbot:

#### Create New Email Templates:

1. **Connection Request Template** (already exists - `template_dy7i7e8`)
   - Update it to include the new fields:
   ```
   Subject: New Connection Request from {{from_name}}
   
   Hello Abhinav,
   
   You have received a new connection request:
   
   Name: {{from_name}}
   Email: {{from_email}}
   Connection Type: {{connection_type}}
   Message: {{message}}
   
   Please respond to {{from_email}} to follow up.
   ```

2. **Acceptance Response Template** (`template_accepted`)
   ```
   Subject: Connection Request Accepted - Abhinav Kumar
   
   Hello {{to_name}},
   
   Thank you for your interest in connecting! I'm excited about the possibility of {{connection_type}}.
   
   I'll be in touch soon to discuss the details.
   
   Best regards,
   Abhinav Kumar
   ```

3. **Decline Response Template** (`template_declined`)
   ```
   Subject: Thank You for Your Interest - Abhinav Kumar
   
   Hello {{to_name}},
   
   Thank you for reaching out regarding {{connection_type}}. While I appreciate your interest, I'm not currently available for this opportunity.
   
   I wish you the best of luck with your project!
   
   Best regards,
   Abhinav Kumar
   ```

### 2. Update Email Address

In `script.js`, line 281, replace `'abhinav@example.com'` with your actual email address:

```javascript
to_email: 'your-actual-email@domain.com'
```

### 3. Test the System

1. **Open your website** in a browser
2. **Click the chat button** (bottom-right corner)
3. **Test the conversation flow**:
   - Say "I want to connect"
   - Provide test information
   - Complete the flow
4. **Check for notifications** - you should see a notification popup
5. **Test accept/decline** buttons

### 4. Customization Options

#### Modify Chatbot Responses
Edit the `handleGreeting()`, `handleNameCollection()`, etc. methods in `script.js` to customize the conversation flow.

#### Change Notification Duration
In `notification-handler.js`, modify the timeout values:
```javascript
setTimeout(() => {
    this.removeNotification(notification);
}, 10000); // Change 10000 to desired milliseconds
```

#### Disable Sound Notifications
Comment out the `playNotificationSound()` call in the `showNotification()` method.

#### Customize Colors
Update the CSS variables in `styles.css` to match your preferred color scheme.

## How It Works

### User Journey
1. **Visitor clicks chat button** → Chat window opens
2. **Bot greets and asks purpose** → User responds with connection intent
3. **Bot collects information** → Name, email, connection type, message
4. **Bot shows summary** → User confirms details
5. **Bot sends request** → Email sent to you + notification triggered
6. **You receive notification** → Accept/decline options available
7. **Response sent** → Automatic email response to visitor

### Technical Flow
1. **Chatbot collects data** → Stores in `userInfo` object
2. **EmailJS sends email** → Notification email to you
3. **Custom event triggered** → `connectionRequest` event dispatched
4. **Notification handler responds** → Creates visual notification
5. **User actions** → Accept/decline triggers response emails

## Browser Compatibility

- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ⚠️ Internet Explorer (limited support)

## Security Considerations

- **Email Validation**: Basic email format validation included
- **XSS Protection**: User input is properly escaped
- **Rate Limiting**: Consider implementing if you expect high traffic
- **Spam Protection**: EmailJS has built-in spam protection

## Troubleshooting

### Common Issues

1. **Chatbot not appearing**
   - Check browser console for JavaScript errors
   - Ensure all scripts are loaded correctly

2. **Notifications not working**
   - Verify browser allows notifications
   - Check if `notification-handler.js` is loaded

3. **Emails not sending**
   - Verify EmailJS configuration
   - Check template IDs match your EmailJS dashboard
   - Ensure your email address is correct

4. **Styling issues**
   - Clear browser cache
   - Check CSS file is loading correctly

### Debug Mode

For development, a test notification button is automatically added when running on localhost. Use it to test the notification system.

## Future Enhancements

Consider these additional features:
- **Chat history persistence** using localStorage
- **Typing indicators** for better UX
- **File upload support** for portfolios/resumes
- **Calendar integration** for scheduling meetings
- **Analytics tracking** for connection requests
- **Multi-language support**

## Support

If you encounter any issues:
1. Check the browser console for error messages
2. Verify all files are properly uploaded
3. Test EmailJS configuration separately
4. Ensure all dependencies are loaded

The chatbot is now fully integrated into your portfolio and ready to help visitors connect with you!
