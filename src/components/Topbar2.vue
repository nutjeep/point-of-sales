<template>
   <section class="bg-white border border-b-2 px-6 py-4 flex justify-between items-center w-full z-30 h-[70px] fixed">
      <BackButton :to_url="back_url"/>
      <div class="w-full">
         <h1 class="text-center font-bold text-lg">{{ pageTitle }}</h1>
      </div>
   </section>
</template>

<script>
import BackButton from './buttons/BackButton.vue';
import { mapActions } from 'vuex';
import VueJwtDecode from 'vue-jwt-decode';

export default {
   name: 'TopBar',
   components: {
      BackButton
   },
   props: {
      back_url: [Object, String],
      pageTitle: String,
   },
   methods: {
      ...mapActions('detail_user', ['fetchUser'])
   },
   async created() {
      this.$store.dispatch('detail_user/fetchUser');
      const token = localStorage.getItem('auth_token');

      const decodedToken = VueJwtDecode.decode(token);
      this.$store.commit('detail_user/setUserLogin', decodedToken);
   }
}
</script>