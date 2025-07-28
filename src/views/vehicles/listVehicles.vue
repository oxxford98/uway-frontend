<template>
  <Toast />
  <ConfirmDialog />
  <Card>
    <template #content>
      <div class="font-semibold text-xl mb-4">Listado de Vehículos</div>
      <Button 
        icon="pi pi-plus" 
        label="Nuevo Vehículo" 
        size="small" 
        class="mb-4"
        @click="openNewVehicleModal"
      />
      <DataTable
        :value="vehicles"
        size="small"
        paginator
        :rows="10"
        :rowsPerPageOptions="[5, 10, 20, 50]"
        stripedRows
        rowHover
      >
        <template #empty>
          No hay vehículos para mostrar
        </template>
        <Column field="category" header="Categoría" :body="categoryTemplate" />
        <Column field="color" header="Color" />
        <Column field="license_plate" header="Placa" />
        <Column field="brand" header="Marca" />
        <Column field="model" header="Modelo" />
        <Column field="soat_due_date" header="Vencimiento SOAT" :body="dateTemplate('soat_due_date')" />
        <Column field="technical_mechanical_due_date" header="Vencimiento Tec. Mecánica" :body="dateTemplate('technical_mechanical_due_date')" />
        <Column header="Acciones">
          <template #body="{data}">
            <Button icon="pi pi-pencil" size="small" class="mx-1" @click="editVehicle(data)" />
            <Button icon="pi pi-trash" size="small" severity="danger" class="mx-1" @click="confirmDeleteVehicle(data.id)" />
          </template>
        </Column>
      </DataTable>
    </template>
  </Card>

  <!-- Modal para crear/editar vehículo -->
  <Dialog v-model:visible="showVehicleModal" modal :header="editMode ? 'Editar Vehículo' : 'Nuevo Vehículo'" class="w-full md:w-2/3">
    <template #container>
      <form @submit.prevent="saveVehicle" class="space-y-6 p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block mb-1">Categoría</label>
            <Dropdown 
              v-model="vehicleForm.category"
              :options="categoryOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="Seleccione una categoría"
              class="w-full"
              :invalid="!vehicleForm.category && saveAttempted"
            />
          </div>
          <div>
            <label class="block mb-1">Color</label>
            <InputText v-model="vehicleForm.color" class="w-full" :invalid="!vehicleForm.color && saveAttempted" />
          </div>
          <div>
            <label class="block mb-1">Placa</label>
            <InputText v-model="vehicleForm.license_plate" class="w-full" :invalid="!vehicleForm.license_plate && saveAttempted" />
          </div>
          <div>
            <label class="block mb-1">Marca</label>
            <InputText v-model="vehicleForm.brand" class="w-full" :invalid="!vehicleForm.brand && saveAttempted" />
          </div>
          <div>
            <label class="block mb-1">Modelo</label>
            <InputText v-model="vehicleForm.model" class="w-full" :invalid="!vehicleForm.model && saveAttempted" />
          </div>
          <div>
            <label class="block mb-1">Vencimiento SOAT</label>
            <Calendar v-model="vehicleForm.soat_due_date" dateFormat="yy-mm-dd" class="w-full" :invalid="!vehicleForm.soat_due_date && saveAttempted" />
          </div>
          <div>
            <label class="block mb-1">Vencimiento Tec. Mecánica</label>
            <Calendar v-model="vehicleForm.technical_mechanical_due_date" dateFormat="yy-mm-dd" class="w-full" :invalid="!vehicleForm.technical_mechanical_due_date && saveAttempted" />
          </div>
        </div>
        <div class="flex gap-2 justify-end pt-4">
          <Button type="button" label="Cancelar" severity="secondary" @click="closeVehicleModal" />
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
import Dropdown from 'primevue/dropdown'
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
    Dropdown,
    Calendar,
    Toast,
    ConfirmDialog
  },
  setup() {
    const toast = useToast()
    const store = useAuthStore()
    const confirm = useConfirm()
    const vehicles = ref([])
    const showVehicleModal = ref(false)
    const editMode = ref(false)
    const isSaving = ref(false)
    const saveAttempted = ref(false)
    const vehicleForm = ref({
      id: null,
      category: null,
      color: '',
      license_plate: '',
      brand: '',
      model: '',
      soat_due_date: '',
      technical_mechanical_due_date: ''
    })

    const categoryOptions = [
      { value: 1, label: 'Intermunicipal' },
      { value: 2, label: 'Metropolitana' },
      { value: 3, label: 'Campus interior' }
    ]

    // Cargar vehículos del usuario logueado
    const loadVehicles = async () => {
      try {
        const userId = store.user?.id
        if (!userId) return
        const { data } = await ApiService.get(`/vehicles/by-user/${userId}`)
        vehicles.value = data
      } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los vehículos', life: 3000 })
      }
    }

    // Mostrar nombre de categoría
    const categoryTemplate = (row) => {
      const found = categoryOptions.find(opt => opt.value === row.category)
      return found ? found.label : row.category
    }

    // Formatear fechas
    const dateTemplate = (field) => (row) => {
      if (!row[field]) return ''
      return new Date(row[field]).toLocaleDateString()
    }

    // Abrir modal para nuevo vehículo
    const openNewVehicleModal = () => {
      editMode.value = false
      saveAttempted.value = false
      Object.assign(vehicleForm.value, {
        id: null,
        category: null,
        color: '',
        license_plate: '',
        brand: '',
        model: '',
        soat_due_date: '',
        technical_mechanical_due_date: ''
      })
      showVehicleModal.value = true
    }

    // Abrir modal para editar vehículo
    const editVehicle = (vehicle) => {
      editMode.value = true
      saveAttempted.value = false
      Object.assign(vehicleForm.value, { ...vehicle })
      showVehicleModal.value = true
    }

    // Cerrar modal
    const closeVehicleModal = () => {
      showVehicleModal.value = false
    }

    // Guardar vehículo (crear o editar)
    const saveVehicle = async () => {
      saveAttempted.value = true
      // Validación simple
      const v = vehicleForm.value
      if (!v.category || !v.color || !v.license_plate || !v.brand || !v.model || !v.soat_due_date || !v.technical_mechanical_due_date) {
        toast.add({ severity: 'warn', summary: 'Campos requeridos', detail: 'Complete todos los campos', life: 3000 })
        return
      }
      isSaving.value = true
      try {
        const payload = {
        ...v,
        soat_due_date: v.soat_due_date instanceof Date
            ? v.soat_due_date.toISOString().slice(0, 10)
            : v.soat_due_date,
        technical_mechanical_due_date: v.technical_mechanical_due_date instanceof Date
            ? v.technical_mechanical_due_date.toISOString().slice(0, 10)
            : v.technical_mechanical_due_date,
        driver: store.user.id
        }
        if (editMode.value) {
          // PATCH para editar
          await ApiService.patch(`/vehicles/${v.id}/`, payload)
          toast.add({ severity: 'success', summary: 'Actualizado', detail: 'Vehículo actualizado', life: 2000 })
        } else {
          // POST para crear
          await ApiService.post('/vehicles/', payload)
          toast.add({ severity: 'success', summary: 'Registrado', detail: 'Vehículo registrado', life: 2000 })
        }
        showVehicleModal.value = false
        await loadVehicles()
      } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo guardar el vehículo', life: 3000 })
      } finally {
        isSaving.value = false
      }
    }

    // Confirmar borrado
    const confirmDeleteVehicle = (id) => {
        confirm.require({
            message: '¿Está seguro de eliminar este vehículo?',
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            accept: async () => {
                try {
                    await ApiService.delete(`/vehicles/${id}/`)
                    toast.add({ severity: 'success', summary: 'Eliminado', detail: 'Vehículo eliminado', life: 2000 })
                    await loadVehicles()
                } catch (error) {
                    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el vehículo', life: 3000 })
                }
            }
        })
    }

    onMounted(() => {
      loadVehicles()
    })

    return {
      vehicles,
      showVehicleModal,
      editMode,
      vehicleForm,
      isSaving,
      saveAttempted,
      categoryOptions,
      categoryTemplate,
      dateTemplate,
      openNewVehicleModal,
      editVehicle,
      closeVehicleModal,
      saveVehicle,
      confirmDeleteVehicle
    }
  }
}
</script>