<template>
   <div
   id="overlay"
   class="fixed inset-0 bg-black bg-opacity-30 z-30"
   ></div>
</template>
<script>
export default {
   name: 'ElementOverlay',
   // props: {
   //    overlay_class: String
   // }
}
</script>
<style>
#overlay {
   backdrop-filter: blur(5px);
}
</style>