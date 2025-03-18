<template>
  <Topbar2 :pageTitle="isEdit ? 'Edit Cabang' : 'Tambah Cabang'" back_url="/outlet" /> 
  <section class="p-6 mt-[80px]">
    <AlertSuccess v-if="alert_success" :text="alert_text"/>
    <AlertDanger v-if="alert_danger" @closeAlertDanger="hideAlertDanger" :text="alert_text"/>

    <div class="w-1/2 bg-white shadow-md rounded-md p-6">
      <InputForm id="outlet-name" v-model="name" input_class="w-full mb-6" label="Kota Cabang" type="text"/>
      <InputForm id="outlet-phone-number" v-model="phone_number" input_class="w-full mb-6" label="No Telepon" type="number"/>
      <TextArea id="outlet-address" v-model="address" label="Alamat Lengkap" textarea_class="mb-8" rows="5"/>
      <div class="flex justify-center">
        <SubmitButton id="submit" @click="submitOutlet" button_name="Simpan" button_class="bg-primary-color-2 text-white rounded-lg uppercase font-medium"/>
      </div>
    </div>
  </section>
</template>

<script>
import Topbar2 from '@/components/Topbar2.vue';
import TextArea from '@/components/form/TextArea.vue';
import AlertSuccess from '@/components/alerts/AlertSuccess.vue';
import AlertDanger from '@/components/alerts/AlertDanger.vue';
import InputForm from '@/components/form/InputForm.vue';
import SubmitButton from '@/components/form/SubmitButton.vue';
import { mapActions } from 'vuex';

export default {
  name: "AddEditOutlet",
  components: {
    InputForm, TextArea, SubmitButton, Topbar2, AlertSuccess, AlertDanger
  },
  data() {
    return {
      name: '',
      address: '',
      phone_number: '',
      isEdit: false,

      alert_success: false,
      alert_danger: false,
      alert_text: '',
    }
  },
  methods: {
    ...mapActions('outlets', ['createOutlet', 'updateOutlet', 'fetchOutletById']),
    async submitOutlet() {
      try {
        const outletData = {
          id: this.id,
          name: this.name,
          address: this.address,
          phone_number: this.phone_number
        };

        if (this.isEdit) {
          await this.updateOutlet(outletData);
          this.alert_success = true;
          this.alert_text = 'Berhasil update data';
        } else {
          await this.createOutlet(outletData);
          this.alert_success = true;
          this.alert_text = 'Berhasil menambah data';
        }
        setTimeout(() => {
          this.$router.push('/outlet');
        }, 800);
      }
      catch (error) {
        console.error('Failed to create or update data', error);
        this.alert_danger = true;
        this.alert_text = error;
      }
    },
    async loadOutlet() {
      if (this.isEdit) {
        try {
          const outlet = await this.fetchOutletById(this.id);
          this.name = outlet.name;
          this.address = outlet.address;
          this.phone_number = outlet.phone_number;
        } catch (error) {
          console.error('Failed to load outlet data', error);
        }
      }
    },
    hideAlertDanger() {
      this.alert_danger = false;
      this.alert_text = '';
    },
  },
  created() {
    const outletId = this.$route.params.id;
    if (outletId) {
      this.isEdit = true;
      this.id = outletId;
      this.loadOutlet();
    }
  }
}
</script>