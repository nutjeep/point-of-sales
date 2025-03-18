<template>
  <section class="w-screen h-screen absolute flex justify-center items-center">
    <div class="modal border-t-4 border-primary-color-2 absolute block w-5/12 bg-white shadow-md rounded-lg z-50"
        :class="{
        'animate__animated animate__zoomIn': showModal,
        'animate__animated animate__zoomOut': !showModal,
        }">
        <div class="w-full border-b border-gray-400 py-3 rounded-t-lg">
          <h5 class="text-primary-color-1 text-center font-bold text-xl">{{ isEdit ? 'Edit Kategori' : 'Tambah Kategori' }}</h5>
        </div>
        <div id="modal-body" class="p-5">
          <AlertDanger v-if="alert_danger" :text="alert_text" @closeAlertDanger="hideAlertDanger()"/>
          <InputForm v-model="categoryName" id="category-name" label="Nama Kategori" input_class="w-full" :is_required="true"/>
        </div>
        <div class="modal-footer p-5">
          <div class="flex justify-center">
            <SubmitButton id="close" button_name="Tutup" button_class="bg-gray-200 rounded-lg me-3" @click="closeModal"/>
            <SubmitButton id="submit" button_name="Simpan" button_class="bg-primary-color-2 text-white rounded-lg" @click="submit()"/>
          </div>
        </div>
    </div>
  </section>
</template>

<script>
import InputForm from '../form/InputForm.vue';
import SubmitButton from '../form/SubmitButton.vue';
import AlertDanger from '@/components/alerts/AlertDanger.vue';
import { mapActions } from 'vuex';

export default {
  name: "ModalCategory",
  props: {
    category: {
      type: Object,
      default: null,
    }
  },
  components: {
    InputForm, SubmitButton, AlertDanger
  },
  data() {
    return {
      showModal: true,
      categoryName: this.category ? this.category.name : '',
      isEdit: !!this.category,

      alert_danger: false,
      alert_text: ''
    };
  },
  watch: {
    category(newValue) {
      if (newValue) {
        this.categoryName = newValue.name;
        this.isEdit = true;
      } else {
        this.categoryName = '';
        this.isEdit = false;
      }
    }
  },
  methods: {
    ...mapActions('categories', ['createCategory', 'updateCategory']),
    
    closeModal() {
      this.showModal = false;
      this.$emit('closeModal');
    },
    hideAlertDanger() {
      this.alert_danger = false;
      this.alert_text = '';
    },
    async submit() {
      if(!this.categoryName.trim()) {
        this.alert_danger = true;
        this.alert_text = 'Nama Kategori harus diisi!';
        return;
      }
      try {
        const newCategory = {
          name: this.categoryName
        };

        if(this.isEdit && this.category) {
          newCategory.id = this.category.id;
          await this.updateCategory(newCategory);
        }
        else {
          await this.createCategory(newCategory);
        }
        
        this.closeModal();
        window.location.reload();
      }
      catch (error) {
        console.error('Gagal submit kategori: ', error);
      }
    }
  }
}
</script>