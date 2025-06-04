<template>
 <q-layout view="hHh lpR fFf" class="fullscreen">
  <q-header class="bg-primary text-white" height-hint="98">
   <q-toolbar>
    <q-toolbar-title>
     <q-avatar>
      <img src="@/assets/mytasks.png" />
     </q-avatar>
     Tarefas
    </q-toolbar-title>

    <DropDownUser
     :user="user"
     :funAltera="abreAltera"
     :funSair="sair"
    ></DropDownUser>
   </q-toolbar>
   <q-tabs
    v-model="tab"
    dense
    class="text-white"
    active-color="white"
    indicator-color="white"
    align="left"
   >
    <q-tab to="lista" name="lista" label="Lista"></q-tab>
    <q-tab to="cadastro" name="cadastro" label="Cadastro"></q-tab>
   </q-tabs>
  </q-header>

  <q-page-container>
   <q-tab-panels v-model="tab" animated class="row q-pa-md" swipeable draggable>
    <q-tab-panel
     name="lista"
     v-touch-swipe.mouse.right.left="handleSwipe"
     draggable
    >
     <div class="text-h6">Tarefas</div>
     <div class="q-gutter-md">
      <q-list bordered separator>
       <q-item
        :clickable="false"
        v-ripple="false"
        v-for="t in tarefas"
        v-bind:key="t.key"
       >
        <q-item-section>
         <q-item-label>{{ t.titulo }}</q-item-label>
         <q-item-label caption
          >{{ t.descricao }}<br />
          <span class="text-primary">
           {{ t.dataLimite }}
           {{ t.dataLimite ? "Vencimento: " : "Sem data limite" }}
           {{
            new Date(`${t.dataLimite} 00:00:00 GMT-0300`).toLocaleDateString(
             "pt-BR",
             {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
             }
            )
           }}</span
          >
         </q-item-label>
        </q-item-section>
        <q-item-section side class="gt-xs">
         <q-btn-group push>
          <q-btn
           label="Alterar"
           icon="update"
           color="green"
           @click="
            tarefa = t;
            diagaltera = true;
           "
          ></q-btn>
          <q-btn
           label="Excluir"
           icon="delete"
           color="red"
           @click="exclui(t)"
          ></q-btn>
         </q-btn-group>
        </q-item-section>
        <q-item-section side class="lt-sm">
         <q-btn-group push>
          <q-btn
           icon="update"
           color="green"
           @click="
            tarefa = t;
            diagaltera = true;
           "
          ></q-btn>
          <q-btn icon="delete" color="red" @click="exclui(t)"></q-btn>
         </q-btn-group>
        </q-item-section>
       </q-item>
      </q-list>
     </div>
    </q-tab-panel>

    <q-tab-panel
     name="cadastro"
     v-touch-swipe.mouse.right.left="handleSwipe"
     draggable
    >
     <q-card class="bg-blue-1 q-pa-md">
      <div class="text-h6">Nova Tarefa</div>
      <div class="q-gutter-md">
       <q-input
        filled
        type="text"
        v-model="tarefa.titulo"
        label="Título *"
        hint="Título da tarefa"
        lazy-rules
        :rules="[(val) => (val && val.length > 0) || 'Digite um título']"
       ></q-input>
       <q-input
        filled
        type="text"
        v-model="tarefa.descricao"
        label="Descrição *"
        hint="Descrição da tarefa"
        lazy-rules
        :rules="[(val) => (val && val.length > 0) || 'Digite uma descrição']"
       ></q-input>
       <q-input
        filled
        type="date"
        v-model="tarefa.dataLimite"
        label="Data limite *"
        hint="Data limite"
       ></q-input>
       <div>
        <q-btn label="Salvar" color="primary" @click="cadTarefa"></q-btn>
        <q-btn label="Cancelar" color="primary" flat class="q-ml-sm"></q-btn>
       </div>
      </div>
     </q-card>
    </q-tab-panel>
   </q-tab-panels>

   <q-dialog v-model="diagaltera" persistent>
    <q-card style="width: 700px; max-width: 80vw" class="bg-green-3">
     <q-card-section>
      <div class="text-h6">Tarefa</div>
     </q-card-section>

     <q-card-section class="q-pt-none">
      <div class="q-gutter-md">
       <q-input
        filled
        type="text"
        v-model="tarefa.titulo"
        label="Título *"
        hint="Título da tarefa"
        lazy-rules
        :rules="[(val) => (val && val.length > 0) || 'Digite um título']"
       ></q-input>
       <q-input
        color="white"
        filled
        type="text"
        v-model="tarefa.descricao"
        label="Descrição *"
        hint="Descrição da tarefa"
        lazy-rules
        :rules="[(val) => (val && val.length > 0) || 'Digite uma descrição']"
       ></q-input>
       <q-input
        filled
        type="date"
        v-model="tarefa.dataLimite"
        label="Data limite *"
        hint="Data limite"
       ></q-input>
      </div>
     </q-card-section>

     <q-card-actions align="right" class="bg-green-2">
      <q-btn label="Alterar" v-close-popup @click="atualiza" />
      <q-btn
       flat
       label="Fechar"
       v-close-popup
       @click="
        () => {
         limpa();
         todas();
        }
       "
      />
     </q-card-actions>
    </q-card>
   </q-dialog>
  </q-page-container>
 </q-layout>
