<template>
  <div
    id="overlay"
    class="fixed inset-0 bg-black bg-opacity-30 z-30"
    :class="{ 'hidden': !isBlur }"
  ></div>
  <IndexView title="staff"/>
  <AddButton v-if="isAdmin" to_url="/staff/tambah-staff" id="tambah-staff"/>

  <AlertConfirmation
    v-if="alert_confirmation"
    @confirmNo="handle_clicked_no"
    @confirmYes="handle_clicked_yes"
    :animation_class="animation_alert_confirmation_class"
    text="Yakin menghapus data staff?"
    text_class="text-xl font-medium" />

  <section class="p-6">
    <div class=" bg-white rounded-lg py-6 px-5 shadow-lg">
      <AlertSuccess v-if="alert_success" :text="alert_text"/>
      <AlertDanger v-if="alert_danger" @hideAlertDanger="hide_alert_danger" :text="alert_text"/>
      <div class="mb-6 flex justify-between">
        <span>
          <InputForm v-model="searchQuery" @input="handleSearch" placeholder="Cari nama staff ..." input_class="w-80"/>
        </span>
        <div v-if="this.$store.state.detail_user.user_login.is_super" class="flex">
          <button 
            @click="filterByOutlet(null)"
            :class="['px-3 me-2 text-sm rounded-lg border border-gray-500', selectedOutlet === null ? 'bg-gray-500 text-white font-bold' : '']">
            ALL
          </button>
          <button
            v-for="outlet in allOutlets"
            :key="outlet.id"
            @click="filterByOutlet(outlet.id)"
            :class="['px-3 me-2 text-sm rounded-lg border border-gray-500 uppercase', selectedOutlet === outlet.id ? 'bg-gray-500 text-white font-bold' : '']">
            {{ outlet.name }}
          </button>
        </div>
      </div>
      <div class="overflow-x-scroll">
        <table class="table-auto w-full">
          <thead class="bg-gray-300">
            <tr>
              <th class="p-3 border text-center">No</th>
              <th class="p-3 border text-left">Nama Staff</th>
              <th class="p-3 border text-left">Email</th>
              <th class="p-3 border text-left">No Telepon</th>
              <th class="p-3 border text-left">Tanggal lahir</th>
              <th v-if="this.$store.state.detail_user.user_login.is_super" class="p-3 border text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="allEmployees.length == 0">
              <td colspan="7" class="p-3 text-center italic text-gray-400">Belum ada data</td>
            </tr>
            <tr v-else v-for="(employee, index) in filteredEmployees" :key="employee.id">
              <td class="p-3 border text-center">{{ index + 1 }}</td>
              <td class="p-3 border capitalize">{{ employee.name }}</td>
              <td class="p-3 border">{{ employee.email }}</td>
              <td class="p-3 border">{{ employee.phone_number }}</td>
              <td class="p-3 border">{{ formatDate(employee.birthdate) }}</td>
              <td v-if="this.$store.state.detail_user.user_login.is_super" class="p-3 border flex flex-wrap justify-around">
                <button @click="editEmployee(employee)" :id="'edit-data-' + employee.id" class="border border-gray-400 hover:border-green-500 hover:bg-green-400 p-2 rounded-md group">
                  <PencilSquareIcon class="h-4 w-4 group-hover:text-green-700"/>
                </button>
                <button @click="deleteEmployee(employee)" :id="'delete-data-' + employee.id" class="border border-gray-400 hover:border-red-500 hover:bg-red-400 p-2 rounded-md group">
                  <TrashIcon class="h-4 w-4 group-hover:text-red-700"/>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <PaginationComponent
        :totalItems="pagination.totalItems"
        :perPage="parseInt(pagination.perPage)"
        :currentPage="parseInt(pagination.page)"
        :previousPageLink="pagination?.previousPageLink"
        :nextPageLink="pagination?.nextPageLink"
        @page-changed="fetchEmployees"
      />
    </div>
  </section>
</template>

