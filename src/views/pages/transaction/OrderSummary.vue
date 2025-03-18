<template>
  <section class="flex flex-col items-center justify-center h-full">
    <div class="flex justify-center mb-6">
      <button @click="changeTab('order_summary_1')" id="order_summary_1" :class="{'text-white bg-black' : active_tab == 'order_summary_1'}" class="px-3 py-1 border border-black uppercase text-sm">Order Summary 1</button>
      <button @click="changeTab('order_summary_2')" id="order_summary_2" :class="{'text-white bg-black' : active_tab == 'order_summary_2'}" class="px-3 py-1 border border-black uppercase text-sm">Order Summary 2</button>
    </div>
    <div v-if="active_tab == 'order_summary_1'" id="order-summary" class="bg-white rounded-lg shadow-lg p-6 w-[800px] mb-6">
      <header class="flex bg-primary-color-3 p-6 mb-10">
        <div class="company flex items-center">
          <div class="w-[100px] md:w-[60px] overflow-hidden rounded-full">
            <img class="object-cover w-full h-full" src="/images/jeju_logo.webp" alt="">
          </div>
          <div class="ms-3">
            <h1 class="font-bold text-xl text-white uppercase">JEJU STUDIO</h1>
            <p class="font-light text-sm text-white capitalize">Nail Art, Eyelash, & Salon Studio</p>
          </div>
        </div>
      </header>
      <div class="body px-6">
        <div class="flex justify-between mb-10">
          <div>
            <h2 class="text-2xl font-medium">
              Order Summary
            </h2>
            <span v-if="transaction?.trx_status == 1" class="rounded-lg text-sm text-orange-700 font-medium uppercase">Pending</span>
            <span v-if="transaction?.trx_status == 2" class="rounded-lg text-sm text-green-700 font-medium uppercase">done</span>
            <span v-if="transaction?.trx_status == 3" class="rounded-lg text-sm text-red-700 font-medium uppercase">cancel</span>
          </div>
          <table>
            <tbody>
              <tr>
                <td class="text-[13px] pe-3 font-light">No Transaksi : </td>
                <td class="text-[13px] font-medium">{{ transaction?.transaction_code }}</td>
              </tr>
              <tr>
                <td class="text-[13px] pe-3 font-light">Pelanggan : </td>
                <td class="text-[13px] font-medium">{{ transaction?.customer?.name }}</td>
              </tr>
              <tr>
                <td class="text-[13px] pe-3 font-light">No Telepon : </td>
                <td class="text-[13px] font-medium">{{ customer?.phone }}</td>
              </tr>
              <tr>
                <td class="text-[13px] pe-3 font-light">Tanggal Booking : </td>
                <td class="text-[13px] font-medium">{{ transaction?.appointment_date ? formatDate(transaction?.appointment_date) : '' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="order-items mb-6">
          <table class="table-auto w-full">
            <thead class="bg-black">
              <tr class="border text-white font-medium">
                <th class="p-3 border-x text-left text-[1rem]">Produk</th>
                <th class="p-3 border-x text-left text-[1rem]">Biaya</th>
                <th class="p-3 border-x text-left text-[1rem]">Diskon Layanan</th>
                <th class="p-3 border-x text-left text-[1rem]">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="service_item in transaction?.service_items" :key="service_item.id" class="border-y">
                <td class="p-3 text-[14px]">{{ service_item?.product_detail?.name }}</td>
                <td class="p-3 text-[14px]">{{ formatRupiah(service_item?.price_per_unit) }}</td>
                <td class="p-3 text-[14px]">{{ service_item?.discount == 0 ? 0 : service_item?.discount + ' %' }}</td>
                <td class="p-3 text-[14px]">{{ formatRupiah(service_item?.subtotal) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="grand-total flex justify-end mb-6">
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
                <td class="pe-6 pb-3 font-medium text-[1rem] capitalize">grand total : </td>
                <td class="font-medium text-[1rem] pb-3">{{ formatRupiah(transaction?.grand_total) }}</td>
              </tr>
              <tr>
                <td class="pe-6 pt-3 font-light text-[13px] capitalize">Pembayaran : </td>
                <td class="pt-3 text-[13px] font-medium">{{ formatRupiah(invoice?.total_payment) }}</td>
              </tr>
              <tr>
                <td class="pe-6 font-light text-[13px] capitalize">Kembalian : </td>
                <td class="text-[13px] font-medium">{{ invoice?.total_payment != 0 ? formatRupiah(invoice?.total_payment - invoice?.total_transaction) : formatRupiah(0) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <footer>
          <p class="text-center font-light italic text-sm">
            "Terima kasih atas kepercayaan Anda di <span class="font-medium">Jeju Studio</span>. Sampai jumpa kembali!"
          </p>
        </footer>
      </div>
    </div>
    <div v-if="active_tab == 'order_summary_2'" id="order-summary" class="bg-white rounded-lg shadow-lg p-3 w-[400px] mb-6">
      <div class="header text-center mb-6">
        <h1 class="text-center font-bold uppercase">Jeju Studio</h1>
        <p class="font-light text-sm">{{ transaction?.transaction_code }}</p>
      </div>
      
      <table class="table-auto mb-3">
        <tbody>
          <tr>
            <td class="text-sm">Customer &nbsp;</td>
            <td class="text-sm">:</td>
            <td class="text-sm font-medium capitalize">&nbsp; {{ transaction?.customer?.name }}</td>
          </tr>
          <tr>
            <td class="text-sm">Tanggal &nbsp;</td>
            <td class="text-sm">:</td>
            <td class="text-sm font-medium">&nbsp; {{ formatDate(transaction?.appointment_date) }}</td>
          </tr>
          <tr>
            <td class="text-sm">Telepon &nbsp;</td>
            <td class="text-sm">:</td>
            <td class="text-sm font-medium">&nbsp; {{ transaction?.customer?.phone }}</td>
          </tr>
        </tbody>
      </table>
      <table class="table-auto">
        <tbody>
          <tr>
            <td class="text-sm">Staff &nbsp;</td>
            <td class="text-sm">:</td>
            <td class="text-sm font-medium capitalize">&nbsp; {{ staff }}</td>
          </tr>
        </tbody>
      </table>
      <hr class="border border-dashed border-gray-500 my-3">
      <table class="w-full">
        <thead>
          <tr>
            <th class="text-start text-sm py-1 uppercase">No</th>
            <th class="text-start text-sm py-1 uppercase">Layanan</th>
            <th class="text-end text-sm py-1 uppercase">Biaya</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(service, index) in transaction?.service_items" :key="service.id">
            <td class="text-sm py-1">{{ index + 1 }}</td>
            <td class="text-sm py-1">{{ service?.product_detail.name }}</td>
            <td class="text-sm py-1 font-medium capitalize text-end">{{ formatRupiah(service.subtotal) }}</td>
          </tr>
        </tbody>
      </table>
      <hr class="border border-dashed border-gray-500 my-3">
      <table class="w-full">
        <tbody>
          <tr>
            <td class="text-sm">Subtotal</td>
            <td class="text-sm font-medium capitalize text-end">{{ formatRupiah(transaction?.subtotal) }}</td>
          </tr>
          <tr>
            <td class="text-sm">Diskon</td>
            <td class="text-sm font-medium capitalize text-end">{{ transaction?.discount == 0 ? 0 : transaction?.discount + " %"}}</td>
          </tr>
          <tr>
            <td class="font-bold uppercase">Grand Total</td>
            <td class="font-bold capitalize text-end">{{ formatRupiah(transaction?.grand_total) }}</td>
          </tr>
          <tr>
            <td class="text-sm pt-3">Total Pembayaran</td>
            <td class="text-sm pt-3 font-medium capitalize text-end">{{ formatRupiah(invoice?.total_payment) }}</td>
          </tr>
          <tr>
            <td class="text-sm">Kembalian</td>
            <td class="text-sm font-medium capitalize text-end">{{ invoice?.total_payment != 0 ? formatRupiah(invoice?.total_payment - invoice?.total_transaction) : formatRupiah(0) }}</td>
          </tr>
        </tbody>
      </table>
      <p class="text-center font-light italic text-xs mt-6">
        "Terima kasih atas kepercayaan Anda di <span class="font-medium">Jeju Studio</span>. Sampai jumpa kembali!"
      </p>
    </div>
    <div class="print">
      <button @click="printOrderSummary" id="print-order-summary" class="py-2 px-5 md:py-2 hover:bg-black hover:text-white text-[14px] rounded-lg flex items-center border border-black border-b-2 shadow-md">
        <PrinterIcon class="w-5 h-5 me-2"/>
        <span class="font-medium">Print</span>
      </button>
    </div>
  </section>
</template>

<script>
import { formatDate, formatRupiah } from '@/helpers/formating';
import { PrinterIcon } from '@heroicons/vue/24/solid';
import { mapActions } from 'vuex';
import html2pdf from 'html2pdf.js';

export default {
  name: "OrderSummary",
  props: ["id"],
  components: {
    PrinterIcon,
  },
  data() {
    return {
      transaction: null,
      invoice: null,
      customer: null,

      active_tab: "order_summary_1"
    }
  },
  methods: {
    formatDate, formatRupiah,
    ...mapActions('transactions', ['fetchTransactionById']),
    ...mapActions('invoices', ['fetchInvoiceById']),
    ...mapActions('customers', ['fetchCustomerById']),

    // printOrderSummary() {
    //   html2pdf(document.getElementById('order-summary'), {
    //     margin: 1,
    //     filename: `jejuorder_${this.transaction.transaction_code}_${formatDate(this.transaction?.appointment_date)}.pdf`
    //   })
    // },
    printOrderSummary() {
      const element = document.getElementById('order-summary');
      let options = {
        margin: 1,
        filename: `jejuorder_${this.transaction.transaction_code}_${formatDate(this.transaction?.appointment_date)}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', orientation: 'portrait' }
      };

      if (this.active_tab === 'order_summary_1') {
        // Untuk order_summary_1, gunakan ukuran A4
        options.jsPDF.format = 'a4';
      } else {
        // Untuk order_summary_2, gunakan ukuran kustom
        const elementWidth = element.offsetWidth;
        const elementHeight = element.offsetHeight;
        options.jsPDF.format = [elementWidth / 3.779527559, elementHeight / 3.2]; // Konversi pixel ke mm
        options.html2canvas.height = elementHeight;
      }

      html2pdf().set(options).from(element).save().then(() => {
        console.log('PDF generated successfully');
      }).catch(err => {
        console.error('Error generating PDF:', err);
      });
    },

    // Menghitung Subtotal Pada Order-Summary
    calculateSubtotal() {
      if (!this.transaction?.service_items) return 0; // Handle empty service items
      return this.transaction.service_items.reduce((subtotalResult, serviceItem) => subtotalResult + parseInt(serviceItem.subtotal), 0); //Nilai yang dikembalikan adalah dari "subtotalResult". "subtotalResult" bernilai awal 0
    },

    changeTab(tab) {
      this.active_tab = tab;
    }
  },
  computed: {
    staff() {
      if (!this.transaction?.service_items) return '';

      // Flatten the staff names from all service items and join them with commas
      const allStaffNames = this.transaction.service_items
        .flatMap(serviceItem => serviceItem.staff_list
          .map(staff => staff.employee_name))
        .join(', ');

      return allStaffNames;
    }
  },
  async created() {
    if(this.id) {
      try {
        const response = await this.fetchTransactionById(this.id);
        
        if (response && response.data) {
          this.transaction = response.data;
          console.log('fetch trx by id: ', this.transaction);

          const invoice_id = response.data?.invoice.id;
          if(invoice_id) {
            const responseInvoice = await this.fetchInvoiceById(invoice_id);
            const invoiceData = responseInvoice.data;
            this.invoice = invoiceData;
            // console.log('fetch inv by id: ', this.invoice);
          }

          const customer_id = response.data?.customer_id;
          if(customer_id) {
            const responseCustomer = await this.fetchCustomerById(customer_id);
            const customerData = responseCustomer.data;
            this.customer = customerData;
            // console.log('fetch customer by id: ', this.customer);
          }
        }
        else {
          console.error('Failed to fetch pos payment: ', response);
        }
      }
      catch(error) {
        console.error(error);
      }
    }
  }
}
</script>