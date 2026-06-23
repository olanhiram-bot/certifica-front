import { useStampStore } from '@/stores/stamp'
import type { RouteLocationNormalized } from 'vue-router'

export default async (_to: RouteLocationNormalized): Promise<boolean | { name: string }> => {
  const stampStore = useStampStore()

  if (!stampStore.currentStamp) {
    await stampStore.fetchCurrentStamp()
  }

  if (!stampStore.hasStamp) {
    return { name: 'usuario-instrucciones' }
  }

  return true
}
