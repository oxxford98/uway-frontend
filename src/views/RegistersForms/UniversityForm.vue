<template>
  <div class="min-h-screen flex items-center justify-center bg-surface-50 dark:bg-surface-900 p-4">
    <Card class="w-full max-w-2xl">
      <template #header>
        <div class="text-center py-6">
          <h1 class="text-3xl font-bold text-surface-900 dark:text-surface-0 mb-2">
            Registro de Universidad
          </h1>
          <p class="text-surface-600 dark:text-surface-300">
            Complete la información de su institución educativa
          </p>
        </div>
      </template>

      <template #content>
        <form @submit.prevent="submitForm" class="space-y-6">
          <!-- Nombre de la Universidad -->
          <div class="flex flex-col gap-2">
            <InputText 
              v-model="formData.name" 
              class="w-full"
              :invalid="!formData.name && saveAttempted"
              placeholder="Ingrese el nombre de la universidad"
            />
            <label class="text-sm font-medium text-surface-700 dark:text-surface-300">
              Nombre de la Universidad <span class="text-red-500">*</span>
            </label>
            <small 
              v-if="!formData.name && saveAttempted" 
              class="text-red-500"
            >
              El nombre de la universidad es requerido
            </small>
          </div>

          <!-- Ciudad -->
          <div class="flex flex-col gap-2">
            <InputText 
              v-model="formData.city" 
              class="w-full"
              :invalid="!formData.city && saveAttempted"
              placeholder="Ingrese la ciudad"
            />
            <label class="text-sm font-medium text-surface-700 dark:text-surface-300">
              Ciudad <span class="text-red-500">*</span>
            </label>
            <small 
              v-if="!formData.city && saveAttempted" 
              class="text-red-500"
            >
              La ciudad es requerida
            </small>
          </div>

          <!-- Dirección -->
          <div class="flex flex-col gap-2">
            <InputText 
              v-model="formData.address" 
              class="w-full"
              :invalid="!formData.address && saveAttempted"
              placeholder="Ingrese la dirección completa"
            />
            <label class="text-sm font-medium text-surface-700 dark:text-surface-300">
              Dirección <span class="text-red-500">*</span>
            </label>
            <small 
              v-if="!formData.address && saveAttempted" 
              class="text-red-500"
            >
              La dirección es requerida
            </small>
          </div>

          <!-- Logo (Opcional) -->
          <div class="flex flex-col gap-2">
            <FileUpload 
              mode="basic" 
              name="logo" 
              accept="image/*" 
              :maxFileSize="1000000"
              @select="onLogoSelect"
              @clear="onLogoClear"
              :auto="false"
              chooseLabel="Seleccionar Logo"
              class="w-full"
            />
            <label class="text-sm font-medium text-surface-700 dark:text-surface-300">
              Logo de la Universidad <span class="text-surface-500">(Opcional)</span>
            </label>
            <small class="text-surface-500">
              Tamaño máximo: 1MB. Formatos aceptados: JPG, PNG, GIF
            </small>
          </div>

          <!-- Colores -->
          <div class="flex flex-col gap-2">
            <MultiSelect 
              v-model="formData.colors" 
              :options="availableColors" 
              optionLabel="name" 
              optionValue="value"
              placeholder="Seleccione los colores institucionales"
              class="w-full"
              :maxSelectedLabels="3"
              selectedItemsLabel="{0} colores seleccionados"
            />
            <label class="text-sm font-medium text-surface-700 dark:text-surface-300">
              Colores Institucionales
            </label>
            <small class="text-surface-500">
              Seleccione los colores que representan a su universidad
            </small>
          </div>

          <!-- Vista previa de colores seleccionados -->
          <div v-if="formData.colors.length > 0" class="flex flex-col gap-2">
            <label class="text-sm font-medium text-surface-700 dark:text-surface-300">
              Vista previa de colores:
            </label>
            <div class="flex gap-2 flex-wrap">
              <div 
                v-for="color in formData.colors" 
                :key="color"
                class="flex items-center gap-2 px-3 py-1 rounded-full border"
                :style="{ backgroundColor: color + '20', borderColor: color }"
              >
                <div 
                  class="w-4 h-4 rounded-full"
                  :style="{ backgroundColor: color }"
                ></div>
                <span class="text-sm">{{ getColorName(color) }}</span>
              </div>
            </div>
          </div>

          <!-- Botones -->
          <div class="flex gap-3 pt-4">
            <Button 
              type="button" 
              label="Cancelar" 
              severity="secondary" 
              @click="goBack"
              class="flex-1"
            />
            <Button 
              type="submit" 
              label="Registrar Universidad" 
              :loading="isSubmitting"
              class="flex-1"
            />
          </div>
        </form>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import FileUpload from 'primevue/fileupload'
import MultiSelect from 'primevue/multiselect'
import Button from 'primevue/button'

const router = useRouter()

// Estado del formulario
const formData = reactive({
  name: '',
  city: '',
  address: '',
  logo: null as File | null,
  colors: [] as string[]
})

const saveAttempted = ref(false)
const isSubmitting = ref(false)

// Colores disponibles para seleccionar
const availableColors = [
  { name: 'Azul', value: '#3B82F6' },
  { name: 'Rojo', value: '#EF4444' },
  { name: 'Verde', value: '#10B981' },
  { name: 'Amarillo', value: '#F59E0B' },
  { name: 'Púrpura', value: '#8B5CF6' },
  { name: 'Rosa', value: '#EC4899' },
  { name: 'Naranja', value: '#F97316' },
  { name: 'Cian', value: '#06B6D4' },
  { name: 'Índigo', value: '#6366F1' },
  { name: 'Gris', value: '#6B7280' },
  { name: 'Negro', value: '#1F2937' },
  { name: 'Marrón', value: '#92400E' }
]

// Función para obtener el nombre del color
const getColorName = (colorValue: string) => {
  const color = availableColors.find(c => c.value === colorValue)
  return color ? color.name : colorValue
}

// Manejo del logo
const onLogoSelect = (event: any) => {
  const file = event.files[0]
  if (file) {
    formData.logo = file
  }
}

const onLogoClear = () => {
  formData.logo = null
}

// Validación del formulario
const validateForm = () => {
  return formData.name.trim() !== '' && 
         formData.city.trim() !== '' && 
         formData.address.trim() !== ''
}

// Envío del formulario
const submitForm = async () => {
  saveAttempted.value = true
  
  if (!validateForm()) {
    return
  }

  isSubmitting.value = true

  try {
    // Crear FormData para enviar al backend
    const formDataToSend = new FormData()
    formDataToSend.append('name', formData.name)
    formDataToSend.append('city', formData.city)
    formDataToSend.append('address', formData.address)
    formDataToSend.append('colors', JSON.stringify(formData.colors))
    
    if (formData.logo) {
      formDataToSend.append('logo', formData.logo)
    }

    // Aquí harías la llamada al API
    console.log('Datos a enviar:', {
      name: formData.name,
      city: formData.city,
      address: formData.address,
      colors: formData.colors,
      logo: formData.logo
    })

    // Simular llamada al API
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Redirigir o mostrar mensaje de éxito
    alert('Universidad registrada exitosamente!')
    router.push('/')
    
  } catch (error) {
    console.error('Error al registrar universidad:', error)
    alert('Error al registrar la universidad. Intente nuevamente.')
  } finally {
    isSubmitting.value = false
  }
}

// Función para volver atrás
const goBack = () => {
  router.go(-1)
}
</script>

<style scoped>
/* Estilos adicionales si son necesarios */
</style>