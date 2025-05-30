//import "./assets/main.css";

import { createApp } from "vue";

import { Quasar, Dialog, Loading, LoadingBar } from "quasar";
import quasarLang from "quasar/lang/pt-BR";

import "@quasar/extras/roboto-font/roboto-font.css";
import "@quasar/extras/material-icons/material-icons.css";

import "quasar/src/css/index.sass";

import "@/styles/main.scss";

import App from "./App.vue";
import router from "./router";

const app = createApp(App);

app.use(router);

app.use(Quasar, {
  plugins: { Dialog, Loading, LoadingBar }, // import Quasar plugins and add here
  lang: quasarLang,
  config: {
    loading: {
      spinnerColor: "primary",
    },
    loadingBar: {
      color: "primary",
      skipHijack: true,
      size: "20px",
    },
  },
});

app.mount("#app");
