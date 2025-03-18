<template>
  <TopBar @toggleBlur="toggleBlur" />
  <IndexView title="Beranda" />
  <div
    id="overlay"
    class="fixed inset-0 bg-black bg-opacity-30 z-30"
    :class="{ hidden: !isBlur }"
  ></div>
  <section class="p-6">
    <!-- <div class="mb-6 flex justify-center">
      <div class="logo me-3 rounded-full w-36 h-36  flex justify-center items-center overflow-hidden">
        <img class="object-cover w-full h-auto" src="/images/jeju_logo.webp" alt="logo jeju">
      </div>
    </div> -->
    <h1 class="text-center font-light text-lg mb-6">
      Hi! &nbsp;Welcome
      <span class="font-semibold text-primary-color-1 text-xl">{{ userLogin.name ?? 'Admin Jeju' }}</span>
    </h1>
    <div class="mt-3 mb-3 flex">
      <RouterLink
        to="/appointment/add-new"
        id="new-transaction"
        class="bg-primary-color-2 flex items-center rounded-lg text-blue-100 px-4 py-2 font-medium me-3 mb-3 border-b-2 border-r-2 border-gray-800"
      >
        <PlusCircleIcon class="h-5 w-5 me-1" />
        Transaksi Baru
      </RouterLink>
      <RouterLink
        to="/kalender"
        id="url-kalender"
        class="bg-primary-color-2 flex items-center rounded-lg text-blue-100 px-4 py-2 font-medium me-3 mb-3 border-b-2 border-r-2 border-gray-800"
      >
        <WindowIcon class="h-5 w-5 me-1" />
        Kalender
      </RouterLink>
    </div>
    <div class="">
      <h2 class="text-lg font-medium text-primary-color-1 mb-3">
        Transaksi Hari Ini
      </h2>
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
      <div class="flex flex-wrap">
        <span v-if="allTransactions.length == 0 || filteredTransactions.length == 0" class="text-gray-400 italic"
          >~ Tidak ada Transaksi ~</span
        >
        <template v-else v-for="trans in filteredTransactions" :key="trans.id">
          <div
            class="card bg-white rounded-lg shadow-lg w-80 relative me-3 mb-3"
          >
            <div class="card-body p-3">
              <!-- <span class="number text-3xl font-bold text-gray-300 absolute bottom-2 right-3">{{ index + 1 }}</span> -->
              <div class="flex justify-between">
                <h3 class="font-bold leading-tight">
                  Bpk/Ibu. {{ trans?.customer?.name }}
                </h3>
                <div class="flex justify-end h-fit">
                  <BadgeWarning
                    v-if="trans.trx_status == 1"
                    text="Pending"
                  />
                  <BadgeSuccess v-if="trans.trx_status == 2" text="Done" />
                </div>
              </div>
              <div class="flex gap-1 flex-wrap items-center mt-2">
                <span class="text-xs uppercase">Service: </span>
                <template
                  v-for="service in trans.service_items"
                  :key="service.id"
                >
                  <BadgePrimary
                    :text="service?.product_detail?.name"
                    badge_class="bg-secondary-blue-2 text-secondary-blue-1 uppercase tracking-wider"
                  />
                </template>
              </div>
              <div class="flex gap-1 flex-wrap items-center mt-2">
                <span class="text-xs uppercase">Staff: </span>
                <template
                  v-for="service in trans.service_items"
                  :key="service.id"
                >
                  <template v-for="staff in service.staff_list" :key="staff.id">
                    <BadgePrimary
                      :text="staff.employee_name"
                      badge_class="bg-gray-200 uppercase tracking-wider"
                    />
                  </template>
                </template>
              </div>
              <div class="flex justify-between mt-3">
                <p class="text-sm uppercase font-bold flex items-center gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="size-4"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                  <span class="font-medium">{{ trans.appointment_hour }}</span>
                </p>
                <button
                  @click="redirectToCheckout(trans.id)"
                  :id="'checkout-' + trans.id"
                  class="bg-primary-color-2 flex items-center justify-between rounded-lg w-26 text-blue-100 px-3 py-2 text-xs uppercase font-bold border-b-2 border-r-2 border-gray-800"
                >
                  Checkout
                  <ChevronRightIcon class="h-4 w-4 ms-1" />
                </button>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </section>
</template>

<script>
import TopBar from "@/components/TopBar.vue";
import IndexView from "@/views/IndexView.vue";
import {
  PlusCircleIcon,
  WindowIcon,
  ChevronRightIcon,
} from "@heroicons/vue/24/solid";
import { formatRupiah } from "@/helpers/formating";
import { mapGetters, mapActions } from "vuex";
import BadgeWarning from "@/components/badge/BadgeWarning.vue";
import BadgeSuccess from "@/components/badge/BadgeSuccess.vue";
import BadgePrimary from "@/components/badge/BadgePrimary.vue";

export default {
  name: "DashboardView",
  components: {
    TopBar,
    IndexView,
    PlusCircleIcon,
    WindowIcon,
    ChevronRightIcon,
    BadgeSuccess,
    BadgeWarning,
    BadgePrimary,
  },
  data() {
    return {
      isBlur: false,
      selectedOutlet: null,
    };
  },
  async created() {
    this.fetchTransactions(this.pagination.page || 1);
    this.$store.dispatch('outlets/fetchOutlets');
  },
  computed: {
    ...mapGetters("transactions", ["allTransactions", "pagination"]),
    ...mapGetters('outlets', ['allOutlets']),

    userLogin() {
      const user = this.$store.state.detail_user.detail_user;
      return user;
    },
    filteredTransactions() {
      let transactions = this.allTransactions.filter(transaction => transaction.trx_status !== 3);

      // Filter by outlet if selectedOutlet is set (Filter in Superadmin)
      if (this.selectedOutlet !== null) {
        transactions = transactions
          .filter(transaction => transaction.trx_status !== 3)
          .filter(transaction => transaction.outlet_id === this.selectedOutlet)
      }

      // If user is not superadmin, only show transactions for their outlet (Only Trx by Admin Logged in (Transactions by Outlet))
      if (!this.$store.state.detail_user.user_login?.is_super && this.userLogin.outlet_id) {
        transactions = transactions
          .filter(transaction => transaction.trx_status !== 3)
          .filter(transaction => transaction.outlet_id === this.userLogin.outlet_id);
      }

      return transactions;
    }
  },
  methods: {
    formatRupiah,
    ...mapActions("transactions", ["fetchTransactions"]),

    filterByOutlet(outletId) {
      this.selectedOutlet = outletId;
      this.fetchTransactions(1);
    },

    toggleBlur() {
      this.isBlur = !this.isBlur;
    },
    async fetchTransactions(page = 1, limit = 20) {
      const params = {
        page,
        limit,
        appointment_date: new Date().toISOString().split("T")[0],
        customer_id: null,
        payment_status: null,
      };
      await this.$store.dispatch("transactions/fetchTransactions", params);
    },
    redirectToCheckout(transaction_id) {
      this.$router.push({
        name: "CheckoutView",
        params: { id: transaction_id },
      });
    },
  },
};
</script>
