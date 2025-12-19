import { useRef, useState } from 'react';
import { useChat, fetchServerSentEvents } from '@tanstack/ai-react';
import styles from './ChatBox.module.css';
import ReactMarkdown from 'react-markdown';

export default function ChatBox() {
  const [input, setInput] = useState('');

  const { messages, sendMessage, isLoading } = useChat({
    connection: fetchServerSentEvents('/api/chat'),
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLoading || !input.trim()) return;

    sendMessage(input);
    setInput('');
  };

  return (
    <div className={styles['chat-box']}>
      <h2>Messages</h2>
      <div className={styles['scroll-container']}>
        <div className={styles['scroll-content']}>
          {messages.map((message) => (
            <section
              key={message.id}
              className={`${styles.message} ${message.role === 'assistant' ? styles.assistant : styles.user}`}
            >
              {message.parts.map((part, i) => {
                if (part.type === 'thinking') {
                  return <p key={i}>💭 Thinking: {part.content}</p>;
                }

                if (part.type === 'text') {
                  if (message.role === 'assistant') {
                    return (
                      <ReactMarkdown key={i}>{part.content}</ReactMarkdown>
                    );
                  }

                  return <p key={i}>{part.content}</p>;
                }

                return <p key={i}>[Unsupported part type: {part.type}]</p>;
              })}
            </section>
          ))}
        </div>
      </div>

      <form className={styles['form']} onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            value={input}
            onChange={handleChange}
            placeholder="Type a message..."
            autoFocus
          />
          <button type="submit" disabled={isLoading || !input.trim()}>
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
