import { ProgressBar } from 'react-bootstrap';

interface props {
  show: boolean;
  text: string;
  count: number;
}

export const ProgressBarCustom: React.FC<props> = ({ show, text, count }) => {
  return (
    <>
      <div
        className="progress_bar"
        style={{
          display: show ? 'block' : 'none',
        }}>
        <div className="progres">
          <p>{text}</p>
          <ProgressBar animated now={count} label={`${count.toFixed(1)}%`} />
        </div>
      </div>
    </>
  );
};