'use client';

import { ReactNode, createContext, useState } from 'react';

type myAppsProps = {
  children: ReactNode;
};

type StepContextType = {
  step: number;
  stepper: (id: number) => void;
};

export const StepContext = createContext<StepContextType>({
  step: 1,
  stepper: () => {},
});

export const StepProvider: React.FC<myAppsProps> = ({ children }) => {
  const [step, setStep] = useState(1);

  const stepper = (id: number) => {
    setStep(id);
  };

  return <StepContext.Provider value={{ step, stepper }}>{children}</StepContext.Provider>;
};

export default StepContext;
