<template>
  <div class="mb-6 flex items-end justify-between">
    <div class="flex items-center">
      <span>
        <InputForm @change="fetchReportDetailTransaksi()" v-model="filter.start_date" input_class="w-40 me-2"
          type="date" />
      </span>
      <MinusIcon class="w-5 h-5" />
      <span>
        <InputForm @change="fetchReportDetailTransaksi()" v-model="filter.end_date" input_class="w-40 ms-2"
          type="date" />
      </span>
      <span class="ms-3">
        <select v-model="selectedOutlet" @change="fetchReportDetailTransaksi()"
          class="block w-48 text-lg mt-1 flex-1 border border-gray-400 rounded-lg px-3 py-2 text-gray-500 placeholder:text-gray-300 placeholder:text-[12px] sm:text-sm sm:leading-6 focus:outline-none focus:ring focus:ring-gray-500">
          <option value="" selected>Semua Branch</option>
          <option v-for="outlet in allOutlets" :key="outlet.id" :value="outlet.id">{{ outlet.name }}</option>
        </select>
      </span>
      <span class="ms-3">
        <select v-model="selectedEmployee" @change="fetchReportDetailTransaksi()"
          class="block w-48 text-lg mt-1 flex-1 border border-gray-400 rounded-lg px-3 py-2 text-gray-500 placeholder:text-gray-300 placeholder:text-[12px] sm:text-sm sm:leading-6 focus:outline-none focus:ring focus:ring-gray-500">
          <option value="" selected>Semua staff</option>
          <option v-for="employee in filteredEmployee" :key="employee.id" :value="employee.id">{{ employee.name }}
          </option>
        </select>
      </span>
    </div>
    <div v-if="this.$store.state.detail_user.user_login.is_super" class="flex">
      <!-- <button 
        @click="filterByOutlet(null)"
        :class="['px-3 me-2 text-sm rounded-lg border border-gray-500', selectedOutlet === null ? 'bg-gray-500 text-white font-bold' : '']">
        ALL
      </button>
      <button
        v-for="outlet in allOutlets"
        :key="outlet.id"
        @click="filterByOutlet(outlet.id)"
        :class="['px-3 me-2 py-1 text-sm rounded-lg border border-gray-500 uppercase', selectedOutlet === outlet.id ? 'bg-gray-500 text-white font-bold' : '']">
        {{ outlet.name }}
      </button> -->
    </div>
  </div>
  <div class="overflow-x-scroll">
    <table class="table-auto w-full mb-6">
      <thead class="bg-gray-300">
        <tr>
          <th class="p-3 border-x text-center">No</th>
          <th class="p-3 border-x text-center">ID Transaksi</th>
          <th class="p-3 border-x text-left">Transaksi Selesai</th>
          <th class="p-3 border-x text-left">Staff</th>
          <th class="p-3 border-x text-left">Nama Produk</th>
          <th class="p-3 border-x text-left">Total Harga Produk</th>
          <th class="p-3 border-x text-left flex justify-between items-center">Komisi</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="filteredReportDetailTransaksi.length <= 0">
          <td colspan="7" class="p-3 text-center italic text-gray-400">{{ 'Tidak ada data' }}</td>
        </tr>

        <tr v-for="(data, index) in Object.values(filteredReportDetailTransaksi)" :key="index" class="border-y">
          <td class="p-3 text-center">{{ index + 1 + (pagination.page - 1) * pagination.perPage }}</td>
          <td class="p-3 text-center">{{ data.transaction_code }}</td>
          <td class="p-3">{{ formatTime( data.updatedAt ) }}</td>
          <td class="p-3 capitalize">{{ data.users }}</td>
          <td class="p-3">
            <span
                class="capitalize"
                v-for="(product,index) in data.items"
                :key="'p'+index"
              >
                <BadgePrimary
                    :text="product.product_name"
                    badge_class="bg-gray-200 uppercase tracking-wide me-3"
                  />
              </span>
          </td>
          <td class="p-3">{{ formatRupiah(data.subtotal) }}</td>
          <td class="p-3">{{ formatRupiah(data.commission) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
  <PaginationComponent :totalItems="pagination.totalItems" :perPage="parseInt(pagination.perPage)"
    :currentPage="parseInt(pagination.page)" :previousPageLink="pagination?.previousPageLink"
    :nextPageLink="pagination?.nextPageLink" @page-changed="fetchReportDetailTransaksi" />
</template>

<script>
import InputForm from '@/components/form/InputForm.vue';
import PaginationComponent from "@/components/PaginationComponent.vue";
import BadgePrimary from "@/components/badge/BadgePrimary.vue";
import { mapGetters, mapActions } from 'vuex';
import { formatTime, formatRupiah } from '@/helpers/formating';
import { MinusIcon } from '@heroicons/vue/24/solid';

export default {
  name: "ReportCommission",
  components: {
    InputForm, PaginationComponent,
    MinusIcon,
    BadgePrimary
  },
  data() {
    return {
      selectedEmployee: '',
      filter: {
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date().toISOString().split('T')[0]
      },

      processedCommissions: [],
      selectedOutlet: '',
      allOutlet: [],
    }
  },
  computed: {
    // ...mapGetters('commissions', ['allCommissions', 'pagination']),
    ...mapGetters('report_detail_transaksi', ['allDetailTransaksi', 'pagination']),
    ...mapGetters('employees', ['allEmployees']),
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
    },
    filteredEmployee() {
      let employees = this.allEmployees.filter(employee => employee.role_id == 2);

      if (this.selectedOutlet) {
        employees = employees.filter(employee => employee.outlet_id == this.selectedOutlet);
      }

      if (!this.$store.state.detail_user.user_login?.is_super && this.userLogin.outlet_id) {
        employees = employees.filter(employee => employee.outlet_id == this.userLogin.outlet_id);
      }

      return employees;
    },

    filteredReportDetailTransaksi() {
      let reportDetailTransaksi = this.allDetailTransaksi;

      if (this.selectedOutlet) {
        reportDetailTransaksi = reportDetailTransaksi.filter(reportDetailTransaksi => reportDetailTransaksi.outlet_id == this.selectedOutlet);
      }

      if (this.selectedEmployee) {
        reportDetailTransaksi = reportDetailTransaksi.filter(reportDetailTransaksi => reportDetailTransaksi.user_id == this.selectedEmployee);
      }

      if (!this.$store.state.detail_user.user_login?.is_super && this.userLogin.outlet_id) {
        reportDetailTransaksi = reportDetailTransaksi.filter(reportDetailTransaksi => reportDetailTransaksi.outlet_id == this.userLogin.outlet_id);
      }
      return reportDetailTransaksi;

    },

  },
  created() {
    this.fetchReportDetailTransaksi(this.pagination.page || 1);
    this.$store.dispatch('employees/fetchAllEmployees');
    if (this.pagination && this.pagination.page) {
      console.log(this.pagination.page);
    } else {
      console.error('Pagination data is not available');
    }
  },
  methods: {
    formatRupiah, formatTime,
    ...mapActions('report_detail_transaksi', ['fetchReportDetailTransaksi']),

    filterByOutlet(outletId) {
      this.selectedOutlet = outletId;
      this.fetchReportDetailTransaksi(1);
    },

    async fetchReportDetailTransaksi(page = 1, limit = 10, type = "start_date") {
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
        outlet_id: this.selectedOutlet,
        user_id: this.selectedEmployee,
        start_date: this.filter.start_date,
        end_date: this.filter.end_date,
      };
      await this.$store.dispatch('report_detail_transaksi/fetchReportDetailTransaksi', params);
    },
  }
}
</script>