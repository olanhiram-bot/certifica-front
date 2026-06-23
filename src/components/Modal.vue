<template>
  <teleport to="body">
    <div
      class="modal fade"
      :id="modalId"
      tabindex="-1"
      data-bs-backdrop="static"
      :aria-labelledby="`${modalId}Label`"
      aria-hidden="true"
    >
      <div :class="['modal-dialog', 'modal-dialog-centered', getSizeClass(), dialogExtraClass]">
        <div class="modal-content" :class="dialogModalContent">
          <div :class="`modal-header ${dialogHeaderExtraClass}`">
            <span
              v-if="iconHeader"
              class="material-symbols-outlined me-2"
              :class="iconHeaderClass"
              >{{ iconHeader }}</span
            >
            <h4 v-if="title !== ''" class="modal-title" :id="`${modalId}Label`">{{ title }}</h4>
            <button
              v-if="btnClosed !== false"
              type="button"
              class="btn-close"
              :class="dialogBtnClose"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body" :class="{ 'modal-body-overflow': overflow }">
            <slot name="body"></slot>
          </div>
          <div class="modal-footer">
            <div v-if="buttons && buttons.length > 0" class="d-flex gap-2 flex-wrap">
              <button
                v-for="(button, index) in buttons"
                :key="index"
                :class="['boton', getButtonClass(button.variant)]"
                :disabled="button.disabled || button.loading"
                :data-bs-dismiss="button.dismiss && !button.disabled ? 'modal' : undefined"
                @click="handleButtonClick(button)"
              >
                <span v-if="button.loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                {{ button.text }}
              </button>
            </div>
            <slot v-else name="footer"></slot>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Modal } from 'bootstrap'
import type { ModalProps, ModalButton } from '@/interfaces/ModalProps'

const props = withDefaults(defineProps<ModalProps>(), {
  btnClosed: true
})

const emits = defineEmits(['execute'])

const modalHtml = ref<InstanceType<typeof Modal>>()

onMounted(() => {
  const element = document.getElementById(props.modalId)
  if (element) {
    modalHtml.value = new Modal(element)
    element.addEventListener('hide.bs.modal', () => {
      if (element.contains(document.activeElement)) {
        (document.activeElement as HTMLElement).blur()
      }
    })
  } else {
    console.error('Modal element not found')
  }
})

const execute = () => {
  emits('execute')
}

const showModal = async () => {
  modalHtml.value?.show()
}

const hideModal = () => {
  modalHtml.value?.hide()
}

const handleButtonClick = (button: ModalButton) => {
  if (button.action) {
    button.action()
  }
}

const getButtonClass = (variant?: string): string => {
  switch (variant) {
    case 'primario':
      return 'boton_primario'
    case 'secundario':
      return 'boton_secundario'
    case 'peligro':
      return 'boton_peligro'
    case 'terciario':
    default:
      return 'boton_terciario'
  }
}

const getSizeClass = (): string => {
  switch (props.size) {
    case 'sm':
      return 'modal-sm'
    case 'lg':
      return 'modal-lg'
    case 'xl':
      return 'modal-xl'
    case 'fullscreen':
      return 'modal-fullscreen'
    default:
      return 'modal-md'
  }
}

defineExpose({
  showModal,
  hideModal,
  execute,
})
</script>

<style scoped>
.modal-fullscreen .modal-body-overflow {
  overflow-y: hidden !important;
}
</style>
