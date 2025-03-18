<template>
  <IndexView />
  <BackButton class="mb-2 px-12 pt-6" to_url="/dashboard" />
  <PageTitle class="px-12" title="Profil"/>
  <section id="profile" class="grid grid-cols-12 gap-10 px-12 py-7">
    <SideBarProfile class="col-span-3 rounded-md" />
    <div class="profile-main col-span-9 p-10 bg-white shadow-md rounded-md">
      <div class="grid grid-cols-12 gap-8 mb-4">
        <div class="col-span-6">
          <InputText id="user-name" v-model="userName" input_class="w-full" label="Nama Lengkap" label_class="mb-1 text-color-1 block text-start" type="text" name="name" placeholder="Nama lengkap"/>
        </div>
        <div class="col-span-6">
          <InputText id="user-email" v-model="userEmail" :modelValue="userEmail" input_class="w-full" label="Email" label_class="mb-1 text-color-1 block text-start" type="email" name="email" placeholder="example@mail.com"/>
        </div>
      </div>
      <div class="grid grid-cols-12 gap-8 mb-4">
        <div class="col-span-6">
          <InputText id="user-phone" v-model="userPhoneNumber" input_class="w-full" label="No Telepon" label_class="mb-1 text-color-1 block text-start" type="text" name="no_telp" placeholder="Cth: 081234567890"/>
        </div>
      </div>
      <TextArea id="user-address" v-model="userAddress" label="Alamat Lengkap" textarea_class="mb-6" />
      <div class="grid grid-cols-12 gap-8 mb-4">
        <div class="col-span-6">
          <!-- <InputPassword id="user-current-password" v-model="currentPassword" label="Password Saat Ini" label_class="mb-1 text-color-1 block text-start" name="current_password" placeholder="Password saat ini"/> -->
        </div>
      </div>
      <div class="grid grid-cols-12 gap-8 mb-6">
        <div class="col-span-6">
          <!-- <InputPassword id="user-new-password" v-model="newPassword" label="Password Baru" label_class="mb-1 text-color-1 block text-start" name="new_password"  placeholder="Password baru"/> -->
        </div>
        <div class="col-span-6">
          <!-- <InputPassword id="user-confirm-password" v-model="passwordConfirmation" label="Konfirmasi Password Baru" label_class="mb-1 text-color-1 block text-start" name="confirm_new_password" placeholder="konfirmasi password baru"/> -->
        </div>
      </div>
      <div class="flex justify-center">
        <SubmitButton id="submit" @click="submit" button_name="Simpan" button_class="rounded-md bg-color-1 px-6 py-2 text-base font-semibold text-color-4 shadow-sm hover:bg-color-2 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-color-3 block"/>
      </div>
    </div>
  </section>
</template>

<script>
import IndexView from '@/views/IndexView.vue';
import SideBarProfile from '@/components/SideBarProfile.vue';
import InputText from '@/components/form/InputForm.vue';
import TextArea from '@/components/form/TextArea.vue';
// import InputPassword from '@/components/form/InputPassword.vue';
import SubmitButton from '@/components/form/SubmitButton.vue';
import BackButton from '@/components/buttons/BackButton.vue';
import PageTitle from '@/components/PageTitle.vue';
import { mapGetters, mapActions } from 'vuex';
import axios from 'axios';


export default {
  name: 'IndexProfileView',
  components: {
    IndexView, TextArea, SideBarProfile, InputText, SubmitButton, BackButton, PageTitle
  },
  data() {
    return {
      id: null,
      userName: '',
      userEmail: '',
      userPhoneNumber: '',
      userAddress: '',
      currentPassword: '',
      newPassword: '',
      passwordConfirmation: ''
    }
  },
  computed: {
    ...mapGetters('detail_user', ['detailUser'])
  },
  created() {
    this.$store.dispatch('detail_user/fetchUser');
  },
  watch: {
    detailUser: {
      handler(user) {
        if (user) {
          this.id = user.id
          this.userName = user.name;
          this.userEmail = user.email;
          this.userPhoneNumber = user.phone_number;
          this.userAddress = user.address;
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    ...mapActions('detail_user', ['updateUser', 'changePassword']),
    async submit() {
      try {
        if(this.currentPassword || this.newPassword || this.passwordConfirmation){
          const authResponse = await axios.post('https://example.com/api/v1/auth', {
            email: this.userEmail,
            password: this.currentPassword
          });

          if (authResponse.data.status == 'success') {
            if(this.newPassword && this.passwordConfirmation) {
              if (this.newPassword !== this.passwordConfirmation) {
                alert('Konfirmasi password tidak sesuai!');
                return;
              }
            }

            const dataPassword = {
              id: this.id,
              name: this.userName,
              email: this.userEmail,
              password: this.newPassword
            };

            await this.changePassword(dataPassword);
            alert('Password berhasil diubah!');
          }
          else {
            alert('Password saat ini tidak sesuai!');
            return;
          }
        }

        const userData = {
          id: this.id,
          name: this.userName,
          email: this.userEmail,
          phone_number: this.userPhoneNumber,
          address: this.userAddress,
        };

        await this.updateUser(userData);
        alert('Data user berhasil diubah!');
        this.$store.dispatch('detail_user/fetchUser');
      }
      catch (error) {
        alert(`Gagal mengubah data user: ${error.response.data.message || error.message}`);
      }
    }
  },
}
</script>