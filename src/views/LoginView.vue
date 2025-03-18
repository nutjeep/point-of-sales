<template>
  <section class="bg-primary-color-1 h-screen max-w-screen flex justify-center items-center">
    <div class="bg-white rounded-lg p-[100px] w-[600px] flex flex-col justify-center items-center">
      <div class="logo mb-10 rounded-full w-[100px] h-[100px] flex justify-center items-center overflow-hidden">
        <img class="object-cover w-full h-full" src="/images/jeju_logo.webp" alt="logo jeju">
      </div>
      <span v-if="errorMessage" class="text-secondary-red-2 w-full bg-secondary-red-1 font-medium px-3 py-2 rounded-md flex items-center justify-between mb-3">
        <div class="flex items-center">
          <ExclamationTriangleIcon class="w-5 h-5 me-2"/>
          {{ errorMessage }}
        </div>
        <button @click="closeAlert()"><PlusIcon class="w-5 h-5 text-white rotate-45" /></button>
      </span>
      <div class="mb-3 w-full">
        <InputForm v-model="email" @keydown.enter="login" label="Email" type="text" placeholder="Masukkan email" input_class="w-full"/>
      </div>
      <div class="mb-3 w-full">
        <label class="font-medium">Kata Sandi</label>
        <div class="relative">
          <input v-model="password" :type="passwordInputType" @keydown.enter="login" placeholder="Masukkan kata sandi" class="block text-lg mt-1 flex-1 border border-gray-400 rounded-lg px-3 py-1 w-full text-gray-600 placeholder:text-gray-400 placeholder:text-[12px] sm:text-sm sm:leading-6 focus:outline-none focus:ring focus:ring-gray-500">
          <span class="absolute right-2 top-2">
            <EyeIcon @click="showPassword" :class="eyeIconClass + ' h-4 w-4 text-gray-600 cursor-pointer'"/>
            <EyeSlashIcon @click="hidePassword" :class="eyeSlashIconClass + ' h-4 w-4 text-gray-600 cursor-pointer'"/>
          </span>
        </div>
        <!-- <InputForm v-model="password" label="Kata Sandi" type="password" placeholder="Masukkan kata sandi" input_class="w-full"/> -->
      </div>
      <div class="flex justify-start w-full mb-10">
        <RouterLink to="/forget_password" class="text-xs text-gray-400">Lupa kata sandi?</RouterLink>
      </div>
      <div class="w-full flex justify-center">
        <SubmitButton @click="login()" button_name="Masuk" button_class="bg-black text-white"/>
      </div>
    </div>
  </section>
</template>

<script>
import axios from 'axios';
import InputForm from '@/components/form/InputForm.vue';
import SubmitButton from '@/components/form/SubmitButton.vue';
import { ExclamationTriangleIcon, PlusIcon, EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/solid';
import { validationEmail, validationPassword } from '@/helpers/validation';

export default {
  name: 'LoginView',
  components: {
    InputForm, SubmitButton,
    ExclamationTriangleIcon, PlusIcon, EyeIcon, EyeSlashIcon
  },
  data() {
    return {
      email: '',
      password: '',
      errorMessage: '',
      passwordInputType: 'password',
      eyeIconClass: '',
      eyeSlashIconClass: 'hidden'
    }
  },
  created() {
    const token = localStorage.getItem('auth_token');
    if(token) {
      this.$router.push('/dashboard');
    }
  },
  methods: {
    validationEmail, validationPassword,
    
    async login() {
      if(!this.email && !this.password) {
        this.errorMessage = 'Email dan Kata Sandi harus terisi!';
        return;
      }
      if(!validationEmail(this.email)) {
        this.errorMessage = 'Format email tidak valid';
        return;
      }
      // if(!validationPassword(this.password)) {
      //   this.errorMessage = 'Password terdiri dari min. 1 simbol dan min. 8 karakter';
      //   return;
      // }
      try {
        const response = await axios.post(`${process.env.VUE_APP_ROOT_API}/auth`, {
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
      } catch(error) {
        this.errorMessage = 'Email atau Password salah';
      }
    },
    closeAlert() {
      this.errorMessage = '';
    },
    showPassword() {
      this.passwordInputType = 'text';
      this.eyeIconClass = 'hidden';
      this.eyeSlashIconClass = '';
    },
    hidePassword() {
      this.passwordInputType = 'password';
      this.eyeIconClass = '';
      this.eyeSlashIconClass = 'hidden';
    }
  }
}
</script>