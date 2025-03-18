<template>
  <AlertConfirmation
    v-if="alert_confirmation"
    @confirmNo="handle_clicked_no"
    @confirmYes="handle_clicked_yes"
    :animation_class="animation_alert_confirmation_class"
    text="Yakin membatalkan transaksi?"
    text_class="text-xl font-medium"
  />

  <section class="w-screen h-screen absolute flex justify-center items-top">
    <div
      :class="{
        'animate__animated animate__zoomIn': showModal,
        'animate__animated animate__zoomOut': !showModal,
      }"
      class="z-50 modal max-w-2xl bg-white rounded-lg shadow-lg border-t-4 border-primary-color-2 w-[80%] max-h-[80%]"
    >
      <div class="modal-header border-b border-gray-400 justify-between flex">
        <div class="w-full py-4">
          <h5 class="text-center font-bold text-lg">Detail Agenda</h5>
        </div>
        <PlusIcon
          @click="closeModal()"
          id="close-modal"
          class="h-6 w-6 rotate-45 cursor-pointer mt-2 mr-2"
        />
      </div>
      <div v-if="alert_success || alert_danger" class="px-6">
        <AlertSuccess v-if="alert_success" :text="alert_text" />
        <AlertDanger
          v-if="alert_danger"
          @hideAlertDanger="hide_alert_danger"
          :text="alert_text"
        />
      </div>
      <div class="modal-body px-6 overflow-y-auto max-h-[450px] mt-3">
        <div class="flex justify-between items-center mb-3">
          <p class="font-bold text-lg tracking-wide">
            {{ detailAgenda?.transaction_code }}
          </p>
          <div>
            <BadgeWarning v-if="detailAgenda?.trx_status == 1" text="Pending" />
            <BadgeSuccess v-if="detailAgenda?.trx_status == 2" text="Done" />
            <BadgeDanger v-if="detailAgenda?.trx_status == 3" text="Cancel" />
          </div>
        </div>
        <div
          class="profile bg-white border rounded-lg py-3 px-5 shadow-md flex items-center justify-between mb-6"
        >
          <div class="flex items-center">
            <div class="flex items-center profile">
              <div
                class="logo me-3 rounded-full bg-red-900 w-[50px] h-[50px] flex justify-center items-center overflow-hidden"
              >
                <img
                  class="object-cover w-full h-full"
                  src="/images/jeju_logo.webp"
                  alt="logo jeju"
                />
              </div>
              <div class="flex flex-col">
                <h1 class="font-bold capitalize">
                  {{ detailAgenda?.customer?.name }}
                </h1>
                <p class="text-sm font-light">{{ detailAgenda?.customer?.phone }}</p>
              </div>
            </div>
          </div>
          <div class="invoice flex flex-col gap-1 items-end">
            <p class="text-sm uppercase font-bold">{{ formatDate(detailAgenda?.appointment_date) }}</p>
            <button
              @click="showModalInvoice"
              id="open-modal-invoice"
              class="cursor-pointer"
            >
              <BadgePrimary
                text="invoice"
                badge_class="border border-secondary-blue-1 border-b-2 border-r-2 shadow-md text-secondary-blue-1 uppercase tracking-wide"
              />
            </button>

            <ModalInvoice
              v-if="modalInvoice"
              @closeModalInvoice="hideModalInvoice"
              :trx="detailAgenda"
            />
          </div>
        </div>
        <div
          v-for="order in detailAgenda.service_items"
          :key="order.id"
          class="order-detail border rounded-lg mb-3 overflow-hidden"
        >
          <div class="flex items-center profile mb-2 px-4 py-2">
            <div class="logo rounded-full bg-red-900 w-[50px] h-[50px] flex justify-center items-center overflow-hidden">
              <img
                v-if="order?.product_detail?.path"
                class="object-cover w-full h-full"
                :src="imageBaseUrl + order.product_detail.path"
                alt="logo jeju"
              />
              <img
                v-else
                class="object-cover w-full h-full"
                src="/images/jeju_logo.webp"
                alt="logo jeju"
              />
            </div>
            <div class="flex flex-col w-full pl-4">
              <div class="flex justify-between items-center w-full">
                <h1
                  class="text-secondary-red-1 font-bold text-lg mb-1 flex-grow"
                >
                  {{ order?.product_detail.name }}
                </h1>
                <div class="flex flex-col gap-1">
                  <div class="flex items-center gap-1">
                    <ClockIcon class="h-4 w-4 text-gray-500" />
                    <BadgePrimary
                      :text="order.start_service_time"
                      badge_class="bg-secondary-blue-2 text-secondary-blue-1 uppercase tracking-wider"
                    />
                  </div>
                  <p class="text-sm font-medium text-right">
                    {{ order.product_detail?.duration }} menit
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="flex items-center justify-between px-4 pb-4">
            <div class="time-duration-staff flex-grow flex flex-col gap-1">
              <div class="flex gap-1 flex-wrap items-center mt-1">
                <label class="text-xs uppercase pt-0.5">Staff: </label>
                <div class="w-fit">
                  <span
                    v-if="order?.staff_list.length <= 0"
                    class="text-gray-400 italic"
                  >
                    ~ Belum ada staff dipilih
                  </span>
                  <span
                    v-for="(staff, index) in order?.staff_list"
                    :key="index"
                    class=""
                  >
                    <BadgePrimary
                      :text="staff?.employee_name"
                      badge_class="bg-gray-200 uppercase tracking-wider"
                    />
                  </span>
                </div>
              </div>
              <div class="flex gap-2 items-center mt-1">
                <span class="text-xs uppercase pt-0.5">Note: </span>
                <p class="italic font-bold">{{ order?.service_note }}</p>
              </div>
            </div>
            <div class="grand-total flex flex-col">
              <span v-if="parseInt(order.discount) !== 0">
                <p class="line-through text-sm">
                  {{ formatRupiah(order.price_per_unit) }}
                </p>
                <h4 class="font-bold text-xl">
                  {{
                    formatRupiah(
                      calculateDiscount(order.price_per_unit, order.discount)
                    )
                  }}
                </h4>
              </span>
              <h4
                v-if="parseInt(order.discount) == 0"
                class="font-bold text-xl"
              >
                {{ formatRupiah(order.price_per_unit) }}
              </h4>
            </div>
          </div>
        </div>
      </div>
      <div
        class="modal-footer border-t border-gray-400 justify-between items-center flex lg:px-6 lg:py-3 md:p-6"
      >
        <div class="flex">
          <button
            @click="cancelTrx(detailAgenda.id)"
            :disabled="detailAgenda?.appointment_date < today || detailAgenda?.trx_status == 3 ? true : false"
            :class="
              detailAgenda?.appointment_date < today  || detailAgenda?.trx_status == 3
                ? 'bg-gray-200 text-gray-400'
                : 'text-secondary-red-1 border border-secondary-red-1 border-r-2 border-b-2'
            "
            id="cancel-transaction"
            class="rounded-lg py-1 px-3 text-sm me-2"
          >
            Batalkan Transaksi
          </button>
          <button
            @click="editTransaction(detailAgenda.id)"
            :disabled="
              detailAgenda?.trx_status == 2 || detailAgenda?.trx_status == 3
                ? true
                : false
            "
            :class="
              detailAgenda?.trx_status == 2 || detailAgenda?.trx_status == 3
                ? 'bg-gray-200 text-gray-400'
                : 'text-secondary-green-1 border border-secondary-green-1  border-r-2 border-b-2'
            "
            id="to-edit-transaction"
            class="rounded-lg py-1 px-3 text-sm"
          >
            Edit Transaksi
          </button>
        </div>
        <div class="checkout">
          <SubmitButton
            @click="closeModal()"
            id="close-modal"
            button_name="Close"
            button_class="bg-gray-200 rounded-lg me-3 border border-b-2 border-r-2 border-gray-400 uppercase font-semibold"
          />
          <SubmitButton
            @click="checkout(detailAgenda?.id)"
            :is_disable="
              detailAgenda?.trx_status == 2 || detailAgenda?.trx_status == 3
                ? true
                : false
            "
            button_name="Checkout"
            id="to-checkout"
            :button_class="
              detailAgenda?.trx_status == 2 || detailAgenda?.trx_status == 3
                ? 'bg-gray-200 text-gray-400'
                : 'bg-primary-color-2 text-white border-b-2 border-r-2 border-gray-800 uppercase font-semibold'
            "
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import ModalInvoice from "./ModalInvoice.vue";
import SubmitButton from "../form/SubmitButton.vue";
import AlertDanger from "@/components/alerts/AlertDanger.vue";
import AlertSuccess from "@/components/alerts/AlertSuccess.vue";
import AlertConfirmation from "@/components/alerts/AlertConfirmation.vue";

