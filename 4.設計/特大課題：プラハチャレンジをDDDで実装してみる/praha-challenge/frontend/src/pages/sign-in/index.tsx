import SignIn from "../../components/sign-in";
import { useSignIn } from "../../hooks/use-sign-in";
import { firebaseApp } from "../../infra/firebase/app";
import uiConfig from "../../infra/firebase/uiConfig";

const SignInContainer = () => {
  const [isSignedIn] = useSignIn(firebaseApp.auth());
  return (
    <SignIn
      uiConfig={uiConfig}
      auth={firebaseApp.auth()}
      isSignedIn={isSignedIn}
    />
  );
};
export default SignInContainer;
