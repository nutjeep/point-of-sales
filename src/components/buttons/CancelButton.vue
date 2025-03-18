<template>
   <RouterLink :to="to_url" id="back-button" class="bg-gray-200 py-2 px-4 rounded-lg">
      Batal
   </RouterLink>
</template>

<script>

export default {
   name: 'BackButton',
   props: {
      to_url: String,
   }
}
</script>