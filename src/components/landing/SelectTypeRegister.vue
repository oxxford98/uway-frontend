<template>
  <div v-if="visible" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white dark:bg-surface-800 rounded-lg p-6 max-w-md w-full mx-4">
      <div class="text-center mb-6">
        <h2 class="text-2xl font-bold text-surface-900 dark:text-surface-0 mb-2">
          Tipo de Registro
        </h2>
        <p class="text-surface-600 dark:text-surface-300">
          Selecciona el tipo de cuenta que deseas crear
        </p>
      </div>

      <div class="space-y-4">
        <button
          @click="selectType('universidad')"
          class="w-full p-4 border-2 border-surface-200 dark:border-surface-700 rounded-lg hover:border-primary-500 transition-colors text-left"
        >
          <div class="flex items-center">
            <i class="pi pi-building text-2xl text-primary-500 mr-4"></i>
            <div>
              <h3 class="font-semibold text-surface-900 dark:text-surface-0">Universidad</h3>
              <p class="text-sm text-surface-600 dark:text-surface-300">Registro para instituciones educativas</p>
            </div>
          </div>
        </button>

        <button
          @click="selectType('conductor')"
          class="w-full p-4 border-2 border-surface-200 dark:border-surface-700 rounded-lg hover:border-primary-500 transition-colors text-left"
        >
          <div class="flex items-center">
            <i class="pi pi-car text-2xl text-primary-500 mr-4"></i>
            <div>
              <h3 class="font-semibold text-surface-900 dark:text-surface-0">Conductor</h3>
              <p class="text-sm text-surface-600 dark:text-surface-300">Registro para conductores</p>
            </div>
          </div>
        </button>

        <button
          @click="selectType('usuario')"
          class="w-full p-4 border-2 border-surface-200 dark:border-surface-700 rounded-lg hover:border-primary-500 transition-colors text-left"
        >
          <div class="flex items-center">
            <i class="pi pi-user text-2xl text-primary-500 mr-4"></i>
            <div>
              <h3 class="font-semibold text-surface-900 dark:text-surface-0">Usuario</h3>
              <p class="text-sm text-surface-600 dark:text-surface-300">Registro para usuarios regulares</p>
            </div>
          </div>
        </button>
      </div>

      <div class="mt-6 text-center">
        <button
          @click="closeModal"
          class="px-4 py-2 text-surface-600 dark:text-surface-300 hover:text-surface-900 dark:hover:text-surface-0"
        >
          Cancelar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

interface Props {
  visible: boolean
}

interface Emits {
  (e: 'close'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const router = useRouter()

const selectType = (type: 'universidad' | 'conductor' | 'usuario') => {
  const routes = {
    universidad: '/register/university',
    conductor: '/register/driver',
    usuario: '/register/user'
  }

  emit('close')
  router.push(routes[type])
}

const closeModal = () => {
  emit('close')
}
</script>