import { mapGetters, mapActions } from "vuex";
import { formatRupiah, formatDate } from "@/helpers/formating";
import { calculateDiscount } from "@/helpers/calculation";
import { ClockIcon, PlusIcon } from "@heroicons/vue/24/solid";
import BadgeWarning from "@/components/badge/BadgeWarning.vue";
import BadgeSuccess from "@/components/badge/BadgeSuccess.vue";
import BadgeDanger from "@/components/badge/BadgeDanger.vue";
import BadgePrimary from "@/components/badge/BadgePrimary.vue";

export default {
  name: "DetailAgendaView",
  emits: ["closeModalDetailAgenda"],
  props: {
    detailAgenda: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      modalInvoice: false,
      showModal: true,
      selected_staff: [],
      selected_staff_id: "",
      transaction: this.detailAgenda,

      alert_success: false,
      alert_danger: false,
      alert_text: "",
      alert_confirmation: false,
      animation_alert_confirmation_class: "",

      today: new Date().toISOString().split('T')[0]
    };
  },
  components: {
    ModalInvoice,
    SubmitButton,
    AlertConfirmation,
    AlertSuccess,
    AlertDanger,
    PlusIcon,
    ClockIcon,
    BadgeSuccess,
    BadgeDanger,
    BadgeWarning,
    BadgePrimary,
  },
  methods: {
    formatRupiah,
    formatDate,
    calculateDiscount,
    ...mapActions("transactions", ["updateTransaction", "fetchTransactions", "cancelTransaction"]),

    closeModal() {
      this.showModal = false;
      this.$emit("closeModalDetailAgenda");
    },
    showModalInvoice() {
      this.modalInvoice = true;
    },
    hideModalInvoice() {
      setTimeout(() => {
        this.modalInvoice = false;
      }, 500);
    },

    // Confirmation Cancel Transaction
    cancelTrx(transaction_id) {
      console.log("id trx: ", transaction_id);
      this.showAlertConfirmation();
    },
    showAlertConfirmation() {
      this.alert_confirmation = true;
      this.animation_alert_confirmation_class = "animate__backInDown";
    },
    handle_clicked_no() {
      this.animation_alert_confirmation_class = "animate__backOutUp";
    },
    async handle_clicked_yes() {
      await this.cancelTransaction(this.transaction.id);
      this.closeModal();
    },
    async fetchTransactions(page = 1, limit = 10) {
      const params = {
        page,
        limit,
        start_date:
          this.dateFormating(this.detailAgenda?.appointment_date) || null,
        end_date:
          this.dateFormating(this.detailAgenda?.appointment_date) || null,
        customer_id: null,
        trx_status: null,
      };
      await this.$store.dispatch("transactions/fetchTransactions", params);
    },
    dateFormating(stringDate) {
      const date = new Date(stringDate);

      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();

      return `${year}-${month}-${day}`;
    },

    // Edit Transaction
    editTransaction(transaction_id) {
      this.$router.push({
        name: "EditAppointment",
        params: { transaction_id: transaction_id },
      });
    },

    checkout(detailAgendaId) {
      this.$router.push({
        name: "CheckoutView",
        params: { id: detailAgendaId },
      });
    },
  },
  computed: {
    ...mapGetters("employees", ["allEmployees"]),
    availableEmployees() {
      return this.allEmployees.filter(
        (employee) =>
          !this.selected_staff.find((selected) => selected.id === employee.id)
      );
    },
    imageBaseUrl() {
      return process.env.VUE_APP_API_IMAGE_URL;
    },
  },
  created() {
    this.$store.dispatch("employees/fetchAllEmployees");
    console.log("detail agenda: ", this.detailAgenda);
  },
};
</script>