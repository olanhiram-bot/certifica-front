<template>
  <Modal
    ref="modal"
    modal-id="modalEvidenciaCompleta"
    title="Evidencias cargadas correctamente"
    dialog-header-extra-class="header-naranja"
  >
    <template #body>
      <p class="mb-4">
        Todas las evidencias han sido cargadas correctamente. Tu expediente ha sido enviado a
        revisión. Podrás consultar su estatus en el dashboard y recibirás notificaciones en
        caso de observaciones.
      </p>
      <div class="text-center">
        <img
          :src="tarjeta2Img"
          alt="Evidencias completadas"
          class="img-fluid modal-ilustracion"
        />
      </div>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Modal from '@/components/Modal.vue'
import tarjeta2Img from '@/assets/images/tarjeta2.png'

const modal = ref<InstanceType<typeof Modal> | null>(null)
const router = useRouter()
let autoCloseTimer: ReturnType<typeof setTimeout> | null = null

const showModal = () => {
  modal.value?.showModal()

  const el = document.getElementById('modalEvidenciaCompleta')
  if (!el) return

  el.addEventListener(
    'shown.bs.modal',
    () => {
      autoCloseTimer = setTimeout(() => {
        autoCloseTimer = null
        // Primero esperar a que el modal se cierre completamente, luego navegar
        el.addEventListener('hidden.bs.modal', () => router.push('/usuario/dashboard'), { once: true })
        modal.value?.hideModal()
      }, 5000)
    },
    { once: true },
  )
}

const hideModal = () => {
  if (autoCloseTimer !== null) {
    clearTimeout(autoCloseTimer)
    autoCloseTimer = null
  }
  modal.value?.hideModal()
}

defineExpose({ showModal, hideModal })
</script>

<style scoped>
:deep(.header-naranja .modal-title) {
  color: #f37021;
  font-weight: 700;
}

.modal-ilustracion {
  max-height: 220px;
  object-fit: contain;
}
</style>
