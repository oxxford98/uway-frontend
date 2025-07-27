<template>
  <div class="min-h-screen flex items-center justify-center bg-surface-50 dark:bg-surface-900 p-4">
    <Toast />
    <Card class="w-full max-w-2xl">
      <template #header>
        <div class="text-center py-6">
          <h1 class="text-3xl font-bold text-surface-900 dark:text-surface-0 mb-2">
            Registro de Usuario
          </h1>
          <p class="text-surface-600 dark:text-surface-300">
            Complete su información personal y académica
          </p>
        </div>
      </template>

      <template #content>
        <form @submit.prevent="submitForm" class="space-y-6">
          <!-- Información Personal -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Email -->
            <div class="flex flex-col gap-2">
              <InputText 
                v-model="formData.email" 
                type="email"
                class="w-full"
                :invalid="!formData.email && saveAttempted"
                placeholder="Ingrese su email"
              />
              <label class="text-sm font-medium text-surface-700 dark:text-surface-300">
                Email <span class="text-red-500">*</span>
              </label>
              <small v-if="!formData.email && saveAttempted" class="text-red-500">
                El email es requerido
              </small>
            </div>

            <!-- Username -->
            <div class="flex flex-col gap-2">
              <InputText 
                v-model="formData.username" 
                class="w-full"
                :invalid="!formData.username && saveAttempted"
                placeholder="Ingrese su nombre de usuario"
              />
              <label class="text-sm font-medium text-surface-700 dark:text-surface-300">
                Nombre de Usuario <span class="text-red-500">*</span>
              </label>
              <small v-if="!formData.username && saveAttempted" class="text-red-500">
                El nombre de usuario es requerido
              </small>
            </div>

            <!-- Password -->
            <div class="flex flex-col gap-2">
              <Password 
                v-model="formData.password" 
                class="w-full"
                :invalid="!formData.password && saveAttempted"
                placeholder="Ingrese su contraseña"
                toggleMask
              />
              <label class="text-sm font-medium text-surface-700 dark:text-surface-300">
                Contraseña <span class="text-red-500">*</span>
              </label>
              <small v-if="!formData.password && saveAttempted" class="text-red-500">
                La contraseña es requerida
              </small>
            </div>

            <!-- Second Name (Opcional) -->
            <div class="flex flex-col gap-2">
              <InputText 
                v-model="formData.second_name" 
                class="w-full"
                placeholder="Segundo nombre (opcional)"
              />
              <label class="text-sm font-medium text-surface-700 dark:text-surface-300">
                Segundo Nombre
              </label>
            </div>

            <!-- Second Last Name (Opcional) -->
            <div class="flex flex-col gap-2">
              <InputText 
                v-model="formData.second_last_name" 
                class="w-full"
                placeholder="Segundo apellido (opcional)"
              />
              <label class="text-sm font-medium text-surface-700 dark:text-surface-300">
                Segundo Apellido
              </label>
            </div>

            <!-- Identification Document -->
            <div class="flex flex-col gap-2">
              <InputText 
                v-model="formData.identification_document" 
                class="w-full"
                :invalid="!formData.identification_document && saveAttempted"
                placeholder="Número de documento"
              />
              <label class="text-sm font-medium text-surface-700 dark:text-surface-300">
                Documento de Identificación <span class="text-red-500">*</span>
              </label>
              <small v-if="!formData.identification_document && saveAttempted" class="text-red-500">
                El documento de identificación es requerido
              </small>
            </div>
          </div>

          <!-- Información de Contacto -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Address -->
            <div class="flex flex-col gap-2">
              <InputText 
                v-model="formData.address" 
                class="w-full"
                :invalid="!formData.address && saveAttempted"
                placeholder="Dirección completa"
              />
              <label class="text-sm font-medium text-surface-700 dark:text-surface-300">
                Dirección <span class="text-red-500">*</span>
              </label>
              <small v-if="!formData.address && saveAttempted" class="text-red-500">
                La dirección es requerida
              </small>
            </div>

            <!-- Phone Number -->
            <div class="flex flex-col gap-2">
              <InputText 
                v-model="formData.phone_number" 
                class="w-full"
                :invalid="!formData.phone_number && saveAttempted"
                placeholder="Número de teléfono"
              />
              <label class="text-sm font-medium text-surface-700 dark:text-surface-300">
                Teléfono <span class="text-red-500">*</span>
              </label>
              <small v-if="!formData.phone_number && saveAttempted" class="text-red-500">
                El teléfono es requerido
              </small>
            </div>
          </div>

          <!-- Información Académica -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Institutional Email (Opcional) -->
            <div class="flex flex-col gap-2">
              <InputText 
                v-model="formData.institutional_email" 
                type="email"
                class="w-full"
                placeholder="Email institucional (opcional)"
              />
              <label class="text-sm font-medium text-surface-700 dark:text-surface-300">
                Email Institucional
              </label>
            </div>

            <!-- Student Code (Opcional) -->
            <div class="flex flex-col gap-2">
              <InputText 
                v-model="formData.student_code" 
                class="w-full"
                placeholder="Código estudiantil (opcional)"
              />
              <label class="text-sm font-medium text-surface-700 dark:text-surface-300">
                Código Estudiantil
              </label>
            </div>

            <!-- University -->
            <div class="flex flex-col gap-2">
              <Dropdown 
                v-model="formData.university" 
                :options="universities" 
                optionLabel="name" 
                optionValue="id"
                placeholder="Seleccione una universidad"
                class="w-full"
                filter
                showClear
              />
              <label class="text-sm font-medium text-surface-700 dark:text-surface-300">
                Universidad
              </label>
            </div>

            <!-- Role -->
            <div class="flex flex-col gap-2">
              <Dropdown 
                v-model="formData.role" 
                :options="roles" 
                optionLabel="name" 
                optionValue="id"
                placeholder="Seleccione un rol"
                class="w-full"
                :invalid="!formData.role && saveAttempted"
              />
              <label class="text-sm font-medium text-surface-700 dark:text-surface-300">
                Rol <span class="text-red-500">*</span>
              </label>
              <small v-if="!formData.role && saveAttempted" class="text-red-500">
                El rol es requerido
              </small>
            </div>
          </div>

          <!-- Documentos (Opcionales) -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Academic Register Photo -->
            <div class="flex flex-col gap-2">
              <FileUpload 
                mode="basic" 
                name="academic_register_photo" 
                accept="image/*" 
                :maxFileSize="2000000"
                @select="onAcademicRegisterSelect"
                @clear="onAcademicRegisterClear"
                :auto="false"
                chooseLabel="Subir Registro Académico"
                class="w-full"
              />
              <label class="text-sm font-medium text-surface-700 dark:text-surface-300">
                Foto del Registro Académico <span class="text-surface-500">(Opcional)</span>
              </label>
              <small class="text-surface-500">
                Tamaño máximo: 2MB
              </small>
            </div>

            <!-- Institutional ID Photo -->
            <div class="flex flex-col gap-2">
              <FileUpload 
                mode="basic" 
                name="institutional_id_photo" 
                accept="image/*" 
                :maxFileSize="2000000"
                @select="onInstitutionalIdSelect"
                @clear="onInstitutionalIdClear"
                :auto="false"
                chooseLabel="Subir Carnet Institucional"
                class="w-full"
              />
              <label class="text-sm font-medium text-surface-700 dark:text-surface-300">
                Foto del Carnet Institucional <span class="text-surface-500">(Opcional)</span>
              </label>
              <small class="text-surface-500">
                Tamaño máximo: 2MB
              </small>
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
              label="Registrar Usuario" 
              :loading="isSubmitting"
              class="flex-1"
            />
          </div>
        </form>
      </template>
    </Card>
  </div>
