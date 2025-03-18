<template>
   <Topbar2 pageTitle="Edit Data Pelanggan" back_url="/pelanggan" />
   <div class="tab-menu bg-white flex justify-center mt-[70px]">
      <button @click="changeTab('tab_profile')" :class="{'text-primary-color-2 font-semibold border-b-primary-color-2 border-b-2 border-primary-color-2': activeTab === 'tab_profile'}" class=" mx-6 px-5 py-3">Profil</button>
      <button @click="changeTab('tab_detail')" :class="{'text-primary-color-2 font-semibold border-b-primary-color-2 border-b-2 border-primary-color-2': activeTab === 'tab_detail'}" class=" mx-6 px-5 py-3">Detail</button>
   </div> 
   <section class="p-6">
      <!-- PROFILE TAB -->
      <section v-if="activeTab === 'tab_profile'">
         <!-- <TabProfile :customer="customer"/> -->
         <div class="flex flex-col bg-white rounded-lg mb-8 shadow-lg">
            <div class="flex justify-between p-6">
               <div class="profile flex items-center">
                  <div class="logo me-3 rounded-full bg-red-900 w-[50px] h-[50px] flex justify-center items-center overflow-hidden">
                     <img class="object-cover w-full h-full" src="/images/jeju_logo.webp" alt="logo jeju">
                  </div>
                  <div>
                     <h2 class="text-xl font-medium">{{ customer.name }}</h2>
                     <p>{{ formatCustomerId(customer.id) }}</p>
                  </div>
               </div>
               <div class="flex justify-between w-[9rem]">
                  <div class="flex flex-col items-center justify-center">
                     <!-- <div class="mb-2 flex items-center justify-center p-3 w-[50px] h-[50px] rounded-full bg-white border border-gray-50 shadow-md">
                        <ReceiptPercentIcon class="w-6 h-6 text-red-800"/>
                     </div>
                     <p class="text-sm text-center">Voucher</p> -->
                  </div>
                  <div class="flex flex-col items-center justify-center">
                     <!-- <div class="mb-2 flex items-center justify-center border p-3 w-[50px] h-[50px] rounded-full bg-white border-gray-50 shadow-md">
                        <StarIcon class="w-6 h-6 text-color-4"/>
                     </div>
                     <p class="text-sm text-center">Loyalty Point</p> -->
                  </div>
               </div>
            </div>

            <div class="bg-gray-200 rounded-lg flex flex-wrap justify-around py-4">
               <div class="m-1">
                  <h3 class="text-lg mb-1 font-medium">Total Pembelian</h3>
                  <p class="text-lg text-primary-color-3 font-medium text-center">{{ totalPembelian }}</p>
               </div>
               <div class="m-1">
                  <h3 class="text-lg mb-1 font-medium">Outstanding</h3>
                  <p class="text-lg text-primary-color-3 font-medium text-center">{{ outstanding }}</p>
               </div>
               <div class="m-1">
                  <h3 class="text-lg mb-1 font-medium">Semua Pesanan</h3>
                  <p class="text-lg text-primary-color-3 font-medium text-center">{{ semuaPesanan }}</p>
               </div>
               <div class="m-1">
                  <h3 class="text-lg mb-1 font-medium">Transaksi Selesai</h3>
                  <p class="text-lg text-primary-color-3 font-medium text-center">{{ transaksiSelesai }}</p>
               </div>
               <div class="m-1">
                  <h3 class="text-lg mb-1 font-medium">Transaksi Batal</h3>
                  <p class="text-lg text-primary-color-3 font-medium text-center">{{ transaksiBatal }}</p>
               </div>
               <!-- <div class="m-1">
                  <h3 class="text-lg mb-1 font-medium">No Show</h3>
                  <p class="text-lg text-primary-color-3 font-medium text-center">0</p>
               </div> -->
            </div>
         </div>
         <div class="tab-menu flex justify-between px-6 py mb-8">
            <div>
               <button @click="changeChildTab('tab_appointment')" :class="{'bg-primary-color-2 text-white font-medium rounded-s-lg': activeChildTab === 'tab_appointment'}" class="px-3 py-2">Appointments</button>
               <button @click="changeChildTab('tab_invoice')" :class="{'bg-primary-color-2 text-white font-medium rounded-e-lg': activeChildTab === 'tab_invoice'}" class="px-3 py-2">Invoices</button>
            </div>
            <button @click="makeNewAppointment(customer.id)" class="bg-primary-color-2 py-2 px-4 rounded-lg text-white">
               + New Appoinment
            </button>
         </div>
         <div class="bg-white rounded-lg p-6">
            <!-- TAB APPOINTMENT -->
            <section v-if="activeChildTab === 'tab_appointment'">
               <TabAppointment :id ="customer.id"/>
            </section>

            <!-- TAB INVOICE -->
            <section v-if="activeChildTab === 'tab_invoice'">
               <TabInvoice :id ="customer.id"/>
            </section>
         </div>
      </section>

      <!-- DETAIL TAB -->
      <section v-if="activeTab === 'tab_detail'">
         <TabDetail :id="customer.id"/>
      </section>
   </section>
