<script setup>
import { ref, computed } from 'vue';
import { useAuthStore } from '@/stores/auth.js'
import AppMenuItem from './AppMenuItem.vue';

const store = useAuthStore();

const model = ref([
    {
        label: 'Home',
        items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/' }]
    },
    {
        label: 'Menú',
        items: [
            store.user?.is_staff
                ? { label: 'Usuarios', icon: 'pi pi-fw pi-id-card', to: '/admin/users' }
                : null,
            store.user?.is_superuser
                ? { label: 'Universidades', icon: 'pi pi-fw pi-building', to: '/admin/universities' }
                : null,
            store.user?.role === 1
                ? { label: 'Vehículos', icon: 'pi pi-fw pi-car', to: '/admin/vehicles' }
                : null,
            store.user?.role === 1
                ? { label: 'Crear Rutas', icon: 'pi pi-fw pi-plus-circle', to: '/admin/create-routes' }
                : null,
            { label: 'Rutas', icon: 'pi pi-fw pi-map', to: '/admin/routes' },
        ].filter(Boolean) 
    },
    {
        label: 'Pages',
        icon: 'pi pi-fw pi-briefcase',
        to: '/pages',
        items: [
            {
                label: 'Landing',
                icon: 'pi pi-fw pi-globe',
                to: '/landing'
            },
            {
                label: 'Auth',
                icon: 'pi pi-fw pi-user',
                items: [
                    {
                        label: 'Login',
                        icon: 'pi pi-fw pi-sign-in',
                        to: '/auth/login'
                    },
                    {
                        label: 'Error',
                        icon: 'pi pi-fw pi-times-circle',
                        to: '/auth/error'
                    },
                    {
                        label: 'Access Denied',
                        icon: 'pi pi-fw pi-lock',
                        to: '/auth/access'
                    }
                ]
            },
            {
                label: 'Crud',
                icon: 'pi pi-fw pi-pencil',
                to: '/pages/crud'
            },
            {
                label: 'Not Found',
                icon: 'pi pi-fw pi-exclamation-circle',
                to: '/pages/notfound'
            },
            {
                label: 'Empty',
                icon: 'pi pi-fw pi-circle-off',
                to: '/pages/empty'
            }
        ]
    },
]);
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
</template>

<style lang="scss" scoped></style>