</template>

<script>
import FBService from "@/services/FBService.js";
import AuthService from "@/services/AuthService.js";
import TarefaService from "@/services/TarefaService.js";
import DropDownUser from "@/components/DropDownUser.vue";

export default {
 components: {
  DropDownUser,
 },
 data() {
  return {
   user: null,
   tab: "lista",
   tarefa: {
    titulo: "",
    descricao: "",
   },
   tarefas: [],
   diagaltera: false,
  };
 },
 beforeCreate() {},
 mounted() {
  this.$q.loading.show();
  FBService.init();
  AuthService.verificaLogado(
   () => {
    this.user = AuthService.user;
    TarefaService.user = AuthService.user;
    this.todas();
    this.$q.loading.hide();
   },
   () => {
    this.$router.push({ path: "/login" });
   }
  );
  TarefaService.init((dados) => {
   this.tarefas = [];
  });
 },
 methods: {
  handleSwipe({ evt, ...newInfo }) {
   // native Javascript event
   console.log(evt);
   console.log(newInfo);
  },
  limpa() {
   this.tarefa = {
    titulo: "",
    descricao: "",
   };
  },
  abreAltera() {
   this.$router.push("alterasenha");
  },
  todas() {
   this.limpa();
   this.$q.loading.show();
   TarefaService.recupera((dados) => {
    this.tarefas = [];
    if (dados) {
     this.tarefas = dados;
    }
    this.$q.loading.hide();
   }, null, "dataLimite");
  },
  sair() {
   AuthService.deslogar(() => {
    this.$router.push({ path: "/login" });
   });
  },
  cadTarefa() {
   TarefaService.cadastra(
    this.tarefa,
    () => {
     this.$q
      .dialog({
       title: "SUCESSO",
       message: `Dados cadastrados com sucesso!`,
      })
      .onOk(() => {
       this.todas();
       this.tab = "lista";
      });
    },
    (e) => {
     this.limpa();
     this.$q.dialog({
      title: "ERRO",
      message: `${e}`,
     });
    }
   );
  },
  exclui(k) {
   this.$q
    .dialog({
     title: "ATENÇÃO",
     message: `Deseja realmente excluir essa tarefa?`,
     cancel: "Não",
     ok: "Sim",
     persistent: true,
     color: "white",
     class: "bg-red text-white",
    })
    .onOk(() => {
     TarefaService.exclui(
      k,
      () => {
       this.$q
        .dialog({
         title: "SUCESSO",
         message: `Dados excluídos com sucesso!`,
        })
        .onOk(() => {
         this.todas();
         this.tab = "lista";
        });
      },
      (e) => {
       this.limpa();
       console.error("Erro ao remover:", e);
      }
     );
    });
  },
  atualiza() {
   if (this.tarefa.key) {
    this.tarefa = JSON.stringify(this.tarefa);
    this.tarefa = JSON.parse(this.tarefa);
    TarefaService.atualiza(
     this.tarefa,
     () => {
      this.$q
       .dialog({
        title: "SUCESSO",
        message: `Dados alterados com sucesso!`,
       })
       .onOk(() => {
        this.todas();
        this.tab = "lista";
       });
     },
     (e) => {
      this.limpa();
      console.error("Erro ao atualizar:", e);
     }
    );
   }
  },
 },
};
</script>

<style>
</style>