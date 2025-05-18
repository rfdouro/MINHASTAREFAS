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
} from "@firebase/database";

import FBService from "./FBService";

class TarefaService {
  static tarefasRef = null;

  static init(cbOk) {
    // Referência para o nó no banco de dados
    TarefaService.tarefasRef = ref(FBService.database, "tarefas");
  }

  static recupera(cbOk, filtroStart) {
    let tarefas = query(TarefaService.tarefasRef, orderByChild("descricao"));
    if (filtroStart) tarefas = query(tarefas, startAt(filtroStart));
    get(tarefas)
      .then((snapshot) => {
        const dados = snapshot.val();
        if (dados) {
          const dadosArray = Object.entries(dados).map(([key, value]) => ({
            key: key, // Adiciona a chave como um campo "id"
            ...value, // Espalha os demais campos
          }));
          cbOk(dadosArray);
        }else{
          cbOk([]);
        }
      })
      .catch((error) => {
        console.log(error);
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
      .then(() => cbOk())
      .catch((error) => cbNotOk(error));
  }
}

export default TarefaService;
