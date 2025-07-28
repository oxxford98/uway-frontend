<template>
  <Toast />
  <ConfirmDialog />
  <Card>
    <template #content>
      <div class="font-semibold text-xl mb-4">Listado de Usuarios</div>
      <DataTable
        :value="users"
        size="small"
        paginator
        :rows="10"
        :rowsPerPageOptions="[5, 10, 20, 50]"
        stripedRows
        rowHover
      >
        <template #empty>
          No hay usuarios para mostrar
        </template>
        <Column field="first_name" header="Nombre" />
        <Column field="last_name" header="Apellido" />
        <Column field="email" header="Email" />
        <Column field="address" header="Dirección" />
        <Column field="phone_number" header="Teléfono" />
        <Column field="identification_document" header="Documento" />
        <Column field="role_name" header="Rol" />
        <Column field="is_active" header="Estado" :body="statusTemplate" />
        <Column header="Acciones">
          <template #body="{data}">
            <Button
              v-if="!data.is_active"
              icon="pi pi-check-circle"
              severity="success"
              size="small"
              class="mx-1"
              @click="confirmApproveUser(data)"
              title="Aprobar usuario"
            />
            <Button
              icon="pi pi-eye"
              severity="info"
              size="small"
              class="mx-1"
              title="Ver detalle"
              @click="viewUserDetail(data)"
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
import { useAuthStore } from "@/stores/auth.js"

export default {
  name: 'Users',
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
      users: [],
      toast: null,
      confirm: null,
      store: null
    }
  },
  mounted() {
    this.toast = useToast()
    this.confirm = useConfirm()
    this.store = useAuthStore()
    this.loadUsers()
  },
  methods: {
    async loadUsers() {
      try {
        const universityId = this.store.user?.university
        if (!universityId) return
        const { data } = await ApiService.get(`/user/by-university/${universityId}`)
        this.users = data
      } catch (error) {
        this.toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los usuarios', life: 3000 })
      }
    },
    statusTemplate(row) {
      return row.is_active
        ? '<span class="text-green-600 font-semibold">Activo</span>'
        : '<span class="text-red-600 font-semibold">Pendiente</span>'
    },
    confirmApproveUser(user) {
      this.confirm.require({
        message: `¿Está seguro que desea aprobar el usuario "${user.first_name} ${user.last_name}"?`,
        header: 'Confirmar aprobación',
        icon: 'pi pi-exclamation-triangle',
        accept: async () => {
          // Aquí va tu servicio de aprobación
          const payload = {
            is_active: true
          }
          await ApiService.patch(`/user/${user.id}/`, payload)
          this.toast.add({ severity: 'success', summary: 'Aprobado', life: 3000 })
  
          await this.loadUsers()
        }
      })
    },
    viewUserDetail(user) {
      // Aquí irá la navegación a la vista de detalle
      // this.$router.push({ name: 'userDetail', params: { id: user.id } })
      this.toast.add({ severity: 'info', summary: 'Detalle', detail: `Ver detalle de ${user.first_name} ${user.last_name}`, life: 2000 })
    }
  }
}
</script>