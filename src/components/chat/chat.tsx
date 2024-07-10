'use client';

import { obtenerChatBot } from '@/servicios';
import 'animate.css';
import { useState } from 'react';
import styles from './chat.module.css';

export const ChatComponent = () => {
  const [verChat, setverChat] = useState(false);
  const [mouseHover, setMouseHover] = useState(false);

  return (
    <>
      {!verChat && mouseHover ? (
        <button
          className={`${styles['btn-chathover']}`}
          onClick={() => setverChat(!verChat)}
          onMouseEnter={() => setMouseHover(true)}
          onMouseLeave={() => setMouseHover(false)}>
          <div className="d-flex justify-content-around">
            <div className="p-2 align-self-center">ASISTENTE VIRTUAL</div>
            <div className="p-2">
              <i className="animate__animated animate_fadeIn bi bi-chat-dots-fill float-rigth"></i>
            </div>
          </div>
        </button>
      ) : (
        <button
          className={styles['btn-chat']}
          onClick={() => setverChat(!verChat)}
          onMouseEnter={() => setMouseHover(true)}
          onMouseLeave={() => setMouseHover(false)}>
          <i className="bi bi-chat-fill"></i>
        </button>
      )}

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
