import Vue from "vue";
import VueRouter from "vue-router";
import HomeView from "../views/HomeView.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/about",
    name: "about",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
  },
  {
    path: "/",
    name: "toolbar",
    component: () => import("../views/Toolbar.vue"),
    children: [
      {
        path: "/apicon",
        name: "apicon",
        component: () => import("../views/Apicon.vue"),
      },
      {
        path: "/products",
        name: "products",
        component: () => import("../views/products/Product.vue"),
      },
      {
        path: "/products/:id",
        name: "productdetail",
        component: () => import("../views/products/ProductDetail.vue"),
      },
      {
        path: "/cart",
        name: "cart",
        component: () => import("../views/cart/Cart.vue"),
      },
      {
        path: "/my-orders",
        name: "myorders",
        component: () => import("../views/MyOrders.vue"),
        meta: { requireAuth: true, role: 1 },
      },
      {
        path: "/profile",
        name: "profile",
        component: () => import("../views/Profile.vue"),
        meta: { requireAuth: true },
      },
    ],
  },
  {
    path: "/admin",
    component: () => import("../views/admin/AdminLayout.vue"),
    meta: { requireAuth: true, roles: [0] },
    children: [
      {
        path: "products",
        name: "admin-products",
        component: () => import("../views/admin/ManageProduct.vue"),
      },
      {
        path: "orders",
        name: "admin-orders",
        component: () => import("../views/admin/ManageOrder.vue"),
      },
      {
        path: "users",
        name: "admin-users",
        component: () => import("../views/admin/ManageUser.vue"),
      },
    ],
  },
  {
    path: "/myport",
    name: "myport",
    component: () => import("../views/Myportfolio.vue"),
  },
  {
    path: "/calculate",
    name: "calculate",
    component: () => import("../views/CalculateGrade.vue"),
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../views/Login.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const protectedRoute = to.matched.some(
    (record) => record.meta.requireAuth,
  );
  const roleRoute = to.matched
    .slice()
    .reverse()
    .find(
      (record) =>
        record.meta.roles !== undefined || record.meta.role !== undefined,
    );
  const allowedRoles = roleRoute
    ? roleRoute.meta.roles || [roleRoute.meta.role]
    : null;

  if (protectedRoute && !token) {
    return next("/login");
  }

  if (
    allowedRoles &&
    !allowedRoles.some((allowedRole) => String(role) === String(allowedRole))
  ) {
    return next(role === "0" ? "/admin/products" : "/products");
  }

  next();
});

export default router;
