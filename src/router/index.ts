import { createRouter, createWebHistory } from 'vue-router'
import AddRdv from '../views/AddRdv.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import ListRdv from '../views/ListRdv.vue'
import {supabase} from "../supabase";

const routes = [
    {
        path: '/',
        name: 'AddRdv',
        component: AddRdv,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/login',
        name: 'Login',
        component: Login
    },
    {
        path: '/register',
        name: 'Register',
        component: Register
    },
    {
        path: '/listrdv',
        name: 'ListRdv',
        component: ListRdv,
        meta: {
            requiresAuth: true
        }
    }
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

router.beforeEach(async (to, from, next) => {
    const { data: { session } } = await supabase.auth.getSession()

    if (!to.meta.requiresAuth) {
        return next()
    }

    if (session == null) next({name: 'Login'})
    else next()
})

export default router