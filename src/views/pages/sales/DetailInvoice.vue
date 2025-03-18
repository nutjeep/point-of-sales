<template>
  <Topbar2 pageTitle="Detail Invoice" :back_url="'/penjualan'"/>
  <section class="p-6 mt-[70px]">
    <div class="bg-white rounded-lg p-6 shadow-lg">
      <div class="flex justify-between">
        <h1 class="font-bold text-3xl mb-3">{{ invoice?.invoice_code }}</h1>
        <span>
          <BadgeWarning v-if="transaction?.trx_status == 1" badge_class="uppercase font-medium" text="Pending"/>
          <BadgeSuccess v-if="transaction?.trx_status == 2" badge_class="uppercase font-medium" text="Completed"/>
          <BadgeDanger v-if="transaction?.trx_status == 3" badge_class="uppercase font-medium" text="Canceled"/>
        </span>
      </div>
      <div class="customer-detail mb-6">
        <table>
          <tbody>
            <tr>
              <td class="text-[13px] pe-6 font-light">Nama : </td>
              <td class="text-[13px] font-medium">{{ transaction?.customer?.name }}</td>
            </tr>
            <tr>
              <td class="text-[13px] pe-6 font-light">No Telepon : </td>
              <td class="text-[13px] font-medium">{{ customer?.phone }}</td>
            </tr>
            <tr>
              <td class="text-[13px] pe-6 font-light">Tanggal Invoice : </td>
              <td class="text-[13px] font-medium">{{ formatDate(invoice?.invoice_date) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="order-detail mb-12">
        <table class="table-auto w-full">
          <thead class="bg-black text-white">
            <tr class="border">
              <th class="p-3 border-x text-left">Produk Layanan</th>
              <th class="p-3 border-x text-left">Biaya</th>
              <th class="p-3 border-x text-left">Diskon Layanan</th>
              <th class="p-3 border-x text-left">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="service_item in transaction?.service_items" :key="service_item.id" class="border-y">
              <td class="p-3">{{ service_item?.product_detail?.name }}</td>
              <td class="p-3">{{ formatRupiah(service_item?.price_per_unit) }}</td>
              <td class="p-3">{{ service_item?.discount == 0 ? 0 : service_item?.discount + ' %' }}</td>
              <td class="p-3">{{ formatRupiah(service_item?.subtotal) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="order-summary bg-gray-100 p-6 flex justify-between">
        <div class="invoice-text w-[25rem]">
          <div class="bg-white rounded-md p-4 text-sm max-h-56 overflow-y-scroll" ref="invoiceText">
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
            
            <p>Total yang harus dibayarkan : <span class="font-bold">{{ formatRupiah(transaction?.grand_total) }}</span> {{ transaction?.discount != 0 ? `(disc. ${transaction?.discount}%)` : ''}}</p>

            <span>Pembayaran dapat dilakukan secara cash atau melalui transfer ke rekening :</span>
            <div class="flex flex-col">
              <span>Bank : <span class="font-bold">{{ this.$globalVar.bank_account.bank }}</span></span>
              <span>No Rekening : <span class="font-bold">{{ this.$globalVar.bank_account.no_rek }}</span></span>
              <span>Atas Nama : <span class="font-bold uppercase">{{ this.$globalVar.bank_account.name }}</span></span>
            </div>
            <p>Jika ada pertanyaan, jangan ragu untuk menghubungi kami di nomor 0821-2279-1565 (Jakarta) / 0812-5888-1565 (Surabaya)</p>
          </div>
          <div class="invoice-footer flex justify-end mt-3">
            <button
              @click="copyText()"
              :class="buttonClass"
              id="copy-invoice-text"
              class="rounded-md px-4 text-sm flex items-center hover:text-white hover:bg-black me-3">
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
        <div class="grand-total">
          <table>
            <tbody>
              <tr>
                <td class="pe-6 font-light text-[13px] capitalize">subtotal : </td>
                <td class="font-medium text-[13px]">{{ formatRupiah(calculateSubtotal()) }}</td>
              </tr>
              <tr>
                <td class="pe-6 font-light text-[13px] capitalize">diskon transaksi : </td>
                <td class="font-medium text-[13px]">{{ transaction?.discount +' %' }}</td>
              </tr>
              <tr class="border-b">
                <td class="pe-6 pb-3 font-light text-[13px] capitalize">grand total : </td>
                <td class="font-medium text-[13px] pb-3">{{ formatRupiah(transaction?.grand_total) }}</td>
              </tr>
              <tr>
                <td class="pe-6 pt-3 font-light text-[13px] capitalize">Pembayaran : </td>
                <td class="pt-3 text-[13px] font-medium">{{ formatRupiah(invoice?.total_payment) }}</td>
              </tr>
              <tr>
                <td class="pe-6 font-light text-[13px] capitalize">Kembalian : </td>
                <td class="text-[13px] font-medium">{{ invoice?.payment_status == 1 ? formatRupiah(0) : formatRupiah(invoice?.total_payment - invoice?.total_transaction) }}</td>
              </tr>
              <tr>
                <td class="pe-6 pt-6 font-medium uppercase">sisa tagihan : </td>
                <td class="font-medium pt-6">
                  {{ invoice?.payment_status == 2 ? formatRupiah(0) : formatRupiah(invoice?.total_transaction) }}  
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import Topbar2 from '@/components/Topbar2.vue';
import BadgeSuccess from '@/components/badge/BadgeSuccess.vue';
import BadgeWarning from '@/components/badge/BadgeWarning.vue';
import BadgeDanger from '@/components/badge/BadgeDanger.vue';
import { formatDate, formatRupiah, formatWhatsappNumberLink } from '@/helpers/formating';
import { mapActions } from 'vuex';

export default {
  name: "DetailInvoice",
  props: ['id'],
  components: {
    Topbar2, BadgeWarning, BadgeSuccess, BadgeDanger
  },
  data() {
    return {
      invoice: null,
      transaction: null,
      customer: null,

      buttonClass: 'border border-black',
      buttonText: 'Copy',

      service_items: null
    }
  },
  methods: {
    formatDate, formatRupiah, formatWhatsappNumberLink,
    ...mapActions('invoices', ['fetchInvoiceById']),
    ...mapActions('transactions', ['fetchTransactionById']),
    ...mapActions('customers', ['fetchCustomerById']),

    copyText() {
      const textToCopy = this.$refs.invoiceText.innerText;
      navigator.clipboard.writeText(textToCopy).then(() => {
        this.buttonText = 'Copied';
        this.buttonClass = 'bg-black text-white';
        
        setTimeout(() => {
          this.buttonText = 'Copy';
          this.buttonClass = 'border border-black';
        }, 2000);
      }).catch(err => {
        console.error('Failed to copy text: ', err);
      });
    },

    // Menghitung Subtotal Pada Order-Summary
    calculateSubtotal() {
      if (!this.transaction?.service_items) return 0; // Handle empty service items
      return this.transaction.service_items.reduce((subtotalResult, serviceItem) => subtotalResult + parseInt(serviceItem.subtotal), 0); //Nilai yang dikembalikan adalah dari "subtotalResult". "subtotalResult" bernilai awal 0
    },
  },
  async created() {
    const invoice_id = this.id;
    const response = await this.fetchInvoiceById(invoice_id);
    const invoiceData = response.data;

    const transaction_id = response.data?.pos_transaction_id;
    const responseTransaction = await this.fetchTransactionById(transaction_id)
    const transactionData = responseTransaction.data;
    
    const customer_id = responseTransaction.data?.customer_id;
    if(customer_id) {
      const responseCustomer = await this.fetchCustomerById(customer_id);
      const customerData = responseCustomer.data;
      this.customer = customerData;
    }
    
    this.invoice = invoiceData;
    this.transaction = transactionData;

    this.service_items = this.transaction.service_items
      .map(service => `${service?.product_detail.name} (${this.formatRupiah(service?.price_per_unit)})`)
      .join(', ');

    // console.log("invoice data: ", this.invoice);
    // console.log("transaction data: ", this.transaction);
    // console.log("customer data: ", this.customer);
  },
}
</script>