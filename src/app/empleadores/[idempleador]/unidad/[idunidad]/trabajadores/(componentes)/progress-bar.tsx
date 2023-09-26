import { ProgressBar } from 'react-bootstrap';
import styles from './progress-bar.module.css';

interface props {
  show: boolean;
  text: string;
  count: number;
}

export const ProgressBarCustom: React.FC<props> = ({ show, text, count }) => {
  return (
    <>
      <div
        className={styles['progress_bar']}
        style={{
          display: show ? 'block' : 'none',
        }}>
        <div className={styles['progres']}>
          <p className={styles['texto_progress_bar']}>{text}</p>
          <ProgressBar animated now={count} label={`${count.toFixed(1)}%`} />
        </div>
      </div>
    </>
  );
};
