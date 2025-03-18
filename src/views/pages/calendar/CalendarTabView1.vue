<template>
  <div @click="hideModal()" id="overlay" class="fixed inset-0 bg-black bg-opacity-30 z-40" :class="{ hidden: !isBlur }">
  </div>
  <ModalDetailAgenda ref="modal" v-if="modalDetailAgenda" :detailAgenda="selectedAgenda"
    @closeModalDetailAgenda="hideModalDetailAgenda" />
  <div class="mb-6 flex item-center">
    <span>
      <InputForm id="filter-date" @change="fetchTransactions()" v-model="filter.appointment_date"
        input_class="w-40 me-2" type="date" />
    </span>

    <span class="ms-3">
      <select v-model="selectedOutlet" @change="fetchTransactions()"
        class="block w-48 text-lg mt-1 flex-1 border border-gray-400 rounded-lg px-3 py-2 text-gray-500 placeholder:text-gray-300 placeholder:text-[12px] sm:text-sm sm:leading-6 focus:outline-none focus:ring focus:ring-gray-500">
        <option value="" selected>Semua Branch</option>
        <option v-for="outlet in allOutlets" :key="outlet.id" :value="outlet.id">{{ outlet.name }}</option>
      </select>
    </span>
  </div>

  <!-- Calendar Header -->
  <div class="grid w-full" :class="'grid-cols-' + (parseInt(filteredEmployees.length) + 1)">
    <span class="py-3 text-center flex justify-center items-center">
      <ClockIcon class="h-6 w-6" />
    </span>
    <template v-for="employee in filteredEmployees" :key="employee.id">
      <span class="text-center col-auto uppercase text-primary-color-2 py-3">
        {{ employee.name }}
      </span>
    </template>
  </div>

  <!-- Calendar Body -->
  <div class="grid w-full" :class="'grid-cols-' + (parseInt(filteredEmployees.length) + 1)">
    <div class="text-center border col-auto row-start-1 grid box-border"
      :style="{ gridTemplateRows: 'repeat(27, minmax(2rem, 1rem))' }">
      <div v-for="(time, index) in times" :key="time.id" :class="{ 'border-t': index % 2 === 1, '': index % 2 !== 0 }"
        class="flex items-center justify-center box-border">
        <span class="mb-8 bg-white px-2">{{ time.name }}</span>
      </div>
    </div>
    <template v-for="employee in filteredEmployees" :key="employee.id">
      <div class="text-center border grid row-start-1 group relative box-border"
        :style="{ gridTemplateRows: 'repeat(27, minmax(2rem, 1rem))' }">
        <div class="absolute inset-0" :style="{ gridTemplateRows: 'repeat(27, minmax(2rem, 1rem))' }">
          <div v-for="(time, index) in times" :key="time.id"
            :class="{ 'border-t': index % 2 === 1, '': index % 2 !== 1 }"
            class="flex items-center justify-center box-border">
            <span class="h-[calc(2rem-0.5px)]"></span>
          </div>
        </div>
        <template v-for="transaction in getEmployeeTransactions(employee.id)" :key="transaction.id">
          <template v-for="serviceItem in transaction.service_items" :key="serviceItem.id">
            <div :class="{
              'transition-all ease-in-out delay-100 duration-300 relative mt-px hover:left-0 flex z-10 hover:z-20 overflow-clip': true,
              'hover:col-span-2': isOverlapping(serviceItem), // Add a class for overlap
              'col-span-2': !isOverlapping(serviceItem), // Add a class for overlap
            }" :style="{
              gridRow:
                convertTimeToRow(serviceItem.start_service_time) +
                ' / span ' +
                convertDurationToRow(serviceItem.product_detail.duration),
            }">
              <a class="overflow-clip absolute inset-1 flex flex-col justify-start rounded-lg bg-primary-color-4 py-0 px-2 text-xs leading-5 hover:bg-primary-color-4 border border-primary-color-4 shadow-md cursor-pointer"
                @click="sendDataAgenda(transaction)" :id="'open-modal-detail-transaction-' + transaction.id">
                <p class="flex-grow-0 text-left font-bold whitespace-nowrap">
                  {{ serviceItem.product_detail?.name }}
                </p>
                <p class="flex-grow-0 mb-1 text-left hidden">
                  {{ transaction.appointment_hour }} |
                  {{ formatDate(transaction.appointment_date) }}
                </p>
                <p class="flex-grow-0 text-left capitalize font-light">
                  {{ transaction.customer?.name }}
                </p>
              </a>
            </div>
          </template>
        </template>
        <div v-if="!getEmployeeTransactions(employee.id).length" class="text-gray-400 italic"></div>
      </div>
    </template>
  </div>
