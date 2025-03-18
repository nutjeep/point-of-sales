<template>
  <IndexView title="Laporan"/>
  <div class="tab-menu bg-white flex justify-center mt-[70px]">
    <button
      @click="changeTab('tab_detail_transaction')"
      :class="{'text-primary-color-2 font-semibold border-b-primary-color-2 border-b-2 border-primary-color-2': activeTab === 'tab_detail_transaction'}" class=" mx-6 px-5 py-3">Detail Transaksi</button>
    
    <!-- Only Superadmin Can Access -->
    <!-- v-if="this.$store.state.detail_user.user_login.is_super" -->
    <button 
      v-if="isAdmin"
      @click="changeTab('tab_commission')"
      :class="{'text-primary-color-2 font-semibold border-b-primary-color-2 border-b-2 border-primary-color-2': activeTab === 'tab_commission'}" class=" mx-6 px-5 py-3">Komisi</button>
    <button
      v-if="isAdmin"
      @click="changeTab('tab_product')"
      :class="{'text-primary-color-2 font-semibold border-b-primary-color-2 border-b-2 border-primary-color-2': activeTab === 'tab_product'}" class=" mx-6 px-5 py-3">Produk</button>
    <button
      v-if="isAdmin"
      @click="changeTab('tab_customer')"
      :class="{'text-primary-color-2 font-semibold border-b-primary-color-2 border-b-2 border-primary-color-2': activeTab === 'tab_customer'}" class=" mx-6 px-5 py-3">Pelanggan</button>
    <button
      v-if="isAdmin"
      @click="changeTab('tab_payment_method')"
      :class="{'text-primary-color-2 font-semibold border-b-primary-color-2 border-b-2 border-primary-color-2': activeTab === 'tab_payment_method'}" class=" mx-6 px-5 py-3">Metode Pembayaran</button>
  </div>

  <section class="p-6 mt-4">
    <div class="bg-white rounded-lg p-6 shadow-lg">
      <div v-if="activeTab === 'tab_detail_transaction'">
        <ReportDetailTransaction/>
      </div>
      <div v-if="activeTab === 'tab_commission'">
        <ReportCommission/>
      </div>
      <div v-if="activeTab === 'tab_product'">
        <ReportProduct/>
      </div>
      <div v-if="activeTab === 'tab_customer'">
        <ReportCustomer/>
      </div>
      <div v-if="activeTab === 'tab_payment_method'">
        <ReportPaymentMethod/>
      </div>
    </div>
  </section>
</template>

<script>
import IndexView from '@/views/IndexView.vue';
import ReportProduct from './ReportProduct.vue';
import ReportCustomer from './ReportCustomer.vue';
import ReportCommission from './ReportCommission.vue';
import ReportPaymentMethod from './ReportPaymentMethod.vue';
import ReportDetailTransaction from './ReportDetailTransaction.vue';

export default {
  name: "ReportMainView",
  components: {
    IndexView, ReportProduct, ReportCustomer, ReportCommission, ReportPaymentMethod, ReportDetailTransaction
  },
  data() {
    return {
      activeTab: 'tab_detail_transaction',
    }
  },
  created() {
    this.$store.dispatch('outlets/fetchOutlets');
  },
  methods: {
    changeTab(target) {
      this.activeTab = target;
    },
  },
}
</script>