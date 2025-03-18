<template>
   <section class="w-screen h-screen absolute flex justify-center items-center">
      <div class="modal absolute block w-3/4 max-w-xl bg-white shadow-lg rounded-lg border-t-4 border-primary-color-2 z-50"
      :class="{
      'animate__animated animate__zoomIn': showModal,
      'animate__animated animate__zoomOut': !showModal,
      }">
         <div class="modal-body p-6">
            <div class="product overflow-hidden w-full flex justify-between border rounded-lg">
               <div class="flex flex-grow">
                  <div class="w-[100px] md:w-[80px] overflow-hidden">
                     <img class="object-cover w-full h-full" src="/images/jeju_logo.webp" alt="">
                  </div>
                  <div class="py-2 px-4 w-full">
                     <h5 class="text-secondary-red-1 font-bold text-lg mb-1 capitalize">{{ !product.staff_list ? product_selected.name : product.product_detail.name }}</h5>
                     <div class="flex justify-between text-gray-400 w-full">
                        <span v-if="parseInt(product.discount) !== 0">
                           <p class="line-through text-sm">{{ !product.staff_list ? formatRupiah(product.sale_price) : '10' }}</p>
                           <h4 class="font-bold text-black">{{ formatRupiah(calculateDiscount(product.sale_price, product.discount)) }}</h4>
                        </span>
                        <h4 v-if="parseInt(product.discount) == 0" class="font-bold text-black">{{ !product.staff_list ? formatRupiah(product.sale_price) : formatRupiah(product.price_per_unit) }}</h4>
                     </div>
                  </div>
               </div>
               <div class="category_name p-3 flex flex-col gap-2">
                  <BadgePrimary
                     v-if="!product.staff_list"
                     :text="product?.Category?.name"
                     badge_class="bg-secondary-blue-2 text-secondary-blue-1 uppercase tracking-wider"
                  />
                  <BadgePrimary
                     :text="`${!product.staff_list ? product.duration : product.product_detail.duration} menit`"
                     badge_class="bg-gray-200"
                  />
               </div>
            </div>
            <div class="mt-3">
               <h5 class="font-bold">Deskripsi :</h5>
               <p class="font-light">{{ product.desc }}</p>
            </div>
            <AlertDanger v-if="alert_danger" :text="alert_text" @closeAlertDanger="hideAlertDanger()"/>
            <div class="date-time my-6 flex">
               <div class="me-6">
                  <label class="font-medium">Waktu</label>
                  <InputTime v-model="service_item.start_service_time" id="time" type="time"/>
               </div>
               <div>
                  <label class="mb-1 font-medium block">Staff <span class="text-red-700">*</span></label>
                  <select v-model="selected_staff_id" @change="selectStaff()" id="select-staff" class="bg-white w-full rounded-lg border mb-3 py-2 px-2">
                     <option value="">Pilih staff</option>
                     <option v-for="employee in availableEmployees" :key="employee.id" :value="employee.id">{{ employee.name }}</option>
                  </select>
                  <div class="w-full flex flex-wrap">
                     <span v-if="selected_staff.length <= 0" class="text-gray-400 italic">
                        ~ Belum ada staff dipilih
                     </span>
                     <span v-for="(staff, index) in selected_staff" :key="index" class="staff bg-gray-200 px-3 mb-1 py-1 rounded-md m-1 flex gap-1 items-center text-lg font-medium">
                        {{  staff.name || staff.employee_name }}
                        <button @click="removeStaff(staff)" :id="'remove-staff-'+index" class="text-gray-700">
                           <XMarkIcon class="h-5 w-5"/>
                        </button>
                     </span>
                  </div>
               </div>
            </div>
            <div>
               <TextArea v-model="service_item.service_note" id="service_note" label="Catatan" rows="3" />
            </div>
         </div>
         <div class="modal-footer flex justify-end p-6 border-t border-gray-400">
            <SubmitButton
               @click="closeModal"
               button_name="Tutup"
               id="close-modal"
               button_class="bg-gray-300 rounded-lg me-3"
            />
            <SubmitButton
               @click="save()"
               :loading="loadingSave"
               :is_disable="loadingSave"
               id="submit"
               button_name="Simpan"
               button_class="bg-primary-color-2 text-white rounded-lg"/>
         </div>
      </div>
   </section>
 </template>
<script>
import SubmitButton from '../form/SubmitButton.vue';
import InputTime from '../form/InputTime.vue';
import TextArea from '../form/TextArea.vue';
import AlertDanger from '@/components/alerts/AlertDanger.vue';
import BadgePrimary from "@/components/badge/BadgePrimary.vue";
import { calculateDiscount } from '@/helpers/calculation';
import { formatRupiah, getCurrentTime } from '@/helpers/formating';
import { XMarkIcon } from '@heroicons/vue/24/solid';
import { mapGetters, mapActions } from 'vuex';

