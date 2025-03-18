<template>
  <Topbar2 :pageTitle="isEdit ? 'Edit Staff' : 'Tambah Staff'" back_url="/staff" /> 
  <section class="p-6 px-40 xl:px-56 md:px-20 mt-[100px]">
    <AlertSuccess v-if="alert_success" :text="alert_text"/>
    <AlertDanger v-if="alert_danger" @closeAlertDanger="hideAlertDanger()" :text="alert_text"/>
    <div class="grid grid-cols-12 gap-10 mb-14">
      <div class="col-span-6">
        <InputForm id="staff-name" v-model="employee.name" :is_required="true" input_class="w-full mb-5" label="Nama" label_class="mb-1 block text-start" type="text" placeholder="Nama staff"/>
        <InputForm id="staff-email" v-model="employee.email" :is_required="true" :is_disabled="isEdit == true" input_class="w-full mb-5" label="Email" label_class="mb-1 block text-start" type="email" placeholder="Cth: example@email.com"/>
        <InputForm id="staff-phone-number" v-model="employee.phone_number" input_class="w-full mb-5" label="Nomor Telepon" label_class="mb-1 block text-start" type="number" placeholder="Cth: 081234567890"/>
        <InputForm id="staff-birthdate" v-model="employee.birthdate" input_class="w-full mb-5" label="Tanggal Lahir" label_class="mb-1 block text-start" type="date"/>
        <div>
          <label for="" class="font-medium">Cabang</label>
          <template v-if="userLogin.outlet_id">
            <div class="mt-2">
              <span class="uppercase bg-gray-300 rounded-lg px-3 py-1 font-medium">{{ outletName }}</span>
            </div>
          </template>
          <template v-else>
            <select v-model="employee.outlet_id" class="mt-1 block w-full text-lg flex-1 border border-gray-400 rounded-lg px-3 py-2 text-gray-500 placeholder:text-gray-300 placeholder:text-[12px] sm:text-sm sm:leading-6 focus:outline-none focus:ring focus:ring-gray-500">
              <option value="" disabled selected>Pilih Cabang</option>
              <option v-for="outlet in allOutlets" :key="outlet.id" :value="outlet.id">{{ outlet.name }}</option>
            </select>
          </template>
        </div>
        <!-- <div>
          <label class="font-medium">Gender</label>
          <div class="flex mt-2">
            <button @click="setGender('')" :class="genderButtonClass('')" class="py-2 px-3 text-sm rounded-s-lg">Disable</button>
            <button @click="setGender('male')" :class="genderButtonClass('male')" class="py-2 px-3 text-sm">Pria</button>
            <button @click="setGender('female')" :class="genderButtonClass('female')" class="py-2 px-3 text-sm rounded-e-lg">Wanita</button>
          </div>
        </div> -->
      </div>
      <div class="col-span-6">
        <TextArea id="staff-address" v-model="employee.address" rows="4" label="Alamat" textarea_class="mb-5" />
      </div>
    </div>
    <div class="grid grid-cols-12 gap-10">
      <div class="col-span-6">
      </div>
      <div class="col-span-6 flex justify-end">
        <CancelButton class="mb-10 me-3" id="back" to_url="/staff" />
        <span>
          <SubmitButton
            id="submit"
            :loading="loadingSubmit"
            :is_disable="loadingSubmit"
            @click="submit()"
            button_name="Simpan"
            button_class="bg-primary-color-2 text-white rounded-lg"
          />
        </span>
      </div>
    </div>
  </section>
</template>

<script>
import InputForm from '@/components/form/InputForm.vue';
import TextArea from '@/components/form/TextArea.vue';
import CancelButton from '@/components/buttons/CancelButton.vue';
import SubmitButton from '@/components/form/SubmitButton.vue';
import Topbar2 from '@/components/Topbar2.vue';
import AlertSuccess from '@/components/alerts/AlertSuccess.vue';
import AlertDanger from '@/components/alerts/AlertDanger.vue';
import { validationEmail, validationPhoneNumber } from '@/helpers/validation';
import { mapActions, mapGetters } from 'vuex';

