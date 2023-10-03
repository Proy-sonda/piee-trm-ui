import { FC, Fragment } from 'react';
import styles from './stepper.module.css';

interface Data {
  label: string;
  num: number;
  active: boolean;
  url: string;
  disabled?: boolean;
}

type Myprops = {
  Options: Data[];
};

export const Stepper: FC<Myprops> = ({ Options }) => {
  return (
    <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-center">
      {Options.map((value: Data) => {
        if (value.num == 1) {
          return (
            <Fragment key={value.num}>
              <div className={`${styles.line} d-none d-md-inline-block`}></div>
              <div className={value.active ? styles.step + ' ' + styles.active : styles.step}>
                <div className="d-flex flex-md-column align-items-center justify-content-center">
                  <div className={styles['step-circle']}>{value.num}</div>
                  <span className={`${styles['step-label']} ms-2 ms-md-0 mt-md-2`}>
                    {value.label}
                  </span>
                </div>
              </div>
            </Fragment>
          );
        } else {
          return (
            <Fragment key={value.num}>
              <div className={`${styles.line} d-none d-md-inline-block`}></div>
              <div className={value.active ? styles.step + ' ' + styles.active : styles.step}>
                <div className="d-flex flex-md-column align-items-center justify-content-center">
                  <div className={styles['step-circle']}>{value.num}</div>
                  <span className={`${styles['step-label']} ms-2 ms-md-0 mt-md-2`}>
                    {value.label}
                  </span>
                </div>
              </div>
              <div className={`${styles.line} d-none d-md-inline-block`}></div>
            </Fragment>
          );
        }
      })}
    </div>
  );
};
