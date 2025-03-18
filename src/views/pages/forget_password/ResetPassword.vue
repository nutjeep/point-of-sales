<template>
  <section class="bg-primary-color-1 h-screen max-w-screen flex justify-center items-center">
    <div class="bg-white p-3 rounded-lg w-[600px] flex flex-col justify-center items-center">
      <div class="w-full">
        <RouterLink to="/" id="url-login" class="text-start flex items-center text-sm">
          <ChevronLeftIcon class="h-4 w-4 me-1"/>
          Login
        </RouterLink>
      </div>
      <div class="p-[100px] w-full">
        <AlertSuccess v-if="alert_success" :text="alert_text"/>
        <AlertDanger v-if="alert_danger" @closeAlertDanger="hideAlertDanger" :text="alert_text"/>
        <div class="mb-10 w-full">
          <div class="mb-3 w-full">
            <label class="font-medium">Kata Sandi Baru</label>
            <div class="relative">
              <input 
                v-model="password" 
                :type="passwordIsVisible.password ? 'text' : 'password'"
                id="password" 
                placeholder="Kata Sandi" 
                class="block text-lg mt-1 flex-1 border border-gray-400 rounded-lg px-3 py-1 w-full text-gray-600 placeholder:text-gray-400 placeholder:text-[12px] sm:text-sm sm:leading-6 focus:outline-none focus:ring focus:ring-gray-500"
              >
              <span class="absolute right-2 top-2">
                <EyeIcon 
                  @click="togglePasswordVisibility('password')" 
                  :class="!passwordIsVisible.password ? 'h-4 w-4 text-gray-600 cursor-pointer' : 'hidden'"
                />
                <EyeSlashIcon 
                  @click="togglePasswordVisibility('password')" 
                  :class="passwordIsVisible.password ? 'h-4 w-4 text-gray-600 cursor-pointer' : 'hidden'"
                />
              </span>
            </div>
          </div>
          <div class="mb-3 w-full">
            <label class="font-medium">Konfirmasi Kata Sandi</label>
            <div class="relative">
              <input
                v-model="confirmation" 
                :type="passwordIsVisible.confirmation ? 'text' : 'password'" 
                id="confirmation" 
                placeholder="Konfirmasi Kata Sandi" 
                class="block text-lg mt-1 flex-1 border border-gray-400 rounded-lg px-3 py-1 w-full text-gray-600 placeholder:text-gray-400 placeholder:text-[12px] sm:text-sm sm:leading-6 focus:outline-none focus:ring focus:ring-gray-500"
              >
              <span class="absolute right-2 top-2">
                <EyeIcon 
                  @click="togglePasswordVisibility('confirmation')" 
                  :class="!passwordIsVisible.confirmation ? 'h-4 w-4 text-gray-600 cursor-pointer' : 'hidden'"
                />
                <EyeSlashIcon
                  @click="togglePasswordVisibility('confirmation')" 
                  :class="passwordIsVisible.confirmation ? 'h-4 w-4 text-gray-600 cursor-pointer' : 'hidden'"
                />
              </span>
            </div>
          </div>
        </div>
        <div class="w-full flex justify-center">
          <SubmitButton @click="resetPassword" id="submit" button_name="Reset Kata Sandi" button_class="bg-black text-white"/>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import axios from 'axios';
import AlertSuccess from '@/components/alerts/AlertSuccess.vue';
import AlertDanger from '@/components/alerts/AlertDanger.vue';
import SubmitButton from '@/components/form/SubmitButton.vue';
import { validationPassword } from '@/helpers/validation';
import { ChevronLeftIcon, EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/solid';

export default {
  name: "ResetPassword",
  components: {
    SubmitButton, AlertSuccess, AlertDanger,
    ChevronLeftIcon, EyeIcon, EyeSlashIcon
  },
  data() {
    return {
      token: '',
      password: '',
      confirmation: '',

      alert_success: false,
      alert_danger: false,
      alert_text: '',

      passwordIsVisible: {
        password: false,
        confirmation: false,
      }
    }
  },
  methods: {
    validationPassword,

    async resetPassword() {
      if(!validationPassword(this.password)) {
        this.errorMessage = 'Password terdiri dari min. 1 simbol dan min. 8 karakter';
        return;
      }
      if(this.confirmation !== this.password) {
        this.alert_danger = true;
        this.alert_text = 'Kata Sandi dan Konfirmasi tidak sesuai!';
        return;
      }
      try {
        await axios.post(`${process.env.VUE_APP_ROOT_API}/auth/reset`, {
          token: this.token,
          password: this.password,
          confirmation: this.confirmation,
        });

        this.alert_success = true;
        this.alert_text = "Berhasil mengganti kata sandi";

        setTimeout(() => {
          this.alert_success = false;
          this.alert_text = '';
        }, 500);
      }
      catch(error) {
        this.alert_danger = true;
        this.alert_text = "Gagal mengganti kata sandi";
        console.error('Gagal mengganti kata sandi: ', error);
      }
    },

    togglePasswordVisibility(field) {
      this.passwordIsVisible[field] = !this.passwordIsVisible[field]; // bracket notation "[]". Mengakses property pada object secara dinamis
    },

    hideAlertDanger() {
      this.alert_danger = false;
      this.alert_text = '';
    }
  },
  created() {
    this.token = this.$route.query.token;
  }
}
</script>