</template>

<script>
import Topbar2 from '@/components/Topbar2.vue';
// import TabProfile from './tabs/TabProfile.vue';
import TabDetail from './tabs/TabDetail.vue';
import TabAppointment from './tabs/TabAppointment.vue';
import TabInvoice from './tabs/TabInvoice.vue';
// import { StarIcon, ReceiptPercentIcon } from '@heroicons/vue/24/solid';
import { formatRupiah, formatCustomerId } from '@/helpers/formating';
import { mapActions } from 'vuex';

export default {
   name: "EditCustomer",
   props: ['id'],
   components: {
      Topbar2, TabDetail, TabAppointment, TabInvoice,
      // StarIcon, ReceiptPercentIcon
   },
   data() { 
      return {
         activeTab: 'tab_profile',
         activeChildTab: 'tab_appointment',

         customer: {
            id: null,
            name: '',
            email: '',
            phone: '',
            birthday: '',
            address: '',
            // gender: ''
         },
         transactionsByCustomerId: null
      }
   },
   methods: {
      formatRupiah, formatCustomerId,
      ...mapActions('customers', ['fetchCustomerById']),
      ...mapActions('transactions', ['fetchTransactionByCustomerId']),

      changeTab(target) {
         this.activeTab = target;
      },
      changeChildTab(target) {
         this.activeChildTab = target;
      },
      makeNewAppointment(customer_id) {
         // console.log('customer id:', customer_id);
         this.$router.push({ name: 'AddAppoinmentWithCustomer', params: { props_customer_id: customer_id } });
      }
   },
   computed: {
      totalPembelian() {
         if (!this.transactionsByCustomerId) return '~';
         return formatRupiah(this.transactionsByCustomerId
            .filter(transaction => transaction.payment_status === 2)
            .reduce((sum, transaction) => sum + parseFloat(transaction.grand_total), 0));
      },
      outstanding() {
         if (!this.transactionsByCustomerId) return '~';
         return formatRupiah(this.transactionsByCustomerId
            .filter(transaction => transaction.payment_status === 1)
            .reduce((sum, transaction) => sum + parseFloat(transaction.grand_total), 0));
      },
      semuaPesanan() {
         if (!this.transactionsByCustomerId) return '~';
         return this.transactionsByCustomerId.length;
      },
      transaksiSelesai() {
         if (!this.transactionsByCustomerId) return '~';
         return this.transactionsByCustomerId
            .filter(transaction => transaction.payment_status === 2)
            .length;
      },
      transaksiBatal() {
         if (!this.transactionsByCustomerId) return '~';
         return this.transactionsByCustomerId
            .filter(transaction => transaction.payment_status === 3)
            .length;
      }
   },
   async created() {      
      const customerId = this.id;
      const response = await this.fetchCustomerById(customerId);
      const customerData = response.data;

      this.customer = {
         id: customerData.id,
         name: customerData.name,
         birthday: '',
         phone: customerData.phone,
         email: customerData.email,
         address: '',
         note: ''
      }

      const responseTransactions = await this.fetchTransactionByCustomerId(customerId);
      const transactionsData = responseTransactions.data;
      this.transactionsByCustomerId = transactionsData;
      // console.log('transactions by customer: ', this.transactionsByCustomerId);
   }
}
</script>