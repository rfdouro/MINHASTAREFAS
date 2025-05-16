// Importações dos módulos do Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  set,
  onValue,
  remove,
} from "https://www.gstatic.com/firebasejs/11.7.1/firebase-database.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/11.7.1/firebase-auth.js";

import FBService from "./FBService";

class AuthService {
  static user = null;

  static verificaLogado(cbOk, cbNotOk) {
    onAuthStateChanged(FBService.auth, (user) => {
      if (user) {
        if (FBService.auth) {
          AuthService.user = user;
        }
        // https://firebase.google.com/docs/reference/js/auth.user
        const uid = AuthService.user.uid;
        console.log(AuthService.user);
        cbOk();
      } else {
        // User is signed out
        cbNotOk();
      }
    });
  }

  static async logar(email, senha, cbOk, cbNotOk) {
    try {
      const result = await signInWithEmailAndPassword(
        FBService.auth,
        email,
        senha
      );

      if (result.user) {
        console.log("Login bem-sucedido:", result.user.email);
        cbOk();
      } else {
        cbNotOk();
      }
    } catch (e) {
     cbNotOk(e);
    }
  }

  static deslogar(cbOk) {
    signOut(FBService.auth).then(cbOk);
  }
}

export default AuthService;
