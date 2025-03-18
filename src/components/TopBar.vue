<template>
    <div
      id="overlay"
      class="fixed inset-0 bg-black bg-opacity-30 z-30"
      :class="{ 'hidden': !isBlur }"
    ></div>

    <transition name="fade">
        <AlertConfirmation
            v-if="alert_confirmation"
            @confirmNo="handle_clicked_no"
            @confirmYes="handle_clicked_yes"
            :animation_class="animation_alert_confirmation_class"
            text="Keluar Aplikasi?"
            text_class="text-xl font-medium" />
    </transition>

    <section class="bg-primary-color-1 px-6 py-4 flex justify-between items-center w-full z-40 h-[70px] fixed">
        <div class="flex items-center">
            <div id="open-sidebar" class="flex flex-col w-8 h-10 py-2 justify-between cursor-pointer me-5" @click="toggleSidebar">
                <span class="bg-white rounded-full h-[3px]"></span>
                <span class="bg-white rounded-full h-[3px]"></span>
                <span class="bg-white rounded-full h-[3px]"></span>
            </div>
        </div>
        <div class="w-full">
            <h1 class="text-white text-center font-bold text-lg capitalize">{{ pageTitle }}</h1>
        </div>
        <button id="logout" @click="logout()">
            <ArrowRightStartOnRectangleIcon class="h-6 w-6 text-white"/>
        </button>
    </section>
</template>

<script>
import { ArrowRightStartOnRectangleIcon } from '@heroicons/vue/24/solid';
import AlertConfirmation from '@/components/alerts/AlertConfirmation.vue';

export default {
    name: 'TopBar',
    emits: ['toggleBlur'],
    props: {
        pageTitle: [Object, String],
    },
    data() {
        return {
            isBlur: false,
            isProfileDropdownOpen: false,
            alert_confirmation: false,
            animation_alert_confirmation_class: ''
        }
    },
    components: {
        AlertConfirmation,
        ArrowRightStartOnRectangleIcon
    },
    methods: {
        toggleSidebar() {
            this.$parent.$refs.sidebar.toggleSidebar();
            this.$emit('toggleBlur');
        },
        toggleProfileDropdown() {
            this.isProfileDropdownOpen = !this.isProfileDropdownOpen;
            if (this.isProfileDropdownOpen) {
                document.addEventListener('click', this.closeProfileDropdown);
            }
        },
        closeProfileDropdown(event) {
            if (event && this.$refs.profileDropdown && !this.$refs.profileDropdown.contains(event.target)) {
                this.isProfileDropdownOpen = false;
                document.removeEventListener('click', this.closeProfileDropdown);
            }
        },
        logout() {
            this.isBlur = true;
            this.showAlertConfirmation();
        },
        showAlertConfirmation() {
            this.alert_confirmation = true;
            this.animation_alert_confirmation_class =  'animate__backInDown';
        },
        handle_clicked_no(){
            this.isBlur = false;
            this.alert_confirmation = true;
            this.animation_alert_confirmation_class =  'animate__backOutUp';
        },
        handle_clicked_yes() {
            localStorage.clear();
            this.$router.push('/');
        }
    },
}
</script>