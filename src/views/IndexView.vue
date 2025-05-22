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
     v-touch-swipe.mouse.right.left="handleSwipe" draggable
    >
     <div class="text-h6">Tarefas</div>
     <div class="q-pa-md">
      <q-list bordered separator>
       <q-item
        clickable
        v-ripple
        v-for="t in tarefas"
        v-bind:key="t.key"
        @click="exclui(t)"
       >
        <q-item-section>
         <q-item-label>{{ t.descricao }}</q-item-label>
         <q-item-label caption>{{ t.dataCadastro }}</q-item-label>
        </q-item-section>
       </q-item>
      </q-list>
     </div>
    </q-tab-panel>

    <q-tab-panel
     name="cadastro"
     v-touch-swipe.mouse.right.left="handleSwipe" draggable
    >
     <div class="text-h6">Nova Tarefa</div>
     <div class="q-gutter-md">
      <q-input
       filled
       type="text"
       v-model="tarefa.descricao"
       label="Descrição *"
       hint="Descrição"
       lazy-rules
       :rules="[(val) => (val && val.length > 0) || 'Digite uma descrição']"
      ></q-input>
      <div>
       <q-btn label="Salvar" color="primary" @click="cadTarefa"></q-btn>
       <q-btn label="Cancelar" color="primary" flat class="q-ml-sm"></q-btn>
      </div>
     </div>
    </q-tab-panel>
   </q-tab-panels>
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
    descricao: "",
   },
   tarefas: [],
  };
 },
 beforeCreate() {},
 mounted() {
  this.$q.loading.show();
  FBService.init();
  AuthService.verificaLogado(
   () => {
    this.user = AuthService.user;
    this.$q.loading.hide();
   },
   () => {
    this.$router.push({ path: "/login" });
   }
  );
  TarefaService.init((dados) => {
   this.tarefas = [];
  });
  this.todas();
 },
 methods: {
  handleSwipe({ evt, ...newInfo }) {
   // native Javascript event
   console.log(evt);
   console.log(newInfo);
  },
  abreAltera() {
   this.$router.push("alterasenha");
  },
  todas() {
   this.$q.loading.show();
   TarefaService.recupera((dados) => {
    this.tarefas = [];
    if (dados) {
     this.tarefas = dados;
    }
    this.$q.loading.hide();
   });
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
     class: "bg-orange",
    })
    .onOk(() => {
     TarefaService.exclui(
      k,
      () => {
       this.todas();
      },
      (e) => {
       console.error("Erro ao remover:", e);
      }
     );
    });
  },
 },
};
</script>

<style>
</style>