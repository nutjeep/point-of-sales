<template>
  <section class="w-full flex justify-center absolute z-[51] top-20">
      <div :class="['bg-white rounded-lg px-10 py-8 w-[400px] shadow-md text-center border-t-primary-color-2 border-t-4 transition-all ease-in-out animate__animated', animation_class]">
         <span :class="text_class">{{ text }}</span>
         <div class="mt-6 flex justify-center">
            <button @click="clicked_no" class="py-1 px-5 rounded-lg mx-2 border border-secondary-red-1 text-secondary-red-1 hover:bg-secondary-red-1 hover:text-secondary-red-2">No</button>
            <button @click="clicked_yes" class="py-1 px-5 rounded-lg mx-2 border border-secondary-green-1 text-secondary-green-1 hover:bg-secondary-green-1 hover:text-secondary-green-2">Yes</button>
         </div>
      </div>
  </section>
</template>

<script>
export default {
   name: "AlertConfirmation",
   components: {

   },
   data() {
      return {
         yes: false,
         no: false
      }
   },
   props: {
      text: String,
      text_class: String,
      animation_class: String
   },
   methods: {
      clicked_yes() {
         this.$emit('confirmYes');
      },
      clicked_no() {
         this.$emit('confirmNo');
      }
   }
}
</script>