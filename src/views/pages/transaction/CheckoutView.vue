<template>
  <Topbar2 pageTitle="Checkout" :back_url="'/penjualan'"/>
  <div
    @click="hideModal()"
    id="overlay" 
    class="fixed inset-0 bg-black bg-opacity-30 z-40"
    :class="{ 'hidden': !isBlur }"
  ></div>
  <ModalPayment
    ref="modal"
    v-if="modalPayment"
    @closeModalPayment="hideModalPayment()"
    :trx="transactionToPayment"
  />
  <ModalAddNote
    ref="modal"
    v-if="modalAddNote"
    @closeModalAddNote="hideModalAddNote()"
    :trx="transaction"
  />
  <section class="p-6 mt-[70px]">
    <div class="bg-white rounded-lg p-6 shadow-lg">
      <AlertDanger v-if="alert_danger" :text="alert_text" @closeAlertDanger="hideAlertDanger()"/>
      <div v-if="transaction.trx_status == 2" class="bg-secondary-green-1 text-secondary-green-2 text-center py-2 font-bold rounded-lg mb-6">
        Transaksi Telah Selesai
      </div>
      <div v-if="transaction.trx_status == 3" class="bg-secondary-red-1 text-secondary-red-2 text-center py-2 font-bold rounded-lg mb-6">
        Transaksi Dibatalkan
      </div>
      <div class="grid grid-cols-10 gap-6">
        <div class="col-span-6">
          <template v-if="transaction?.service_items">
            <div v-for="service in transaction.service_items" :key="service.id" class="order-detail border border-gray-400 rounded-lg p-3 mb-6">
              <div class="flex items-center profile mb-6">
                <div class="logo me-3 rounded-full bg-red-900 w-[50px] h-[50px] flex justify-center items-center overflow-hidden">
                  <img class="object-cover w-full h-full" src="/images/jeju_logo.webp" alt="logo jeju">
                </div>
                <div class="flex flex-col">
                  <h1 class="font-bold text-secondary-red-1 text-lg">{{ service.product_detail?.name }}</h1>
                  <p class="text-sm font-light">{{ service.product_detail?.duration }} menit</p>
                </div>
              </div>
              <div class="flex flex-wrap items-center justify-between">
                <div class="time-staff-discount flex">
                  <div class="start-time flex flex-col mx-3 md:mx-2">
                    <label class="mb-1">Waktu</label>
                    <p :class="transaction.trx_status == 2 || transaction.trx_status == 3 ? 'bg-gray-200' : 'bg-secondary-blue-2 text-secondary-blue-1'" class=" px-6 py-1 rounded-md">
                      {{ formatDate(transaction.appointment_date) }}
                      <br>
                      {{ service.start_service_time }}
                    </p>
                  </div>
                  <div class="staff flex flex-col mx-3 md:mx-2">
                    <label class="mb-1">Staff</label>
                    <div class="flex flex-col">
                      <span v-for="staff in service.staff_list" :key="staff.id" :class="transaction.trx_status == 2 || transaction.trx_status == 3 ? 'bg-gray-200' : 'bg-secondary-purple-2 text-secondary-purple-1'" class=" px-3 py-1 mx-1 rounded-md mb-3">{{ staff.employee_name }}</span>
                      <!-- <span class="bg-secondary-purple-2 text-secondary-purple-1 px-3 py-1 mx-1 rounded-md mb-3">2. Wijaya</span> -->
                    </div>
                  </div>
                  <div class="staff flex flex-col mx-3 md:mx-2">
                    <label class="mb-1">Diskon Produk</label>
                    <span :class="transaction.trx_status == 2 || transaction.trx_status == 3 ? 'bg-gray-200' : 'bg-secondary-green-2 text-secondary-green-1'" class=" px-3 py-1 mx-1 rounded-md text-center">{{ service.discount ? parseInt(service.discount) + ' %' : parseInt(service.discount)}}</span>
                  </div>
                </div>
                <div class="grand-total flex flex-col">
                  <p class="text font-bold">Price: </p>
                  <template v-if="parseInt(service.discount) !== 0">
                    <p class="line-through text-sm text-gray-400">{{ formatRupiah(service.price_per_unit) }}</p>
                    <h2 class="font-bold text-xl">{{ formatRupiah(calculateDiscount(service.price_per_unit, service.discount)) }}</h2>
                  </template>
                  <h2 v-else class="font-bold text-xl">{{ formatRupiah(service.price_per_unit) }}</h2>
                </div>
              </div>
            </div>
          </template>
          
          <div class="accordion border-b border-t p-3">
            <!-- <div @click="toggleAccordion()" class="accordion-title flex items-center justify-between cursor-pointer text-gray-500 font-medium" :class="accordionBodyIsVisible ? 'mb-6' : ''">
              <h5 class="text-lg text-gray-600">Pembayaran</h5>
              <PlusIcon v-if="!accordionBodyIsVisible" class="w-5 h-5"/>
              <MinusIcon v-else class="w-5 h-5"/>
            </div> -->
            <div class="accordion-title flex items-center justify-between cursor-pointer text-gray-500 font-medium mb-6">
              <h5 class="text-lg text-black">Pembayaran</h5>
            </div>
            <div class="accordion-body">
              <div class="grid grid-cols-10 gap-6 mb-6">
                <div class="col-span-3 flex items-center">
                  <label>Metode Pembayaran</label>
                </div>
                <div class="col-span-5 md:col-span-7">
                  <template v-for="payment in paymentMethods" :key="payment.id">
                    <button
                      @click="setPaymentMethod(payment.id)"
                      :disabled="transaction.trx_status == 2 || transaction.trx_status == 3"
                      :class="paymentMethodClass(payment.id)"
                      :id="`metode-pembayaran-${payment.id}`"
                      class="px-2 py-1 text-sm rounded-lg border border-primary-color-3 me-3 mb-3">{{ payment.description }}</button>
                  </template>
                </div>
              </div>
              <div class="grid grid-cols-10 gap-6 mb-6">
                <div class="col-span-3 flex items-center">
                  <label>Diskon</label>  
                </div>
                <div class="col-span-5 md:col-span-7 relative">
                  <input v-model="transaction_discount" :disabled="discount_is_applied || transaction.trx_status == 2 || transaction.trx_status == 3" placeholder="Cth: 50" id="transaction-discount" class="block text-lg mt-1 flex-1 border border-gray-400 rounded-lg px-3 py-1 text-gray-500 placeholder:text-gray-400 placeholder:text-[12px] sm:text-sm sm:leading-6 focus:outline-none focus:ring focus:ring-gray-500 w-full" type="text">
                  <span class="absolute bottom-0 right-0 py-1 px-3 border font-medium border-gray-400 rounded-r-lg bg-gray-200 text-gray-400">
                    %
                  </span>
                </div>
              </div>
              <div class="grid grid-cols-10 gap-6 mb-6">
                <div class="col-span-3 flex items-center">
                  <label>Catatan</label>  
                </div>
                <div class="col-span-5 md:col-span-7 relative">
                  <TextArea v-model="transaction_note" rows="4" :is_disabled="discount_is_applied || transaction.trx_status == 2 || transaction.trx_status == 3" id="transaction-note"/>
                </div>
              </div>
              <div class="flex justify-end">
                <SubmitButton @click="editPayment" v-if="discount_is_applied" button_name="Edit" id="edit-payment" button_class="border me-3 border-black text-black hover:bg-black hover:text-white"/>
                <SubmitButton @click="showModalAddNote" v-if="transaction.trx_status == 2" :button_name="transaction.transaction_note ? 'Edit Catatan' : 'Tambah Catatan'" id="edit-payment" button_class="border me-3 border-black text-black hover:bg-black hover:text-white"/>
                <SubmitButton
                  id="save-payment"
                  @click="submit"
                  :is_disable="discount_is_applied || transaction.trx_status == 2 || transaction.trx_status == 3"
                  :button_name="discount_is_applied ? 'Applied' : 'Simpan'"
                  :button_class="discount_is_applied || transaction.trx_status == 2 || transaction.trx_status == 3 ? 'bg-gray-300' : 'bg-primary-color-2 text-white'"/>  
              </div>
            </div>
          </div>
        </div>

        <!-- ORDER DETAIL -->
        <div class="col-span-4">
          <div class="bg-gray-100 p-6 rounded-lg h-full">
            <h2 class="font-bold text-center text-lg mb-3">Order Summary</h2>
            <div class="bg-white p-3 rounded-lg mb-6">
              <table class="table-auto w-full">
                <tbody>
                  <tr>
                    <td class="py-2 font-light md:text-sm">No. Transaksi</td>
                    <td class="py-2 text-end font-medium md:text-sm">{{ transaction?.transaction_code }}</td>
                  </tr>
                  <tr>
                    <td class="py-2 font-light md:text-sm">Pelanggan</td>
                    <td class="py-2 text-end font-medium md:text-sm capitalize">{{ transaction?.customer?.name }}</td>
                  </tr>
                  <tr>
                    <td class="py-2 font-light md:text-sm">Total Item</td>
                    <td class="py-2 text-end font-medium md:text-sm">{{ transaction.service_items ? transaction.service_items.length : 0 }}</td>
                  </tr>
                  <tr>
                    <td class="py-2 font-light md:text-sm">Diskon</td>
                    <td class="py-2 text-end font-medium md:text-sm">{{ transaction?.discount == 0 ? transaction?.discount : transaction?.discount + ' %'}}</td>
                  </tr>
                  <tr>
                    <td class="py-2 font-light md:text-sm">Subtotal</td>
                    <td class="py-2 text-end font-medium md:text-sm">{{ formatRupiah(transaction?.subtotal) }}</td>
                  </tr>
                  <tr>
                    <td class="py-2 pb-6 font-medium md:text-sm">Grand Total</td>
                    <td class="py-2 pb-6 text-end font-bold md:text-sm">{{ formatRupiah(transaction?.grand_total) }}</td>
                  </tr>
                  <tr class="border-t">
                    <td class="py-2 font-light md:text-sm">Jumlah Dibayarkan</td>
                    <td class="py-2 text-end font-medium md:text-sm">{{ formatRupiah(posPayment.total_payment) }}</td>
                  </tr>
                  <tr>
                    <td class="font-light md:text-sm">Kembalian</td>
                    <td class="text-end font-medium md:text-sm">{{ formatRupiah(posPayment.total_change) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div :class="transaction.trx_status == 2 || transaction.trx_status == 3 ? 'bg-gray-300' : 'bg-primary-color-3 text-white'" class="p-3 items-end justify-between flex rounded-lg">
              <p class="capitalize md:text-sm">grand total :</p>
              <h3 class="text-xl font-bold">{{ formatRupiah(transaction?.grand_total) }}</h3>
            </div>
            <div class="flex flex-wrap justify-between border-t pt-6">
              <div class="flex md:justify-between">
                <div class="flex">
                  <button @click="showOrderSummary()" id="show-order-summary" :class="transaction.trx_status == 2 ? 'bg-primary-color-2 text-white ' : 'bg-gray-300 text-black border-black'" class="me-1 py-2 px-4 md:py-2 md:px-3 text-[14px] rounded-lg flex items-center border">
                    <PrinterIcon class="w-4 h-4 me-2"/>
                    <span>Print</span>
                  </button>
                  <a
                    :href="transaction?.customer?.phone
                      ? `https://api.whatsapp.com/send?phone=${formatWhatsappNumberLink(transaction?.customer.phone)}&text=Halo%20*${transaction?.customer.name}*%0ATerima%20kasih%20telah%20menggunakan%20layanan%20di%20*Jeju%20Nail%2C%20Eyelash%20%26%20Salon%20Studio*.%20Berikut%20adalah%20detail%20order%20Anda%20%3A%0A%0ANo%20Invoice%20%3A%20*${transaction?.invoice.invoice_code}*%0ANama%20%3A%20*${transaction?.customer.name}*%0ATanggal%20Pengerjaan%20%3A%20*${formatDate(transaction?.appointment_date)}*%0AWaktu%20Pengerjaan%20%3A%20*${transaction?.appointment_hour}*%0ADetail%20Layanan%20%3A%0A*${service_items}*%0A%0ATotal%20yang%20harus%20dibayarkan%20%3A%20*${formatRupiah(transaction?.grand_total)}*%0A%0APembayaran%20dapat%20dilakukan%20secara%20cash%20atau%20melalui%20transfer%20ke%20rekening%20%3A%0ABank%20%3A%20*${this.$globalVar.bank_account.bank}*%0ANo%20Rekening%20%3A%20*${this.$globalVar.bank_account.no_rek}*%0AAtas%20Nama%20%3A%20*${this.$globalVar.bank_account.name}*%0A%0AJika%20ada%20pertanyaan%2C%20jangan%20ragu%20untuk%20menghubungi%20kami%20di%20nomor%200821-2279-1565%20(Jakarta)%20%2F%200812-5888-1565%20(Surabaya)`
                      : '#'"
                    :aria-disabled="transaction?.customer?.phone ? false : true"
                    class="flex items-center rounded-lg px-2 border bg-white text-sm"
                    :class="transaction?.customer?.phone ? 'border-emerald-600 text-emerald-600 border-r-2 border-b-2' : 'border-gray-500 text-gray-500'"
                    :target="transaction?.customer?.phone ? '_blank' : ''">
                    <img v-if="transaction?.customer?.phone" src="/images/whatsapp.webp" alt="whatsapp" class="me-1" width="20" height="20">
                    {{ transaction?.customer?.phone ? 'Kirim' : 'No phone number' }}
                  </a>
                </div>
                
              </div>
              <button
                @click="showModalPayment()"
                :disabled="transaction.trx_status == 2 || transaction.trx_status == 3 || !readyToPayment"
                :class="transaction.trx_status == 2 || transaction.trx_status == 3 || !readyToPayment ? 'bg-gray-300 text-gray-800' : 'bg-primary-color-2 text-white'"
                id="show-modal-payment"
                class="px-4 font-medium md:px-3 py-2 text-[1rem] rounded-lg flex items-center  justify-between">
                Bayar
                <ChevronRightIcon class="w-5 h-5 ms-3 font-medium md:ms-2"/>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import Topbar2 from '@/components/Topbar2.vue';
import TextArea from '@/components/form/TextArea.vue';
import SubmitButton from '@/components/form/SubmitButton.vue';
import ModalPayment from '@/components/modals/ModalPayment.vue';
import ModalAddNote from '@/components/modals/ModalAddNote.vue';
import AlertDanger from '@/components/alerts/AlertDanger.vue';
import { calculateDiscount } from '@/helpers/calculation';
import { formatRupiah, formatDate, formatWhatsappNumberLink } from '@/helpers/formating';
import { mapActions, mapGetters } from 'vuex';
import { ChevronRightIcon, PrinterIcon } from '@heroicons/vue/24/solid';

export default {
  name: "CheckoutView",
  props: ['id', 'trx'],
  components: {
    Topbar2, SubmitButton, ModalPayment, ModalAddNote, TextArea, AlertDanger,
    ChevronRightIcon, PrinterIcon
  },
  data() {
    return {
      isBlur: false,
      modalPayment: false,
      modalAddNote: false,
      readyToPayment: false,
      payment_method: '',
      transaction_discount: '',
      transaction_note: '',
      transactionToPayment: {},
      transaction: {},
      alert_danger: false,
      alert_text: '',
      discount_is_applied: false,
      pos_payment: {},

      service_items: null
    }
  },
  computed: {
    ...mapGetters('payment_methods', ['allPaymentMethods']),

    paymentMethods() {
      return this.allPaymentMethods.filter( payment =>
        payment.is_active === true
      );
    },
    posPayment() {
      if (!this.pos_payment || this.pos_payment.length === 0) {
        return {
          total_payment: '',
          total_change: ''
        };
      }
      else {
        return {
          total_payment: this.pos_payment[0]?.total_payment || '',
          total_change: this.pos_payment[0]?.total_change || ''
        };
      }
    }
  },
  async created() {
    this.$store.dispatch('payment_methods/fetchPaymentMethods');

    if(this.id) {
      try {
        const response = await this.fetchPosPaymentByTransactionId(this.id);

        if (response && response.data) {
          this.pos_payment = response.data;
          // console.log('pos_payment: ', this.pos_payment);
        }
        else {
          console.error('Failed fetch pos payment:', response);
        }
      }
      catch(error) {
        console.error(error);
      }

      try {
        const response = await this.fetchTransactionById(this.id);
        
        if (response && response.data) {
          this.transaction = response.data;
          this.transaction_discount = this.transaction.discount;
          this.payment_method = this.transaction.invoice.payment_method;
          this.transaction_note = this.transaction.transaction_note;

          this.service_items = this.transaction.service_items
            .map(service => `${service?.product_detail.name} (${this.formatRupiah(service?.price_per_unit)})`)
            .join(', ');
        }
        else {
          console.error('Failed to fetch pos payment: ', response);
        }
      }
      catch(error) {
        console.error(error);
      }
    }
    // console.log('trx: ', this.transaction);
  },
  methods: {
    formatDate,
    formatRupiah,
    calculateDiscount,
    formatWhatsappNumberLink,
    ...mapActions('transactions', ['fetchTransactionById', 'updateTransaction']),
    ...mapActions('pos_payments', ['fetchPosPaymentByTransactionId']),

    // toggleAccordion() {
    //   this.accordionBodyIsVisible = !this.accordionBodyIsVisible
    // },
    setPaymentMethod(payment_id) {
      this.payment_method = payment_id;
      // console.log('pay method: ', this.payment_method);
    },
    paymentMethodClass(payment_id) {
      return this.payment_method === payment_id ? 'bg-primary-color-3 text-white': 'bg-white text-primary-color-3';
    },
    hideModalPayment(){
      this.isBlur = false,
      setTimeout(() => {
        this.modalPayment = false;
      }, 500);
    },
    hideModalAddNote(){
      this.isBlur = false,
      setTimeout(() => {
        this.modalAddNote = false;
      }, 500);
    },
    hideAlertDanger() {
      this.alert_danger = false;
      this.alert_text = '';
    },
    async editPayment() {
      this.payment_method = '';
      this.discount_is_applied = false;
      this.transaction_discount = 0;
      this.transaction.discount = this.transaction_discount;
      
      await this.updateTransaction(this.transaction);
      const response = await this.fetchTransactionById(this.transaction.id);
      this.transaction = response.data;
      console.log('edit pembayaran: ', this.transaction);
    },
    async submit() {
      if(!this.payment_method) {
        this.alert_danger = true;
        this.alert_text = 'Pilih metode pembayaran!';
        return;
      }
      this.transaction.payment_method = this.payment_method;
      this.transaction.discount = this.transaction_discount;
      this.transaction.transaction_note = this.transaction_note;
      this.transaction.subtotal = calculateDiscount(this.transaction.subtotal, this.transaction.discount);
      this.transaction.grand_total = parseInt(this.transaction.subtotal) - (parseInt(this.transaction.tax) + parseInt(this.transaction.service_charge));
      this.transactionToPayment = this.transaction;
      this.discount_is_applied = true;
      this.readyToPayment = true;
      await this.updateTransaction(this.transaction);
      const response = await this.fetchTransactionById(this.transaction.id);
      this.transaction = response.data;
    },
    showModalPayment() {
      if(!this.payment_method) {
        this.alert_danger = true;
        this.alert_text = 'Pilih metode pembayaran!';
        return;
      }
      this.isBlur = true;
      this.modalPayment = true;
      this.$emit('trx', this.transaction);
    },
    showModalAddNote() {
      this.isBlur = true;
      this.modalAddNote = true;
      this.$emit('trx', this.transaction);
    },

    showOrderSummary() {
      const newTabUrl = this.$router.resolve({ name: 'OrderSummary', params: { id: this.transaction.id } }).href;
      window.open(newTabUrl, '_blank');
    },

    // Else for Closing Modal Detail Agenda
    hideModal() {
      this.$refs.modal.closeModal();
    }
  }
}
</script>