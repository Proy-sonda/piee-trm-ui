import { FC, Fragment, useContext } from "react"
import styles from './Stepper.module.css'

import Link from "next/link";
import StepContext from '../../contexts/Stepcontext';


interface Data {
    label: string;
    num: number;
    active: boolean;
    url: string;
    disabled?: boolean
}

type Myprops = {
    Options: Data[]
}



export const Stepper: FC<Myprops> = ({ Options }) => {

    return (
        <div className={styles.stepper}>

            {
                Options.map((value: Data) => {

                    if (value.num == 1) {
                        return (
                            <Fragment key={value.num}>
                                <div className={styles.line}></div>
                                <div className={(value.active ? styles.step + " " + styles.active : styles.step)}>
                                    <div className={styles['step-circle']}>{value.num}</div>
                                    <span className={styles['step-label']}>
                                        {value.label}
                                    </span>
                                </div>
                            </Fragment >
                        )
                    } else {
                        return (
                            <Fragment key={value.num}>
                                <div className={styles.line}></div>
                                <div className={(value.active ? styles.step + " " + styles.active : styles.step)}>
                                    <div className={styles['step-circle']}>{value.num}</div>
                                    <span className={styles['step-label']}>
                                        {value.label}
                                    </span>
                                </div>
                                <div className={styles.line}></div>
                            </Fragment >
                        )
                    }
                }
                )
            }
        </div>
    )
}
