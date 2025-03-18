<template>
  <section class="w-screen h-screen absolute flex justify-center items-center">
    <div class="modal absolute block w-3/4 bg-white shadow-lg rounded-lg border-t-4 border-primary-color-2 z-50"
      :class="{
      'animate__animated animate__zoomIn': showModal,
      'animate__animated animate__zoomOut': !showModal,
      }">
      
      <div class="modal-header border-b border-gray-400 justify-between flex">
        <div class="w-full py-4">
          <h5 class="text-center font-bold text-lg">Pilih Pelanggan</h5>
        </div>
        <PlusIcon @click="closeModal()" class="h-6 w-6 rotate-45 cursor-pointer mt-2 mr-2" />
      </div>
      <div class="modal-body p-6">
        <div class="flex justify-between">
          <div>
            <button @click="showModalAddCustomer()" id="open-modal-add-customer" class="bg-primary-color-2 text-white flex rounded-lg items-center py-2 px-4 mb-2 shadow-md">
              <PlusIcon class="w-4 h-4 me-1"/>
              Tambah Pelanggan Baru
            </button>
          </div>
          <div v-if="this.$store.state.detail_user.user_login.is_super" class="">
            <!-- <button 
              @click="filterByOutlet(null)"
              :class="['px-3 py-2 me-2 text-sm rounded-lg border border-gray-500', selectedOutlet === null ? 'bg-gray-500 text-white font-bold' : '']">
              ALL
            </button> -->
            <button
            disabled
              v-for="outlet in allOutlets"
              :key="outlet.id"
              @click="filterByOutlet(outlet.id)"
              :class="['px-3 py-2 me-2 text-sm rounded-lg uppercase', selectedOutlet === outlet.id ? 'bg-gray-500 border-gray-500 text-white font-bold border' : 'border-none']">
              {{ outlet.name }}
            </button>
          </div>
        </div>
        <InputForm v-model="searchQuery" @input="handleSearch" placeholder="Cari nama pelanggan" input_class="shadow-md mb-6 w-full py-2"/>
        <div class="max-h-[450px] overflow-y-auto">
          <table class="table-auto w-full mb-6">
            <thead class="bg-gray-100">
              <tr>
                <th class="py-3 border text-center">No</th>
                <th class="p-3 border text-left">Nama Pelanggan</th>
                <th class="p-3 border text-left">No Telepon</th>
                <th class="p-3 border text-center">Pilih Pelanggan</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(customer, index) in allCustomers" :key="customer.id">
              <td class="py-3 border text-center">{{ index + 1 + (pagination.page - 1) * pagination.perPage }}</td>
              <td class="p-3 border capitalize">{{ customer.name }}</td>
              <td class="p-3 border">{{ customer.phone }}</td>
              <td class="p-3 border text-center">
                <button @click="selectCustomer(customer)" :id="'select-customer-'+index" class="border px-4 py-1 rounded-lg border-secondary-green-1 text-secondary-green-1 hover:bg-secondary-green-1 hover:text-secondary-green-2">
                  Pilih Pelanggan
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
          @page-changed="fetchCustomers"
        />
      </div>
    </div>
  </section>
</template>

<script>
import InputForm from '../form/InputForm.vue';
import PaginationComponent from '@/components/PaginationComponent.vue';
import { mapGetters, mapActions } from 'vuex';
import { PlusIcon, } from '@heroicons/vue/24/solid';
import { debounce } from 'lodash';

export default {
  name: "ModalAllCustomer",
  emits: ['closeModalAllCustomer', 'openModalAddCustomer', 'selectedCustomer'],
  props: {
    outlet_id_for_modal: [String, Number]
  },
  components: {
    InputForm, PaginationComponent,
    PlusIcon
  },
  data() {
    return {
      showModal: true,
      searchQuery: '',
      selectedOutlet: null,
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
  async created() {
    this.$store.dispatch('outlets/fetchOutlets');

    // Admin Cabang
    if(this.userLogin.outlet_id) {
      this.selectedOutlet = this.userLogin.outlet_id;
    }

    // === Superadmin / Owner
    if(this.outlet_id_for_modal) {
      this.selectedOutlet = this.outlet_id_for_modal;
    }

    await this.fetchCustomers(this.pagination.page || 1);

    // console.log('outlet_id_for_modal', this.outlet_id_for_modal);
  },
  methods: {
    ...mapActions('customers', ['fetchCustomers', 'searchCustomers']),
    ...mapActions('transactions', ['createTransaction']),
    
    // filterByOutlet(outletId) {
    //   this.selectedOutlet = outletId;
    //   this.fetchCustomers(1);
    // },

    async fetchCustomers(page = 1, limit = 10) {
      const params = {
        page,
        limit,
        search: this.searchQuery,
        outlet_id: this.selectedOutlet
      };
      try {
        await this.$store.dispatch('customers/fetchCustomers', params);
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    },
    handleSearch: debounce(function () {
      console.log('search query: ', this.searchQuery); 
      this.fetchCustomers(1); 
    }, 300),
    closeModal(){
      this.$emit('closeModalAllCustomer');
      this.showModal = false;
    },
    showModalAddCustomer() {
      this.closeModal();
      this.$emit('openModalAddCustomer');
      console.log("Initial pagination state: ", this.pagination);
    },
    selectCustomer(customer) {
      this.$emit('selectedCustomer', customer);
      this.closeModal();
    }
  },
}
</script>