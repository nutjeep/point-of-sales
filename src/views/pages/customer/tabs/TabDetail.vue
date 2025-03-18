<template>
  <section class="p-6 xl:px-56 md:px-20 lg:px-58">
    <AlertSuccess v-if="alert_success" :text="alert_text" />
    <AlertDanger v-if="alert_danger" @closeAlertDanger="hideAlertDanger" :text="alert_text"/>
    <div class="grid grid-cols-12 gap-10 mb-12">
      <div class="col-span-6">
        <InputForm id="customer-name" v-model="customer.name" input_class="w-full mb-5" label="Nama" label_class="mb-1 block text-start" type="text" placeholder="Nama pelanggan" :is_required="true"/>
        <InputForm id="customer-phone" v-model="customer.phone" input_class="w-full mb-5" label="No Telepon" label_class="mb-1 block text-start" type="number" placeholder="Cth: 081234567890"/>
        <InputForm id="customer-email" v-model="customer.email" input_class="w-full mb-5" label="Email" label_class="mb-1 block text-start" type="text" placeholder="Cth: example@email.com"/>
        <InputForm id="customer-birthdate" v-model="customer.birthdate" input_class="w-full mb-5" label="Tanggal Lahir" label_class="mb-1 block text-start" type="date"/>
        
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
            id="submit"
            :loading="loadingSubmit"
            :is_disable="loadingSubmit"
            button_name="Simpan"
            button_class="bg-primary-color-2 text-white"/>
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
import AlertSuccess from '@/components/alerts/AlertSuccess.vue';
import AlertDanger from '@/components/alerts/AlertDanger.vue';
import { validationEmail, validationPhoneNumber } from '@/helpers/validation';
import { mapActions } from 'vuex';

export default {
   name: "TabDetail",
   components: {
    InputForm, TextArea, CancelButton, SubmitButton, AlertSuccess, AlertDanger,
   },
   props: ['id'],
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
        // gender: ''
      },

      loadingSubmit: false
    }
  },
  methods: {
    ...mapActions('customers', ['fetchCustomerById', 'updateCustomer']),
    validationPhoneNumber, validationEmail,

    async submit() {
      if(this.customer.phone.startsWith(62)) {
        this.alert_danger = true;
        this.alert_text = 'Format nomor telepon diawali dengan 08...';
        return;
      }
      if(this.customer.phone && !validationPhoneNumber(this.customer.phone)) {
        this.alert_danger = true;
        this.alert_text = 'Format no telepon terdiri dari 10 - 13 karakter angka dan diawali dengan 08...';
        return;
      }
      if(!this.customer.name.trim()) {
        this.alert_danger = true;
        this.alert_text = 'Nama Pelanggan harus diisi!';
        return;
      }
      if(this.customer.email && !validationEmail(this.customer.email)) {
        this.alert_danger = true;
        this.alert_text = 'Format email tidak valid!';
        return;
      }

      this.loadingSubmit = true;

      if(this.id) {
        try {
          await this.updateCustomer(this.customer);
          this.alert_success = true;
          this.alert_text = 'Berhasil edit data pelanggan';
          this.alert_success_class = 'animate__fadeOut';
          setTimeout(() => {
            this.alert_success = false;
            this.$router.push('/pelanggan');
          }, 500);
        }
        catch (error) {
          this.alert_danger = true;
          this.alert_text = 'Gagal edit data pelanggan' + error
          console.error('Failed to update customer', error);
        }
        finally {
          this.loadingSubmit = false;
        }
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
  async created() {
    const customerId = this.id;
    const response = await this.fetchCustomerById(customerId);
    const customerData = response.data;
    this.customer = {
      id: customerData.id,
      name: customerData.name,
      email: customerData.email,
      phone: customerData.phone,
      birthdate: customerData.birthdate ? new Date(customerData.birthdate).toISOString().split('T')[0] : null,
      address: customerData.address,
    }
  }
}
</script>