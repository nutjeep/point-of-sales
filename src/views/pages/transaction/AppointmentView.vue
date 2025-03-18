<template>
  <Topbar2 
    :pageTitle="transaction_id ? `Edit Appointment - (${transaction?.transaction_code})` : 'Tambah Appointment Baru'" 
    :back_url="goBackUrl"
  />
  <div
    @click="hideModal()"
    id="overlay"
    class="fixed inset-0 bg-black bg-opacity-30 z-40"
    :class="{ 'hidden': !isBlur }"
  ></div>
  <ModalProduct
    ref="modal"
    v-if="modalProduct"
    @closeModalProduct="hideModalProduct"
    @serviceItem="handleSelectedServiceItem"
    :product="selectedProduct"
    :outlet_id_for_modal="outlet"
  />
  <ModalAddCustomer
    ref="modal"
    v-if="modalAddCustomer"
    @closeModalAddCustomer="hideModalAddCustomer"
    @openModalAllCustomer="showModalAllCustomer"
  />
  <ModalAllCustomer
    ref="modal"
    v-if="modalAllCustomer"
    @openModalAddCustomer="showModalAddCustomer"
    @closeModalAllCustomer="hideModalAllCustomer"
    @selectedCustomer="handleSelectedCustomer"
    :outlet_id_for_modal="outlet"
  />
  <section class="p-6 mt-[55px] h-[90vh] xl:h-[92vh] xl:mt-[65px]">
    <AlertSuccess v-if="alert_success" :text="alert_text"/>
    <AlertDanger v-if="alert_danger" :text="alert_text" @closeAlertDanger="hideAlertDanger()"/>
    <div class="bg-white rounded-lg py-6 px-5 shadow-lg md:h-full lg:h-[98%] xl:h-full overflow-y-hidden">
      <div class="flex h-full">
        <div class="w-[60%] md:w-1/2 h-full overflow-y-hidden me-2 px-1">
          <div class="flex justify-between items-end mb-6">
            <span class="w-1/2 me-3">
              <InputForm v-model="transaction.appointment_date" label_class="text-primary-color-2" label="Pilih Tanggal" type="date" input_class="w-full border-primary-color-2 shadow-md"/>
            </span>
            <div class="w-1/2">
              <!-- For Superadmin -->
              <template v-if="this.$store.state.detail_user.user_login.is_super">
                
                <p v-if="required_to_select_outlet" class="text-red-700 font-semibold"> Harap pilih Cabang!</p>
                <label for="" class="font-medium text-primary-color-2">Pilih Cabang <span class="text-red-700">*</span></label>
                <select @change="changeOutlet" v-model="transaction.outlet_id" :disabled="transaction_id" class="mt-1 block w-full text-lg flex-1 border border-primary-color-1 shadow-lg rounded-lg px-3 py-2 text-gray-500 placeholder:text-gray-300 placeholder:text-[12px] sm:text-sm sm:leading-6 focus:outline-none focus:ring focus:ring-gray-500">
                  <option value="" disabled selected>Pilih Cabang</option>
                  <option v-for="outlet in allOutlets" :key="outlet.id" :value="outlet.id">{{ outlet?.name }}</option>
                </select>
              </template>

              <!-- For Admin -->
              <template v-if="userLogin.outlet_id">
                <div class="mt-2 flex flex-col">
                  <label for="" class="font-medium text-primary-color-2">Cabang</label>
                  <span class="uppercase bg-gray-300 rounded-lg px-3 py-2 font-medium">{{ outletName }}</span>
                </div>
              </template>
            </div>
          </div>

          <InputForm v-model="searchQuery" @input="handleSearch" id="filter-product" placeholder="Cari nama produk ..." input_class="w-full mb-3"/>

          <div class="categories flex gap-2 mb-2 overflow-x-auto">
            <button
              @click="selectCategory(null)"
              :class="selectedCategory === null ? 'bg-secondary-blue-1 text-secondary-blue-2' : 'bg-secondary-blue-2 text-secondary-blue-1'"
              id="filter-category-all"
              class="rounded-md px-4 py-2 uppercase font-semibold text-sm">All</button>
            <button
              v-for="category in allCategories" :key="category.id"
              @click="selectCategory(category)"
              :class="category.id === selectedCategory?.id ? 'bg-secondary-blue-1 text-secondary-blue-2' : 'bg-secondary-blue-2 text-secondary-blue-1'"
              :id="'filter-category-'+category.id"
              class="rounded-md px-4 py-2 uppercase font-semibold text-sm">{{ category?.name }}</button>
          </div>
          <div class="products overflow-y-auto h-full pb-60 relative">
            <div class="w-full flex flex-wrap">
              <div
                v-for="product in productsByCategory"
                :key="product.id"
                :id="'open-modal-detail-product'+product.id"
                @click="showModalProduct(product)"
                class="card border cursor-pointer border-gray-400 shadow-md flex rounded-lg bg-white overflow-hidden m-2 md:w-full lg:w-full xl:w-[400px] border-b-2 border-r-2">
                <div class="w-[100px] md:w-[60px] overflow-hidden">
                  <img v-if="product.path" class="object-cover w-full h-full" :src="imageBaseUrl + product.path" alt="">
                  <img v-else class="object-cover w-full h-full" src="/images/jeju_logo.webp" alt="">
                </div>
                <div class="py-2 px-4 w-full">
                  <div class="flex justify-between items-center w-full">
                    <h5 class="text-secondary-red-1 font-bold text-lg mb-1 flex-grow">{{ product?.name }}</h5>
                    <BadgePrimary
                      :text="product.Category?.name"
                      badge_class="bg-secondary-blue-2 text-secondary-blue-1 uppercase tracking-wider"
                    />
                  </div>
                  <div class="flex text-gray-400">
                    <span v-if="parseInt(product.discount) !== 0">
                      <p class="line-through text-sm">{{ formatRupiah(product.sale_price) }}</p>
                      <h4 class="font-bold text-black">{{ formatRupiah(calculateDiscount(product.sale_price, product.discount)) }}</h4>
                    </span>
                    <h4 v-if="parseInt(product.discount) == 0" class="font-bold text-black">{{ formatRupiah(product.sale_price) }}</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- REKAP ORDER -->
        <div class="w-[40%] md:w-1/2 max-h-full overflow-hidden ms-2">
          <div class="bg-gray-100 p-6 rounded-lg h-full overflow-y-auto flex flex-col justify-between">            
            <div class="bg-white rounded-lg flex justify-between border border-gray-200 shadow-sm mb-4">
              <div class="flex-grow px-6 py-3">
                <p class="font-light text-sm">Nama Pelanggan :</p>
                <h5 v-if="customer.name" class="font-bold text-xl capitalize">{{ customer?.name }}</h5>
                <h5 v-else class="italic text-gray-400">~ Silahkan pilih pelanggan!</h5>
              </div>
              <button @click="showModalAllCustomer()" id="open-modal-customer" class="bg-primary-color-1 py-2 w-ffit hover:bg-primary-color-2 text-white shadow-md border border-gray-400 rounded-lg flex gap-2 justify-center items-center px-4 font-semibold">
                <UserGroupIcon class="w-6 h-6"/><span>Customer</span>
              </button>
            </div>

            <div class="flex-grow overflow-y-auto">
              <!-- EDIT TRANSACTION -->
              <template v-if="transaction_id">
                <div v-for="service_item in transaction?.service_items" :key="service_item" class="selected-product mb-3 bg-white rounded-lg h-fit border border-gray-200">
                  <div class="flex justify-between">
                    <div class="flex-grow px-4 py-2 h-28">
                      <div class="product-header flex justify-between items-center">
                        <div class="flex justify-between items-center w-full">
                          <span class="flex mb-1">
                            <h5 class="text-secondary-red-1 font-bold text-lg capitalize me-2">
                              {{ service_item?.product_detail?.name }}
                            </h5>
                            <BadgePrimary
                              @click="showModalProduct(service_item)"
                              text="Edit"
                              badge_class="border border-primary-color-3 text-primary-color-3 cursor-pointer flex items-center"
                            />
                          </span>
                          <div class="flex text-gray-500">
                            <p class="font-bold text-primary-color-2">{{ formatRupiah(service_item?.subtotal) }}</p>
                          </div>
                        </div>
                      </div>
                      <div class="product-body flex justify-between items-center">
                        <div class="flex gap-1 flex-wrap items-center mt-1">
                          <span class="text-xs uppercase">Staff: </span>
                          <template
                            v-for="staff in service_item.staff_list" :key="staff.user_id"
                          >
                            <BadgePrimary
                              :text="staff.employee_name"
                              badge_class="bg-gray-200 uppercase tracking-wider"
                            />
                          </template>
                          <!-- <BadgePrimary
                            @click="showModalProduct(service_item)"
                            text="Edit Staff"
                            badge_class="border border-primary-color-3 text-primary-color-3 cursor-pointer"
                          /> -->

                          <!-- Start: Only For Display Staff when Product Added -->
                          <template
                            v-for="staff in service_item.staffs" :key="staff.user_id"
                          >
                            <BadgePrimary
                              :text="staff.employee_name"
                              badge_class="bg-gray-200 uppercase tracking-wider"
                            />
                          </template>
                          <!-- End: Only For Display Staff when Product Added -->
                        </div>
                        <div class="flex items-center gap-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            class="size-4"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                            />
                          </svg>
                          <span class="font-medium">{{ service_item?.start_service_time }}</span>
                        </div>
                      </div>
                      <div class="flex gap-1 items-center mt-1">
                        <span class="text-xs uppercase">Note: </span>
                        <p>{{ service_item.service_note }}</p>
                      </div>
                    </div>
                    <XMarkIcon @click="removeSelectedproduct(service_item)" :id="'remove-product-' + service_item.product_id" class="text-gray-700 w-10 h-28 cursor-pointer border-l border-gray-200 px-2 rounded-r-lg"/>
                  </div>
                </div>
              </template>

              <!-- CREATE TRANSACTION / NEW TRANSACTION -->
              <template v-else>
                <div v-for="service_item in transaction.services" :key="service_item" class="selected-product mb-3 bg-white rounded-lg h-fit border border-gray-200">
                  <div class="flex justify-between">
                    <div class="flex-grow px-4 py-2 h-28">
                      <div class="product-header flex justify-between items-center">
                        <div class="flex justify-between items-center w-full">
                          <h5 class="text-secondary-red-1 font-bold text-lg mb-1 capitalize">
                            <!-- {{ productName(service_item.product_id) }} -->
                            {{ service_item.name }}
                          </h5>
                          <div class="flex text-gray-500">
                            <p class="font-bold text-primary-color-2">{{ formatRupiah(service_item?.subtotal) }}</p>
                          </div>
                        </div>
                      </div>
                      <div class="product-body flex justify-between items-center">
                        <div class="flex gap-1 flex-wrap items-center mt-1">
                          <span class="text-xs uppercase">Staff: </span>
                          <template
                            v-for="staff in service_item.staffs" :key="staff.user_id"
                          >
                            <BadgePrimary
                              :text="staff.employee_name"
                              badge_class="bg-gray-200 uppercase tracking-wider"
                            />
                          </template>
                        </div>
                        <div class="flex items-center gap-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            class="size-4"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                            />
                          </svg>
                          <span class="font-medium">{{ service_item?.start_service_time }}</span>
                        </div>
                      </div>
                      <div class="flex gap-1 items-center mt-1">
                        <span class="text-xs uppercase">Note: </span>
                        <p>{{ service_item.service_note }}</p>
                      </div>
                    </div>
                    <XMarkIcon @click="removeSelectedproduct(service_item)" :id="'remove-order-item-'+service_item.product_id" class="text-gray-700 w-10 h-28 cursor-pointer border-l border-gray-200 px-2 rounded-r-lg"/>
                  </div>
                  
                </div>
              </template>
            </div>
            <div class="mt-4 justify-between">
              <div class="mb-4 flex justify-between text-secondary-blue-1 font-bold text-2xl">
                <span>Subtotal</span>
                <span>{{ formatRupiah(transaction?.subtotal) }}</span>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div class="col-span-1">
                  <SubmitButton
                    id="save-order"
                    @click="saveOrder()"
                    :is_disable="!buttonSaveOrder || loadingSaveOrder"
                    :loading="loadingSaveOrder"
                    button_name="Simpan Order"
                    :class="['bg-gray-300 text-black w-full py-2 rounded-lg border-b-2 border-r-2 border-gray-800 font-semibold uppercase tracking-wider', {'bg-primary-color-2 text-white' : buttonSaveOrder}]"
                  />
                </div>
                <div class="col-span-1">
                  <SubmitButton
                    @click="checkout()"
                    id="checkout"
                    button_name="Checkout"
                    class="bg-secondary-red-1 text-secondary-red-2 w-full py-2 rounded-lg border-b-2 border-r-2 border-gray-800 font-semibold uppercase tracking-wider"
                    :loading="loadingCheckout"
                    :is_disable="loadingSaveOrder"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import Topbar2 from '@/components/Topbar2.vue';
