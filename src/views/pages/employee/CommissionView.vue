<template>
  <IndexView title="Komisi"/>
  <section class="p-6">
    <div class="bg-white rounded-lg p-6 shadow-lg">
      <div class="mb-5 flex">
        <div class="me-6">
          <select v-model="selectedEmployee" @change="fetchCommissions(1)" class="block w-56 text-lg mt-1 flex-1 border border-gray-400 rounded-lg px-3 py-2 text-gray-500 placeholder:text-gray-300 placeholder:text-[12px] sm:text-sm sm:leading-6 focus:outline-none focus:ring focus:ring-gray-500">
            <option value="" selected>Semua staff</option>
            <option v-for="employee in allEmployees" :key="employee.id" :value="employee.id">{{ employee.name }}</option>
          </select>
        </div>
        <div class="flex items-center">
          <span><InputForm @change="fetchCommissions(1)" v-model="filter.start_date" input_class="w-40 me-2" type="date"/></span>
          <MinusIcon class="w-5 h-5"/>
          <span><InputForm @change="fetchCommissions(1)" v-model="filter.end_date" input_class="w-40 ms-2" type="date"/></span> 
        </div>
      </div>
      <!-- <div class="flex justify-end "> -->
        <span
          v-if="isHovered"
          :class="['card absolute text-sm right-12 top-[10%] bg-white text-primary-color-2 p-3 rounded-lg shadow-md border border-primary-color-2 w-56 transition-all ease-in-out animate__animated', animation_class]">
          <strong>Total Komisi</strong> = 10% dari harga produk / harga produk setelah diskon
        </span>
      <!-- </div> -->
      <table class="table-auto w-full">
        <thead class="bg-gray-300">
          <tr>
            <th class="p-3 border text-center">No</th>
            <th class="p-3 border text-center">ID Transaksi</th>
            <th class="p-3 border text-left">Transaksi Selesai</th>
            <th class="p-3 border text-left">Staff</th>
            <th class="p-3 border text-left">Nama Produk</th>
            <th class="p-3 border text-left">Harga Asli Produk</th>
            <th class="p-3 border text-left flex justify-between items-center">
              Total Komisi
              <ExclamationCircleIcon
                @mouseover="handleMouseOver()"
                @mouseleave="handleMouseLeave()"
                class="h-4 w-4 text-gray-600"/>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="noDataFound">
            <td colspan="7" class="p-3 text-center italic text-gray-400">{{ notFoundMessage || 'Tidak ada data' }}</td>
          </tr>
          <tr v-else v-for="(commission, index) in allCommissions" :key="commission.id">
            <td class="p-3 border text-center">{{ index + 1 }}</td>
            <td class="p-3 border text-center">{{ commission.transactionCode || 'Loading...' }}</td>
            <td class="p-3 border">{{ formatTime(commission?.createdAt) }}</td>
            <td class="p-3 border capitalize">{{ commission?.user?.name }}</td>
            <td class="p-3 border">{{ commission.productName || 'Loading...' }}</td>
            <td class="p-3 border">{{ formatRupiah(commission.pos_transaction?.grand_total) }}</td>
            <td class="p-3 border">{{ formatRupiah(commission.commission) }}</td>
          </tr>
        </tbody>
      </table>
      <PaginationComponent
        :totalItems="pagination.totalItems"
        :perPage="parseInt(pagination.perPage)"
        :currentPage="parseInt(pagination.page)"
        :previousPageLink="pagination?.previousPageLink"
        :nextPageLink="pagination?.nextPageLink"
        @page-changed="fetchCommissions"
      />
    </div>
  </section>
</template>

<script>
import IndexView from '@/views/IndexView.vue';
import InputForm from '@/components/form/InputForm.vue';
import PaginationComponent from '@/components/PaginationComponent.vue';
import { formatTime, formatRupiah } from '@/helpers/formating';
import { mapGetters, mapActions } from 'vuex';
import { ExclamationCircleIcon, MinusIcon } from '@heroicons/vue/24/solid';

export default {
  name: "CommissionView",
  components: {
    IndexView, PaginationComponent, InputForm,
    ExclamationCircleIcon, MinusIcon
  },
  data() {
    return {
      selectedEmployee: '',
      noDataFound: false,
      notFoundMessage: '',
      isHovered: false,
      isFadingOut: false,
      animation_class: '',

      filter: {
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date().toISOString().split('T')[0]
      }
    }
  },
  computed: {
    ...mapGetters('commissions', ['allCommissions', 'pagination']),
    ...mapGetters('employees', ['allEmployees'])
  },
  created() {
    this.fetchCommissions(this.pagination.page || 1);
    this.$store.dispatch('employees/fetchAllEmployees');
  },
  methods: {
    formatTime, formatRupiah,
    ...mapActions('commissions', ['fetchCommissions']),
    ...mapActions('transactions', ['fetchTransactionById']),

    handleMouseOver() {
      this.isHovered = true;
      this.animation_class = 'animate__fadeInDown';
    },
    handleMouseLeave() {
      this.isHovered = false;
      this.animation_class = 'animate__fadeOutUp';
    },
    async fetchCommissions(page = 1, limit = 20) {
      const params = {
        page,
        limit,
        user_id: this.selectedEmployee,
        start_date: this.filter.start_date,
        end_date: this.filter.end_date
      };
      try {
        await this.$store.dispatch('commissions/fetchCommissions', params);

        if (this.allCommissions.length === 0) {
          this.noDataFound = true;
        } else {
          this.noDataFound = false;

          // Fetch Transaction By "commission.pos_transaction_id"
          for (const commission of this.allCommissions) {
            const transaction = await this.fetchTransactionById(commission.pos_transaction_id);
            commission.transactionCode = transaction?.data?.transaction_code || 'N/A';
            commission.productName = transaction?.data?.service_items[0].product_detail.name || '~';
          }
        }
      }
      catch (error) {
        if (error.response && error.response.status == 404) {
          this.noDataFound = true; // No data found for the selected employee
          this.notFoundMessage = error.response.data.message
          this.$store.commit('commissions/setCommissions', []); // Clear the previous commissions data
        }
        else {
          // Handle other types of errors
          console.error('gagal menambil data:', error);
        }
      }
    },
  },
}
</script>