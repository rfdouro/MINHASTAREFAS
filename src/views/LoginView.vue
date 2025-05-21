<template>
 <q-layout view="hHh lpr fFf" class="fullscreen">
  <q-header elevated class="bg-primary text-white" height-hint="98">
   <q-toolbar>
    <q-tsolbar-title>
     <q-avatar>
      <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg" />
     </q-avatar>
     Acesso
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
        label="Senha *"
        lazy-rules
        :rules="[
         (val) => (val !== null && val !== '') || 'Por favor digite a senhha',
         (val) => val.length >= 6 || 'Mínimo de 6 caracteres',
        ]"
       ></q-input>

       <div>
        <q-btn label="Acessar" type="submit" color="primary"></q-btn>
        <q-btn
         label="Resetar"
         type="reset"
         color="primary"
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
  };
 },
 mounted() {
  this.$q.loading.show();
  FBService.init();
  AuthService.verificaLogado(
   () => {
    this.$router.push({ path: "/index" });
    this.$q.loading.hide();
   },
   () => {
    this.$q.loading.hide();
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
     this.$q.loading.hide();
     this.$router.push({ path: "/index" });
    },
    (e) => {
     this.$q.loading.hide();
     this.$q
      .dialog({
       title: "ERRO",
       message: `Erro ao logar ${e}`,
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
  },
 },
};
</script>

<style>
</style>