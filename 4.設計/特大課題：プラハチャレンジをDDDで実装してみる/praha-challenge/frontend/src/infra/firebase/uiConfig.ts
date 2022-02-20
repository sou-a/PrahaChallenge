import { EmailAuthProvider } from "firebase/auth";

var uiConfig = {
  signInFlow: "popup",
  signInSuccessUrl: "/sign-in",
  signInOptions: [EmailAuthProvider.PROVIDER_ID],
};

export default uiConfig;
