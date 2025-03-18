<template>
  <div class="mb-6 flex items-center">
    <span>
      <InputForm @change="fetchReportCommissions()" v-model="filter.startDate" input_class="w-40 me-2" type="date" />
    </span>
    <MinusIcon class="w-5 h-5" />
    <span>
      <InputForm @change="fetchReportCommissions()" v-model="filter.endDate" input_class="w-40 ms-2" type="date" />
    </span>
    <span class="ms-3">
      <select v-model="selectedOutlet" @change="fetchReportCommissions()"
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
        <th class="p-3 border text-left">Staff</th>
        <th class="p-3 border text-left">Total Komisi</th>
      </tr>
    </thead>
    <tbody>
      <tr v-if="processedReportCommissions.length == 0">
        <td colspan="3" class="text-center py-3 italic text-gray-400">Tidak ada data</td>
      </tr>
      <tr v-for="(item, index) in processedReportCommissions" :key="item.id">
        <td class="p-3 border-y text-center">{{ index + 1 }}</td>
        <td class="p-3 border-y text-left">{{ item.user?.name }}</td>
        <td class="p-3 border-y text-left">{{ formatRupiah(item.total_commission) }}</td>
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
  name: "ReportCommission",
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
      processedReportCommissions: [],
      selectedOutlet: '',
      allOutlet: [],
    }
  },
  computed: {
    ...mapGetters('report_commissions', ['allReportCommission']),
    ...mapGetters('outlets', ['allOutlets']),
    userLogin() {
      const user = this.$store.state.detail_user.detail_user;
      return user;
    },
    filteredReportCommissions: {
      get() {
        return this.processedReportCommissions;
      },
      set(commissions) {
        let filteredReportCommissions = commissions;

        if (this.selectedOutlet) {
          filteredReportCommissions = filteredReportCommissions.filter(commission => commission.user.outlet_id == this.selectedOutlet);
        }

        if (!this.$store.state.detail_user.user_login?.is_super && this.userLogin.outlet_id) {
          filteredReportCommissions = filteredReportCommissions.filter(commission => commission.user.outlet_id == this.userLogin?.outlet_id);
        }

        this.processedReportCommissions = filteredReportCommissions;
      }
    }
  },
  created() {
    this.fetchReportCommissions();
  },
  methods: {
    formatRupiah,
    ...mapActions('report_commissions', ['fetchReportCommissions']),

    async fetchReportCommissions(startDate = this.filter.startDate, endDate = this.filter.endDate, type = "start_date") {
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
      await this.$store.dispatch('report_commissions/fetchReportCommissions', params);
      this.filteredReportCommissions = this.allReportCommission;
    },
  }
}
</script>