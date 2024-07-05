'use client';
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';

interface myAppProps {
  children: React.ReactNode;
}

const ProgressPage: React.FC<myAppProps> = ({ children }) => {
  return (
    <>
      {children}
      <ProgressBar height="4px" color="#F50303" options={{ showSpinner: false }} shallowRouting />
    </>
  );
};

export default ProgressPage;