export default {
  name: "AddEditEmployeeView",
  props: ['id'],
  components: {
    InputForm, TextArea, CancelButton, SubmitButton, Topbar2, AlertSuccess, AlertDanger,
  },
  data() {
    return {
      alert_success: false,
      alert_danger: false,
      alert_text: '',

      employee: {
        id: null,
        name: '',
        phone_number: '',
        email: '',
        password: 'password@123!',
        birthdate: null,
        address: '',
        role_id: 2,
        outlet_id: null
      },
      isEdit: false,
      isClicked: false,

      loadingSubmit: false
    };
  },
  async created() {
    this.$store.dispatch('outlets/fetchOutlets');

    this.employee.outlet_id = this.userLogin.outlet_id
    const employeeId = this.id; 
    if (employeeId) {
      this.isEdit = true;

      try {
        const response = await this.fetchEmployeeById(employeeId);
        const employeeData = response.data;

        this.employee = {
          id: employeeData.id,
          name: employeeData.name,
          email: employeeData.email,
          phone_number: employeeData.phone_number,
          birthdate: employeeData.birthdate ? new Date(employeeData.birthdate).toISOString().split('T')[0] : null,
          address: employeeData.address,
          outlet_id: employeeData.outlet_id,
          // gender: employeeData.gender,
          // outlet_id: employeeData.outlet_id
        };
      }
      catch (error) {
        console.error('Failed to fetch employee', error);
      }
    }
  },
  computed: {
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
    }
  },
  methods: {
    ...mapActions('employees', ['createEmployee', 'updateEmployee', 'fetchEmployeeById']),
    validationPhoneNumber, validationEmail,

    // setGender(gender) {
    //   this.employee.gender = gender;
    // },
    // genderButtonClass(gender) {
    //   return this.employee.gender === gender ? 'bg-primary-color-3 text-white' : 'bg-white';
    // },
    
    async submit() {
      if(!this.employee.name || !this.employee.email) {
        this.alert_danger = true;
        this.alert_text = 'Nama dan Email harus diisi!';
        return;
      }
      if (this.employee.phone_number && !validationPhoneNumber(this.employee.phone_number)) {
        this.alert_danger = true;
        this.alert_text = 'Format no telepon terdiri dari 10 - 13 karakter angka';
        return;
      }
      if (!this.employee.outlet_id) {
        this.alert_danger = true;
        this.alert_text = 'Harap Pilih cabang terlebih dahulu!';
        return;
      }
      if(!this.id) {
        if (this.employee.email && !validationEmail(this.employee.email)) {
          this.alert_danger = true;
          this.alert_text = 'Format email tidak valid!';
          return;
        }
      }

      this.loadingSubmit = true;

      if (this.isEdit) {
        try {
          await this.updateEmployee(this.employee);
          this.alert_success = true;
          this.alert_text = 'Berhasil mengubah data staff';
          setTimeout(() => {
            this.alert_success = false;
            this.alert_text = ''
            this.$router.push('/staff');
          }, 500);
        }
        catch (error) {
          console.error('Failed to update employee', error);
          this.alert_danger = true;
          this.alert_text = 'Gagal ubah data staff' + error
        }
        finally {
          this.loadingSubmit = false;
        }
      }
      else {
        try {
          await this.createEmployee(this.employee);
          this.alert_success = true;
          this.alert_text = 'Berhasil menambah staff baru';
          setTimeout(() => {
            this.alert_success = false;
            this.alert_text = '';
            this.$router.push('/staff');
          }, 500);
        }
        catch (error) {
          console.error('Failed to create employee', error);
          this.alert_danger = true;
          this.alert_text = 'Gagal menambah staff baru: ' + error?.response?.data?.message;
        }
      }
    },
    hideAlertDanger() {
      this.alert_danger = false;
      this.alert_text = '';
    },
  },
  
}
</script>