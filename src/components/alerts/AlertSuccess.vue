<template>
   <div class=" bg-secondary-green-1 rounded-lg py-2 px-4 flex justify-between mb-3 transition-all duration-300 ease-in-out animate__animated" :class="alert_class">
      <span class="flex items-center text-white">
         <span class="font-bold me-2 flex items-center">
            <CheckCircleIcon class="w-5 h-5 me-1 font-bold" />
            Sukses!
         </span>
         {{ text }} 
      </span>
   </div>
</template>

<script>
import { CheckCircleIcon  } from '@heroicons/vue/24/solid';

export default {
   name: "AlertSuccess",
   components: {
      CheckCircleIcon
   },
   props: {
      text: String,
      alert_class: String
   },
}
</script>