<template>
  <button id="add-data" :class="button_class" class="p-5 z-30 rounded-full bg-primary-color-1 w-12 h-12 flex items-center justify-center absolute shadow-lg bottom-[2rem] right-[2rem]">
    <RouterLink :to="to_url" class=" text-white absolute inset-0 flex items-center justify-center">
      <PlusIcon class="w-6 h-6" />
    </RouterLink>
  </button>
</template>

<script>
import { PlusIcon } from '@heroicons/vue/24/solid';

export default {
  name: "AddButton",
  components: {
    PlusIcon
  },
  props: {
    id: String,
    to_url: [Object, String],
    button_class: String
  }
}
</script>