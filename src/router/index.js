import AppLayout from '@/layout/AppLayout.vue';
import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from "@/stores/auth";

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
                    component: () => import('@/views/Dashboard.vue'),
                    meta: {
                        middleware: 'auth',
                        pageTitle: 'Dashboard',
                        icon: 'pi pi-fw pi-home',
                    }
                },
                {
                    path: '/admin/users',
                    name: 'users',
                    component: () => import('@/views/Users.vue'),
                    meta: {
                        middleware: 'auth',
                        pageTitle: 'Users',
                        icon: 'pi pi-fw pi-users',
                    }
                },
                {
                    path: '/admin/universities',
                    name: 'universities',
                    component: () => import('@/views/Universities.vue'),
                    meta: {
                        middleware: 'auth',
                        pageTitle: 'Universities',
                        icon: 'pi pi-fw pi-building',
                    }
                },
                {
                    path: '/admin/vehicles',
                    name: 'vehicles',
                    component: () => import('@/views/vehicles/listVehicles.vue'),
                    meta: {
                        middleware: 'auth',
                        pageTitle: 'Vehicles',
                        icon: 'pi pi-fw pi-car',
                    }
                },
                {
                    path: '/admin/routes',
                    name: 'routes',
                    component: () => import('@/views/routes/listRoutes.vue'),
                    meta: {
                        middleware: 'auth',
                        pageTitle: 'Routes',
                        icon: 'pi pi-fw pi-map',
                    }
                },
                {
                    path: '/admin/create-routes',
                    name: 'createRoutes',
                    component: () => import('@/views/routes/createRoutes.vue'),
                    meta: {
                        middleware: 'auth',
                        pageTitle: 'Crear Rutas',
                        icon: 'pi pi-fw pi-plus-circle',
                    }
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
    ],
    scrollBehavior() {
        return { left: 0, top: 0 };
    }
});

router.beforeEach((to, from, next) => {
    const authStore = useAuthStore();

    // current page view title
    if (to.meta.pageTitle) {
        document.title = `${to.meta.pageTitle} - ${import.meta.env.VITE_APP_TITLE}`;
    } else {
        document.title = import.meta.env.VITE_APP_TITLE;
    }

    authStore.verifyAuth().then(() => {
        // before page access check if page requires authentication
        if (to.meta.middleware == 'auth') {
            if (authStore.isAuthenticated) {
                next();
            } else {
                next({ name: "login" });
            }
        } else {
            next();
        }

        // Scroll page to top on every route change
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth",
        });
    })
    .catch(() => {
        next({ name: "login" });
    });
});

export default router;
