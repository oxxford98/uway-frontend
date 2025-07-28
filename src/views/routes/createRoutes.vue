<template>
  <Toast />
  <ConfirmDialog />
  <Card>
    <template #content>
      <div class="font-semibold text-xl mb-4">Listado de Rutas</div>
      <Button 
        icon="pi pi-plus" 
        label="Nueva Ruta" 
        size="small" 
        class="mb-4"
        @click="openNewRouteModal"
      />
      <DataTable
        :value="routes"
        size="small"
        paginator
        :rows="10"
        :rowsPerPageOptions="[5, 10, 20, 50]"
        stripedRows
        rowHover
      >
        <template #empty>
          No hay rutas para mostrar
        </template>
        <Column field="travel_route" header="Descripción" />
        <Column field="start_route_date_time" header="Fecha y Hora de Inicio" :body="dateTimeTemplate('start_route_date_time')" />
        <Column field="start_location" header="Origen" />
        <Column field="end_location" header="Destino" />
        <Column header="Acciones">
          <template #body="{data}">
            <Button icon="pi pi-pencil" size="small" class="mx-1" @click="editRoute(data)" />
            <Button icon="pi pi-trash" size="small" severity="danger" class="mx-1" @click="confirmDeleteRoute(data.id)" />
          </template>
        </Column>
      </DataTable>
    </template>
  </Card>

  <!-- Modal para crear/editar ruta -->
  <Dialog v-model:visible="showRouteModal" modal :header="editMode ? 'Editar Ruta' : 'Nueva Ruta'" class="w-full md:w-2/3">
    <template #container>
      <form @submit.prevent="saveRoute" class="space-y-6 p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="col-span-2">
            <label class="block mb-1">Descripción de la Ruta</label>
            <InputText v-model="routeForm.travel_route" class="w-full" :invalid="!routeForm.travel_route && saveAttempted" />
          </div>
          <div>
            <label class="block mb-1">Fecha y Hora de Inicio</label>
            <Calendar 
              v-model="routeForm.start_route_date_time"
              showTime
              hourFormat="24"
              dateFormat="yy-mm-dd"
              class="w-full"
              :invalid="!routeForm.start_route_date_time && saveAttempted"
            />
          </div>
          <div>
            <label class="block mb-1">Origen</label>
            <InputText v-model="routeForm.start_location" class="w-full" :invalid="!routeForm.start_location && saveAttempted" />
          </div>
          <div>
            <label class="block mb-1">Destino</label>
            <InputText v-model="routeForm.end_location" class="w-full" :invalid="!routeForm.end_location && saveAttempted" />
          </div>
        </div>
        <div class="flex gap-2 justify-end pt-4">
          <Button type="button" label="Cancelar" severity="secondary" @click="closeRouteModal" />
          <Button type="submit" :label="editMode ? 'Actualizar' : 'Registrar'" :loading="isSaving" />
        </div>
      </form>
    </template>
  </Dialog>
</template>

<script>
import { ref, onMounted } from 'vue'
import ApiService from '@/service/ApiService'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Card from 'primevue/card'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Calendar from 'primevue/calendar'
import Toast from 'primevue/toast'
import ConfirmDialog from 'primevue/confirmdialog'
import { useToast } from "primevue/usetoast"
import { useAuthStore } from "@/stores/auth.js"
import { useConfirm } from "primevue/useconfirm"

export default {
  components: {
    DataTable,
    Column,
    Button,
    Card,
    Dialog,
    InputText,
    Calendar,
    Toast,
    ConfirmDialog
  },
  setup() {
    const toast = useToast()
    const store = useAuthStore()
    const confirm = useConfirm()
    const routes = ref([])
    const showRouteModal = ref(false)
    const editMode = ref(false)
    const isSaving = ref(false)
    const saveAttempted = ref(false)
    const routeForm = ref({
      id: null,
      travel_route: '',
      start_route_date_time: '',
      start_location: '',
      end_location: ''
    })

    // Cargar rutas del usuario logueado
    const loadRoutes = async () => {
      try {
        const userId = store.user?.id
        if (!userId) return
        const { data } = await ApiService.get(`/routes/by-user/${userId}`)
        routes.value = data
      } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar las rutas', life: 3000 })
      }
    }

    // Formatear fecha y hora
    const dateTimeTemplate = (field) => (row) => {
      if (!row[field]) return ''
      const date = new Date(row[field])
      return date.toLocaleString()
    }

    // Abrir modal para nueva ruta
    const openNewRouteModal = () => {
      editMode.value = false
      saveAttempted.value = false
      Object.assign(routeForm.value, {
        id: null,
        travel_route: '',
        start_route_date_time: '',
        start_location: '',
        end_location: ''
      })
      showRouteModal.value = true
    }

    // Abrir modal para editar ruta
    const editRoute = (route) => {
      editMode.value = true
      saveAttempted.value = false
      Object.assign(routeForm.value, { ...route })
      // Si la fecha viene como string, conviértela a Date para el Calendar
      if (typeof routeForm.value.start_route_date_time === 'string') {
        routeForm.value.start_route_date_time = new Date(routeForm.value.start_route_date_time)
      }
      showRouteModal.value = true
    }

    // Cerrar modal
    const closeRouteModal = () => {
      showRouteModal.value = false
    }

    // Guardar ruta (crear o editar)
    const saveRoute = async () => {
      saveAttempted.value = true
      const v = routeForm.value
      if (!v.travel_route || !v.start_route_date_time || !v.start_location || !v.end_location) {
        toast.add({ severity: 'warn', summary: 'Campos requeridos', detail: 'Complete todos los campos', life: 3000 })
        return
      }
      isSaving.value = true
      try {
        // Formatear fecha y hora a 'YYYY-MM-DDTHH:mm:ss'
        const payload = {
          ...v,
          start_route_date_time: v.start_route_date_time instanceof Date
            ? v.start_route_date_time.toISOString().slice(0, 19)
            : v.start_route_date_time,
          driver: store.user.id
        }
        if (editMode.value) {
          await ApiService.patch(`/routes/${v.id}/`, payload)
          toast.add({ severity: 'success', summary: 'Actualizado', detail: 'Ruta actualizada', life: 2000 })
        } else {
          await ApiService.post('/routes/', payload)
          toast.add({ severity: 'success', summary: 'Registrada', detail: 'Ruta registrada', life: 2000 })
        }
        showRouteModal.value = false
        await loadRoutes()
      } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo guardar la ruta', life: 3000 })
      } finally {
        isSaving.value = false
      }
    }

    // Confirmar borrado
    const confirmDeleteRoute = (id) => {
      confirm.require({
        message: '¿Está seguro de eliminar esta ruta?',
        header: 'Confirmar',
        icon: 'pi pi-exclamation-triangle',
        accept: async () => {
          try {
            await ApiService.delete(`/routes/${id}/`)
            toast.add({ severity: 'success', summary: 'Eliminada', detail: 'Ruta eliminada', life: 2000 })
            await loadRoutes()
          } catch (error) {
            toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar la ruta', life: 3000 })
          }
        }
      })
    }

    onMounted(() => {
      loadRoutes()
    })

    return {
      routes,
      showRouteModal,
      editMode,
      routeForm,
      isSaving,
      saveAttempted,
      dateTimeTemplate,
      openNewRouteModal,
      editRoute,
      closeRouteModal,
      saveRoute,
      confirmDeleteRoute
    }
  }
}
</script>