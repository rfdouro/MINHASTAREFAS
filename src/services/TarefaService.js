import firebaseConfig from "../data/firebase.conf";
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

class TarefaService {
  static tarefasRef = null;

  static init(cbOk) {
    // Referência para o nó no banco de dados
    TarefaService.tarefasRef = ref(FBService.database, "tarefas");

    // Ler dados
    onValue(TarefaService.tarefasRef, (snapshot) => {
      const dados = snapshot.val();
      if (dados) {
        console.log(dados);
        cbOk(dados);
      }
    });
  }

  static cadastra(tarefa, cbOk, cbNotOk) {
    // Cria uma nova referência com ID único
    const novaTarefaRef = push(TarefaService.tarefasRef);

    set(novaTarefaRef, {
      descricao: tarefa.descricao,
      dataCadastro: new Date().toISOString(),
    })
      .then(() => {
        cbOk();
      })
      .catch((error) => {
        cbNotOk(error);
      });
  }

  static exclui(k, cbOk, cbNotOk) {
    remove(ref(FBService.database, `tarefas/${k.key}`))
      .then(() => cbOk)
      .catch((error) => cbNotOk(error));
  }
}

export default TarefaService;
