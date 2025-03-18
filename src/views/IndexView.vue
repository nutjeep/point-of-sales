<template>
    <section class="mb-[70px]">
        <TopBar @toggleBlur="toggleBlur" :pageTitle="title"/>
        <SideBar ref="sidebar" @toggleBlur="toggleBlur"/>
        <div
            id="overlay"
            class="fixed inset-0 bg-black bg-opacity-30 z-40"
            :class="{ 'hidden': !isBlur }"
            @click="hideSidebar()"
        ></div>
    </section>
</template>

<script>
import SideBar from '@/components/SideBar.vue';
import TopBar from '@/components/TopBar.vue';
import VueJwtDecode from 'vue-jwt-decode';

export default {
    name: 'IndexView',
    props: {
      title: String,
   },
    components: { SideBar, TopBar },
    data() {
        return {
            isBlur: false,
            pageTitle: '',
        }
    },
    methods: {
        toggleBlur() {
            this.isBlur = !this.isBlur
        },
        hideSidebar() {
            this.$refs.sidebar.closeSidebar();
        },
    },
    async created() {
        this.$store.dispatch('detail_user/fetchUser');
        const token = localStorage.getItem('auth_token');

        const decodedToken = VueJwtDecode.decode(token);
        this.$store.commit('detail_user/setUserLogin', decodedToken);
    }
}
</script>

<style>
#overlay {
    backdrop-filter: blur(5px);
}
</style>