<template>
  <div :class="{'animate__animated animate__fadeInUp': showModal, 'animate__animated animate__fadeOutDown': !showModal}" class="invoice-detail absolute bg-gray-100 rounded-lg right-[5%] max-w-[400px] shadow-lg border border-gray-300 overflow-hidden">
    <div class="invoice-header flex justify-between border-b bg-white border-gray-400">
      <div class="w-full py-2">
        <h5 class="text-center font-bold text-lg">Invoice</h5>
      </div>
      <PlusIcon @click="closeModal" id="close-modal-invoice" class="h-6 w-6 rotate-45 cursor-pointer mt-1 me-1" />
    </div>
    <div class="invoice-body my-4 px-4">
      <div class="bg-white rounded-md p-4 text-sm max-h-56 overflow-y-scroll border-gray-400 border" ref="invoiceText">
        <p>Halo <strong>{{ transaction?.customer?.name }}</strong></p>

        <div>Terima kasih telah menggunakan layanan di <span class="font-bold">Jeju Nail, Eyelash & Salon Studio.</span> Berikut adalah detail order Anda :</div>
        <div class="flex flex-col">
          <span>No Invoice : <strong>{{ transaction?.invoice?.invoice_code }}</strong></span>
          <span>Nama : <strong>{{ transaction?.customer?.name }}</strong></span>
          <span>Tanggal Pengerjaan : <strong>{{ formatDate(transaction?.appointment_date) }}</strong></span>
          <span>Waktu Pengerjaan : <strong>{{ transaction?.appointment_hour }}</strong></span>
        </div>
        
        <p class="flex flex-col">
          <span>Detail Layanan : </span>
          <span>
            <ul>
              <li v-for="(service_item, index) in transaction?.service_items" :key="service_item.id">
                <span class="font-bold"> {{ index + 1 }}. {{ service_item?.product_detail?.name }} <span class="font-normal">({{ formatRupiah(service_item?.price_per_unit) }})</span></span>
              </li>
            </ul>
          </span>
        </p>
        
        <p>Total yang harus dibayarkan : <span class="font-bold">{{ formatRupiah(transaction?.grand_total) }}</span></p>

        <span>Pembayaran dapat dilakukan secara cash atau melalui transfer ke rekening :</span>
        <div class="flex flex-col">
          <span>Bank : <span class="font-bold">{{ this.$globalVar.bank_account.bank }}</span></span>
          <span>No Rekening : <span class="font-bold">{{ this.$globalVar.bank_account.no_rek }}</span></span>
          <span>Atas Nama : <span class="font-bold uppercase">{{ this.$globalVar.bank_account.name }}</span></span>
        </div>
        <p>Jika ada pertanyaan, jangan ragu untuk menghubungi kami di nomor 0821-2279-1565 (Jakarta) / 0812-5888-1565 (Surabaya)</p>
      </div>
    </div>
    <div class="invoice-footer px-4 pb-4 flex justify-end">
      <button
        @click="copyText()"
        :class="buttonClass"
        id="copy-invoice"
        class="rounded-md px-3 flex items-center me-3">
        {{ buttonText }}
      </button>
      <a
        :href="transaction?.customer.phone
          ? `https://api.whatsapp.com/send?phone=${formatWhatsappNumberLink(transaction?.customer.phone)}&text=Halo%20*${transaction?.customer.name}*%0ATerima%20kasih%20telah%20menggunakan%20layanan%20di%20*Jeju%20Nail%2C%20Eyelash%20%26%20Salon%20Studio*.%20Berikut%20adalah%20detail%20order%20Anda%20%3A%0A%0ANo%20Invoice%20%3A%20*${transaction?.invoice.invoice_code}*%0ANama%20%3A%20*${transaction?.customer.name}*%0ATanggal%20Pengerjaan%20%3A%20*${formatDate(transaction?.appointment_date)}*%0AWaktu%20Pengerjaan%20%3A%20*${transaction?.appointment_hour}*%0ADetail%20Layanan%20%3A%0A*${service_items}*%0A%0ATotal%20yang%20harus%20dibayarkan%20%3A%20*${formatRupiah(transaction?.grand_total)}*%0A%0APembayaran%20dapat%20dilakukan%20secara%20cash%20atau%20melalui%20transfer%20ke%20rekening%20%3A%0ABank%20%3A%20*${this.$globalVar.bank_account.bank}*%0ANo%20Rekening%20%3A%20*${this.$globalVar.bank_account.no_rek}*%0AAtas%20Nama%20%3A%20*${this.$globalVar.bank_account.name}*%0A%0AJika%20ada%20pertanyaan%2C%20jangan%20ragu%20untuk%20menghubungi%20kami%20di%20nomor%200821-2279-1565%20(Jakarta)%20%2F%200812-5888-1565%20(Surabaya)`
          : '#'"
        :aria-disabled="transaction?.customer.phone ? false : true"
        class="flex items-center rounded-md px-2 border bg-white"
        :class="transaction?.customer.phone ? 'border-emerald-600 text-emerald-600 border-r-2 border-b-2' : 'border-gray-500 text-gray-500'"
        :target="transaction?.customer.phone ? '_blank' : ''">
        <img v-if="transaction?.customer.phone" src="/images/whatsapp.webp" alt="whatsapp" class="me-2" width="20" height="20">
        {{ transaction?.customer.phone ? 'Kirim' : 'no phone number' }}
      </a>
    </div>
  </div>
</template>

<script>
import { formatRupiah, formatDate, formatWhatsappNumberLink } from '@/helpers/formating';
import { PlusIcon } from '@heroicons/vue/24/solid';

export default {
  name: "ModalInvoice",
  emits: ['closeModalInvoice'],
  props: {
    trx: {
      type: Object,
      default: null,
    }
  },
  data() {
    return {
      showModal: true,
      buttonClass: 'bg-white border border-gray-600',
      buttonText: 'Copy',
      transaction: this.trx,

      service_items: null
    }
  },
  components: {
    PlusIcon
  },
  created() {
    // console.log('invoice: ', this.transaction);
    this.service_items = this.transaction.service_items
      .map(service => `${service?.product_detail.name} (${this.formatRupiah(service?.price_per_unit)})`)
      .join(', ');
  },
  methods: {
    formatRupiah, formatDate, formatWhatsappNumberLink,

    closeModal() {
      this.showModal = false;
      this.$emit('closeModalInvoice');
    },
    copyText() {
      const textToCopy = this.$refs.invoiceText.innerText;
      navigator.clipboard.writeText(textToCopy).then(() => {
        this.buttonText = 'Copied';
        this.buttonClass = 'bg-black text-white';
        
        setTimeout(() => {
          this.buttonText = 'Copy';
          this.buttonClass = 'bg-white border border-gray-600';
        }, 2000);
      }).catch(err => {
        console.error('Failed to copy text: ', err);
      });
    }
  }
}
</script>