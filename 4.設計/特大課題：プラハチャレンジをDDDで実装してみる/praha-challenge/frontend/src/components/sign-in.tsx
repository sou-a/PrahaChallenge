import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";

interface SignInProps {
  uiConfig: Object;
  auth: any;
  isSignedIn: boolean | ((auth: any) => void);
}

const SignIn = ({ uiConfig, auth, isSignedIn }: SignInProps): JSX.Element => {
  if (!isSignedIn) {
    return (
      <div>
        <h1>My App</h1>
        <p>Please sign-in:</p>
        <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth} />
      </div>
    );
  }
  return (
    <div>
      <h1>My App</h1>
      <p>Welcome {auth.currentUser.displayName}! You are now signed-in!</p>
      <a onClick={() => auth.signOut()}>Sign-out</a>
    </div>
  );
};

export default SignIn;
