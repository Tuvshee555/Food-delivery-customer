export type SignUpEmailStepType = {
    nextStep: () => void;
    stepBack: () => void;
  };

  
 export type InputEventType = {
    target: {
      value: string;
    };
  };
  
export type ValidationFunction = (
    value: string,
    nextStep: () => void,
    setError: (error: string) => void
  ) => void;