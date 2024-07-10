'use client';

import { obtenerChatBot } from '@/servicios';
import 'animate.css';
import { useState } from 'react';
import styles from './chat.module.css';

export const ChatComponent = () => {
  const [verChat, setverChat] = useState(false);

  return (
    <>
      <button className={styles['btn-chat']} onClick={() => setverChat(!verChat)}>
        {!verChat ? (
          <i className="animate__animated animate_fadeIn bi bi-chat-dots-fill"></i>
        ) : (
          <i className="bi bi-chat-fill"></i>
        )}
      </button>
      <iframe
        className="animate__animated animate__fadeIn"
        hidden={!verChat}
        height={800}
        width={600}
        style={{
          zIndex: 1,
          position: 'fixed',
          bottom: 15,
          right: '3%',
        }}
        src={`${obtenerChatBot()}`}></iframe>
    </>
  );
};
