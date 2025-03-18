<template>
  <Topbar2 pageTitle="Tambah Pelanggan" back_url="/pelanggan" /> 
  <section class="p-6 px-40 xl:px-56 md:px-20 mt-[100px]">
    <AlertSuccess v-if="alert_success" :text="alert_text"/>
    <AlertDanger v-if="alert_danger" @closeAlertDanger="hideAlertDanger()" :text="alert_text"/>
    <div class="grid grid-cols-12 gap-10 mb-12">
      <div class="col-span-6">
        <InputForm id="customer-name" v-model="customer.name" input_class="w-full mb-5" label="Nama" label_class="mb-1 block text-start" type="text" placeholder="Nama pelanggan" :is_required="true"/>
        <InputForm id="customer-phone" v-model="customer.phone" input_class="w-full mb-5" label="No Telepon" label_class="mb-1 block text-start" type="number" placeholder="Cth: 081234567890"/>
        <InputForm id="customer-email" v-model="customer.email" input_class="w-full mb-5" label="Email" label_class="mb-1 block text-start" type="text" placeholder="Cth: example@email.com"/>
        <InputForm id="customer-birthdate" v-model="customer.birthdate" input_class="w-full mb-5" label="Tanggal Lahir" label_class="mb-1 block text-start" type="date"/>
        <div>
          <label for="" class="font-medium">Cabang <span class="text-red-700">*</span></label>
          <template v-if="userLogin.outlet_id">
            <div class="mt-2">
              <span class="uppercase bg-gray-300 rounded-lg px-3 py-1 font-medium">{{ outletName }}</span>
            </div>
          </template>
          <template v-else>
            <select v-model="customer.outlet_id" class="mt-1 block w-full text-lg flex-1 border border-gray-400 rounded-lg px-3 py-2 text-gray-500 placeholder:text-gray-300 placeholder:text-[12px] sm:text-sm sm:leading-6 focus:outline-none focus:ring focus:ring-gray-500">
              <option value="" disabled selected>Pilih Cabang</option>
              <option v-for="outlet in allOutlets" :key="outlet.id" :value="outlet.id">{{ outlet.name }}</option>
            </select>
          </template>
        </div>
        <!-- <div>
          <label class="font-medium">Gender</label>
          <div class="flex mt-2">
            <button @click="setGender('')" :class="genderButtonClass('')" class="bg-white py-2 px-3 text-sm rounded-s-lg">Disable</button>
            <button @click="setGender('male')" :class="genderButtonClass('male')" class="bg-white py-2 px-3 text-sm">Pria</button>
            <button @click="setGender('female')" :class="genderButtonClass('female')" class="bg-white py-2 px-3 text-sm rounded-e-lg">Wanita</button>
          </div>
        </div> -->
      </div>
      <div class="col-span-6">
        <div class="mb-5">
          <TextArea id="customer-address" v-model="customer.address" rows="4" label="Alamat" textarea_class="mb-5" />
        </div>
      </div>
    </div>
    <div class="grid grid-cols-12 gap-10">
      <div class="col-span-6">
      </div>
      <div class="col-span-6 flex justify-end">
        <CancelButton class="mb-10 me-3" to_url="/pelanggan" />
        <span>
          <SubmitButton
            @click="submit()"
            :loading="loadingSubmit"
            :is_disable="loadingSubmit"
            button_name="Simpan"
            button_class="bg-primary-color-2 text-white"
          />
        </span>
      </div>
    </div>
  </section>
</template>

<script>
import InputForm from '@/components/form/InputForm.vue';
import TextArea from '@/components/form/TextArea.vue';
import CancelButton from '@/components/buttons/CancelButton.vue';
import SubmitButton from '@/components/form/SubmitButton.vue';
import Topbar2 from '@/components/Topbar2.vue';
import AlertSuccess from '@/components/alerts/AlertSuccess.vue';
import AlertDanger from '@/components/alerts/AlertDanger.vue';
import { mapActions, mapGetters } from 'vuex';
import { validationEmail, validationPhoneNumber } from '@/helpers/validation';

export default {
  name: "AddCustomer",
  components: {
    TextArea, SubmitButton, CancelButton, Topbar2, InputForm, AlertSuccess, AlertDanger,
  },
  data() {
    return {
      alert_success: false,
      alert_danger: false,
      alert_text: '',

      customer: {
        id: null,
        name: '',
        email: '',
        phone: '',
        birthdate: null,
        address: '',
        outlet_id: ''
        // gender: ''
      },

      loadingSubmit: false
    }
  },
  computed: {
    ...mapGetters('outlets', ['allOutlets']),

    userLogin() {
      const user = this.$store.state.detail_user.detail_user;
      return user;
    },
    outletName() {
      if (this.userLogin.outlet_id) {
        const outlet = this.allOutlets.find(outlet => outlet.id == this.userLogin.outlet_id);
        return outlet ? outlet.name : 'Loading...';
      }
      return '';
    }
  },
  created() {
    this.$store.dispatch('outlets/fetchOutlets');
  },
  methods: {
    ...mapActions('customers', ['createCustomer']),
    validationEmail, validationPhoneNumber,

    async submit() {
      if(this.customer.phone.startsWith(62)) {
        this.alert_danger = true;
        this.alert_text = 'Format nomor telepon diawali dengan 08...';
        return;
      }
      if(this.customer.phone && this.customer.phone.startsWith('62') && !validationPhoneNumber(this.customer.phone)) {
        this.alert_danger = true;
        this.alert_text = 'Format no telepon terdiri dari 10 - 13 karakter angka';
        return;
      }
      if(this.customer.email && !validationEmail(this.customer.email)) {
        this.alert_danger = true;
        this.alert_text = 'Format email tidak valid!';
        return;
      }
      if(!this.customer.name.trim()) {
        this.alert_danger = true;
        this.alert_text = 'Nama Pelanggan harus diisi!';
        return;
      }
      if(!this.customer.outlet_id && this.$store.state.detail_user.user_login?.is_super) {
        this.alert_danger = true;
        this.alert_text = 'Harap Pilih Cabang terlebih dahulu!';
        return;
      }

      this.loadingSubmit = true;

      try {
        if(this.userLogin.outlet_id) {
          this.customer.outlet_id = this.userLogin.outlet_id;
        }
        await this.createCustomer(this.customer);
        this.alert_danger = false;
        this.alert_success = true;
        this.alert_text = 'Berhasil menambah pelanggan baru';
        setTimeout(() => {
          this.alert_success = false;
          this.$router.push('/pelanggan');
        }, 500);
      }
      catch(error) {
        this.alert_danger = true;
        this.alert_text = 'Gagal menambah pelanggan baru' + error
        console.error('Failed to create customer', error);
      }
      finally {
        this.loadingSubmit = false;
      }
    },
    hideAlertDanger() {
      this.alert_danger = false;
      this.alert_text = '';
    },
    // setGender(gender) {
    //   this.customer.gender = gender;
    // },
    // genderButtonClass(gender) {
    //   return this.customer.gender === gender ? 'bg-primary-color-3 text-white' : 'bg-white';
    // },
  },
}
</script>