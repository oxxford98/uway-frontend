import { createApp } from 'vue';
import { createPinia } from "pinia";
import App from './App.vue';
import router from './router';

import ApiService from "@/service/ApiService";
import Aura from '@primeuix/themes/aura';
import PrimeVue from 'primevue/config';
import ConfirmationService from 'primevue/confirmationservice';
import ToastService from 'primevue/toastservice';
import Tooltip from 'primevue/tooltip';

import '@/assets/styles.scss';
import '@/assets/tailwind.css';

const app = createApp(App);

ApiService.init(app);
app.use(createPinia());
app.use(router);
app.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {
            darkModeSelector: '.app-dark'
        }
    },
    locale: {
        dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
        dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'],
        dayNamesMin: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá'],
        monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
        monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
        noFileChosenMessage: 'No se ha seleccionado un archivo',
        choose: 'Seleccionar Archivos',
        fileChosenMessage: '{0} Archivos',
        emptyMessage: 'No hay opciones disponibles',
    }
});
app.directive('tooltip', Tooltip);
app.use(ToastService);
app.use(ConfirmationService);

app.mount('#app');
