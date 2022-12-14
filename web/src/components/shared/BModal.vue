<template>
  <TransitionRoot as="template" :show="show">
    <Dialog as="div" class="relative z-10" @close="close()">
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div
          class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        ></div>
      </TransitionChild>

      <div class="fixed inset-0 z-10 overflow-y-auto">
        <div
          class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"
        >
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <DialogPanel
              class="relative transform overflow-hidden rounded-lg bg-gray-900 text-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
            >
              <DialogTitle
                class="flex flex-row items-center font-bold h-10 px-4 py-2"
                :class="{
                  'bg-red-700': type === 'danger',
                  'bg-indigo-700': type === 'default',
                }"
              >
                <slot name="dialog-title">
                  <div
                    class="flex flex-row items-center flex-grow justify-between"
                  >
                    <span>{{ title }}</span>
                    <BButton
                      @click="close()"
                      type="default-icon-only"
                      icon="x-lg"
                    ></BButton>
                  </div>
                </slot>
              </DialogTitle>
              <slot name="dialog-content"></slot>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from '@headlessui/vue'
import { BButton } from '.'

withDefaults(
  defineProps<{
    title?: string
    type?: string
    show: boolean
  }>(),
  {
    type: 'default',
  }
)

const emit = defineEmits(['update:show', 'onClose'])

function close() {
  emit('update:show', false)
  emit('onClose')
}
</script>
