// Importações dos módulos do Firebase
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "@firebase/auth"

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
        //result.user.email
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
