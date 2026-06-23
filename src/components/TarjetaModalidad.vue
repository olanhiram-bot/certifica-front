<template>
    <div class="caja_tarjeta" :class="{ 'caja_tarjeta-disabled': disabled }">
        <div class="contenido_modalidad">
            <!-- Texto -->
            <div class="texto_modalidad">
                <h2>{{ data.titulo }}</h2>
                <p>{{ data.descripcion }}</p>


                <RouterLink v-if="data.botonTexto && ruta && !disabled" :to="ruta" class="boton boton_primario">{{
                    data.botonTexto }}</RouterLink>
                <div v-else-if="data.botonTexto && !disabled" class="boton boton_primario" @click="emit('click')">{{
                    data.botonTexto }}</div>
                <div v-else-if="data.botonTexto && disabled" class="boton boton_primario disabled">{{ data.botonTexto }}
                </div>
            </div>

            <!-- Imagen -->
            <div class="imagen_modalidad" :style="{ backgroundImage: `url(${data.imagen})` }" />
        </div>
    </div>
</template>

<script setup lang="ts">
import type { TarjetaModalidadData } from '@/interfaces/TarjetaModalidadData'
import type { RouteLocationRaw } from 'vue-router'

defineProps<{
    data: TarjetaModalidadData
    ruta?: RouteLocationRaw
    disabled?: boolean
}>()

const emit = defineEmits<{
    click: []
}>()
</script>

<style scoped>
.contenido_modalidad {
    display: flex;
    height: 100%;
}

/* TEXTO */
.texto_modalidad {
    width: 60%;
    padding: 24px 28px;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.texto_modalidad h2 {
    font-size: 20px;
    font-weight: 700;
    margin-bottom: 8px;
    color: #2b2b2b;
}

.texto_modalidad p {
    font-size: 14px;
    line-height: 1.5;
    color: #5f6368;
    margin-bottom: 16px;
    max-width: 280px;
}


/* IMAGEN DERECHA */
.imagen_modalidad {
    width: 40%;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
}

/* RESPONSIVE */
@media (max-width: 768px) {
    .contenido_modalidad {
        flex-direction: column;
    }

    .texto_modalidad,
    .imagen_modalidad {
        width: 100%;
    }

    .imagen_modalidad {
        min-height: 140px;
    }

    .caja_tarjeta-disabled {
        opacity: 0.6;
        pointer-events: none;
    }

    .caja_tarjeta-disabled .boton.disabled {
        background-color: #9e9e9e;
        cursor: not-allowed;
    }
}
</style>