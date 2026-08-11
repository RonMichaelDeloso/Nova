import SignIn from '@/components/Authentication/SignIn.vue'
import SignUp from '@/components/Authentication/SignUp.vue'
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {
        path: '/signin',
        component: SignIn
    },
    {
        path: '/signup',
        component: SignUp
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router