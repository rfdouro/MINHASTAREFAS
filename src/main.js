import "./assets/main.css";

import { createApp } from "vue";

import { Quasar, Dialog } from "quasar";
import quasarLang from "quasar/lang/pt-BR";

import "@quasar/extras/roboto-font/roboto-font.css";
import "@quasar/extras/material-icons/material-icons.css";

import "quasar/src/css/index.sass";

import App from "./App.vue";
import router from "./router";

const app = createApp(App);

app.use(router);

app.use(Quasar, {
  plugins: { Dialog }, // import Quasar plugins and add here
  lang: quasarLang,
});

app.mount("#app");
