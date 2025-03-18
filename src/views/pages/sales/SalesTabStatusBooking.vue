<template>
  <div v-if="this.$store.state.detail_user.user_login.is_super" class="flex mb-3">
    <button @click="filterByOutlet(null)"
      :class="['px-3 py-1 me-2 text-sm rounded-lg border border-gray-500', selectedOutlet === null ? 'bg-gray-500 text-white font-bold' : '']">
      ALL
    </button>
    <button v-for="outlet in allOutlets" :key="outlet.id" @click="filterByOutlet(outlet.id)"
      :class="['px-3 py-1 me-2 text-sm rounded-lg border border-gray-500 uppercase', selectedOutlet === outlet.id ? 'bg-gray-500 text-white font-bold' : '']">
      {{ outlet.name }}
    </button>
  </div>
  <div class="pb-3 mb-3 flex justify-between">
    <div class="flex flex-wrap">
      <div class="flex items-center me-3">
        <span>
          <InputForm @change="fetchTransactions(1, 10, 'start_date')" id="filter-start-date" v-model="filter.start_date"
            input_class="w-40" type="date" />
        </span>
        <MinusIcon class="w-5 h-5 mx-1" />
        <span>
          <InputForm @change="fetchTransactions(1, 10, 'end_date')" id="filter-end-date" v-model="filter.end_date"
            input_class="w-40" type="date" />
        </span>
      </div>
      <span class="me-3 flex items-center">
        <select v-model="filter.customer_id" @change="fetchTransactions()" id="filter-select-customer"
          class="block w-48 text-lg mt-1 flex-1 border border-gray-400 rounded-lg px-3 py-2 text-gray-500 placeholder:text-gray-300 placeholder:text-[12px] sm:text-sm sm:leading-6 focus:outline-none focus:ring focus:ring-gray-500">
          <option value="" selected>Pilih customer</option>
          <option v-for="customer in filteredCustomers" :key="customer.id" :value="customer.id">
            {{ customer.name }}
          </option>
        </select>
      </span>
    </div>
    <div class="flex items-center">
      <button @click="setTrxStatus('')" :class="TrxAllStatusClass('')" id="filter-all"
        class="px-3 py-1 me-2 text-sm rounded-lg border">
        All
      </button>
      <button @click="setTrxStatus(1)" :class="TrxPendingStatusClass()" id="filter-pending"
        class="px-3 py-1 me-2 text-sm rounded-lg border">
        Pending
      </button>
      <button @click="setTrxStatus(2)" :class="TrxCompletedStatusClass()" id="filter-completed"
        class="px-3 py-1 me-2 text-sm rounded-lg border">
        Done
      </button>
      <button @click="setTrxStatus(3)" :class="TrxCanceledStatusClass()" id="filter-canceled"
        class="px-3 py-1 text-sm rounded-lg border">
        Cancel
      </button>
    </div>
  </div>
  <div class="overflow-x-scroll">
    <table class="table-auto w-full">
      <thead class="bg-gray-300">
        <tr>
          <th class="text-xs uppercase px-2 py-1 border text-center">No</th>
          <th class="text-xs uppercase px-2 py-1 border text-left">ID Trx</th>
          <th class="text-xs uppercase px-2 py-1 border text-left">Pelanggan</th>
          <th class="text-xs uppercase px-2 py-1 border text-left">Staff</th>
          <th class="text-xs uppercase px-2 py-1 border text-left">Produk</th>
          <th class="text-xs uppercase px-2 py-1 border text-left">Tanggal Pengerjaan</th>
          <th class="text-xs uppercase px-2 py-1 border text-left">Waktu</th>
          <th class="text-xs uppercase px-2 py-1 border text-left">Total</th>
          <th class="text-xs uppercase px-2 py-1 border text-center">Status</th>
          <th class="text-xs uppercase px-2 py-1 border text-center">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="allTransactions.length == 0 || filteredTransactions.length === 0">
          <td colspan="10" class="text-gray-400 italic text-lg text-center py-3">
            ~ Tidak ada data ~
          </td>
        </tr>
        <tr v-for="(trans, index) in filteredTransactions" :key="trans.id" class="border-y">
          <td class="px-2 py-1 text-center">{{ index + 1 + (pagination.page - 1) * pagination.perPage }}</td>
          <td class="px-2 py-1 text-sm">{{ trans.transaction_code }}</td>
          <td class="px-2 py-1 capitalize">{{ trans?.customer?.name }}</td>
          <td class="px-2 py-1">
            <div class="flex flex-wrap gap-1">
              <template v-for="service in trans.service_items" :key="service.id">
                <template v-for="staff in service.staff_list" :key="staff.id">
                  <BadgePrimary :text="staff?.employee?.name || staff.employee_name" badge_class="bg-gray-200" />
                </template>
              </template>
            </div>
          </td>
          <td class="px-2 py-1">
            <div class="flex flex-wrap gap-1">
              <span class="capitalize" v-for="service in trans.service_items" :key="service.id">
                <BadgePrimary :text="service?.product_detail?.name" badge_class="bg-gray-200 uppercase tracking-wide" />
              </span>
            </div>
          </td>
          <td class="px-2 py-1 text-sm capitalize">
            {{ formatDate(trans.appointment_date) }}
          </td>
          <td class="px-2 py-1">{{ trans.appointment_hour }}</td>
          <td class="px-2 py-1 text-right">{{ formatRupiah(trans.grand_total) }}</td>
          <td class="px-2 py-1 text-center">
            <div class="flex gap-1 items-center">
              <BadgeWarning v-if="trans.trx_status == 1" text="Pending" />
              <BadgeSuccess v-if="trans.trx_status == 2" text="Done" />
              <BadgeDanger v-if="trans.trx_status == 3" text="Cancel" />
              <div @click="showInvoice(trans?.invoice.id)" :id="'to-invoice-' + trans?.invoice.id"
                class="cursor-pointer">
                <BadgePrimary text="invoice"
                  badge_class="border border-secondary-blue-1 border-b-2 border-r-2 shadow-md text-secondary-blue-1 uppercase tracking-wide" />
              </div>
            </div>
          </td>
          <td class="px-2 py-1 text-center flex gap-1 items-center justify-around">
            <button @click="sendDataAgenda(trans)" :id="'open-modal-detail-transaction-' + trans.id"
              class="bg-gray-300 p-2 rounded-lg">
              <EyeIcon class="h-4 w-4" />
            </button>
            <button @click="redirectToCheckout(trans.id)" :id="'to-checkout-' + trans.id"
              class="bg-primary-color-2 rounded-lg p-2">
              <ChevronRightIcon class="text-white h-4 w-4" />
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <PaginationComponent :totalItems="pagination.totalItems" :perPage="parseInt(pagination.perPage)"
    :currentPage="parseInt(pagination.page)" :previousPageLink="pagination?.previousPageLink"
    :nextPageLink="pagination?.nextPageLink" @page-changed="fetchTransactions" />
