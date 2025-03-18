<template>
  <section class="w-screen h-screen absolute flex justify-center items-center">
    <div class="modal border-t-4 border-primary-color-2 absolute block w-5/12 bg-white shadow-md rounded-lg z-50"
      :class="{
      'animate__animated animate__zoomIn': showModal,
      'animate__animated animate__zoomOut': !showModal,
      }">
      <div class="modal-header border-b border-gray-400 justify-between flex">
        <div class="w-full py-4">
          <h5 class="text-center font-bold text-lg">{{ trx.transaction_note ? 'Edit' : 'Tambah' }} Catatan</h5>
          <p class="text-center text-sm font-light">{{ transaction?.transaction_code }}</p>
        </div>
        <PlusIcon @click="closeModal()" class="h-6 w-6 rotate-45 cursor-pointer mt-2 mr-2" />
      </div>
      <div class="modal-body p-6">
        <AlertSuccess v-if="alert_success" :text="alert_text"/>
        <label class="font-medium mb-1">Catatan</label>
        <div class="col-span-5 md:col-span-7 relative">
          <TextArea v-model="transaction_note" rows="4" id="transaction-note"/>
        </div>
      </div>
      <div class="modal-footer flex justify-end p-6 border-t border-gray-400">
        <SubmitButton @click="closeModal()" button_name="Tutup" id="close-modal" button_class="bg-gray-200 rounded-lg me-3"/>
        <SubmitButton @click="submit()" button_name="Simpan" id="submit" button_class="bg-primary-color-2 text-white rounded-lg"/>
      </div>
    </div>
  </section>
</template>

<script>
import SubmitButton from '../form/SubmitButton.vue';
import TextArea from '@/components/form/TextArea.vue';
import AlertSuccess from '@/components/alerts/AlertSuccess.vue';
import { PlusIcon, } from '@heroicons/vue/24/solid';
import { formatRupiah } from '@/helpers/formating';
import { mapActions } from 'vuex';

export default {
  name: "ModalAddNote",
  emits: ['closeModalAddNote'],
  props: {
    trx: Object,
    default: null
  },
  components: {
    SubmitButton, AlertSuccess, TextArea,
    PlusIcon
  },
  data() {
    return {
      showModal: true,
      transaction: {},
      transaction_note: this.trx.transaction_note || '',

      alert_success: false,
      alert_text: '',
    }
  },
  methods: {
    formatRupiah,
    ...mapActions('transactions', ['fetchTransactionById', 'updateTransaction']),

    async submit() {
      try {
        this.transaction.transaction_note = this.transaction_note;
        await this.updateTransaction(this.transaction);
        this.alert_success = true;
        this.alert_text = 'Catatan Berhasil Ditambahkan!';
        setTimeout(() => {
          this.showModal = false;
          window.location.reload();
        }, 500); 
      }
      catch(error) {
        console.error(error);
      }
    },

    closeModal(){
      this.$emit('closeModalAddNote');
      this.showModal = false;
    },
  },
  async created() {
    const response = await this.fetchTransactionById(this.trx.id);
    this.transaction = response.data;
  }
}
</script>