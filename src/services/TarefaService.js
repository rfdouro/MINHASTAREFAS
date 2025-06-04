// Importações dos módulos do Firebase
import {
  getDatabase,
  ref,
  push,
  set,
  onValue,
  remove,
  query,
  orderByKey,
  limitToFirst,
  startAt,
  orderByValue,
  orderByChild,
  equalTo,
  get,
  update,
} from "@firebase/database";

import FBService from "./FBService";

class TarefaService {
  static tarefasRef = null;
  static user = null;

  static init(cbOk) {
    // Referência para o nó no banco de dados
    TarefaService.tarefasRef = ref(FBService.database, "tarefas");
  }

  static recupera(cbOk, filtroStart, sortAt) {
    let tarefas = query(TarefaService.tarefasRef);
    if (filtroStart) tarefas = query(tarefas, startAt(filtroStart));
    get(tarefas)
      .then((snapshot) => {
        const dados = snapshot.val();
        if (dados) {
          const dadosArray = Object.entries(dados).map(([key, value]) => ({
            key: key, // Adiciona a chave como um campo "id"
            ...value, // Espalha os demais campos
          }));
          console.log(sortAt);
          dadosArray.sort((a, b) => { 
            if (sortAt === "dataLimite") {
              return new Date(a.dataLimite) - new Date(b.dataLimite);
            } else if (sortAt === "titulo") {
              return a.titulo.localeCompare(b.titulo);
            } else if (sortAt === "descricao") {
              return a.descricao.localeCompare(b.descricao);
            } else {
              return 0; // Sem ordenação
            }
          });
          cbOk(dadosArray);
        } else {
          cbOk([]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
    // Recupera as tarefas do Firebase Realtime Database
    /*fetch(
      `https://tarefasrfd-default-rtdb.firebaseio.com/tarefas.json?auth=${TarefaService.user.accessToken}`
    )
      .then((response) => response.json())
      .then((dados) => {
        if (dados) {
          const dadosArray = Object.entries(dados).map(([key, value]) => ({
            key: key, // Adiciona a chave como um campo "id"
            ...value, // Espalha os demais campos
          }));
          cbOk(dadosArray);
        } else {
          cbOk([]);
        }
      })
      .catch((error) => {
        console.log(error);
      });*/
  }

  static cadastra(tarefa, cbOk, cbNotOk) {
    // Cria uma nova referência com ID único
    const novaTarefaRef = push(TarefaService.tarefasRef);

    set(novaTarefaRef, {
      titulo: tarefa.titulo,
      descricao: tarefa.descricao,
      dataLimite: tarefa.dataLimite,
      dataCadastro: new Date().toISOString(),
      dataAtualiza: new Date().toISOString(),
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
      .then(() => cbOk())
      .catch((error) => cbNotOk(error));
  }

  static atualiza(tarefa, cbOk, cbNotOk) {
    let k = tarefa.key;
    delete tarefa.key;
    (tarefa.dataLimite = tarefa.dataLimite),
      (tarefa.dataAtualiza = new Date().toISOString());
    update(ref(FBService.database, `tarefas/${k}`), tarefa)
      .then(() => cbOk())
      .catch((error) => cbNotOk(error));
  }
}

export default TarefaService;
