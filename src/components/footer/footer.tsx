'use client';

import { AuthContext } from '@/contexts';
import { format } from 'date-fns';
import { ReactNode, useContext } from 'react';
import styles from './footer.module.css';

interface AppFooterProps {
  children: ReactNode;
}

const AppFooter: React.FC<AppFooterProps> = ({ children }) => {
  const { ultimaConexion } = useContext(AuthContext);

  return (
    <footer className={styles['footer-container']}>
      <div className={styles['footer-background']}>
        <div className={styles['footer-top']}></div>
        <div className="row mb-4">
          <div className="col-12">
            <div className={styles['footer-content']}>
              <div className={styles['contact']}>
                {ultimaConexion && (
                  <>
                    <span>Ultima conexión: </span>
                    {format(new Date(ultimaConexion), 'dd/MM/yyyy HH:mm:ss')} <br />
                  </>
                )}
                <div className="mt-2 text-center" style={{ fontSize: '16px' }}>
                  Para soporte comunicarse a:
                </div>
                <span>Teléfono:</span>&nbsp;<a href="tel:+56227149554">+56227149554</a> -{' '}
                <span>Email:</span>{' '}
                <a href="mailto:soportempleador@fonasa.gov.cl">soportempleador@fonasa.gov.cl</a>
              </div>
              {children}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default AppFooter;
