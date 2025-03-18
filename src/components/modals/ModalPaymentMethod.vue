<template>
  <section class="w-screen h-screen absolute flex justify-center items-center">
    <div class="modal border-t-4 border-primary-color-2 absolute block w-5/12 bg-white shadow-md rounded-lg z-50"
      :class="{
      'animate__animated animate__zoomIn': showModal,
      'animate__animated animate__zoomOut': !showModal,
      }">
      <div class="w-full border-b border-gray-400 py-3 rounded-t-lg">
        <h5 class="text-primary-color-1 text-center font-bold text-xl">{{ isEdit ? 'Edit Metode Pembayaran' : 'Tambah Metode Pembayaran' }}</h5>
      </div>
      <div id="modal-body" class="p-5">
        <InputForm id="payment-method" v-model="description" label="Nama Metode Pembayaran" input_class="w-full mb-3"/>
        <SwitchGroup as="div" class="flex gap-x-4 sm:col-span-2">
          <SwitchLabel class="text-sm leading-6 text-gray-600">
            <span class="font-semibold">Is Active ?</span>
          </SwitchLabel>
          <div class="flex h-6 items-center">
            <Switch v-model="is_active" :class="[is_active ? 'bg-primary-color-2' : 'bg-gray-200', 'flex w-8 flex-none cursor-pointer rounded-full p-px ring-1 ring-inset ring-gray-900/5 transition-colors duration-200 ease-in-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600']">
              <span aria-hidden="true" :class="[is_active ? 'translate-x-3.5' : 'translate-x-0', 'h-4 w-4 transform rounded-full bg-white shadow-sm ring-1 ring-gray-900/5 transition duration-200 ease-in-out']" />
            </Switch>
          </div>
        </SwitchGroup>
      </div>
      <div class="modal-footer p-5">
        <div class="flex justify-center">
          <SubmitButton id="close" button_name="Tutup" button_class="bg-gray-200 rounded-lg me-3" @click="closeModal"/>
          <SubmitButton id="submit" button_name="Simpan" button_class="bg-primary-color-2 text-white rounded-lg" @click="submit"/>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import InputForm from '../form/InputForm.vue';
import SubmitButton from '../form/SubmitButton.vue';
import { Switch, SwitchGroup, SwitchLabel } from '@headlessui/vue'

import { mapActions } from 'vuex';

export default {
  name: "ModalPaymentMethod",
  props:{
    paymentMethod: {
      type: Object,
      default: null
    }
  },
  emits: ['closeModal', 'paymentUpdated', 'paymentCreated' , 'failedCreateUpdatePayment'],
  components: {
    InputForm, SubmitButton, Switch, SwitchGroup, SwitchLabel
  },
  data() {
    return {
      showModal: true,
      description: this.paymentMethod ? this.paymentMethod.description : '',
      is_active: this.paymentMethod ? this.paymentMethod.is_active : false,
      isEdit: !!this.paymentMethod
    };
  },
  methods: {
    ...mapActions('payment_methods', ['createPaymentMethod', 'updatePaymentMethod']),
    closeModal() {
      this.showModal = false;
      this.$emit('closeModal');
      setTimeout(() => {
        this.$emit('closeModal');
      }, 200); 
    },
    async submit() {
      try {
        const newPaymentMethod = {
          description: this.description,
          is_active: this.is_active
        };

        if(this.isEdit && this.paymentMethod) {
          newPaymentMethod.id = this.paymentMethod.id;
          await this.updatePaymentMethod(newPaymentMethod);
          this.$emit('paymentUpdated');
        }
        else {
          await this.createPaymentMethod(newPaymentMethod);
          this.$emit('paymentCreated');
        }

        this.closeModal();
      }
      catch (error) {
        console.error('Failed to create payment method: ', error);
        this.$emit('failedCreateUpdatePayment');
      }
    }
  }
}
</script>