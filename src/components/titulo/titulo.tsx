import Link from 'next/link';
import { ReactNode } from 'react';
import styles from './titulo.module.css';

type TituloProps = {
  children: ReactNode;
  manual?: string;
  url: string;
};

const Titulo: React.FC<TituloProps> = ({ children, url }) => {
  return (
    <>
      <div className={`my-4 ${styles.stagepue}`}>
        <div className="pb-2 border-bottom d-flex align-items-center justify-content-between flex-wrap">
          <div>{children}</div>
          <div className="d-none d-sm-block">
            <Link href={url} target="_blank">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                fill="var(--color-blue)"
                className="bi bi-info-circle"
                viewBox="0 0 16 16">
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
              </svg>
            </Link>
          </div>
          <div className="d-block d-sm-none ms-auto">
            <Link href={url} target="_blank">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                fill="var(--color-blue)"
                className="bi bi-info-circle"
                viewBox="0 0 16 16">
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
      {/* 
      <div className={`my-3 ${styles.stagepue}`}>
        <div className="pb-2 border-bottom d-flex align-items-center justify-content-between flex-wrap">
          <div className="me-4">{children}</div>
          <div className="ml-auto">
            <Link href={url} target="_blank">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                fill="var(--color-blue)"
                className="bi bi-info-circle"
                viewBox="0 0 16 16">
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
              </svg>
            </Link>
          </div>
        </div>
      </div> */}
    </>
  );
};

export default Titulo;
