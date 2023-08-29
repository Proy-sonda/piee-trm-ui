import { ReactNode } from 'react';
import styles from './Stage.module.css';
import Link from 'next/link';

type MyPropsApp = {
  children: ReactNode;
  manual: string;
  url: string;
};

const Stage: React.FC<MyPropsApp> = ({ children, manual, url }) => {
  return (
    <div className={`row mt-2 ${styles.stagepue}`}>
      <div className="col-md-8">
        {children}

        <hr />
      </div>
      <div className="col-md-4">
        <Link href={url} target="_blank">
          <span
            style={{
              cursor: 'pointer',
              color: 'blue',
            }}>
            {' '}
            {manual}
          </span>
        </Link>
      </div>
    </div>
  );
};

export default Stage;
