<template>
  <div class="min-h-screen flex items-center justify-center bg-surface-50 dark:bg-surface-900 p-4">
    <Toast />
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
            <label class="text-sm font-medium text-surface-700 dark:text-surface-300">
              Nombre de la Universidad <span class="text-red-500">*</span>
            </label>
            <InputText 
              v-model="formData.name" 
              class="w-full"
              :invalid="!formData.name && saveAttempted"
              placeholder="Ingrese el nombre de la universidad"
            />
            <small v-if="!formData.name && saveAttempted" class="text-red-500">
              El nombre de la universidad es requerido
            </small>
          </div>

          <!-- Ciudad -->
          <div class="flex flex-col gap-2">
            <label class="text-sm font-medium text-surface-700 dark:text-surface-300">
              Ciudad <span class="text-red-500">*</span>
            </label>
            <InputText 
              v-model="formData.city" 
              class="w-full"
              :invalid="!formData.city && saveAttempted"
              placeholder="Ingrese la ciudad"
            />
            <small v-if="!formData.city && saveAttempted" class="text-red-500">
              La ciudad es requerida
            </small>
          </div>

          <!-- Dirección -->
          <div class="flex flex-col gap-2">
            <label class="text-sm font-medium text-surface-700 dark:text-surface-300">
              Dirección <span class="text-red-500">*</span>
            </label>
            <InputText 
              v-model="formData.address" 
              class="w-full"
              :invalid="!formData.address && saveAttempted"
              placeholder="Ingrese la dirección completa"
            />
            <small v-if="!formData.address && saveAttempted" class="text-red-500">
              La dirección es requerida
            </small>
          </div>

          <div class="flex flex-col gap-2">
            <label class="text-sm font-medium text-surface-700 dark:text-surface-300">
              Número telefónico <span class="text-red-500">*</span>
            </label>
            <InputText 
              v-model="formData.phone_number" 
              class="w-full"
              :invalid="!formData.phone_number && saveAttempted"
              placeholder="Ingrese el número telefónico"
            />
            <small v-if="!formData.phone_number && saveAttempted" class="text-red-500">
              El número telefónico es requerido
            </small>
          </div>

          <!-- Email -->
          <div class="flex flex-col gap-2">
            <label class="text-sm font-medium text-surface-700 dark:text-surface-300">
              Email <span class="text-red-500">*</span>
            </label>
            <InputText 
              v-model="formData.email" 
              type="email"
              class="w-full"
              :invalid="!formData.email && saveAttempted"
              placeholder="Ingrese el email institucional"
            />
            <small v-if="!formData.email && saveAttempted" class="text-red-500">
              El email es requerido
            </small>
          </div>

          <!-- Password -->
          <div class="flex flex-col gap-2">
            <label class="text-sm font-medium text-surface-700 dark:text-surface-300">
              Contraseña <span class="text-red-500">*</span>
            </label>
            <Password 
              v-model="formData.password" 
              class="w-full"
              :invalid="!formData.password && saveAttempted"
              placeholder="Ingrese una contraseña"
              toggleMask
            />
            <small v-if="!formData.password && saveAttempted" class="text-red-500">
              La contraseña es requerida
            </small>
          </div>

          <!-- NIT -->
          <div class="flex flex-col gap-2">
            <label class="text-sm font-medium text-surface-700 dark:text-surface-300">
              NIT <span class="text-red-500">*</span>
            </label>
            <InputText 
              v-model="formData.nit" 
              class="w-full"
              :invalid="!formData.nit && saveAttempted"
              placeholder="Ingrese el NIT de la universidad"
            />
            <small v-if="!formData.nit && saveAttempted" class="text-red-500">
              El NIT es requerido
            </small>
          </div>

          <!-- Logo (Opcional) -->
          <div class="flex flex-col gap-2">
            <label class="text-sm font-medium text-surface-700 dark:text-surface-300">
              Logo de la Universidad <span class="text-surface-500">(Opcional)</span>
            </label>
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
            <small class="text-surface-500">
              Tamaño máximo: 1MB. Formatos aceptados: JPG, PNG, GIF
            </small>
          </div>

          <!-- Colores -->
          <div class="flex flex-col gap-2">
            <label class="text-sm font-medium text-surface-700 dark:text-surface-300">
              Colores Institucionales
            </label>
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
import Password from 'primevue/password'
import ApiService from '@/service/ApiService.js'
import { useToast } from "primevue/usetoast"

const router = useRouter()
const toast = useToast()

// Estado del formulario
const formData = reactive({
  name: '',
  city: '',
  address: '',
  phone_number: '',
  email: '',
  password: '',
  nit: '',
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
         formData.address.trim() !== '' &&
         formData.email.trim() !== '' &&
         formData.password.trim() !== '' &&
         formData.nit.trim() !== '' &&
         formData.phone_number.trim() !== ''
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
    formDataToSend.append('phone_number', formData.phone_number)
    formDataToSend.append('email', formData.email)
    formDataToSend.append('password', formData.password)
    formDataToSend.append('identification_document', formData.nit)
    formDataToSend.append('colors', JSON.stringify(formData.colors))
    
    if (formData.logo) {
      formDataToSend.append('logo', formData.logo)
    }

    // POST al endpoint de universidades usando ApiService
    await ApiService.post('/universities/', formDataToSend, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    toast.add({
      severity: 'success',
      summary: 'Éxito',
      detail: 'Solicitud de registro exitosa',
      life: 3000
    })

    setTimeout(() => {
      router.push('/')
    }, 1500)
    
  } catch (error) {
    console.error('Error al registrar universidad:', error)
    alert('Error al registrar la universidad. Intente nuevamente.')
  } finally {
    isSubmitting.value = false
  }
}


const goBack = () => {
  router.go(-1)
}
</script>

<style scoped>
</style>