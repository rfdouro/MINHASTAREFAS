import {
  createRouter,
  createWebHistory,
  createWebHashHistory,
} from "vue-router";
import IndexView from "@/views/IndexView.vue";
import LoginView from "@/views/LoginView.vue";
import AlteraSenhaView from "@/views/AlteraSenhaView.vue";

const router = createRouter({
  history: createWebHashHistory(), // createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: { path: "/index" },
    },
    {
      path: "/index",
      name: "index",
      component: IndexView,
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
    },
    {
      path: "/alterasenha",
      name: "alterasenha",
      component: AlteraSenhaView,
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/AboutView.vue"),
    },
  ],
});

router.beforeEach((to, from) => {
  if (to.name == "alterasenha") {
    console.log(to.name);
  }
});

export default router;
