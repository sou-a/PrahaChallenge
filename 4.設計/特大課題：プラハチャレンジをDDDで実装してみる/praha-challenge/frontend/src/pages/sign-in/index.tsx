import SignIn from "../../components/sign-in";
import { useSignIn } from "../../hooks/use-sign-in";
import { firebaseApp } from "../../infra/firebase/app";
import uiConfig from "../../infra/firebase/uiConfig";

const SignInContainer = () => {
  const [isSignedIn] = useSignIn(firebaseApp.auth());
  const callApi = async (e: any) => {
    e.preventDefault();
    try {
      const token = await firebaseApp.auth().currentUser?.getIdToken();
      const xhr = new XMLHttpRequest();
      xhr.open("GET", "http://localhost:3001/users", true);
      if (token) {
        xhr.setRequestHeader("Authorization", `${token}`);
      }
      console.log(token);
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          const result = xhr.response;
          alert(result);
        }
      };
      xhr.send(null);
    } catch (err: any) {
      alert(err.message);
    }
  };
  return (
    <SignIn
      uiConfig={uiConfig}
      auth={firebaseApp.auth()}
      isSignedIn={isSignedIn}
      callApi={callApi}
    />
  );
};
export default SignInContainer;