</template>

<script>
import InputForm from "@/components/form/InputForm.vue";
import { ClockIcon } from "@heroicons/vue/24/solid";
import { mapGetters, mapActions } from "vuex";
import { formatDate } from "@/helpers/formating";
import ModalDetailAgenda from "@/components/modals/ModalDetailAgenda.vue";

export default {
  name: "CalendarTabView1",
  emits: ["selectedAgenda"],
  components: {
    InputForm,
    ClockIcon,
    ModalDetailAgenda,
  },
  data() {
    return {
      isBlur: false,
      times: [
        { id: 2, name: "" }, // 07:30
        { id: 3, name: "08:00" },
        { id: 4, name: "" }, // 08:30
        { id: 5, name: "09:00" },
        { id: 6, name: "" }, // 09:30
        { id: 7, name: "10:00" },
        { id: 8, name: "" }, // 10:30
        { id: 9, name: "11:00" },
        { id: 10, name: "" }, // 11:30
        { id: 11, name: "12:00" },
        { id: 12, name: "" }, // 12:30
        { id: 13, name: "13:00" },
        { id: 14, name: "" }, // 13:30
        { id: 15, name: "14:00" },
        { id: 16, name: "" }, // 14:30
        { id: 17, name: "15:00" },
        { id: 18, name: "" }, // 15:30
        { id: 19, name: "16:00" },
        { id: 20, name: "" }, // 16:30
        { id: 21, name: "17:00" },
        { id: 22, name: "" }, // 17:30
        { id: 23, name: "18:00" },
        { id: 24, name: "" }, // 18:30
        { id: 25, name: "19:00" },
        { id: 26, name: "" }, // 19:30
        { id: 27, name: "20:00" },
        { id: 28, name: "" }, // 20:30
      ],

      filter: {
        appointment_date: new Date().toISOString().split("T")[0],
      },
      modalDetailAgenda: false, // Add this to manage modal visibility
      selectedAgenda: null, // Add this to store the selected agenda
      selectedOutlet: '',
      allOutlet: [],
    };
  },
  computed: {
    ...mapGetters("transactions", ["allTransactions", "pagination"]),
    ...mapGetters("employees", ["allEmployees"]),
    ...mapGetters('outlets', ['allOutlets']),

    userLogin() {
      const user = this.$store.state.detail_user.detail_user;
      return user;
    },
    filteredEmployees() {
      let employees = this.allEmployees?.filter(employee => employee.role_id == 2);

      if (this.selectedOutlet) {
        employees = employees.filter(employee => employee.outlet_id == this.selectedOutlet);
      }

      if (!this.$store.state.detail_user.user_login?.is_super && this.userLogin.outlet_id) {
        employees = employees?.filter(employee => employee.outlet_id === this.userLogin.outlet_id);
      }

      return employees;
    }
  },
  created() {
    this.fetchTransactions();
    this.$store.dispatch("employees/fetchAllEmployees");
  },
  methods: {
    formatDate,
    ...mapActions("transactions", ["fetchTransactions"]),

    async fetchTransactions() {
      const params = {
        appointment_date: this.appointment_date || null,
      };
      const response = await this.$store.dispatch(
        "transactions/fetchTransactions",
        params
      );
      console.log("transactions:", response);
    },

    getEmployeeServices(employeeId, time) {
      const today = this.filter.appointment_date;
      const timeHour = time.split(":")[0];

      const services = this.allTransactions
        ?.filter((trans) => {
          const transDate = trans.appointment_date
            ? trans.appointment_date.split("T")[0]
            : null;
          const transHour = trans.appointment_hour
            ? trans.appointment_hour.split(":")[0]
            : null;

          return transDate == today && transHour == timeHour;
        })
        .flatMap((trans) => trans.service_items)
        .filter((service) =>
          service.staff_list.some((staff) => staff.employee?.id === employeeId)
        );

      const combinedService = services.reduce(
        (acc, service) => {
          acc.name += (acc.name ? ", " : "") + service.product_detail.name;
          acc.duration += service.product_detail.duration;
          return acc;
        },
        { name: "", duration: 0 }
      );

      // console.log("combined service: ", combinedService);
      return combinedService;
    },

    getEmployeeTransactions(employeeId) {
      const today = this.filter.appointment_date;

      const transactionsArray = Array.isArray(this.allTransactions) ? this.allTransactions : [];

      const transactions = transactionsArray
        ?.filter((trans) => trans.trx_status === 1 || trans.trx_status === 2)
        .filter((trans) => {
          const transDate = trans.appointment_date
            ? trans.appointment_date.split("T")[0]
            : null;
          return transDate == today;
        })
        .map((trans) => {
          // Filter service_items for the current employee
          const filteredServiceItems = trans.service_items.filter((service) =>
            service.staff_list.some((staff) => staff.user_id === employeeId)
          );

          // Return a new transaction object with filtered service_items
          return { ...trans, service_items: filteredServiceItems };
        })
        .filter((trans) => trans.service_items.length > 0); // Ensure only transactions with service_items are returned

      // console.log("this employee trans is: ", transactions, employeeId);
      return transactions; // Return filtered transactions directly
    },

    convertTimeToRow(time) {
      // console.log("time is: ", time);
      // Implement this function to convert time to grid row
      var array = time.split(":");

      return (Number(array[0]) - 8) * 2 + 2 + (Number(array[1]) >= 30 && 1);
      // return 4;
    },

    convertTimeRangeToRow(startTime, endTime) {
      // Implement this function to convert time range to grid row span
      var array1 = startTime.split(":");
      var array2 = endTime.split(":");
      return (
        (Number(array2[0]) - Number(array1[0])) * 2 +
        Math.ceil((Number(array2[1]) - Number(array1[1])) / 30)
      );
    },

    convertDurationToRow(duration) {
      return Math.ceil(duration / 30);
    },

    isOverlapping(currentServiceItem) {
      const currentStart = this.convertTimeToRow(
        currentServiceItem.start_service_time
      );
      const currentEnd =
        currentStart +
        this.convertDurationToRow(currentServiceItem.product_detail.duration);

      return this.allTransactions.some((transaction) => {
        return transaction.service_items.some((serviceItem) => {
          // Check if the employee IDs match
          const isSameEmployee = serviceItem.staff_list.some(
            (staff) =>
              staff.employee?.id ===
              currentServiceItem.staff_list[0].employee.id
          );

          if (!isSameEmployee || serviceItem.id === currentServiceItem.id)
            return false; // Skip if not the same employee

          const start = this.convertTimeToRow(serviceItem.start_service_time);
          const end =
            start +
            this.convertDurationToRow(serviceItem.product_detail.duration);
          return currentStart < end && currentEnd > start; // Check for overlap
        });
      });
    },

    getTransactionDuration(employeeId, time) {
      const transaction = this.getEmployeeTransaction(employeeId, time);
      if (transaction) {
        const serviceItem = transaction.service_items.find((service) =>
          service.staff_list.some((staff) => staff.employee?.id === employeeId)
        );
        return serviceItem ? serviceItem.product_detail.duration : 0;
      }
      return 0;
    },

    // Show Modal Detail Transaction
    sendDataAgenda(trans) {
      this.selectedAgenda = trans; // Set the selected agenda
      this.modalDetailAgenda = true; // Show the modal
    },

    hideModalDetailAgenda() {
      this.modalDetailAgenda = false; // Hide the modal
      // this.fetchTransactions(); // Optionally fetch transactions
    },
  },
};
</script>