</template>

<script>
import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Dropdown from 'primevue/dropdown'
import FileUpload from 'primevue/fileupload'
import Button from 'primevue/button'
import Toast from 'primevue/toast'
import { useToast } from "primevue/usetoast"
import ApiService from '@/service/ApiService.js'

ApiService.setHeader();

export default {
  setup() {
    const toast = useToast();
    return { toast };
  },
  components: {
    Card,
    InputText,
    Password,
    Dropdown,
    FileUpload,
    Button,
    Toast
  },
  data() {
    return {
      formData: {
        email: '',
        username: '',
        password: '',
        second_name: '',
        second_last_name: '',
        address: '',
        phone_number: '',
        institutional_email: '',
        student_code: '',
        identification_document: '',
        university: null,
        role: null,
        academic_register_photo: null,
        institutional_id_photo: null
      },
      saveAttempted: false,
      isSubmitting: false,
      universities: [],
      roles: []
    }
  },
  async mounted() {
    await this.loadUniversities();
    await this.loadRoles();
  },
  methods: {
    async loadUniversities() {
      try {
        // Aquí cargarás las universidades desde tu servicio
        // const response = await UniversityService.getUniversities();
        // this.universities = response.data;
        
        // Por ahora datos de ejemplo
        this.universities = [
          { id: 1, name: 'Universidad Nacional' },
          { id: 2, name: 'Universidad de los Andes' },
          { id: 3, name: 'Universidad Javeriana' }
        ];
      } catch (error) {
        console.error('Error loading universities:', error);
        this.toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar las universidades',
          life: 3000
        });
      }
    },

    async loadRoles() {
      try {
        // Aquí cargarás los roles desde tu servicio
        // const response = await RoleService.getRoles();
        // this.roles = response.data;
        
        // Por ahora datos de ejemplo
        this.roles = [
          { id: 1, name: 'Estudiante' },
          { id: 2, name: 'Docente' },
          { id: 3, name: 'Administrativo' }
        ];
      } catch (error) {
        console.error('Error loading roles:', error);
        this.toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar los roles',
          life: 3000
        });
      }
    },

    onAcademicRegisterSelect(event) {
      const file = event.files[0];
      if (file) {
        this.formData.academic_register_photo = file;
      }
    },

    onAcademicRegisterClear() {
      this.formData.academic_register_photo = null;
    },

    onInstitutionalIdSelect(event) {
      const file = event.files[0];
      if (file) {
        this.formData.institutional_id_photo = file;
      }
    },

    onInstitutionalIdClear() {
      this.formData.institutional_id_photo = null;
    },

    validateForm() {
      return this.formData.email.trim() !== '' && 
             this.formData.username.trim() !== '' && 
             this.formData.password.trim() !== '' && 
             this.formData.address.trim() !== '' && 
             this.formData.phone_number.trim() !== '' && 
             this.formData.identification_document.trim() !== '' && 
             this.formData.role !== null;
    },

    async submitForm() {
      this.saveAttempted = true;
      
      if (!this.validateForm()) {
        this.toast.add({
          severity: 'warn',
          summary: 'Campos requeridos',
          detail: 'Por favor complete todos los campos obligatorios',
          life: 3000
        });
        return;
      }

      this.isSubmitting = true;

      try {
        // Crear FormData para enviar al backend
        const formDataToSend = new FormData();
        formDataToSend.append('email', this.formData.email);
        formDataToSend.append('username', this.formData.username);
        formDataToSend.append('password', this.formData.password);
        formDataToSend.append('address', this.formData.address);
        formDataToSend.append('phone_number', this.formData.phone_number);
        formDataToSend.append('identification_document', this.formData.identification_document);
        formDataToSend.append('role', this.formData.role);

        // Campos opcionales
        if (this.formData.second_name) {
          formDataToSend.append('second_name', this.formData.second_name);
        }
        if (this.formData.second_last_name) {
          formDataToSend.append('second_last_name', this.formData.second_last_name);
        }
        if (this.formData.institutional_email) {
          formDataToSend.append('institutional_email', this.formData.institutional_email);
        }
        if (this.formData.student_code) {
          formDataToSend.append('student_code', this.formData.student_code);
        }
        if (this.formData.university) {
          formDataToSend.append('university', this.formData.university);
        }
        if (this.formData.academic_register_photo) {
          formDataToSend.append('academic_register_photo', this.formData.academic_register_photo);
        }
        if (this.formData.institutional_id_photo) {
          formDataToSend.append('institutional_id_photo', this.formData.institutional_id_photo);
        }

        // Aquí harías la llamada al API
        console.log('Datos a enviar:', this.formData);

        // Simular llamada al API
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        this.toast.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Usuario registrado exitosamente',
          life: 3000
        });

        // Redirigir después de un momento
        setTimeout(() => {
          this.$router.push('/');
        }, 1500);
        
      } catch (error) {
        console.error('Error al registrar usuario:', error);
        this.toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al registrar el usuario. Intente nuevamente.',
          life: 3000
        });
      } finally {
        this.isSubmitting = false;
      }
    },

    goBack() {
      this.$router.go(-1);
    }
  }
}
</script>

<style scoped>
/* Estilos adicionales si son necesarios */
</style>