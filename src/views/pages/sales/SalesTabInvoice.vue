<template>
  <div v-if="this.$store.state.detail_user.user_login.is_super" class="flex mb-3">
    <button 
      @click="filterByOutlet(null)"
      :class="['px-3 py-1 me-2 text-sm rounded-lg border border-gray-500', selectedOutlet === null ? 'bg-gray-500 text-white font-bold' : '']">
      ALL
    </button>
    <button
      v-for="outlet in allOutlets"
      :key="outlet.id"
      @click="filterByOutlet(outlet.id)"
      :class="['px-3 py-1 me-2 text-sm rounded-lg border border-gray-500 uppercase', selectedOutlet === outlet.id ? 'bg-gray-500 text-white font-bold' : '']">
      {{ outlet.name }}
    </button>
  </div>
  <div class="mb-6 flex items-end justify-between">
    <div class="filters flex">
      <div class="filter-by-created_at flex flex-col items-start me-3">
        <label for="" class="font-medium text-sm">Invoice Date</label>
        <div class="flex items-center">
          <span><InputForm @change="fetchTransactions(1)" v-model="filter.start_date" id="filter-start-date" input_class="w-40 me-2" type="date"/></span>
          <MinusIcon class="w-5 h-5"/>
          <span><InputForm @change="fetchTransactions(1)" v-model="filter.end_date" id="filter-end-date" input_class="w-40 ms-2" type="date"/></span>
        </div>
      </div>
      <div class="filter-by-appointment_date flex flex-col items-start">
        <label for="" class="font-medium text-sm">Appointment Date</label>
        <div class="flex items-center">
          <span><InputForm @change="fetchTransactions(1)" v-model="filter.appointment_date" id="filter-start-date" input_class="w-40 me-2" type="date"/></span>
        </div>
      </div>
    </div>
    <div class="flex items-center">
      <button
        @click="setPaymentStatus('')"
        :class="paymentAllStatusClass('')"
        id="filter-all"
        class="px-3 py-1 text-sm rounded-lg border">All</button>
      <button
        @click="setPaymentStatus(1)"
        :class="paymentPendingStatusClass()"
        id="filter-pending"
        class="mx-3 px-3 py-1 text-sm rounded-lg border">Pending</button>
      <button
        @click="setPaymentStatus(2)"
        :class="paymentCompletedStatusClass()"
        id="filter-completed"
        class="px-3 py-1 text-sm rounded-lg border">Done</button>
    </div>
  </div>
  <div class="overflow-x-scroll">
    <table class="table-auto w-full">
      <thead class="bg-gray-300">
        <tr class="border">
          <th class="px-2 py-1 text-xs uppercase border-x text-center">No</th>
          <th class="px-2 py-1 text-xs uppercase border-x text-left">Invoice ID</th>
          <th class="px-2 py-1 text-xs uppercase border-x text-left">Invoice Date</th>
          <th class="px-2 py-1 text-xs uppercase border-x text-left">Due Date</th>
          <th class="px-2 py-1 text-xs uppercase border-x text-left">Payment Date</th>
          <th class="px-2 py-1 text-xs uppercase border-x text-left">Total Transaction</th>
          <th class="px-2 py-1 text-xs uppercase border-x text-left">Total Payment</th>
          <th class="px-2 py-1 text-xs uppercase border-x text-center">Status</th>
          <th class="px-2 py-1 text-xs uppercase border-x text-center">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="allTransactions == 0 || filteredTransactions.length == 0">
          <td colspan="9" class="text-gray-400 italic text-lg text-center py-3"> ~ Tidak ada data ~ </td>
        </tr>
        <tr v-for="(trx, index) in filteredTransactions" :key="trx.id" class="border-y">
          <td class="px-2 py-1 text-center">{{ index + 1 +(pagination.page - 1) * pagination.perPage }}</td>
          <td class="px-2 py-1">{{ trx?.invoice.invoice_code }}</td>
          <td class="px-2 py-1">{{ formatDate(trx?.invoice.invoice_date) }}</td>
          <td class="px-2 py-1">{{ formatDate(trx?.invoice.due_date) }}</td>
          <td class="px-2 py-1">{{ trx?.invoice.payment_date ? formatTime(trx?.invoice.payment_date) : '' }}</td>
          <td class="px-2 py-1 text-right">{{ trx?.invoice.total_transaction ? formatRupiah(parseInt(trx?.invoice.total_transaction)) : ''}}</td>
          <td class="px-2 py-1 text-right">{{ trx?.invoice.total_payment ? formatRupiah(parseInt(trx?.invoice.total_payment)) : '' }}</td>
          <td class="px-2 py-1 text-center">
            <BadgeSuccess v-if="trx?.trx_status == 2" text="Done"/>
            <BadgeWarning v-if="trx?.trx_status == 1" text="Pending"/>
          </td>
          <td class="px-2 py-1 text-center flex flex-wrap justify-around">
            <button @click="showInvoice(trx?.invoice.id)" :id="'to-invoice-'" class="bg-gray-300 p-2 rounded-lg">
              <EyeIcon class="h-4 w-4"/>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <PaginationComponent
    :totalItems="pagination.totalItems"
    :perPage="parseInt(pagination.perPage)"
    :currentPage="parseInt(pagination.page)"
    :previousPageLink="pagination?.previousPageLink"
    :nextPageLink="pagination?.nextPageLink"
    @page-changed="fetchTransactions"
  />
