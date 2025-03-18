<template>
   <div>
      <div class="">
         <table class="w-full">
            <thead class="bg-gray-300">
               <tr>
                  <th class="px-3 py-1 border font-medium text-center">No</th>
                  <th class="px-3 py-1 border font-medium text-left">ID Invoice</th>
                  <th class="px-3 py-1 border font-medium text-left">Tanggal Invoice</th>
                  <th class="px-3 py-1 border font-medium text-left">Due Date</th>
                  <th class="px-3 py-1 border font-medium text-left">Total Transaksi</th>
                  <th class="px-3 py-1 border font-medium text-center">Status</th>
               </tr>
            </thead>
            <tbody>
               <tr v-if="invoices.length == 0">
                  <td colspan="5" class="p-3 text-center italic text-gray-400">Belum ada transaksi</td>
               </tr>
               <tr v-else v-for="(invoice, index) in invoices" :key="invoice.id">
                  <td class="px-3 py-2 border-y text-center">{{ index + 1 }}</td>
                  <td class="px-3 py-2 border-y">{{ invoice.invoice.invoice_code }}</td>
                  <td class="px-3 py-2 border-y">{{ formatDate(invoice.invoice.invoice_date) }}</td>
                  <td class="px-3 py-2 border-y">{{ formatRupiah(invoice.invoice.total_transaction) }}</td>
                  <td class="px-3 py-2 border-y">{{ formatRupiah(invoice.invoice.total_transaction) }}</td>
                  <td class="px-3 py-2 border-y text-center">
                     <BadgeSuccess v-if="invoice.payment_status == 2" text="Completed"/>
                     <BadgeDanger v-if="invoice.payment_status == 1" text="Pending"/>
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
import { formatTime, formatDate, formatRupiah } from '@/helpers/formating';
import { mapActions } from 'vuex';

export default {
   name: "TabInvoice",
   props: ['id'],
   components: {
      BadgeSuccess, BadgeDanger
   },
   data() {
      return {
         invoices: []
      }
   },
   watch: {
      id: {
         immediate: true,
         handler(newId) {
            if (newId) {
               this.loadInvoices(newId);
            }
         }
      }
   },
   methods: {
      formatTime, formatDate, formatRupiah,
      ...mapActions('transactions', ['fetchTransactionByCustomerId']),

      async loadInvoices(customerId) {
         try {
            const response = await this.fetchTransactionByCustomerId(customerId);
            this.invoices = response.data;
            console.log('data invoice: ', this.invoices);
         }
         catch (error) {
            console.error('Failed to fetch transaction by customer id:', error);
         }
      }
   },
}
</script>
