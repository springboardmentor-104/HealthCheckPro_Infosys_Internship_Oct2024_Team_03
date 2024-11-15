
import React, { useState } from 'react';

const Chatbot = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');

    // Mock function to simulate chatbot response
    const getChatbotResponse = (userMessage) => {
        return `You said: ${userMessage}`;  // For now, it just echoes user input
    };

    const handleSendMessage = () => {
        if (input.trim() === '') return;

        const userMessage = { text: input, sender: 'user' };
        const botMessage = { text: getChatbotResponse(input), sender: 'bot' };

        setMessages([...messages, userMessage, botMessage]);
        setInput('');
    };

    return (
        <div style={styles.chatContainer}>
            <div style={styles.chatWindow}>
                {messages.map((message, index) => (
                    <div
                        key={index}
                        style={{
                            ...styles.message,
                            alignSelf: message.sender === 'user' ? 'flex-end' : 'flex-start',
                            backgroundColor: message.sender === 'user' ? '#e1ffc7' : '#f1f0f0',
                        }}
                    >
                        {message.text}
                    </div>
                ))}
            </div>
            <div style={styles.inputContainer}>
                <input
                    style={styles.input}
                    type="text"
                    placeholder="Type a message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                <button onClick={handleSendMessage} style={styles.sendButton}>
                    Send
                </button>
            </div>
        </div>
    );
};

const styles = {
    chatContainer: { width: '300px', margin: '0 auto', border: '1px solid #ccc', borderRadius: '5px' },
    chatWindow: { height: '400px', padding: '10px', overflowY: 'scroll', display: 'flex', flexDirection: 'column' },
    message: { padding: '10px', margin: '5px', borderRadius: '10px', maxWidth: '70%' },
    inputContainer: { display: 'flex', padding: '10px', borderTop: '1px solid #ccc' },
    input: { flex: 1, padding: '8px', borderRadius: '5px', border: '1px solid #ccc' },
    sendButton: { marginLeft: '10px', padding: '8px', borderRadius: '5px', cursor: 'pointer' }
};

export default Chatbot;
