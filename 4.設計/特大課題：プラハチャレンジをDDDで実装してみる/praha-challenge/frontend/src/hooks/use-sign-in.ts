import { useState, useEffect } from "react";

export const useSignIn = (auth: any) => {
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    const unregisterAuthObserver = auth.onAuthStateChanged((user: any) => {
      setIsSignedIn(!!user);
    });
    return () => unregisterAuthObserver();
  }, [auth]);
  return [isSignedIn];
};
