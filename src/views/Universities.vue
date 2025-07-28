<template>
  <Toast />
  <ConfirmDialog />
  <Card>
    <template #content>
      <div class="font-semibold text-xl mb-4">Listado de Universidades</div>
      <DataTable
        :value="universities"
        size="small"
        paginator
        :rows="10"
        :rowsPerPageOptions="[5, 10, 20, 50]"
        stripedRows
        rowHover
      >
        <template #empty>
          No hay universidades para mostrar
        </template>
        <Column field="name" header="Nombre" />
        <Column field="city" header="Ciudad" />
        <Column field="address" header="Dirección" />
        <Column field="staff_email" header="Email" />
        <Column field="logo" header="Logo" :body="logoTemplate" />
        <Column field="is_active" header="Estado" :body="statusTemplate" />
        <Column header="Acciones">
          <template #body="{data}">
            <Button
              v-if="!data.is_active"
              icon="pi pi-check-circle"
              severity="success"
              size="small"
              class="mx-1"
              @click="confirmApproveUniversity(data)"
              title="Aprobar universidad"
            />
          </template>
        </Column>
      </DataTable>
    </template>
  </Card>
</template>

<script>
import ApiService from '@/service/ApiService'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Card from 'primevue/card'
import Toast from 'primevue/toast'
import ConfirmDialog from 'primevue/confirmdialog'
import { useToast } from "primevue/usetoast"
import { useConfirm } from "primevue/useconfirm"

export default {
  name: 'Universities',
  components: {
    DataTable,
    Column,
    Button,
    Card,
    Toast,
    ConfirmDialog
  },
  data() {
    return {
      universities: [],
      toast: null,
      confirm: null
    }
  },
  mounted() {
    this.toast = useToast()
    this.confirm = useConfirm()
    this.loadUniversities()
  },
  methods: {
    async loadUniversities() {
      try {
        const { data } = await ApiService.get('/universities/to_super_admin/')
        this.universities = data
      } catch (error) {
        this.toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar las universidades', life: 3000 })
      }
    },
    logoTemplate(row) {
      if (!row.logo) return 'Sin logo'
      return `<img src="${row.logo}" alt="Logo" style="height:32px;max-width:80px;object-fit:contain;" />`
    },
    statusTemplate(row) {
      return row.is_active
        ? '<span class="text-green-600 font-semibold">Activa</span>'
        : '<span class="text-red-600 font-semibold">Pendiente</span>'
    },
    confirmApproveUniversity(university) {
      this.confirm.require({
        message: `¿Está seguro que desea aprobar la universidad "${university.name}"?`,
        header: 'Confirmar aprobación',
        icon: 'pi pi-exclamation-triangle',
        accept: async () => {
          
          await ApiService.patch(`/universities/activate/${university.id}/`)
          this.toast.add({ severity: 'success', summary: 'Aprobada', detail: `Payload: ${JSON.stringify(payload)}`, life: 3000 })
          await this.loadUniversities()
        }
      })
    }
  }
}
</script>