document.addEventListener('DOMContentLoaded', () => {
    const modelSelect = document.getElementById('ai-model-select');
    const sendBtn = document.getElementById('send-btn');
    const userInput = document.getElementById('user-input');
    const chatHistory = document.getElementById('chat-history');

    // Load saved model preference
    chrome.storage.local.get(['selectedModel'], (result) => {
        if (result.selectedModel) {
            modelSelect.value = result.selectedModel;
        }
    });

    // Handle model change
    modelSelect.addEventListener('change', (e) => {
        const newModel = e.target.value;
        chrome.storage.local.set({ selectedModel: newModel }, () => {
            appendSystemMessage(`Switched active model to ${newModel.toUpperCase()}`);
            // TODO: Notify background script of model change to manage context handoff
        });
    });

    // Handle sending message
    sendBtn.addEventListener('click', sendMessage);

    // Handle Enter key (Shift+Enter for new line)
    userInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    function sendMessage() {
        const text = userInput.value.trim();
        if (!text) return;

        // Display user message
        appendMessage('user', text);
        userInput.value = '';

        // TODO: Send message to background script for processing by selected AI model
        // Mock response for now
        setTimeout(() => {
            appendMessage('ai', `I am processing your request using ${modelSelect.value}...`);
        }, 500);
    }

    function appendMessage(role, content) {
        const div = document.createElement('div');
        div.className = `message ${role}-message`;

        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        contentDiv.textContent = content; // Note: Use innerHTML and a markdown parser later

        div.appendChild(contentDiv);
        chatHistory.appendChild(div);
        chatHistory.scrollTop = chatHistory.scrollHeight;
    }

    function appendSystemMessage(content) {
        const div = document.createElement('div');
        div.className = 'message system-message';

        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        contentDiv.textContent = content;

        div.appendChild(contentDiv);
        chatHistory.appendChild(div);
        chatHistory.scrollTop = chatHistory.scrollHeight;
    }
});