</template>

<script>
import InputForm from '@/components/form/InputForm.vue';
import BadgeSuccess from '@/components/badge/BadgeSuccess.vue';
import BadgeWarning from '@/components/badge/BadgeWarning.vue';
import PaginationComponent from '@/components/PaginationComponent.vue';
import { formatTime, formatDate, formatRupiah } from '@/helpers/formating';
import { mapGetters, mapActions } from 'vuex';
import { MinusIcon, EyeIcon } from '@heroicons/vue/24/solid';

export default {
  name: "SalesTabInvoice",
  components: {
    BadgeSuccess, BadgeWarning, PaginationComponent, InputForm,
    MinusIcon, EyeIcon
  },
  data() {
    return {
      filter: {
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date().toISOString().split('T')[0],
        appointment_date: null,
        trx_status: ''
      },
      selectedOutlet: null,
    }
  },
  computed: {
    ...mapGetters("transactions", ["allTransactions", "pagination"]),
    // ...mapGetters('invoices', ['allInvoices', 'pagination']),
    ...mapGetters('outlets', ['allOutlets']),

    userLogin() {
      const user = this.$store.state.detail_user.detail_user;
      return user;
    },
    filteredTransactions() {
      let transactions = this.allTransactions.filter(trx => trx.trx_status !== 3);

      // Filter by outlet if selectedOutlet is set (Filter in Superadmin)
      if (this.selectedOutlet !== null) {
        transactions = transactions.filter(transaction => transaction.outlet_id === this.selectedOutlet);
      }

      // If user is not superadmin, only show transactions for their outlet (Only Trx by Admin Logged in (Transactions by Outlet))
      if (!this.$store.state.detail_user.user_login?.is_super && this.userLogin.outlet_id) {
        transactions = transactions.filter(transaction => transaction.outlet_id === this.userLogin.outlet_id);
      }
      return transactions;
    },

    // filteredInvoices() {
    //   // Ambil semua invoice dan filter yang memiliki pos_transaction_id yang sama dengan id di filteredTransactions
    //   const transactionIds = this.filteredTransactions.map(transaction => transaction.id);
    //   return this.allInvoices.filter(invoice => transactionIds.includes(invoice.pos_transaction_id));
    // }
  },
  created() {
    if (this.hasOutletId) {
      this.selectedOutlet = this.hasOutletId;
    }
    this.fetchTransactions();
    // this.fetchInvoices(this.pagination.page || 1);
    this.$store.dispatch('outlets/fetchOutlets');
  },
  methods: {
    formatTime, formatDate, formatRupiah,
    // ...mapActions('invoices', ['fetchInvoices']),
    ...mapActions("transactions", ["fetchTransactions"]),

    filterByOutlet(outletId) {
      this.selectedOutlet = outletId;
      this.fetchTransactions(1);
    },

    async fetchTransactions(page = 1, limit = 10, type = "start_date") {
      // Check if start_date is greater than end_date
      if (type == "start_date" && this.filter.start_date > this.filter.end_date) {
        this.filter.end_date = this.filter.start_date; // Set end_date to start_date
      }

      // Check if end_date is less than start_date
      if (type == "end_date" && this.filter.start_date > this.filter.end_date) {
        this.filter.start_date = this.filter.end_date; // Set start_date to end_date
      }

      const params = {
        page,
        limit,
        start_date: this.filter.start_date || null,
        end_date: this.filter.end_date || null,
        appointment_date: this.filter.appointment_date || null,
        trx_status: this.filter.trx_status || null,
      };

      if (this.selectedOutlet || this.hasOutletId) {
        params.outlet_id = this.selectedOutlet || this.hasOutletId;
      }

      await this.$store.dispatch("transactions/fetchTransactions", params);
    },

    // async fetchInvoices(page = 1, limit = 10) {
    //   const params = {
    //     page,
    //     limit,
    //     search: '',
    //     start_date: this.filter.start_date,
    //     end_date: this.filter.end_date,
    //     payment_status: this.filter.payment_status
    //   };
    //   await this.$store.dispatch('invoices/fetchInvoices', params);
    // },

    // Invoice Statuses
    setPaymentStatus(status) {
      this.filter.trx_status = status;
      this.fetchTransactions(this.pagination.page || 1);
    },
    paymentAllStatusClass() {
      return this.filter.trx_status == '' ? 'bg-gray-500 text-white' : 'border-gray-600';
    },
    paymentPendingStatusClass(){
      return this.filter.trx_status == 1 ? 'text-secondary-orange-2 bg-secondary-orange-1' : 'text-secondary-orange-1 border-secondary-orange-1';
    },
    paymentCompletedStatusClass(){
      return this.filter.trx_status == 2 ? 'text-secondary-green-2 bg-secondary-green-1' : 'text-secondary-green-1 border-secondary-green-1';
    },

    // Detail Invoice
    showInvoice(invoice_id) {
      this.$router.push({ name: 'DetailInvoice', params: { id: invoice_id } });
    }
  },
}
</script>