<script>
import IndexView from '@/views/IndexView.vue';
import AddButton from '@/components/buttons/AddButton.vue';
import InputForm from '@/components/form/InputForm.vue';
import AlertSuccess from '@/components/alerts/AlertSuccess.vue';
import AlertDanger from '@/components/alerts/AlertDanger.vue';
import AlertConfirmation from '@/components/alerts/AlertConfirmation.vue';
import PaginationComponent from '@/components/PaginationComponent.vue';
import { formatDate } from '@/helpers/formating';
import { mapGetters, mapActions } from 'vuex';
import { PencilSquareIcon, TrashIcon } from '@heroicons/vue/24/solid';
import { debounce } from 'lodash';

export default {
  name: "EmployeeView",
  components: {
    IndexView, AddButton, InputForm, PaginationComponent, AlertConfirmation, AlertSuccess, AlertDanger,
    TrashIcon, PencilSquareIcon
  },
  data() {
    return {
      searchQuery: '',
      isBlur: false,

      selectedOutlet: null, //filter by outlet

      alert_success: false,
      alert_danger: false,
      alert_text: '',
      alert_confirmation: false,
      animation_alert_confirmation_class: '',
      employee_to_delete: null,
    }
  },
  computed: {
    ...mapGetters('employees', ['allEmployees', 'pagination']),
    ...mapGetters('outlets', ['allOutlets']),

    userLogin() {
      const user = this.$store.state.detail_user.detail_user;
      return user;
    },
    filteredEmployees() {
      let employees = this.allEmployees;

      if (this.selectedOutlet !== null) {
        employees = employees
          .filter(employee => employee.outlet_id == this.selectedOutlet)
      }

      if (!this.$store.state.detail_user.user_login?.is_super && this.userLogin.outlet_id) {
        employees = employees
          .filter(employee => employee.outlet_id == this.userLogin.outlet_id)
      }

      return employees;
    }
  },
  created() {
    this.$store.dispatch('outlets/fetchOutlets');
    if(this.userLogin.outlet_id) {
      this.selectedOutlet = this.userLogin.outlet_id;
    }
    this.fetchEmployees(this.pagination.page || 1);
  },
  methods: {
    ...mapActions('employees', ['deleteEmployeeById', 'fetchEmployees']),
    formatDate,

    filterByOutlet(outletId) {
      this.selectedOutlet = outletId;
      this.fetchEmployees(1);
    },

    async fetchEmployees(page = 1, limit = 10) {
      const params = {
        page,
        limit,
        search: this.searchQuery || '',
        role_id: 2,
        outlet_id: this.selectedOutlet
      };
      await this.$store.dispatch('employees/fetchEmployees', params);
    },
    handleSearch: debounce(function () {
      console.log('search query: ', this.searchQuery);
      this.fetchEmployees(1);
    }, 300),

    editEmployee(employee) {
      this.$router.push({ name: 'EditEmployee', params: { id: employee.id } });
    },
    showAlertConfirmation() {
      this.isBlur = true
      this.alert_confirmation = true;
      this.animation_alert_confirmation_class = 'animate__backInDown';
    },
    handle_clicked_no(){
      this.isBlur = false;
      this.alert_confirmation = true;
      this.animation_alert_confirmation_class =  'animate__backOutUp';
    },
    async deleteEmployee(employee) {
      this.isBlur = true;
      this.employee_to_delete = employee;
      this.showAlertConfirmation();
    },
    async handle_clicked_yes(employee) {
      if(!this.employee_to_delete) return;
      employee = this.employee_to_delete;
      try {
        await this.deleteEmployeeById(employee.id);
        this.fetchEmployees(this.pagination.page || 1);
        this.alert_success = true;
        this.alert_text = 'Staff berhasil dihapus'
        setTimeout(() => {
          this.alert_success = false;
        }, 2000);
      }
      catch (error) {
        console.error('Gagal menghapus staff', error);
        this.alert_danger = true;
        this.alert_text = 'Gagal menghapus staff' + error
      }
      this.handle_clicked_no();
    },
    hide_alert_danger() {
      this.alert_danger = false;
      this.alert_text = '';
    }
  }
}
</script>