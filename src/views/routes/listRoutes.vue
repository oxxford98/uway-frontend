<template>
  <Toast />
  <ConfirmDialog />
  <Card>
    <template #content>
      <div class="font-semibold text-xl mb-4">Listado de Rutas Disponibles</div>
      <div class="flex gap-4 mb-4">
        <InputText v-model="filters.start_location" placeholder="Punto de partida" class="w-full md:w-1/4" />
        <InputText v-model="filters.end_location" placeholder="Punto de llegada" class="w-full md:w-1/4" />
        <InputText v-model="filters.travel_route" placeholder="Paradas" class="w-full md:w-1/4" />
        <Button label="Buscar" icon="pi pi-search" @click="searchRoutes" />
      </div>
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
        <Column field="driver_full_name" header="Conductor" />
        <Column header="Acciones">
          <template #body="{data}">
            <Button icon="pi pi-check" label="Tomar ruta" size="small" class="mx-1" @click="takeRoute(data)" />
            <Button icon="pi pi-eye" label="Ver detalle" size="small" class="mx-1" severity="info" />
          </template>
        </Column>
      </DataTable>
    </template>
  </Card>
</template>

<script>
import { ref, onMounted } from 'vue'
import ApiService from '@/service/ApiService'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
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
    InputText,
    Toast,
    ConfirmDialog
  },
  setup() {
    const toast = useToast()
    const store = useAuthStore()
    const confirm = useConfirm()
    const routes = ref([])
    const filters = ref({
      start_location: '',
      end_location: '',
      travel_route: ''
    })

    const loadRoutes = async () => {
      try {
        const universityId = store.user?.university
        if (!universityId) return
        const { data } = await ApiService.get(`/routes/available-by-university/${universityId}`)
        routes.value = data
      } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar las rutas', life: 3000 })
      }
    }

    const dateTimeTemplate = (field) => (row) => {
      if (!row[field]) return ''
      const date = new Date(row[field])
      return date.toLocaleString()
    }

    const takeRoute = (route) => {
      confirm.require({
        message: `¿Está seguro que desea tomar la ruta seleccionada?`,
        header: 'Confirmar',
        icon: 'pi pi-exclamation-triangle',
        accept: async () => {
          try {
            await ApiService.post('/route_users/', {
              route: route.id,
              user: store.user.id
            })
            toast.add({ severity: 'success', summary: 'Tomada', detail: 'Ruta tomada exitosamente', life: 2000 })
            await loadRoutes()
          } catch (error) {
            toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo tomar la ruta', life: 3000 })
          }
        }
      })
    }

    const searchRoutes = async () => {
      await loadRoutes()
    }

    onMounted(() => {
      loadRoutes()
    })

    return {
      routes,
      filters,
      dateTimeTemplate,
      takeRoute,
      searchRoutes
    }
  }
}
</script>