import InputForm from '@/components/form/InputForm.vue';
import AlertDanger from '@/components/alerts/AlertDanger.vue';
import SubmitButton from '@/components/form/SubmitButton.vue';
import BadgePrimary from "@/components/badge/BadgePrimary.vue";
import ModalProduct from '@/components/modals/ModalProduct.vue';
import AlertSuccess from '@/components/alerts/AlertSuccess.vue';
import ModalAddCustomer from '@/components/modals/ModalAddCustomer.vue';
import ModalAllCustomer from '@/components/modals/ModalAllCustomer.vue';
import { debounce } from 'lodash';
import { mapGetters, mapActions } from 'vuex';
import { calculateDiscount } from '@/helpers/calculation';
import { formatRupiah, formatDate } from '@/helpers/formating';
import { UserGroupIcon, XMarkIcon  } from '@heroicons/vue/24/solid';

export default {
  name: "AppointmentView",
  components: {
    Topbar2, InputForm, ModalProduct, ModalAllCustomer, ModalAddCustomer, AlertSuccess, AlertDanger,
    UserGroupIcon, XMarkIcon, BadgePrimary, SubmitButton
  },
  props: {
    selectedCustomer: Object,
    serviceItem: Object,
    props_customer_id: String,
    transaction_id: String
  }, 
  data() {
    return {
      isBlur: false,
      modalProduct: false,
      modalAllCustomer: false,
      modalAddCustomer: false,
      selectedProduct: null,
      selectedCategory: null,
      alert_success: false,
      alert_danger: false,
      alert_text: '',
      buttonSaveOrder: true,
      newTransactionId: null,
      required_to_select_outlet: false,
      outlet: null,
      loadingCheckout: false,
      loadingSaveOrder: false,

      customer: {
        id: null,
        name: ''
      },

      transaction: {
        customer_id: null,
        outlet_id: '',
        transaction_note: '',
        discount: 0,
        discount_note:'',
        tax: 0,
        service_charge: 0,
        customer_location: '',
        appointment_date: new Date().toISOString().split('T')[0],
        appointment_hour: '',
        subtotal: 0,
        grand_total: 0,
        services: []
      },
      searchQuery: '',

      // For Edit - Updating Transaction
      new_service_items: {
        serviceItems: [],
        name: '',
        transaction_id: null,
        transaction_type: 2,
        product_id: null,
        quantity: 1,
        price_per_unit: 0,
        start_service_time: '',
        discount: 0,
        subtotal: 0,
        order_note: '',
        order_date: null,
      },

      selectedOutlet: null,

      updated_pos_service_item: null,

      update_staff_service_items: [],
    }
  },
  methods: {
    formatDate,
    formatRupiah,
    calculateDiscount,
    ...mapActions('customers', ['fetchCustomerById']),
    ...mapActions('transactions', ['createTransaction', 'fetchTransactionByCustomerId', 'fetchTransactionById', 'updateTransaction']),
    ...mapActions('products', ['deleteProductById', 'fetchProducts']),
    ...mapActions('pos_services', ['fetchPosServiceByTransactionId', 'createPosService', 'updatePosService', 'deletePosServiceById']),
    ...mapActions('pos_staff_service_item', ['createPosStaffServiceItem']),

    async fetchProducts(page = 1, limit = 50) {
      const params = {
        page,
        limit,
        outlet_id: this.selectedOutlet,
        product_search: this.searchQuery || '',
      };
      await this.$store.dispatch('products/fetchProducts', params);
    },
    handleSearch: debounce(function () {
      this.selectCategory(null);
      // console.log('search query: ', this.searchQuery); 
      this.fetchProducts(1); 
    }, 300),

    async changeOutlet() {
      this.required_to_select_outlet = false;
      this.outlet = this.transaction.outlet_id;
      this.selectedOutlet = this.transaction.outlet_id;
      const params = {
        outlet_id: this.transaction.outlet_id
      };
      await this.$store.dispatch('products/fetchProducts', params);
    },

    hideModalAllCustomer() {
      setTimeout(()=> {
        this.modalAllCustomer = false;
      }, 500);
      this.isBlur = false;
    },
    showModalProduct(product) {
      if(this.$store.state.detail_user.user_login.is_super && !this.transaction.outlet_id) {
        this.required_to_select_outlet = true;
        setTimeout(() => {
          this.required_to_select_outlet = false;
        }, 1500);
        return;
      }
      this.isBlur = true;
      this.modalProduct = true;
      this.selectedProduct = product;
    },
    hideModalProduct() {
      setTimeout(()=> {
        this.modalProduct = false;
      }, 500);
      this.isBlur = false;
    },
    selectCategory(category) {
      this.selectedCategory = category;
    },
    showModalAddCustomer() {
      this.isBlur = true;
      this.modalAddCustomer = true;
    },
    hideModalAddCustomer() {
      this.isBlur = false;
      this.modalAddCustomer = false;
    },
    showModalAllCustomer() {
      if(this.$store.state.detail_user.user_login.is_super && !this.transaction.outlet_id) {
        this.required_to_select_outlet = true;
        setTimeout(() => {
          this.required_to_select_outlet = false;
        }, 1500);
        return;
      }
      this.modalAllCustomer = true;
      this.isBlur = true;
    },
    showAlertSuccess(){
      this.alert_success = true;
      this.alert_text = 'Pelanggan berhasil ditambahkan';
      setTimeout(()=>{
        this.alert_success = false;
        this.alert_text = '';
      }, 2000);
    },
    handleSelectedCustomer(customer) {
      this.transaction.customer_id = customer.id;
      this.customer.id = customer.id;
      this.customer.name = customer.name;
      // console.log('selected customer: ', customer);
      // console.log('trx updated, selected customer: ', this.transaction);
    },
    async handleSelectedServiceItem(service_item) {
      // console.log('transaction: ', this.transaction);
      // console.log('service item selected: ', service_item);
      // === IF Edit Transaction
      if(this.transaction_id) {
        service_item.order_date = this.transaction.appointment_date;
        this.transaction.appointment_hour = service_item.start_service_time;
        this.transaction?.service_items.push(service_item);

        // Insert New / Edited Service Item
        this.new_service_items.transaction_id = this.transaction_id;
        this.new_service_items.product_id = service_item.product_id;
        this.new_service_items.name = service_item.name;
        this.new_service_items.price_per_unit = service_item.price_per_unit;
        this.new_service_items.start_service_time = service_item.start_service_time;
        this.new_service_items.discount = service_item.discount;
        this.new_service_items.subtotal = service_item.subtotal;
        this.new_service_items.service_note = service_item.service_note;
        this.new_service_items.order_date = this.transaction.appointment_date;
        
        const responseUpdatedServiceItem = await this.createPosService(this.new_service_items);
        // console.log('response update service item: ', responseUpdatedServiceItem);

        // === Insert New / Edited Staff per Service Item
        if(service_item.staffs.length > 0) {
          service_item.staffs.forEach((staff) => {

            const newStaffServiceItem = {
              pos_service_item_id: responseUpdatedServiceItem?.data.id,
              user_id: staff.user_id,
              employee_name: staff.employee_name,
              working_status: 1
            };

            this.update_staff_service_items.push(newStaffServiceItem);
          });
        }
        await this.createPosStaffServiceItem(this.update_staff_service_items);
        // const responseUpdatedStaffServiceItem = await this.createPosStaffServiceItem(this.update_staff_service_items);
        // console.log('response update staffs service item: ', responseUpdatedStaffServiceItem);
        this.transaction?.services.push(service_item);
        window.location.reload();
      }
      else {
        service_item.order_date = this.transaction.appointment_date;
        this.transaction.appointment_hour = service_item.start_service_time;
        this.transaction?.services.push(service_item);
      }
      this.calculateSubtotal();
      // console.log('trans updated, selected product: ', this.transaction);
    },
    removeSelectedproduct(selected_product) {
      // console.log('remove this product: ', selected_product);
      
      if(this.transaction_id) {
        // 1. Delete Service Item
        if(selected_product.id) {
          this.deletePosServiceById(selected_product.id);
        }
        const index = this.transaction?.service_items.findIndex(service_item => service_item.product_id === selected_product.product_id);
        if(index !== -1 ) {
          this.transaction?.service_items.splice(index, 1);
        }
      }
      else {
        const index = this.transaction?.services.findIndex(service_item => service_item.product_id === selected_product.product_id);
        if(index !== -1 ) {
          this.transaction?.services.splice(index, 1);
        }
      }
      this.calculateSubtotal();
    },
    // productName(product_id) {
    //   const product = this.allProducts.find(product => product.id === product_id);
    //   return product?.name;
    // },
    calculateSubtotal() {
      // Menghitung total dari semua service_items (EDIT TRANSAKSI)
      if(this.transaction_id) {
        this.transaction.subtotal = this.transaction.service_items.reduce((total, service_item) => {
          return total + parseInt(service_item.subtotal);
        }, 0);
      }
      else { // Menghitung total dari semua services (NEW APPOINTMENT)
        this.transaction.subtotal = this.transaction?.services.reduce((total, service_item) => {
          return total + parseInt(service_item.subtotal);
        }, 0); // Mulai dari 0
      }
    },
    // Update Service Item data & Transaction (affect to service item's order_date => Report Product)
    async saveUpdatedTransaction(trx) {
      const responseTrx = await this.fetchTransactionById(this.transaction_id);
      const serviceItemsData = responseTrx.data;
      serviceItemsData?.service_items.forEach(async (service) => {
        if(service.id) {
          const updatedServiceData = {
            id: service.id,
            order_date: trx.appointment_date,
            transaction_id: trx.id
          }
          await this.updatePosService(updatedServiceData);
          // console.log('updated service: ', service);
        }
      });

      await this.updateTransaction(trx);
    },
    async saveOrder() {
      // console.log('transaction: ', this.transaction);
      if(!this.transaction.customer_id) {
        this.alert_danger = true;
        this.alert_text = 'Pilih Customer terlebih dulu!';
        setTimeout(() => {
          this.alert_danger = false;
          this.alert_text = '';
        }, 2000);
        return;
      }
      if(this.$store.state.detail_user.user_login.is_super && !this.transaction.outlet_id) {
        this.alert_danger = true;
        this.alert_text = 'Pilih Cabang terlebih dulu!';
        setTimeout(() => {
          this.alert_danger = false;
          this.alert_text = '';
        }, 2000);
        return;
      }

      this.loadingSaveOrder = true;
      
      try {
        // Edit & Update Transaction
        if(this.transaction_id) {
          this.saveUpdatedTransaction(this.transaction);
          this.buttonSaveOrder = false;
          this.alert_success = true;
          this.alert_text = 'Order berhasil diubah!';
          setTimeout(() => {
            this.alert_success = false;
            this.alert_text = '';
          }, 1500);
          // console.log('order berhasil diubah: ', this.transaction);
        }
        // New Transaction
        else {
          const newTrx = await this.createTransaction(this.transaction);
          this.buttonSaveOrder = false;
          this.newTransactionId = newTrx.data
          this.alert_success = true;
          this.alert_text = 'Order berhasil disimpan!';
          setTimeout(() => {
            this.alert_success = false;
            this.alert_text = '';
          }, 1500);
          // console.log('order berhasil disimpan: ', this.transaction);
        }
      }
      catch(error) {
        console.error(error)
        this.alert_text = 'Gagal membuat order: ', error;
        return;
      }
      finally {
        this.loadingSaveOrder = false;
      }
    },
    async checkout() {
      // console.log('transaction: ', this.transaction);
      if(!this.transaction.customer_id) {
        this.alert_danger = true;
        this.alert_text = 'Pilih Customer terlebih dulu!';
        setTimeout(() => {
          this.alert_danger = false;
          this.alert_text = '';
        }, 1500);
        return;
      }
      if(this.$store.state.detail_user.user_login.is_super && !this.transaction.outlet_id) {
        this.alert_danger = true;
        this.alert_text = 'Pilih Cabang terlebih dulu!';
        setTimeout(() => {
          this.alert_danger = false;
          this.alert_text = '';
        }, 1500);
        return;
      }
      // if(this.transaction.services.length <= 0) {
      //   this.alert_danger = true;
      //   this.alert_text = 'Pilih Produk terlebih dulu!';
      //   return;
      // }

      this.loadingCheckout = true;

      try {
        // Edit Trancastion
        if(this.transaction_id) {
          this.saveUpdatedTransaction(this.transaction);
          this.loadingCheckout = false;
          this.$router.push({ name: 'CheckoutView', params: { id: this.transaction_id } });
        }
        // New Transaction
        else {
          if(this.newTransactionId) {
            this.loadingCheckout = false;
            this.$router.push({ name: 'CheckoutView', params: { id: this.newTransactionId } });
          }
          else {
            const createdTransaction = await this.createTransaction(this.transaction);
            this.loadingCheckout = false;
            this.$router.push({ name: 'CheckoutView', params: { id: createdTransaction.data } });
          }
        }
      }
      catch(error) {
        console.error(error)
        this.alert_text = 'Gagal membuat transaksi: ', error;
        return;
      }
    },
    hideAlertDanger() {
      this.alert_danger = false;
      this.alert_text = '';
    },

    // Else for Closing Modal 
    hideModal() {
      this.$refs.modal.closeModal();
    },

    dateFormating(stringDate) {
      const date = new Date(stringDate);
      
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Bulan dimulai dari 0
      const year = date.getFullYear();
      
      return `${year}-${month}-${day}`; //return "2024-09-25"
    }
  },
  computed: {
    ...mapGetters('products', ['allProducts']),
    ...mapGetters('categories', ['allCategories']),
    ...mapGetters('outlets', ['allOutlets']),

    userLogin() {
      const user = this.$store.state.detail_user.detail_user;
      return user;
    },
    outletName() {
      if (this.userLogin.outlet_id) {
        const outlet = this.allOutlets.find(outlet => outlet.id == this.userLogin.outlet_id);
        return outlet ? outlet.name : 'Loading...';
      }
      return '';
    },

    productsByCategory() {
      let filteredProducts = this.allProducts.filter(product => product.saleable == true);

      // Filter by selected category
      if (this.selectedCategory !== null) {
        filteredProducts = filteredProducts.filter(product => product.category_id === this.selectedCategory.id);
      }

      // If user is super admin, show products for the selected outlet
      if (this.$store.state.detail_user.user_login?.is_super && this.selectedOutlet !== null) {
        filteredProducts = filteredProducts.filter(product => product.outlet_id === this.selectedOutlet);
      } 
      // If user is admin, show only products from their outlet
      else if (!this.$store.state.detail_user.user_login?.is_super && this.userLogin.outlet_id) {
        filteredProducts = filteredProducts.filter(product => product.outlet_id === this.userLogin.outlet_id);
      }

      return filteredProducts;
    },

    formattedAppointmentDate() {
      return this.transaction ? this.transaction.appointment_date : null;
    },

    imageBaseUrl() {
      return process.env.VUE_APP_API_IMAGE_URL;
    },

    goBackUrl() {
      return this.$router.options.history.state.back === '/penjualan' ? { name: 'SalesView' } 
           : this.$router.options.history.state.back === '/dashboard' ? { name: 'Dashboard' } 
           : { name: 'CalendarView' };
    }
  },
  async created() {
    this.$store.dispatch('products/fetchProducts');
    this.$store.dispatch('categories/fetchCategories');
    this.$store.dispatch('outlets/fetchOutlets');
    
    if(this.props_customer_id) {
      this.transaction.customer_id = this.props_customer_id;
      this.customer.id = this.props_customer_id;
      const response = await this.fetchCustomerById(this.props_customer_id);
      const customerData = response.data;
      this.customer.name = customerData.name;
      return;
    }

    if(this.transaction_id) {
      const response = await this.fetchTransactionById(this.transaction_id);
      response.data.appointment_date ? response.data.appointment_date = this.dateFormating(response.data.appointment_date) : response.data.appointment_date = null;
      this.transaction = response.data;
      this.transaction.services = [];
      this.transaction.service_items.forEach((item) => {
        this.transaction.services.push(item);
      });
      this.customer.name = this.transaction?.customer?.name;
      this.changeOutlet();
      // console.log('edit transaction; ', this.transaction);
    }

    if(this.userLogin.outlet_id) {
      this.transaction.outlet_id = this.userLogin.outlet_id;
    }
  },
}
</script>