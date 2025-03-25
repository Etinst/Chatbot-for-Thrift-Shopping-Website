document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const chatButton = document.querySelector('.chat-button');
    const chatWindow = document.querySelector('.chat-window');
    const sendButton = document.querySelector('.send-button');
    const messageInput = document.querySelector('.chat-input input');
    const messagesContainer = document.querySelector('.chat-messages');
    
    // State
    let isChatOpen = false;
    
    // Toggle Chat Window
    chatButton.addEventListener('click', function() {
        isChatOpen = !isChatOpen;
        chatWindow.classList.toggle('active', isChatOpen);
    });
    
    // Send Message
    async function sendMessage() {
        const messageText = messageInput.value.trim();
        
        if (!messageText) return;
        
        // Add user message
        addMessage('user', messageText);
        messageInput.value = '';
        
        try {
            // Show loading indicator
            const loadingId = addLoadingIndicator();
            
            // Get bot response
            const response = await fetch('/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: messageText })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Delay bot response
            setTimeout(() => {
                // Remove loading indicator
                removeLoadingIndicator(loadingId);
                
                // Add bot response
                if (data.answer) {
                    addMessage('bot', data.answer);
                } else {
                    throw new Error('No answer in response');
                }
            }, 1500); // 1.5 seconds delay
            
        } catch (error) {
            console.error('Error:', error);
            removeLoadingIndicator(loadingId);
            addMessage('bot', "Sorry, I'm having trouble responding. Please try again.");
        }
    }
    
    // Add message to chat
    function addMessage(sender, text) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message');
        messageElement.classList.add(sender === 'user' ? 'user-message' : 'bot-message');
        messageElement.textContent = text;
        messagesContainer.appendChild(messageElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    // Add loading indicator
    function addLoadingIndicator() {
        const id = 'loading-' + Date.now();
        const loadingElement = document.createElement('div');
        loadingElement.id = id;
        loadingElement.classList.add('message', 'bot-message');
        loadingElement.textContent = '...';
        messagesContainer.appendChild(loadingElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        return id;
    }
    
    // Remove loading indicator
    function removeLoadingIndicator(id) {
        const element = document.getElementById(id);
        if (element) {
            element.remove();
        }
    }
    
    // Event listeners
    sendButton.addEventListener('click', sendMessage);
    messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    // Initial greeting
    addMessage('bot', "Hi there! How can I help you today?");
});
