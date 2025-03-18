<template>
   <div class="w-full bg-secondary-red-1 rounded-lg py-2 px-4 flex justify-between mb-5">
      <span class="text-white flex items-center">
         <span class="font-bold me-2 flex items-center">
            <ExclamationTriangleIcon class="w-5 h-5 me-1" />
            Gagal!
         </span>
         {{ text }}
      </span>
      <button @click="hide()"><PlusIcon class="w-5 h-5 text-white rotate-45" /></button>
   </div>
</template>

<script>
import { PlusIcon, ExclamationTriangleIcon  } from '@heroicons/vue/24/solid';

export default {
   name: "AlertDanger",
   emits: ['closeAlertDanger'],
   components: {
      PlusIcon, ExclamationTriangleIcon
   },
   props: {
      text: String
   },
   methods: {
      hide() {
         this.$emit('closeAlertDanger');
      }
   }
}
</script>