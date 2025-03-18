<template>
  <div
    id="overlay"
    class="fixed inset-0 bg-black bg-opacity-30 z-30"
    :class="{ 'hidden': !isBlur }"
  ></div>
  <IndexView title="Pelanggan"/>
  <AddButton v-if="isAdmin" to_url="/pelanggan/tambah-pelanggan"/>

  <AlertConfirmation
    v-if="alert_confirmation"
    @confirmNo="handle_clicked_no"
    @confirmYes="handle_clicked_yes"
    :animation_class="animation_alert_confirmation_class"
    text="Yakin menghapus data pelanggan?"
    text_class="text-xl font-medium" />

  <section class="p-6">
    <div class="bg-white rounded-lg py-6 px-5 shadow-lg">
      <AlertSuccess v-if="alert_success" :text="alert_text"/>
      <AlertDanger v-if="alert_danger" @hideAlertDanger="hide_alert_danger" :text="alert_text"/>
      
      <div class="mb-6 flex justify-between">
        <span>
          <InputForm v-model="searchQuery" @input="handleSearch" id="search-customer" placeholder="Cari nama pelanggan ..." input_class="w-80"/>
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
              <th class="p-3 border text-left">ID Pelanggan</th>
              <th class="p-3 border text-left">Nama</th>
              <th class="p-3 border text-left">No Telepon</th>
              <th class="p-3 border text-left">Ulang Tahun</th>
              <th class="p-3 border text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="allCustomers.length == 0">
              <td colspan="8" class="p-3 text-center italic text-gray-400">Belum ada data</td>
            </tr>
            <tr v-else v-for="(customer, index) in filteredCustomers" :key="customer.id">
              <td class="p-3 border text-center">{{ index + 1 + (pagination.page - 1) * pagination.perPage }}</td>
              <td class="p-3 border">{{ formatCustomerId(customer.id) }}</td>
              <td class="p-3 border capitalize">{{ customer.name }}</td>
              <td class="p-3 border">{{ customer.phone }}</td>
              <td class="p-3 border">{{ customer.birthdate ? formatDate(customer.birthdate) : '' }}</td>
              <td class="p-3 border text-gray-500 flex flex-wrap justify-around">
                <button id="edit-data" class="border border-gray-400 hover:border-primary-color-2 hover:bg-primary-color-2 p-2 rounded-md group">
                  <EyeIcon @click="editCustomer(customer)" class="h-4 w-4 group-hover:text-primary-color-4"/>
                </button>
                <!-- <button @click="deleteCustomer(customer)" id="delete-data" class="border border-gray-400 hover:border-red-500 hover:bg-red-400 p-2 rounded-md group">
                  <TrashIcon class="h-4 w-4 group-hover:text-red-700"/>
                </button> -->
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
        @page-changed="fetchCustomers"
      />
    </div>
  </section>
</template>

<script>
import IndexView from '@/views/IndexView.vue';
import InputForm from '@/components/form/InputForm.vue';
import AddButton from '@/components/buttons/AddButton.vue';
import PaginationComponent from '@/components/PaginationComponent.vue';
import AlertConfirmation from '@/components/alerts/AlertConfirmation.vue';
import AlertSuccess from '@/components/alerts/AlertSuccess.vue';
import AlertDanger from '@/components/alerts/AlertDanger.vue';
import { debounce } from 'lodash';
import { mapGetters, mapActions } from 'vuex';
import { EyeIcon } from '@heroicons/vue/24/solid';
import { formatDate, formatCustomerId } from '@/helpers/formating';

export default {
  name: "CustomerView",
  components: {
    IndexView, InputForm, AddButton, PaginationComponent, AlertConfirmation, AlertSuccess, AlertDanger,
    EyeIcon
  },
  data() {
    return {
      isBlur: false,
      searchQuery: '',

      selectedOutlet: null, //filter by outlet

      alert_success: false,
      alert_danger: false,
      alert_text: '',
      alert_confirmation: false,
      animation_alert_confirmation_class: '',
      customer_to_delete: null,
    }
  },
  computed: {
    ...mapGetters('customers', ['allCustomers', 'pagination']),
    ...mapGetters('outlets', ['allOutlets']),

    userLogin() {
      const user = this.$store.state.detail_user.detail_user;
      return user;
    },
    filteredCustomers() {
      let customers = this.allCustomers;

      /* Catatan :
      - "this.$store.state.detail_user.detail_user" data dari auto-login
      - "this.$store.state.detail_user.user_login" data dari decoded token
      */

      // Filter by outlet if selectedOutlet is set (Filter in Superadmin)
      if (this.selectedOutlet !== null) {
        customers = customers.filter(customer => customer.outlet_id === this.selectedOutlet);
      }

      // If user is not superadmin, only show customers for their outlet (Only Customer by Admin Logged in (Customers by Outlet))
      if (!this.$store.state.detail_user.user_login?.is_super && this.userLogin.outlet_id) {
        customers = customers.filter(customer => customer.outlet_id === this.userLogin.outlet_id);
      }

      return customers;
    }
  },
  created() {
    this.$store.dispatch('outlets/fetchOutlets');
    if(this.userLogin.outlet_id) {
      this.selectedOutlet = this.userLogin.outlet_id;
    }
    this.fetchCustomers(this.pagination.page || 1);
  },
  methods: {
    formatDate, formatCustomerId,
    ...mapActions('customers', ['deleteCustomerById', 'fetchCustomers']),
    ...mapActions('transactions', ['fetchTransactionByCustomerId']),

    // Filter customers by selected outlet
    filterByOutlet(outletId) {
      this.selectedOutlet = outletId; // Update the selected outlet
      this.fetchCustomers(1); // Refetch customers based on selected outlet
    },

    async fetchCustomers(page = 1, limit = 10) {
      const params = {
        page,
        limit,
        search: this.searchQuery || '',
        outlet_id: this.selectedOutlet
      };
      await this.$store.dispatch('customers/fetchCustomers', params);
    },
    //  --- NB: handleSearch() dijalankan sebelum v-model mengikat searchQuery secara keseluruhan ---
    // handleSearch() {
    //   console.log('search query: ', this.searchQuery);
    //   this.fetchCustomers(1);
    // },

    // lodash library (npm install lodash)
    handleSearch: debounce(function () {
      console.log('search query: ', this.searchQuery); 
      this.fetchCustomers(1); 
      // this.fetchCustomers(this.pagination.page);
    }, 300),
    editCustomer(customer) {
      this.$router.push({ name: 'EditCustomer', params: { id: customer.id } });
    },
    showAlertConfirmation() {
      this.alert_confirmation = true;
      this.animation_alert_confirmation_class = 'animate__backInDown';
    },
    handle_clicked_no(){
      this.isBlur = false;
      this.alert_confirmation = true;
      this.animation_alert_confirmation_class =  'animate__backOutUp';
    },
    // async deleteCustomer(customer) {
    //   this.isBlur = true;
    //   this.customer_to_delete = customer;
    //   this.showAlertConfirmation();
    // },
    async handle_clicked_yes(customer) {
      if(!this.customer_to_delete) return;
      customer = this.customer_to_delete;
      try {
        await this.deleteCustomerById(customer.id);
        this.fetchCustomers(this.pagination.page || 1);
        this.alert_success = true;
        this.alert_text = 'Pelanggan berhasil dihapus'
        setTimeout(() => {
          this.alert_success = false;
        }, 2000);
      }
      catch (error) {
        console.error('Failed to delete customer', error);
        this.alert_danger = true;
        this.alert_text = 'Gagal menghapus pelanggan' + error
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