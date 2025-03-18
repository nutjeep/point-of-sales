<template>
   <section class="w-screen h-screen absolute flex justify-center items-center">
      <div class="modal absolute block w-5/12 bg-white shadow-lg border-t-4 border-primary-color-2 rounded-lg z-50"
         :class="{
         'animate__animated animate__zoomIn': showModal,
         'animate__animated animate__zoomOut': !showModal,
         }">
         <div class="modal-header border-b border-gray-400 justify-between flex">
            <div class="w-full py-4">
               <h5 class="text-center font-bold text-lg">Pelanggan Baru</h5>
            </div>
            <PlusIcon @click="closeModal()" class="h-6 w-6 rotate-45 cursor-pointer mt-2 mr-2" />
         </div>
         <div id="modal-body" class="p-6">
            <AlertDanger v-if="alert_danger" :text="alert_text" @closeAlertDanger="hideAlertDanger()"/>
            <InputForm v-model="customer.name" label="Nama" id="customer-name" input_class="w-full mb-3" placeholder="Nama pelanggan baru" type="text"/>
            <InputForm v-model="customer.phone" label="Nomor Telepon" id="customer-phone" input_class="w-full mb-5" placeholder="No Telepon" type="number"/>
            <div>
               <label for="" class="font-medium">Cabang</label>
               <template v-if="userLogin.outlet_id">
                  <div class="mt-2">
                  <span class="uppercase bg-gray-300 rounded-lg px-3 py-1 font-medium">{{ outletName }}</span>
                  </div>
               </template>
               <template v-else>
                  <select v-model="customer.outlet_id" class="mt-1 block w-full text-lg flex-1 border border-gray-400 rounded-lg px-3 py-2 text-gray-500 placeholder:text-gray-300 placeholder:text-[12px] sm:text-sm sm:leading-6 focus:outline-none focus:ring focus:ring-gray-500">
                  <option value="" selected>Pilih Cabang</option>
                  <option v-for="outlet in allOutlets" :key="outlet.id" :value="outlet.id">{{ outlet.name }}</option>
                  </select>
               </template>
            </div>
         </div>
         <div class="modal-footer pb-6">
            <div class="flex justify-center">
               <SubmitButton id="close-modal" button_name="Tutup" button_class="bg-gray-200 rounded-lg me-3" @click="closeModal"/>
               <SubmitButton @click="submit()" id="submit" button_name="Submit" button_class="bg-primary-color-2 text-white rounded-lg"/>
            </div>
         </div>
      </div>
   </section>
</template>
<script>
import InputForm from '../form/InputForm.vue';
import SubmitButton from '../form/SubmitButton.vue';
import AlertDanger from '../alerts/AlertDanger.vue';
import { mapActions } from 'vuex';
import { PlusIcon } from '@heroicons/vue/24/solid';
import { validationPhoneNumber } from '@/helpers/validation';
import { mapGetters } from 'vuex';

export default {
   name: 'ModalAddCustomer',
   emits: ['openAlertSuccess', 'openModalAllCustomer', 'closeModalAddCustomer'],
   components: { InputForm, SubmitButton, AlertDanger, PlusIcon },
   data() {
      return {
         showModal: true,
         alert_danger: false,
         alert_text: '',
         // transaction: {
         //    id: null,
         //    transaction_code: '',
         //    customer_id: null,
         //    payment_status: 1,
         //    transaction_note: '',
         //    customer_location: '',
         //    tax: 0,
         //    service_charge: 0,
         //    subtotal: 0,
         //    grand_total: 0,
         //    service_items: [],
         //    order_items: []
         // },
         customer: {
            id: null,
            name: '',
            email: '',
            phone: '',
            outlet_id: null
         }
      };
   },
   created() {
      this.$store.dispatch('outlets/fetchOutlets');
      if (this.userLogin.outlet_id) {
         this.customer.outlet_id = this.userLogin.outlet_id;
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
   methods: {
      ...mapActions('transactions', ['createTransaction']),
      ...mapActions('customers', ['createCustomer']),
      validationPhoneNumber,

      closeModal() {
         this.showModal = false;
         setTimeout(() => {
            this.$emit('closeModalAddCustomer');
         }, 300); 
      },
      async submit() {
         
         if(!this.customer.name || !this.customer.phone) {
            this.alert_danger = true;
            this.alert_text = 'Nama dan Nomor Telepon harus diisi!'
            return
         }
         if(!validationPhoneNumber(this.customer.phone)) {
            this.alert_danger = true;
            this.alert_text = 'Format no telepon terdiri dari 10 - 13 karakter angka';
            return;
         }
         if(!this.customer.outlet_id){
            this.alert_danger = true;
            this.alert_text = 'Cabang harus diisi!';
            return
         }
         try {
            await this.createCustomer(this.customer);
            // this.$emit('openAlertSuccess');
            this.$emit('openModalAllCustomer');
         }
         catch(error) {
            console.error(error);
            this.alert_danger = true;
            this.alert_text = error;
         }
         
         // if(this.transaction.customer_id) {
         //    await this.createTransaction(this.transaction);
         // }
         // else if(this.customer.firstName) {
         //    await this.createCustomer(this.customer);
         //    const lastCustomer = await this.fetchLastCustomer();
         //    this.transaction.customer_id = lastCustomer.id;
         //    await this.createTransaction(this.transaction);
         // }

         // const lastTransaction = await this.fetchLastTransaction();
         // console.log('last transaction: ', lastTransaction);
         // this.$emit('transactionCreated', lastTransaction);

         this.closeModal();
      },
      hideAlertDanger() {
         this.alert_danger = false;
         this.alert_text = '';
      },
   }
}
</script>