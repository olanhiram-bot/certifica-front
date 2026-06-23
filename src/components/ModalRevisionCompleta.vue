<template>
  <Modal
    ref="modal"
    modal-id="modalRevisionCompleta"
    title="Revisión completada"
    dialog-header-extra-class="header-naranja"
  >
    <template #body>
      <p class="mb-4">{{ message }}</p>
      <div class="text-center">
        <img
          :src="tarjeta2Img"
          alt="Revisión completada"
          class="img-fluid modal-ilustracion"
        />
      </div>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Modal from '@/components/Modal.vue'
import tarjeta2Img from '@/assets/images/tarjeta2.png'

type RevisionType = 'aprobado' | 'rechazado'

const modal = ref<InstanceType<typeof Modal> | null>(null)
const tipoRevision = ref<RevisionType>('aprobado')

const message = computed(() =>
  tipoRevision.value === 'rechazado'
    ? 'Las observaciones y comentarios sobre las evidencias enviadas han sido registrados correctamente. El usuario podrá consultar las anotaciones realizadas por el revisor desde el dashboard y recibirá una notificación para dar seguimiento a las observaciones correspondientes.'
    : 'Las evidencias enviadas han sido revisadas y aprobadas satisfactoriamente. El usuario ha cumplido con los criterios establecidos para continuar en el proceso de obtención del Certifica. Podrá consultar el resultado de la revisión desde el dashboard y recibir notificaciones sobre los siguientes pasos del proceso.'
)

const showModal = (tipo: RevisionType = 'aprobado', onComplete?: () => void) => {
  tipoRevision.value = tipo
  modal.value?.showModal()
  setTimeout(() => {
    modal.value?.hideModal()
    onComplete?.()
  }, 5000)
}
const hideModal = () => modal.value?.hideModal()

defineExpose({ showModal, hideModal })
</script>

<style scoped>
.modal-ilustracion {
  max-height: 220px;
  object-fit: contain;
}
</style>

