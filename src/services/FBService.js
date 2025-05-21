import firebaseConfig from "../data/firebase.conf";
// Importações dos módulos do Firebase
import { initializeApp } from "@firebase/app"; // "https://www.gstatic.com/firebasejs/11.7.1/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  set,
  onValue,
  remove,
} from "@firebase/database"; // "https://www.gstatic.com/firebasejs/11.7.1/firebase-database.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "@firebase/auth"; // "https://www.gstatic.com/firebasejs/11.7.1/firebase-auth.js";

class FBService {
  static fbconf = firebaseConfig.firebaseConfig;
  static appfb = null;
  static database = null;
  static auth = null;

  static init() {
    // Inicializa o Firebase
    if (FBService.appfb == null) {
      FBService.appfb = initializeApp(FBService.fbconf);
      FBService.database = getDatabase(FBService.appfb);
      FBService.auth = getAuth(FBService.appfb);
    }
  }
}

export default FBService;
