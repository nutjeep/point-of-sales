<template>
  <section class="bg-primary-color-1 h-screen max-w-screen flex justify-center items-center">
    <div class="bg-white p-3 rounded-lg w-[600px] flex flex-col justify-center items-center">
      <div class="w-full">
        <RouterLink to="/" class="text-start flex items-center text-sm">
          <ChevronLeftIcon class="h-4 w-4 me-1"/>
          Login
        </RouterLink>
      </div>
      <div class="p-[100px] w-full">
        <div class="mb-10 w-full">
          <InputForm v-model="email" id="email" label="Masukkan Email" type="email" placeholder="Email" input_class="w-full"/>
        </div>
        <div class="w-full flex justify-center">
          <SubmitButton @click="sendEmail" id="submit" button_name="Kirim Email" button_class="bg-black text-white"/>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import axios from 'axios';
import InputForm from '@/components/form/InputForm.vue';
import SubmitButton from '@/components/form/SubmitButton.vue';
import { ChevronLeftIcon } from '@heroicons/vue/24/solid';
import { validationEmail } from '@/helpers/validation';

export default {
  name: 'LoginView',
  components: {
    InputForm, SubmitButton, ChevronLeftIcon
  },
  data() {
    return {
      email: '',
    }
  },
  methods: {
    validationEmail,
    
    async sendEmail() {
      if(!validationEmail(this.email)) {
        this.errorMessage = 'Format email tidak valid';
        return;
      }
      try {
        const response = await axios.post(`${process.env.VUE_APP_ROOT_API}/auth/forget`, {
          email: this.email,
          password: this.password
        });

        if(response.data.status == 'success') {
          const token = response.data.data.token;

          localStorage.setItem('auth_token', token);
          this.$router.push('/dashboard');
        } else {
          this.errorMessage = response.data.message;
        }
      }
      catch(error) {
        this.errorMessage = 'Email atau Password salah';
      }
    },
  }
}
</script>