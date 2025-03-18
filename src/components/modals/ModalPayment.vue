<template>
  <section class="w-screen h-screen absolute flex justify-center items-center">
    <div class="modal border-t-4 border-primary-color-2 absolute block w-5/12 bg-white shadow-md rounded-lg z-50"
      :class="{
      'animate__animated animate__zoomIn': showModal,
      'animate__animated animate__zoomOut': !showModal,
      }">
      <div class="modal-header border-b border-gray-400 justify-between flex">
        <div class="w-full py-4">
          <h5 class="text-center font-bold text-lg">Bayar</h5>
        </div>
        <PlusIcon @click="closeModal()" class="h-6 w-6 rotate-45 cursor-pointer mt-2 mr-2" />
      </div>
      <div class="px-6 pt-3">
        <span class="text-sm bg-secondary-blue-2 rounded-lg px-3 py-1 text-secondary-blue-1">Grand Total : <strong>{{ formatRupiah(transaction?.grand_total) }}</strong></span>
      </div>
      <div class="modal-body p-6">
        <div v-if="alert_success || alert_danger">
          <AlertSuccess v-if="alert_success" :text="alert_text"/>
          <AlertDanger v-if="alert_danger" @closeAlertDanger="hideAlertDanger()" :text="alert_text"/>
        </div>
        <InputRupiah v-model="pos_payment.total_payment" label="Jumlah Pembayaran" input_class="w-full" placeholder="Cth: 500.000"/>
      </div>
      <div class="modal-footer flex justify-end p-6 border-t border-gray-400">
        <SubmitButton button_name="Tutup" id="close-modal" button_class="bg-gray-200 rounded-lg me-3" @click="closeModal()"/>
        <SubmitButton
          @click="makePayment()"
          :loading="loadingPayment"
          button_name="Bayar"
          id="make-payment"
          button_class="bg-primary-color-2 text-white rounded-lg"/>
      </div>
    </div>
  </section>
</template>

<script>
import SubmitButton from '../form/SubmitButton.vue';
import InputRupiah from '../form/InputRupiah.vue';
import AlertSuccess from '@/components/alerts/AlertSuccess.vue';
import AlertDanger from '@/components/alerts/AlertDanger.vue';
import { PlusIcon, } from '@heroicons/vue/24/solid';
import { formatRupiah } from '@/helpers/formating';
import { mapActions } from 'vuex';

export default {
  name: "ModalPayment",
  emits: ['closeModalPayment'],
  props: {
    trx: Object,
    default: null
  },
  components: {
    SubmitButton, AlertSuccess, AlertDanger, InputRupiah,
    PlusIcon
  },
  data() {
    return {
      showModal: true,
      transaction: {},
      pos_payment: {
        transaction_id: null,
        payment_method_id: null,
        total_payment: null,
      },

      alert_success: false,
      alert_danger: false,
      alert_text: '',

      loadingPayment: false,
    }
  },
  methods: {
    formatRupiah,
    ...mapActions('pos_payments', ['createPosPayment']),
    ...mapActions('transactions', ['fetchTransactionById']),

    closeModal(){
      this.$emit('closeModalPayment');
      this.showModal = false;
    },
    hideAlertDanger() {
      this.alert_danger = false;
      this.alert_text = '';
    },
    async makePayment() {
      // console.log('make payment: ', this.pos_payment);
      if(this.pos_payment.total_payment < this.transaction?.grand_total) {
        this.alert_danger = true;
        this.alert_text = 'Pembayaran Anda Kurang!';
        return;
      }

      this.loadingPayment = true;

      try {
        await this.createPosPayment(this.pos_payment);
        this.alert_success = true;
        this.alert_text = 'Pembayaran berhasil!';
        setTimeout(() => {
          this.showModal = false;
          window.location.reload();
        }, 500); 
      }
      catch(error) {
        console.error(error);
      }
      finally {
        this.loadingPayment = false;
      }
    }
  },
  async created() {
    const response = await this.fetchTransactionById(this.trx.id);
    this.transaction = response.data;

    this.pos_payment.transaction_id = this.transaction.id;
    this.pos_payment.payment_method_id = this.trx.payment_method;
    // console.log('trx payment: ', this.trx);
  }
}
</script>