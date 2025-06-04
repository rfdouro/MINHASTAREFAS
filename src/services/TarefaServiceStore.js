// Importações dos módulos do Firebase Firestore
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  and,
  orderBy,
} from "@firebase/firestore";

import FBService from "./FBService";

class TarefaServiceStore {
  static tarefasCollection = null;
  static user = null;

  static init(cbOk) {
    // Referência para o nó no banco de dados
    TarefaServiceStore.tarefasCollection = collection(
      FBService.databaseStore,
      "tarefas"
    );
    if (cbOk) cbOk();
  }

  static recupera(cbOk, filtroStart, sortAt) {
    let w = [where("concluida", "==", false)];
    let o = orderBy(filtroStart || "dataLimite", sortAt || "asc");
    let q = query(TarefaServiceStore.tarefasCollection, w, o);
    getDocs(q).then((ts) => {
      if (ts) {
        const dadosArray = ts.docs.map((doc) => ({
          key: doc.id, // Adiciona a chave como um campo "id"
          ...doc.data(), // Espalha os demais campos
        }));
        console.log(dadosArray);
        if (cbOk) cbOk(dadosArray);
      }
    });
  }

  static cadastra(tarefa, cbOk, cbNotOk) {
    addDoc(TarefaServiceStore.tarefasCollection, tarefa)
      .then(() => {
        if (cbOk) cbOk();
      })
      .catch((error) => {
        if (cbNotOk) cbNotOk(error);
      });
  }

  static exclui(k, cbOk, cbNotOk) {
    deleteDoc(doc(FBService.databaseStore, "tarefas", k.key))
      .then(() => cbOk())
      .catch((error) => cbNotOk(error));
  }

  static atualiza(tarefa, cbOk, cbNotOk) {
    let k = tarefa.key;
    delete tarefa.key;
    tarefa.dataLimite = tarefa.dataLimite;
    tarefa.dataAtualiza = new Date().toISOString();
    updateDoc(doc(FBService.databaseStore, "tarefas", k), tarefa)
      .then(() => cbOk())
      .catch((error) => cbNotOk(error));
  }
}

export default TarefaServiceStore;
