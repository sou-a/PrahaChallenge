import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";

interface SignInProps {
  uiConfig: Object;
  auth: any;
  isSignedIn: boolean | ((auth: any) => void);
  callApi: any;
}

const SignIn = ({
  uiConfig,
  auth,
  isSignedIn,
  callApi,
}: SignInProps): JSX.Element => {
  if (!isSignedIn) {
    return (
      <div>
        <h1>My App</h1>
        <p>Please sign-in:</p>
        <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth} />
        <div>
          <button onClick={callApi}>CallApi</button>
        </div>
      </div>
    );
  }
  return (
    <div>
      <h1>My App</h1>
      <p>Welcome {auth.currentUser.displayName}! You are now signed-in!</p>
      <a onClick={() => auth.signOut()}>Sign-out</a>
      <div>
        <button onClick={callApi}>CallApi</button>
      </div>
    </div>
  );
};

export default SignIn;
