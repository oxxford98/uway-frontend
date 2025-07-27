<template>
    <FloatingConfigurator />
    <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
        <div class="flex flex-col items-center justify-center">
            <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 53px">
                    <div class="text-center mb-8">
                        <img src="/logo.png" alt="" class="mb-8 w-40 shrink-0 mx-auto">
                        <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">Bienvenido</div>
                        <span class="text-muted-color font-medium">Inicia sesión para continuar</span>
                    </div>

                    <Form @submit="attempLogin()">
                        <div>
                            <label for="email1" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Correo Electrónico</label>
                            <InputText id="email1" type="text" placeholder="Correo Electrónico" class="w-full md:w-[30rem] mb-8" v-model="email" />

                            <label for="password1" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Contraseña</label>
                            <Password id="password1" v-model="password" placeholder="Contraseña" :toggleMask="true" class="mb-4" fluid :feedback="false"></Password>

                            <Button :disabled="!statusButton" type="submit" :label="textLogin" class="w-full"></Button>
                            <Message class="mt-2" v-if="errorMessage != ''" severity="error">{{ errorMessage }}</Message>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import FloatingConfigurator from '@/components/FloatingConfigurator.vue';
import { ref } from 'vue';
import ApiService from "@/service/ApiService";
import { useAuthStore } from "@/stores/auth.js";
import { useRouter } from 'vue-router';

const store = useAuthStore();
const router = useRouter();

export default {
    name: 'Login',
    data() {
        return {
            store,
            email: '',
            password: '',
            textLogin: 'Iniciar Sesión',
            statusButton: true,
            errorMessage: '',
        };
    },
    methods: {
        attempLogin() {
            this.statusButton = false;
            this.textLogin = 'Iniciando Sesión...';
            let payload = {
                email: this.email,
                password: this.password
            }
            ApiService.post("/auth/login", payload)
            .then(({ data }) => {
                console.log(data);
                if (data.user) {
                    store.getApiToken(data);
                    this.$router.push({ name: "dashboard" });
                } else {
                    this.statusButton = true;
                    this.textLogin = 'Iniciar Sesión';
                    this.errorMessage = "Usuario o contraseña incorrectos";
                }
            })
            .catch(({ response }) => {
                this.statusButton = true;
                this.textLogin = 'Iniciar Sesión';
                this.errorMessage = "Usuario o contraseña incorrectos";
            });
        }
    },
};
</script>

<style scoped>
.pi-eye {
    transform: scale(1.6);
    margin-right: 1rem;
}

.pi-eye-slash {
    transform: scale(1.6);
    margin-right: 1rem;
}
</style>
