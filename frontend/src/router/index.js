import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Posts from '../views/Posts.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: Home,
    children: [
      {
        path: '',
        name: 'posts',
        component: Posts,
      },
      {
        path: 'newpost',
        name: 'newpost',
        component: () => import(/* webpackChunkName: "newpost" */ '../views/NewPost.vue')
      },
      {
        path: 'post/:id',
        props: true,
        name: 'post-detail',
        component: () => import(/* webpackChunkName: "post-detail" */ '../views/PostDetail.vue')
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue')
  },
  {
    path: '/signup',
    name: 'signup',
    component: () => import(/* webpackChunkName: "signup" */ '../views/Signup.vue')
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// izvrši prije svake rute
router.beforeEach((to, from, next) => {
    // redirect to login page if not logged in and trying to access a restricted
  page
      const publicPages = ["/login", "/signup"];
      const authRequired = !publicPages.includes(to.path);
      const user = Auth.getUser();
 
   // ako je potreban login, ali nema korisnika
    if (authRequired && !user) {
    return next('/login');
    }
  next();
 })

export default router
