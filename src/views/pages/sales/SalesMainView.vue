<template>
   <IndexView title="Penjualan"/>
   <AddButton id="to-new-appointment" :to_url="{ name: 'AddAppoinment' }" />
   <div
      @click="hideModal()"
      id="overlay"
      class="fixed inset-0 bg-black bg-opacity-30 z-40"
      :class="{ 'hidden': !isBlur }"
   ></div>
   <ModalDetailAgenda
      ref="modal"
      v-if="modalDetailAgenda"
      :detailAgenda="selectedAgenda"
      @closeModalDetailAgenda="hideModalDetailAgenda"/>
   <div class="tab-menu bg-white flex justify-center mt-[70px]">
      <!-- <button @click="changeTab('tab_daily_sales')" :class="{'text-primary-color-2 font-semibold border-b-primary-color-2 border-b-2 border-primary-color-2': activeTab === 'tab_daily_sales'}" class=" mx-6 px-5 py-3">Penjualan Harian</button> -->
      <button @click="changeTab('tab_booking')" id="to-tab-booking" :class="{'text-primary-color-2 font-semibold border-b-primary-color-2 border-b-2 border-primary-color-2': activeTab === 'tab_booking'}" class=" mx-6 px-5 py-3">Status Booking</button>
      <button @click="changeTab('tab_invoice')" id="to-tab-invoice" :class="{'text-primary-color-2 font-semibold border-b-primary-color-2 border-b-2 border-primary-color-2': activeTab === 'tab_invoice'}" class=" mx-6 px-5 py-3">Daftar Invoice</button>
   </div>
   <section class="p-6 mt-4">
      <div class="bg-white rounded-lg p-6 shadow-lg">
         <!-- <div v-if="activeTab === 'tab_daily_sales'">
            
         </div> -->
         <div v-if="activeTab === 'tab_booking'">
            <SalesTabStatusBooking @selectedAgenda="handleDataAgenda"/>
         </div>
         <div v-if="activeTab === 'tab_invoice'">
            <SalesTabInvoice />
         </div>
      </div>
   </section>
</template>

<script>
import IndexView from '@/views/IndexView.vue';
import SalesTabInvoice from '@/views/pages/sales/SalesTabInvoice.vue';
import SalesTabStatusBooking from '@/views/pages/sales/SalesTabStatusBooking.vue';
import ModalDetailAgenda from '@/components/modals/ModalDetailAgenda.vue';
import AddButton from '@/components/buttons/AddButton.vue';

export default {
   name: "SalesMainView",
   components: {
      IndexView, SalesTabInvoice, SalesTabStatusBooking, ModalDetailAgenda, AddButton
   },
   data() {
      return {
         activeTab: 'tab_booking',
         modalDetailAgenda: false,
         selectedAgenda: null,
         isBlur: false,
      }
   },
   methods: {
      changeTab(target) {
         this.activeTab = target;
      },

      // Show / Hide Modal Detail Agenda / Detail Transaction
      handleDataAgenda(data){
         this.selectedAgenda = data;
         this.showModalDetailAgenda();
      },
      showModalDetailAgenda() {
         this.isBlur = true;
         this.modalDetailAgenda = true;
      },
      hideModalDetailAgenda(){
         setTimeout(() => {
            this.modalDetailAgenda = false;
         }, 500);
         window.location.reload();
         this.isBlur = false;
      },

      // Else for Closing Modal Detail Agenda
      hideModal() {
         this.$refs.modal.closeModal();
      }
   },
}
</script>