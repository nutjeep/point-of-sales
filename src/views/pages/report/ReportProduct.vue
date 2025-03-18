<template>
  <div class="mb-6 flex items-center">
    <span>
      <InputForm @change="fetchReportProducts()" v-model="filter.startDate" input_class="w-40 me-2" type="date" />
    </span>
    <MinusIcon class="w-5 h-5" />
    <span>
      <InputForm @change="fetchReportProducts()" v-model="filter.endDate" input_class="w-40 ms-2" type="date" />
    </span>
    <span class="ms-3">
      <select v-model="selectedOutlet" @change="fetchReportProducts()"
        class="block w-48 text-lg mt-1 flex-1 border border-gray-400 rounded-lg px-3 py-2 text-gray-500 placeholder:text-gray-300 placeholder:text-[12px] sm:text-sm sm:leading-6 focus:outline-none focus:ring focus:ring-gray-500">
        <option value="" selected>Semua Branch</option>
        <option v-for="outlet in allOutlets" :key="outlet.id" :value="outlet.id">{{ outlet.name }}</option>
      </select>
    </span>
  </div>
  <table class="table-auto w-full mb-6">
    <thead class="bg-gray-300">
      <tr>
        <th class="p-3 border text-center">No</th>
        <th class="p-3 border text-left">Produk</th>
        <th class="p-3 border text-left">Harga Satuan</th>
        <th class="p-3 border text-left">Total Produk Terjual</th>
        <th class="p-3 border text-left">Total Penjualan</th>
      </tr>
    </thead>
    <tbody>
      <tr v-if="combinedReportProducts.length == 0">
        <td colspan="5" class="text-center py-3 italic text-gray-400">Tidak ada data</td>
      </tr>
      <tr v-for="(item, index) in combinedReportProducts" :key="item.id">
        <td class="p-3 border-y text-center">{{ index + 1 }}</td>
        <td class="p-3 border-y">{{ item.product_detail?.name }}</td>
        <td class="p-3 border-y">{{ formatRupiah(item.product_detail?.sale_price) }}</td>
        <td class="p-3 border-y">{{ item.total_quantity_sold }}</td>
        <td class="p-3 border-y">{{ formatRupiah(item.total_sales) }}</td>
      </tr>
    </tbody>
  </table>
  <div class="flex justify-end" v-if="combinedReportProducts.length">
    <div>
      <h4 class="text-primary-color-2 border-b pb-1">Total Produk Terjual: <span class="font-medium">{{
        totalQuantitySold }}</span></h4>
      <h4 class="text-primary-color-2 border-b pt-2 pb-1">Total Penjualan: <span class="font-medium">{{
        formatRupiah(totalSales) }}</span></h4>
    </div>
  </div>
</template>

<script>
import InputForm from '@/components/form/InputForm.vue';
import { MinusIcon } from '@heroicons/vue/24/solid';
import { mapGetters, mapActions } from 'vuex';
import { formatRupiah } from '@/helpers/formating';

export default {
  name: "ReportProduct",
  components: {
    InputForm,
    MinusIcon
  },
  data() {
    return {
      filter: {
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0]
      },
      selectedOutlet: '',
      allOutlet: [],
    }
  },
  computed: {
    ...mapGetters('report_products', ['allReportProduct']),
    ...mapGetters('outlets', ['allOutlets']),
    userLogin() {
      const user = this.$store.state.detail_user.detail_user;
      return user;
    },

    // Combine products with the same product_id
    combinedReportProducts() {
      let combined = {};
      this.allReportProduct.forEach((item) => {
        if (combined[item.product_id]) {
          combined[item.product_id].total_quantity_sold += parseInt(item.total_quantity_sold);
          combined[item.product_id].total_sales += parseFloat(item.total_sales);
        } else {
          combined[item.product_id] = { ...item };
          combined[item.product_id].total_quantity_sold = parseInt(item.total_quantity_sold);
          combined[item.product_id].total_sales = parseFloat(item.total_sales);
        }
      });

      combined = Object.values(combined);

      if (this.selectedOutlet) {
        combined = combined.filter(commission => commission.transaction.outlet_id == this.selectedOutlet);
      }

      if (!this.$store.state.detail_user.user_login?.is_super && this.userLogin?.outlet_id) {
        combined = combined.filter(commission => commission.transaction.outlet_id == this.userLogin.outlet_id);
      }

      console.log('combined: ', combined);
      return Object.values(combined);
    },

    // Total calculation
    totalQuantitySold() {
      return this.combinedReportProducts.reduce((total, item) => total + item.total_quantity_sold, 0);
    },
    totalSales() {
      return this.combinedReportProducts.reduce((total, item) => total + item.total_sales, 0);
    }
  },
  created() {
    this.fetchReportProducts();
  },
  methods: {
    formatRupiah,
    ...mapActions('report_products', ['fetchReportProducts']),

    async fetchReportProducts(startDate = this.filter.startDate, endDate = this.filter.endDate, type = "start_date") {
      // Check if start_date is greater than end_date
      if (type == "start_date" && this.filter.startDate > this.filter.endDate) {
        this.filter.endDate = this.filter.startDate; // Set end_date to start_date
      }

      // Check if end_date is less than start_date
      if (type == "end_date" && this.filter.startDate > this.filter.endDate) {
        this.filter.startDate = this.filter.endDate; // Set start_date to end_date
      }

      const params = {
        startDate,
        endDate,
        outlet_id: this.selectedOutlet
      }
      await this.$store.dispatch('report_products/fetchReportProducts', params);
    }
  }
}
</script>