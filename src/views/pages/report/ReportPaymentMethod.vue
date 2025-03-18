<template>
  <div class="mb-6 flex items-center">
    <span>
      <InputForm @change="fetchReportPaymentMethods()" v-model="filter.start_date" input_class="w-40 me-2"
        type="date" />
    </span>
    <MinusIcon class="w-5 h-5" />
    <span>
      <InputForm @change="fetchReportPaymentMethods()" v-model="filter.end_date" input_class="w-40 ms-2" type="date" />
    </span>
    <span class="ms-3">
      <select v-model="selectedOutlet" @change="fetchReportPaymentMethods()"
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
        <th class="p-3 border text-left">Metode Pembayaran</th>
        <th class="p-3 border text-left">Total Penggunaan</th>
        <th class="p-3 border text-left">Total Pembayaran</th>
      </tr>
    </thead>
    <tbody>
      <tr v-if="processReportPayment.length == 0">
        <td colspan="4" class="text-center py-3 italic text-gray-400">Tidak ada data</td>
      </tr>
      <tr v-for="(item, index) in processReportPayment" :key="item.id">
        <td class="p-3 border-y text-center">{{ index + 1 }}</td>
        <td class="p-3 border-y text-left">{{ item.payment_method_description }}</td>
        <td class="p-3 border-y text-left">{{ item.total_usage }}</td>
        <td class="p-3 border-y text-left">{{ formatRupiah(item.total_payment) }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import InputForm from '@/components/form/InputForm.vue';
import { mapGetters, mapActions } from 'vuex';
import { formatRupiah } from '@/helpers/formating';
import { MinusIcon } from '@heroicons/vue/24/solid';

export default {
  name: "ReportPaymentMethod",
  components: {
    InputForm,
    MinusIcon
  },
  data() {
    return {
      filter: {
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date().toISOString().split('T')[0]
      },
      selectedOutlet: '',
      allOutlet: [],
    }
  },
  computed: {
    ...mapGetters('report_payment_methods', ['allReportPaymentMethod']),
    ...mapGetters('outlets', ['allOutlets']),
    userLogin() {
      const user = this.$store.state.detail_user.detail_user;
      return user;
    },
    
    processReportPayment() {
      let processData = this.allReportPaymentMethod

      processData = processData.reduce((acc, item) => {
        const key = `${item['payment_method.id']}_${item['payment_method.description']}_${item['outlet_id']}`;

        if (!acc[key]) {
          acc[key] = {
            payment_method_id: item['payment_method.id'],
            payment_method_description: item['payment_method.description'],
            outlet_id: item['outlet_id'],
            total_usage: 0,
            total_payment: 0
          };
        }

        acc[key].total_usage += Number(item.total_usage);  // Sum total usage
        acc[key].total_payment += Number(item.total_payment);  // Sum total payment

        return acc;
      }, {});

      processData = Object.values(processData);

      console.log('process data: ', processData);

      if (this.selectedOutlet) {
        return processData.filter(item => item.outlet_id == this.selectedOutlet)
      }

      if (!this.$store.state.detail_user.user_login?.is_super && this.userLogin?.outlet_id) {
        return processData.filter(item => item.outlet_id == this.userLogin.outlet_id)
      }

      return processData
    }
  },
  created() {
    this.fetchReportPaymentMethods();
  },
  methods: {
    formatRupiah,
    ...mapActions('report_payment_methods', ['fetchReportPaymentMethods']),

    async fetchReportPaymentMethods(startDate = this.filter.start_date, endDate = this.filter.end_date, type = "start_date") {
      // Check if start_date is greater than end_date
      if (type == "start_date" && this.filter.start_date > this.filter.end_date) {
        this.filter.end_date = this.filter.start_date; // Set end_date to start_date
      }

      // Check if end_date is less than start_date
      if (type == "end_date" && this.filter.start_date > this.filter.end_date) {
        this.filter.start_date = this.filter.end_date; // Set start_date to end_date
      }

      const params = {
        startDate,
        endDate,
        outlet_id: this.selectedOutlet
      }
      await this.$store.dispatch('report_payment_methods/fetchReportPaymentMethods', params);
    }
  }
}
</script>