</template>

<script>
import InputForm from "@/components/form/InputForm.vue";
import BadgeWarning from "@/components/badge/BadgeWarning.vue";
import BadgeSuccess from "@/components/badge/BadgeSuccess.vue";
import BadgeDanger from "@/components/badge/BadgeDanger.vue";
import BadgePrimary from "@/components/badge/BadgePrimary.vue";
import PaginationComponent from "@/components/PaginationComponent.vue";
import { formatRupiah, formatDate } from "@/helpers/formating";
import { ChevronRightIcon, MinusIcon, EyeIcon } from "@heroicons/vue/24/solid";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "SalesTabStatusBooking",
  emits: ["selectedAgenda"],
  components: {
    InputForm,
    BadgeSuccess,
    BadgeDanger,
    BadgeWarning,
    BadgePrimary,
    PaginationComponent,
    ChevronRightIcon,
    MinusIcon,
    EyeIcon,
  },
  data() {
    return {
      filter: {
        start_date: new Date().toISOString().split("T")[0],
        end_date: new Date().toISOString().split("T")[0],
        customer_id: "",
        trx_status: "",
      },

      selectedOutlet: null,

      status: [
        { id: 1, name: "Pending" },
        { id: 2, name: "Success" },
        { id: 3, name: "Canceled" },
      ],
    };
  },
  computed: {
    ...mapGetters("transactions", ["allTransactions", "pagination"]),
    ...mapGetters("customers", ["allCustomers"]),
    ...mapGetters('outlets', ['allOutlets']),

    userLogin() {
      const user = this.$store.state.detail_user.detail_user;
      return user;
    },
    filteredTransactions() {
      let transactions = this.allTransactions;

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

    filteredCustomers() {
      let customers = this.allCustomers;

      if (this.selectedOutlet) {
        customers = customers.filter(customer => customer.outlet_id == this.selectedOutlet);
      }

      if (!this.$store.state.detail_user.user_login?.is_super && this.userLogin.outlet_id) {
        customers = customers.filter(customer => customer.outlet_id == this.userLogin.outlet_id);
      }

      return customers;
    },
  },
  created() {
    if (this.hasOutletId) {
      this.selectedOutlet = this.hasOutletId;
    }
    this.fetchTransactions(this.pagination.page || 1);
    this.$store.dispatch("customers/fetchAllCustomers");
    this.$store.dispatch('outlets/fetchOutlets');
  },
  methods: {
    formatRupiah,
    formatDate,
    ...mapActions("transactions", ["fetchTransactions"]),

    filterByOutlet(outletId) {
      this.selectedOutlet = outletId;
      this.fetchTransactions(1);
    },

    async fetchTransactions(page = 1, limit = 15, type = "start_date") {
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
        customer_id: this.filter.customer_id || null,
        trx_status: this.filter.trx_status || null,
      };
      if (this.selectedOutlet || this.hasOutletId) {
        params.outlet_id = this.selectedOutlet || this.hasOutletId;
      }

      await this.$store.dispatch("transactions/fetchTransactions", params);
    },

    // Show / Hide Modal Detail Transaction
    sendDataAgenda(trans) {
      this.$emit("selectedAgenda", trans);
    },
    hideModalDetailAgenda() {
      setTimeout(() => {
        this.modalDetailAgenda = false;
        this.fetchTransactions();
      }, 500);
    },

    // Filter By Statuses Transaction
    setTrxStatus(status) {
      this.filter.trx_status = status;
      this.fetchTransactions(this.pagination.page || 1);
    },
    TrxAllStatusClass() {
      return this.filter.trx_status == ""
        ? "bg-gray-500 text-white"
        : "border-gray-600";
    },
    TrxPendingStatusClass() {
      return this.filter.trx_status == 1
        ? "text-secondary-orange-2 bg-secondary-orange-1"
        : "text-secondary-orange-1 border-secondary-orange-1";
    },
    TrxCompletedStatusClass() {
      return this.filter.trx_status == 2
        ? "text-secondary-green-2 bg-secondary-green-1"
        : "text-secondary-green-1 border-secondary-green-1";
    },
    TrxCanceledStatusClass() {
      return this.filter.trx_status == 3
        ? "text-secondary-red-2 bg-secondary-red-1"
        : "text-secondary-red-1 border-secondary-red-1";
    },
    redirectToCheckout(transaction_id) {
      this.$router.push({
        name: "CheckoutView",
        params: { id: transaction_id },
      });
    },

    // Detail Invoice
    showInvoice(invoice_id) {
      this.$router.push({ name: "DetailInvoice", params: { id: invoice_id } });
    },
  },
};
</script>
