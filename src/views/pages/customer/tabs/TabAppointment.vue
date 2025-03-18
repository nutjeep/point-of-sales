<template>
   <div>
      <div class="mb-8">
         <h3 class="font-medium mb-1 text-lg">Transaksi Akan Datang</h3>
         <table class="w-full">
            <thead class="bg-gray-100">
               <tr>
                  <th class="px-2 py-1 border font-medium text-center">No</th>
                  <th class="px-2 py-1 border font-medium text-left">Tanggal</th>
                  <th class="px-2 py-1 border font-medium text-left">Produk</th>
                  <th class="px-2 py-1 border font-medium text-left">Staff</th>
                  <th class="px-2 py-1 border font-medium text-left">Total</th>
                  <th class="px-2 py-1 border font-medium text-center">Status</th>
               </tr>
            </thead>
            <tbody>
               <tr v-if="upcomingTransactions.length <= 0">
                  <td colspan="6" class="text-center pt-3 text-gray-500 italic">~ Tidak ada transaksi ~</td>
               </tr>
               <tr v-else v-for="(transaction, index) in upcomingTransactions" :key="transaction.id">
                  <td class="px-2 py-1 border-y text-center">{{ index + 1 }}</td>
                  <td class="px-2 py-1 border-y">{{ formatDate(transaction.appointment_date) }}</td>
                  <td class="px-2 py-1 border-y">
                     <template v-for="product in transaction.service_items" :key="product.id">
                        <p>{{ product?.product_detail?.name }}</p>
                     </template>
                  </td>
                  <td class="px-2 py-1 border-y">
                     <template v-for="product in transaction.service_items" :key="product.id">
                        <template v-for="staff in product.staff_list" :key="staff.id">
                           <p>{{ staff?.employee_name }}</p>
                        </template>
                     </template>
                  </td>
                  <td class="px-2 py-1 border-y">{{ formatRupiah(transaction.grand_total) }}</td>
                  <td class="px-2 py-1 text-center border-y">
                     <BadgeSuccess v-if="transaction.payment_status == 2" text="Completed"/>
                     <BadgeDanger v-if="transaction.payment_status == 1" text="Pending"/>
                  </td>
               </tr>
            </tbody>
         </table>
      </div>
      <div>
         <h3 class="font-medium mb-1 text-lg">Transaksi Terakhir</h3>
         <table class="w-full">
            <thead class="bg-gray-100">
               <tr>
                  <th class="px-2 py-1 border font-medium text-center">No</th>
                  <th class="px-2 py-1 border font-medium text-left">Tanggal</th>
                  <th class="px-2 py-1 border font-medium text-left">Produk</th>
                  <th class="px-2 py-1 border font-medium text-left">Staff</th>
                  <th class="px-2 py-1 border font-medium text-left">Total</th>
                  <th class="px-2 py-1 border font-medium text-center">Status</th>
               </tr>
            </thead>
            <tbody>
               <tr v-if="latestTransactions.length <= 0">
                  <td colspan="6" class="text-center pt-3 text-gray-500 italic">~ Tidak ada transaksi ~</td>
               </tr>
               <tr v-else v-for="(transaction, index) in latestTransactions" :key="transaction.id">
                  <td class="px-2 py-1 border-y text-center">{{ index + 1 }}</td>
                  <td class="px-2 py-1 border-y">{{ formatDate(transaction.appointment_date) }}</td>
                  <td class="px-2 py-1 border-y">
                     <template v-for="product in transaction.service_items" :key="product.id">
                        <p>{{ product?.product_detail?.name }}</p>
                     </template>
                  </td>
                  <td class="px-2 py-1 border-y">
                     <template v-for="product in transaction.service_items" :key="product.id">
                        <template v-for="staff in product.staff_list" :key="staff.id">
                           <p>{{ staff?.employee_name }}</p>
                        </template>
                     </template>
                  </td>
                  <td class="px-2 py-1 border-y">{{ formatRupiah(transaction.grand_total) }}</td>
                  <td class="px-2 py-1 text-center border-y">
                     <BadgeWarning v-if="transaction.trx_status == 1" text="Pending" />
                     <BadgeSuccess v-if="transaction.trx_status == 2" text="Done" />
                     <BadgeDanger v-if="transaction.trx_status == 3" text="Cancel" />
                  </td>
               </tr>
            </tbody>
         </table>
      </div>
   </div>
</template>

<script>
import BadgeSuccess from '@/components/badge/BadgeSuccess.vue';
import BadgeDanger from '@/components/badge/BadgeDanger.vue';
import BadgeWarning from "@/components/badge/BadgeWarning.vue";
import { formatRupiah, formatDate } from '@/helpers/formating';
import { mapActions } from 'vuex';

export default {
   name: "TabAppointment",
   props: ['id'],
   components: {
      BadgeSuccess, BadgeDanger, BadgeWarning
   },
   data() {
      return {
         transactions: [],
         today: new Date().toISOString().split('T')[0]
      }
   },
   computed: {
      upcomingTransactions() {
         return this.transactions.filter(transaction => {
            return transaction.appointment_date >= this.today && transaction.payment_status !== 2;
         });
      },
      latestTransactions() {
         return this.transactions.filter(transaction => {
            return transaction.appointment_date < this.today;
         });
      }
   },
   watch: {
      id: {
         immediate: true,
         handler(newId) {
            if (newId) {
               this.loadTransactions(newId);
            }
         }
      }
   },
   methods: {
      formatRupiah, formatDate,
      ...mapActions('transactions', ['fetchTransactionByCustomerId']),

      async loadTransactions(customerId) {
         try {
            const response = await this.fetchTransactionByCustomerId(customerId);
            this.transactions = response.data;
            // console.log('data transaksi: ', this.transactions);
         }
         catch (error) {
            console.error('Failed to fetch transaction by customer id:', error);
         }
      }
   }
}
</script>