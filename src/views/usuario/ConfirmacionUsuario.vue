<template>
  <div class="contenedor_general">
    <BreadcrumVue />
    <CajaDatosVue />
    <br>
    <AlertaVue tipo="error" :data="confirmacionData" />
    <TextoFijoVue :data="requisitosminimos" />
    <TextoFijoVue :data="instituciones" />
    <CajaInstitucionVue :instituciones="institucionesData" />
    <br>
    <TextoFijoVue :data="criterios" />
    <AlertaVue tipo="warning" :data="continuarUsuarioData" :mostrar-icono="false" :mostrar-cerrar="false" />
    <TextoFijoVue :data="cumplir" />
    <div class="boton boton_primario" @click="realizarConCertifica">Realizar con Plataforma Certifica</div>
    <TextoFijoVue :data="confirmacion" @update:checkbox="handleCheckboxChange" />
    <div class="botones-acciones">
      <div class="boton boton_secundario" @click="regresar">Regresar</div>
      <div class="boton boton_primario" :class="{ 'boton_disabled': !checkboxConfirmado }" @click="openModal">Continuar
      </div>
    </div>

    <ModalVue ref="modalRef" modal-id="modalidad-1" title="Acreditar la capacitación mediante certificación externa"
      :buttons="modalButtons" @hidden="resetModalCheckbox" size="lg">
      <template #body>
        <h5>Nueva capacitación de Certifica por realizar a través de un Usuario.</h5>
        <div class="elemento_forma caja_checkbox">
          <label class="checkbox">
            <input type="checkbox" id="checkboxModal" v-model="checkboxModalConfirmado" />
            Al aceptar confirmo que revisé los requisitos de la modalidad seleccionada.
          </label>
        </div>
      </template>
    </ModalVue>

    <ModalVue ref="modalCertificaRef" modal-id="certifica" title="Plataforma Certifica"
      :buttons="modalCertificaButtons">
      <template #body>
        <p>Esta es la modalidad de certificación directa con el Plataforma Certifica.</p>
      </template>
    </ModalVue>

    <ModalVue ref="modalGraciasRef" modal-id="modal-gracias" :btn-closed="false" :buttons="[]" size="lg">
      <template #body>
        <div class="text-center py-3">
          <h1>Gracias</h1>

          <img src="@/assets/images/gracias_modal.png" alt="Gracias" class="img-fluid" style="max-width: 150px;" />
          <h2>Tu capacitación ha sido guardada.</h2>
        </div>
      </template>
    </ModalVue>

  </div>
</template>

<script setup lang="ts">
import AlertaVue from '@/components/Alerta.vue'
import BreadcrumVue from '@/components/Breadcrum.vue'
import CajaDatosVue from '@/components/CajaDatos.vue'
import CajaInstitucionVue from '@/components/CajaInstitucion.vue'
import ModalVue from '@/components/Modal.vue'
import TextoFijoVue from '@/components/TextoFijo.vue'

import type { ModalButton } from '@/interfaces/ModalProps'

import { useLandingStore } from '@/stores/landing'
import { useLoadingStore } from '@/stores/loading'
import { useStampStore } from '@/stores/stamp'
import { storeToRefs } from 'pinia'
import { onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toast-notification'

import { confirmacionData, continuarUsuarioData } from '@/data/alertaData'
import { confirmacion, criterios, cumplir, instituciones, requisitosminimos } from '@/data/textoFijoData'

const $toast = useToast()
const router = useRouter()
const landingStore = useLandingStore()
const loadingStore = useLoadingStore()
const stampStore = useStampStore()
const { instituciones: institucionesData } = storeToRefs(landingStore)

onMounted(async () => {
  loadingStore.setLoading('Cargando...')
  try {
    await landingStore.fetchInstituciones()
  } finally {
    loadingStore.clearLoading()
  }
})
const modalRef = ref<InstanceType<typeof ModalVue> | null>(null)
const modalCertificaRef = ref<InstanceType<typeof ModalVue> | null>(null)
const modalGraciasRef = ref<InstanceType<typeof ModalVue> | null>(null)
const checkboxConfirmado = ref(false)
const checkboxModalConfirmado = ref(false)

const handleCheckboxChange = (value: boolean) => {
  checkboxConfirmado.value = value
}

const regresar = () => {
  router.push({ name: 'usuario-instrucciones' })
}

const resetModalCheckbox = () => {
  checkboxModalConfirmado.value = false
}

const removeBackdrops = () => {
  document.querySelectorAll('.modal-backdrop').forEach((el) => el.remove())
  document.body.classList.remove('modal-open')
  document.body.style.removeProperty('overflow')
  document.body.style.removeProperty('padding-right')
}

const navigateToDashboard = () => {
  removeBackdrops()
  router.push({ name: 'usuario-dashboard' })
}

watch(checkboxModalConfirmado, (newValue) => {
  const acceptButton = modalButtons.value[1]
  if (acceptButton) {
    acceptButton.disabled = !newValue
  }
})

const realizarConCertifica = () => {
  modalCertificaRef.value?.showModal()
}

const openModalCertifica = async () => {
  modalCertificaRef.value?.hideModal()
  loadingStore.setLoading('Creando certificación...')
  try {
    await stampStore.createNewStamp(1)
    setTimeout(() => {
      removeBackdrops()
      modalGraciasRef.value?.showModal()
      setTimeout(() => {
        navigateToDashboard()
      }, 2000)
    }, 150)
  } catch {
    $toast.error('Error al iniciar la certificación. Intenta de nuevo.')
  } finally {
    loadingStore.clearLoading()
  }
}

const openModal = () => {
  if (!checkboxConfirmado.value) {
    return
  }
  modalRef.value?.showModal()
}

const modalButtons = ref<ModalButton[]>([
  {
    text: 'En otro momento',
    variant: 'secundario',
    dismiss: true,
    action: () => {
    }
  },
  {
    text: 'Aceptar',
    variant: 'primario',
    dismiss: true,
    disabled: true,
    action: async () => {
      modalRef.value?.hideModal()
      loadingStore.setLoading('Creando certificación...')
      try {
        await stampStore.createNewStamp(2)
        setTimeout(() => {
          removeBackdrops()
          modalGraciasRef.value?.showModal()
          setTimeout(() => {
            navigateToDashboard()
          }, 2000)
        }, 150)
      } catch {
        $toast.error('Error al iniciar la certificación. Intenta de nuevo.')
      } finally {
        loadingStore.clearLoading()
      }
    }
  }
])

const modalCertificaButtons: ModalButton[] = [
  {
    text: 'Cancelar',
    variant: 'secundario',
    dismiss: true,
action: () => {
      openModalCertifica()
    }
  },
  {
    text: 'Continuar',
    variant: 'primario',
    dismiss: true,
    action: () => {
      openModalCertifica()
    }
  }
]
</script>

<style scoped>
.confirmacion-usuario {
  padding: 2rem;
}

.boton.boton_disabled,
.boton_disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

.boton:not(.boton_disabled):hover {
  opacity: 0.9;
}

.botones-acciones {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}
</style>
