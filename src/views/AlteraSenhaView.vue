<template>
 <q-layout view="hHh lpr fFf" class="fullscreen">
  <q-header elevated class="bg-primary text-white" height-hint="98">
   <q-toolbar>
    <q-tsolbar-title>
     <q-avatar>
      <img src="@/assets/mytasks.png" />
     </q-avatar>
     Alterar Senha
    </q-tsolbar-title>
   </q-toolbar>
  </q-header>

  <q-page-container>
   <q-page class="row q-pa-md">
    <div class="offset-0 col-12 offset-md-3 col-md-6">
     <q-card class="q-pa-md">
      <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
       <q-input
        filled
        type="email"
        v-model="email"
        label="E-mail *"
        lazy-rules
        :rules="[(val) => (val && val.length > 0) || 'Digite um e-mail']"
       ></q-input>

       <q-input
        filled
        type="password"
        v-model="senha"
        label="Senha Atual *"
        lazy-rules
        :rules="[
         (val) => (val !== null && val !== '') || 'Por favor digite a senha',
         (val) => val.length >= 6 || 'Mínimo de 6 caracteres',
        ]"
       ></q-input>

       <q-input
        filled
        type="password"
        v-model="novasenha"
        label="Nova Senha *"
        lazy-rules
        :rules="[
         (val) => (val !== null && val !== '') || 'Por favor digite a senha',
         (val) => val.length >= 6 || 'Mínimo de 6 caracteres',
        ]"
       ></q-input>

       <div>
        <q-btn label="Alterar" type="submit" color="primary"></q-btn>
        <q-btn
         label="Cancelar"
         type="reset"
         color="orange"
         flat
         class="q-ml-sm"
        ></q-btn>
       </div>
      </q-form>
     </q-card>
    </div>
   </q-page>
  </q-page-container>
 </q-layout>
</template>

<script>
import FBService from "@/services/FBService.js";
import AuthService from "@/services/AuthService.js";

export default {
 data() {
  return {
   email: "",
   senha: "",
   novasenha: "",
   user: null,
  };
 },
 mounted() {
  this.$q.loading.show();
  FBService.init();
  AuthService.verificaLogado(
   () => {
    this.user = AuthService.user;
    console.log(this.user.email);
    this.email = this.user.email;
    this.$q.loading.hide();
   },
   () => {
    this.$q.loading.hide();
    this.$router.push({ path: "/login" });
   }
  );
 },
 methods: {
  async onSubmit() {
   const email = this.email;
   const password = this.senha;
   this.$q.loading.show();
   await AuthService.logar(
    email,
    password,
    () => {
     AuthService.atualizaSenha(
      this.novasenha,
      () => {
       this.$q
        .dialog({
         title: "Alterado",
         message: `Senha alterada com sucesso`,
        })
        .onOk(() => {
         this.$router.push({ path: "/index" });
        });
        this.$q.loading.hide();
      },
      (e) => {
       this.$q.dialog({
        title: "ERRO",
        message: `Erro nos dados de alteração ${e}`,
       });
       this.$q.loading.hide();
      }
     );
    },
    (e) => {
     this.$q.loading.hide();
     this.$q
      .dialog({
       title: "ERRO",
       message: `Erro nos dados atuais ${e}`,
      })
      .onOk(() => {
       // console.log('OK')
      })
      .onCancel(() => {
       // console.log('Cancel')
      })
      .onDismiss(() => {
       // console.log('I am triggered on both OK and Cancel')
      });
    }
   );
  },
  onReset() {
   this.email = "";
   this.password = "";
   this.$router.push("index");
  },
 },
};
</script>

<style>
</style>