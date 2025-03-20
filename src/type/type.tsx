
  

  
export type ValidationFunction = (
    value: string,
    nextStep: () => void,
    setError: (error: string) => void
  ) => void;

  export type SignUpEmailStepType = {
    nextStep: () => void;
    stepBack?: () => void;
    setUser: React.Dispatch<React.SetStateAction<{ email: string; password: string }>>;
  };
  
  export type InputEventType = {
    target: { value: string };
  };