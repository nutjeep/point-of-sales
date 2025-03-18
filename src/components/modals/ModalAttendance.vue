<template>
  <section class="w-screen h-screen absolute flex justify-center items-center z-50">
     <div id="modal modal-customer" class="modal absolute block w-[600px] bg-white shadow-md rounded-lg"
      :class="{
        'animate__animated animate__zoomIn': showModal,
        'animate__animated animate__zoomOut': !showModal,
      }">
      <div id="modal-header" :class="headerClass">
        <p v-if="!isCheckingOut" class="text-md text-center text-white">Selamat datang</p>
        <p v-else class="text-md text-center text-white">Checking Out</p>
        <h5 class="text-white text-center font-bold uppercase text-xl tracking-widest">{{ employeeName }}</h5>
      </div>
      <div id="modal-body" class="p-10">
        <input v-model="employeeEmail" type="text" class="w-full">
        <InputPassword v-model="employeePassword" label="Password" input_class="w-full" />
      </div>
      <div class="modal-footer p-5">
        <div class="flex justify-center">
          <SubmitButton @click="closeModal" button_name="Close" button_class="mx-1 text-red-600 border-red-600 hover:text-white hover:bg-red-600"/>
          <SubmitButton @click="checkInOut" :button_name="isCheckingOut ? 'CHECK OUT' : 'CHECK IN'" :button_class="buttonClass"/>
        </div>
      </div>
     </div>
  </section>
</template>
<script>
import InputPassword from '../form/InputPassword.vue';
import SubmitButton from '../form/SubmitButton.vue';
import axios from 'axios';

export default {
  name: 'ModalAttendance',
  props: {
    employee: {
      type: Object,
      default: null,
    },
    isCheckingOut: {
      type: Boolean,
      default: false,
    }
  },
  components: { InputPassword, SubmitButton },
  data() {
    return {
      showModal: true,
      employeeEmail: this.employee ? this.employee.email : '',
      employeeName: this.employee ? this.employee.name : '',
    };
  },
  methods: {
    closeModal() {
      this.showModal = false;
      this.$emit('closeModal');
      setTimeout(() => {
        this.closeModal();
      }, 200);
    },
    async checkInOut() {
      try {
        const response = await axios.post('https://example.com/api/v1/auth', {
          email: this.employeeEmail,
          password: this.employeePassword
        });
        if(response.data.status == 'success') {
          const token = response.data.data.token;
          if (this.isCheckingOut) {
            await this.checkOut(token);
          } else {
            await this.checkIn(token);
          }
        } else {
          console.log('Authentication failed: ', response.data.message);
        }
      } catch(error) {
        alert(error);
      }
    },
    async checkIn(token) {
      try {
        const response = await axios.post('https://example.com/api/v1/attendances', {
          user_id: this.employee.id,
          outlet_id: 1,
          start_time: new Date().toISOString(),
          description: 'Checked in'
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.status == 'success') {
          this.$emit('checkInOut', this.employee);
        } else {
          console.log('Check-in failed: ', response.data.message);
        }
      } catch (error) {
        alert(error);
      }
    },
    async checkOut(token) {
      try {
        const attendance = this.$store.getters['attendances/allAttendances'].find(att => att.user_id == this.employee.id && !att.end_time);
        if (attendance) {
          const response = await axios.post('https://example.com/api/v1/attendances', {
            user_id: this.employee.id,
            outlet_id: 1,
            start_time: attendance.start_time,
            end_time: new Date().toISOString(),
            description: 'Checked out'
          }, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (response.data.status == 'success') {
            this.$emit('checkInOut', this.employee);
          } else {
            console.log('Check-out failed: ', response.data.message);
          }
        } else {
          console.log('No open attendance record found for check-out');
        }
      } catch (error) {
        alert(error);
      }
    }
  },
  computed: {
    headerClass() {
      return this.isCheckingOut ? 'w-full bg-red-600 py-3 rounded-t-lg' : 'w-full bg-green-600 py-3 rounded-t-lg';
    },
    buttonClass() {
      return this.isCheckingOut ? 'mx-1 bg-red-500 hover:bg-red-700 text-white' : 'mx-1 bg-green-500 hover:bg-green-700 text-white';
    }
  }
}
</script>