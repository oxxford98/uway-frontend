import AppLayout from '@/layout/AppLayout.vue';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'landing',
            component: () => import('@/views/pages/Landing.vue')
        },
        {
            path: '/admin',
            component: AppLayout,
            children: [
                {
                    path: '/admin',
                    name: 'dashboard',
                    component: () => import('@/views/Dashboard.vue')
                }
            ]
        },
        {
            path: '/pages/notfound',
            name: 'notfound',
            component: () => import('@/views/pages/NotFound.vue')
        },

        {
            path: '/auth/login',
            name: 'login',
            component: () => import('@/views/pages/auth/Login.vue')
        },
        {
            path: '/auth/access',
            name: 'accessDenied',
            component: () => import('@/views/pages/auth/Access.vue')
        },
        {
            path: '/auth/error',
            name: 'error',
            component: () => import('@/views/pages/auth/Error.vue')
        },
        {
            path: '/register/university',
            name: 'universityRegister',
            component: () => import('@/views/RegistersForms/UniversityForm.vue')
        },
        {
            path: '/register/user',
            name: 'userRegister',
            component: () => import('@/views/RegistersForms/UserForm.vue')
        },
        {
            path: '/register/driver',
            name: 'driverRegister',
            component: () => import('@/views/RegistersForms/DriverForm.vue')
        }
    ]
});

export default router;
