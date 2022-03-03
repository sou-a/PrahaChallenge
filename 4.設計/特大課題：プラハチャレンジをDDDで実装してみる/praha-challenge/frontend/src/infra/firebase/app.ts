import firebase from "firebase/compat/app";
import { config } from "./config";
import "firebase/compat/auth";

export const firebaseApp = firebase.initializeApp(config);
