<template>
  <div
    @click="hideModal()"
    id="overlay"
    class="fixed inset-0 bg-black bg-opacity-30 z-40"
    :class="{ 'hidden': !isBlur }"
  ></div>
  <ModalPaymentMethod
    ref="modal"
    v-if="modalShowPaymentMethod"
    @closeModal="closeModal"
    @paymentUpdated="successUpdatePayment()"
    @paymentCreated="successCreatePayment()"
    @failedCreateUpdatePayment="failed()"
    :paymentMethod="selectedPaymentMethod"/>
  
  <IndexView title="Metode Pembayaran"/>
  <AddButton to_url="#" button_text="+ Tambah Metode Pembayaran" button_class="text-sm py-1" @click="showModal"/>
  <section class="p-6">
    <div :id="id" class="tab-content w-1/2 md:w-3/4 bg-white shadow-md rounded-lg p-6">
      <AlertSuccess v-if="alert_success" :text="alert_text"/>
      <AlertDanger v-if="alert_danger" @closeAlertDanger="hideAlertDanger()" :text="alert_text"/>
      <div>
        <table class="table-auto w-full">
          <thead class="bg-gray-300">
            <tr>
              <th class="p-3 text-center">No</th>
              <th class="p-3 text-left">Metode Pembayaran</th>
              <th class="p-3 text-left">Aktif</th>
              <th class="p-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="allPaymentMethods.length == 0">
              <td colspan="4" class="p-3 text-center italic text-gray-400">Belum ada data</td>
            </tr>
            <tr v-else v-for="(paymentMethod, index) in allPaymentMethods" :key="paymentMethod.id">
              <td class="p-3 border-b text-center">{{ index + 1 }}</td>
              <td class="p-3 border-b">{{ paymentMethod.description }}</td>
              <td class="p-3 border-b">
                <BadgeSuccess v-if="paymentMethod.is_active" text="Yes"/>
                <BadgeDanger v-if="!paymentMethod.is_active" text="No"/>
              </td>
              <td class="p-3 border-b">
                <button @click="editPaymentMethod(paymentMethod)" id="edit-data" class="border border-gray-400 hover:border-green-700 hover:bg-green-400 flex justify-center items-center mx-1 p-2 rounded-md group">
                  <PencilSquareIcon class="h-4 w-4 group-hover:text-green-700"/>
                </button>
                <!-- <button @click="deletePaymentMethod(paymentMethod)" id="delete-data" class="border border-gray-400 hover:border-red-500 hover:bg-red-400 flex justify-center items-center mx-1 p-2 rounded-md group">
                  <TrashIcon class="h-4 w-4 text-gray-500 group-hover:text-red-700"/>
                </button> -->
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>

<script>
import ModalPaymentMethod from '@/components/modals/ModalPaymentMethod.vue';
import IndexView from '@/views/IndexView.vue';
import AddButton from '@/components/buttons/AddButton.vue';
import BadgeSuccess from '@/components/badge/BadgeSuccess.vue';
import BadgeDanger from '@/components/badge/BadgeDanger.vue';
import AlertSuccess from '@/components/alerts/AlertSuccess.vue';
import AlertDanger from '@/components/alerts/AlertDanger.vue';
import { mapGetters, mapActions } from 'vuex';
import { PencilSquareIcon } from '@heroicons/vue/24/solid';

export default {
  name: "PaymentMethodView",
  components: {
    AddButton, ModalPaymentMethod, IndexView, BadgeSuccess, BadgeDanger, AlertSuccess, AlertDanger,
    PencilSquareIcon
  },
  data() {
    return {
      isBlur: false,
      alert_success: false,
      alert_danger: false,
      alert_text: '',
      modalShowPaymentMethod: false,
      selectedPaymentMethod: null
    }
  },
  props:{
    id: String
  },
  computed: {
    ...mapGetters('payment_methods', ['allPaymentMethods'])
  },
  created() {
    this.$store.dispatch('payment_methods/fetchPaymentMethods');
  },
  methods: {
    ...mapActions('payment_methods', ['deletePaymentMethodById']),
    showModal() {
      this.modalShowPaymentMethod = true;
      this.isBlur = true;
      this.selectedPaymentMethod = null;
    },
    closeModal() {
      setTimeout(() => {
        this.modalShowPaymentMethod = false;
        this.isBlur = false;
        this.$store.dispatch('payment_methods/fetchPaymentMethods');
      }, 200);
    },
    successCreatePayment() {
      this.alert_success = true;
      this.alert_text = 'Berhasil menambah metode pembayaran';
      setTimeout(() => {
        this.alert_success = false;
      }, 2000);
    },
    successUpdatePayment() {
      this.alert_success = true;
      this.alert_text = 'Berhasil update metode pembayaran';
      setTimeout(() => {
        this.alert_success = false;
      }, 2000);
    },
    failed() {
      this.alert_danger = true;
      this.alert_text = 'error';
    },
    hideAlertDanger() {
      this.alert_danger = false;
      this.alert_text = '';
    },
    editPaymentMethod(paymentMethod) {
      this.selectedPaymentMethod = paymentMethod;
      this.modalShowPaymentMethod = true;
      this.isBlur = true;
    }, 
    async deletePaymentMethod(paymentMethod) {
      if (confirm(`Yakin ingin menghapus metode pembayaran "${paymentMethod.description}"?`)) {
        try {
          await this.deletePaymentMethodById(paymentMethod.id);
          alert('Metode pembayaran berhasil dihapus');
          this.$store.dispatch('payment_methods/fetchPaymentMethods');
        }
        catch (error) {
          console.error('Gagal menghapus metode pembayaran', error);
          alert('Gagal menghapus metode pembayaran');
        }
      }
    },

    // Else for Closing Modal Detail Agenda
    hideModal() {
      this.$refs.modal.closeModal();
    }
  },

}
</script>