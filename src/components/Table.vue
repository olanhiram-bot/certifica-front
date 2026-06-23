<template>
  <div class="tabla_encabezado">
    <table class="estilo_tabla">
      <thead>
        <tr :class="theadStyle">
          <th v-for="(item, index) in thead" :key="index" scope="col">{{ item }}</th>
        </tr>
      </thead>
      <tbody>
        <slot></slot>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import type { TableProps } from '@/interfaces/TableProps'

defineProps<TableProps>()
</script>