export default {
   name: 'ModalProduct',
   emits: ['closeModalProduct', 'serviceItem'],
   props: {
      product: {
         type: Object,
         default: null,
      },
      outlet_id_for_modal: [String, Number]
   },
   components: {
      SubmitButton, TextArea, AlertDanger, InputTime,
      XMarkIcon, BadgePrimary
   },
   data() {
      return {
         showModal: true,
         service_item: {
            transaction_type: 2,
            name: '',
            product_id: null,
            quantity: 1,
            price_per_unit: 0,
            discount: 0,
            subtotal: 0,
            service_note: '',
            order_date: '',
            start_service_time: this.getCurrentTime(),
            staffs: [],
         },
         staff: {
            user_id: null,
            employee_name: '',
            working_status: 1
         },

         product_selected: {
            name: this.product.name,
            sale_price: this.product.sale_price
         },

         alert_danger: false,
         alert_text: '',

         selected_staff: [],
         selected_staff_id: '',

         selectedOutlet: null,

         loadingSave: false
      };
   },
   methods: {
      formatRupiah, calculateDiscount, getCurrentTime,
      ...mapActions('pos_staff_service_item', ['createPosStaffServiceItem', 'deletePosStaffServiceItem']),
      ...mapActions('pos_services', ['updatePosService']),
      ...mapActions('employees', ['fetchEmployees']),

      closeModal() {
         this.showModal = false;
         this.$emit('closeModalProduct');
      },

      async fetchEmployees(page = 1, limit = 20) {
         const params = {
            page,
            limit,
            role_id: 2,
            outlet_id: this.selectedOutlet
         }

         await this.$store.dispatch('employees/fetchEmployees', params);
      },

      selectStaff() {
         const selected = this.allEmployees.find(employee => employee.id === this.selected_staff_id);
         if (selected) {
            this.selected_staff.push(selected);
         }

         const staffData = {
            pos_service_item_id: null,
            user_id: selected.id,
            employee_name: selected.name,
            working_status: 1
         }
         // Masukkan Data Staff Yang Dipilih ke "service_item.staffs"
         this.service_item.staffs.push(staffData);

         this.selected_staff_id = '';

         // console.log("service_item: ", this.service_item);
      },
      hideAlertDanger() {
         this.alert_danger = false;
         this.alert_text = '';
      },
      removeStaff(staff) {
         this.selected_staff = this.selected_staff.filter(selected => selected.id !== staff.id);
         
         // Hapus Staff Dari service_item.staffs
         this.service_item.staffs = this.service_item.staffs.filter(item => item.user_id !== staff.id);
      },
      async save() {
         // console.log('service item: ', this.service_item);
         if(!this.product.staff_list && this.service_item.staffs.length <= 0) {
            this.alert_danger = true;
            this.alert_text = 'Harap pilih Staff!';
            return;
         }

         // === Edit Service Item
         if(this.product.transaction_id || this.product.staff_list) {
            if(this.selected_staff <= 0) {
               this.alert_danger = true;
               this.alert_text = 'Harap pilih Staff!';
               return;
            }

            this.loadingSave = true;

            let updated_staffs_service_item = [];
            this.selected_staff.forEach((staff) => {
               // New Staff Added
               if(!staff.user_id) {
                  const newStaffServiceItem = {
                     pos_service_item_id: this.product.id,
                     user_id: staff.id,
                     employee_name: staff.name,
                     working_status: 1
                  }
                  updated_staffs_service_item.push(newStaffServiceItem);
               }
               // Old Staff
               else {
                  staff.pos_service_item_id = this.product.id;
                  
                  const staffListWithoutID = { ...staff };
                  delete staffListWithoutID.id;
                  delete staffListWithoutID.employee;

                  updated_staffs_service_item.push(staffListWithoutID);
               }
            });
            this.product.staff_list.forEach(async (staff) => {
               await this.deletePosStaffServiceItem(staff);
            });
            await this.createPosStaffServiceItem(updated_staffs_service_item);

            const updated_service_item = {
               id: this.product.id,
               transaction_id: this.product.transaction_id,
               start_service_time: this.service_item.start_service_time,
               service_note: this.service_item.service_note,
            };
            await this.updatePosService(updated_service_item);

            // console.log('save selected staff: ', this.selected_staff);
            // console.log('updated_staffs_service_item: ', updated_staffs_service_item);
            this.loadingSave = false;
            this.closeModal();
            window.location.reload();
            return;
         }

         this.service_item.transaction_id = null;
         this.service_item.product_id = this.product.id;
         this.service_item.price_per_unit = this.product.sale_price;
         this.service_item.discount = this.product.discount;
         this.service_item.name = this.product.name;
         this.service_item.subtotal = calculateDiscount(this.product.sale_price, this.product.discount);
         console.log("final service item: ", this.service_item);

         this.$emit('serviceItem', this.service_item);
         this.loadingSave = false;
         this.closeModal();
      }
   },
   computed: {
      ...mapGetters('employees', ['allEmployees']),
      ...mapGetters('outlets', ['allOutlets']),

      userLogin() {
         const user = this.$store.state.detail_user.detail_user;
         return user;
      },
      availableEmployees() {
         let employees = this.allEmployees
            .filter(employee => employee.role_id == 2)
            .filter(employee => !this.selected_staff.find(selected => selected.id == employee.id)
         );

         if (!this.$store.state.detail_user.user_login?.is_super && this.userLogin.outlet_id) {
            employees = employees
               .filter(employee => employee.role_id == 2)
               .filter(employee => employee.outlet_id == this.userLogin.outlet_id)
               .filter(employee => !this.selected_staff.find(selected => selected.id == employee.id));
         }

         return employees;
      }
   },
   async created() {
      this.$store.dispatch('outlets/fetchOutlets');
      // console.log("this product ", this.product);
      // console.log('outlet_id_for_modal: ', this.outlet_id_for_modal);

      // Admin Cabang
      if(this.userLogin.outlet_id) {
         this.selectedOutlet = this.userLogin.outlet_id;
      }

      // === Superadmin / Owner
      if(this.outlet_id_for_modal) {
         this.selectedOutlet = this.outlet_id_for_modal;
      }

      await this.fetchEmployees(1);

      
      if(this.product.transaction_id || this.product.staff_list) {
         this.product.staff_list.forEach((staff) => {
            this.selected_staff.push(staff);
         });
         // console.log('selected staff: ', this.selected_staff);

         if(this.product.transaction_id) {
            this.service_item.start_service_time = this.product.start_service_time
            this.service_item.service_note = this.product?.service_note
         }
      }      
   },
}
</script>