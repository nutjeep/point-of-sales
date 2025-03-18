<template>
  <ModalCategory
    ref="modal"
    v-if="modalShowCategory"
    @closeModal="closeModal"
    :category="selectedCategory"/>

  <AlertConfirmation
    v-if="alert_confirmation"
    @confirmNo="handle_clicked_no"
    @confirmYes="handle_clicked_yes"
    :animation_class="animation_alert_confirmation_class"
    text="Yakin menghapus kategori?"
    text_class="text-xl font-medium" />

  <IndexView title="Kategori"/>
  <div
    @click="hideModal()"
    id="overlay"
    class="fixed inset-0 bg-black bg-opacity-30 z-40"
    :class="{ 'hidden': !isBlur }"
  ></div>
  <section class="p-6">
    <div class="bg-white w-1/2 md:w-full xl:w-1/2 rounded-lg py-6 px-5 shadow-lg">
      <AlertSuccess v-if="alert_success" :text="alert_text"/>
      <AlertDanger v-if="alert_danger" @hideAlertDanger="hide_alert_danger" :text="alert_text"/>

      <div id="table-header" class="mb-5 flex justify-between">
        <AddButton v-if="isAdmin" to_url="#" button_text="+ Tambah Kategori" button_class="text-base py-2 font-medium" @click="showModal"/>
      </div>
      <table class="table-auto w-full">
        <thead class="bg-gray-300">
          <tr>
            <th class="p-3 text-center">No</th>
            <th class="p-3 text-left">Nama Kategori</th>
            <th v-if="this.$store.state.detail_user.user_login.is_super" class="p-3 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="allCategories.length == 0">
            <td colspan="3" class="p-3 text-center italic text-gray-400">Belum ada data</td>
          </tr>
          <tr v-else v-for="(category, index) in allCategories" :key="category.id" >
            <td class="p-3 border-b text-center">{{ index + 1 }}</td>
            <td class="p-3 border-b">{{ category.name }}</td>
            <td v-if="this.$store.state.detail_user.user_login.is_super" class="p-3 border-b text-gray-500 flex">
              <button @click="editCategory(category)" id="edit-data" class="border border-gray-400 hover:border-green-700 hover:bg-green-400 flex justify-center items-center mx-1 p-2 rounded-md group">
                <PencilSquareIcon class="h-4 w-4 group-hover:text-green-700"/>
              </button>
              <button @click="deleteCategory(category)" id="delete-data" class="border border-gray-400 hover:border-red-500 hover:bg-red-400 flex justify-center items-center mx-1 p-2 rounded-md group">
                <TrashIcon class="h-4 w-4 group-hover:text-red-700"/>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script>
import IndexView from '@/views/IndexView.vue';
import AddButton from '@/components/buttons/AddButton.vue';
import ModalCategory from '@/components/modals/ModalCategory.vue';
import AlertConfirmation from '@/components/alerts/AlertConfirmation.vue';
import AlertSuccess from '@/components/alerts/AlertSuccess.vue';
import AlertDanger from '@/components/alerts/AlertDanger.vue';

import { PencilSquareIcon, TrashIcon } from '@heroicons/vue/24/solid';
import { mapGetters, mapActions } from 'vuex';

export default {
  name: "CategoryView",
  components: {
    IndexView, AddButton, ModalCategory, AlertConfirmation, AlertSuccess, AlertDanger,
    PencilSquareIcon, TrashIcon
  },
  data() {
    return {
      alert_success: false,
      alert_danger: false,
      alert_text: '',
      alert_confirmation: false,
      animation_alert_confirmation_class: '',
      category_to_delete: null,
      modalShowCategory: false,
      isBlur: false,
      selectedCategory: null
    }
  },
  computed: {
    ...mapGetters('categories', ['allCategories']),
    canAddData() {
      return this.$store.state.detail_user.detail_user.role_id == 1 || this.$store.state.detail_user.user_login.is_super;
    },
  },
  created() {
    this.$store.dispatch('categories/fetchCategories');
  },
  methods: {
    ...mapActions('categories', ['deleteCategoryById']),

    showModal() {
      this.modalShowCategory = true;
      this.isBlur = true;
      this.selectedCategory = null;
    },
    closeModal() {
      setTimeout(() => {
        this.modalShowCategory = false;
        this.isBlur = false;
        this.$store.dispatch('categories/fetchCategories');
      }, 200);
    },
    editCategory(category) {
      this.selectedCategory = category;
      this.modalShowCategory = true;
      this.isBlur = true;
    },
    showAlertConfirmation() {
      this.alert_confirmation = true;
      this.animation_alert_confirmation_class =  'animate__backInDown';
    },
    handle_clicked_no(){
      this.isBlur = false;
      this.alert_confirmation = true;
      this.animation_alert_confirmation_class =  'animate__backOutUp';
    },
    deleteCategory(category) {
      this.isBlur = true;
      this.category_to_delete = category;
      this.showAlertConfirmation();
    },
    async handle_clicked_yes(category) {
      if(!this.category_to_delete) return;
      category = this.category_to_delete;
      try {
        await this.deleteCategoryById(category.id);
        // this.fetchCategories(this.pagination.page);
        this.$store.dispatch('categories/fetchCategories');
        this.alert_success = true;
        this.alert_text = 'Kategori berhasil dihapus'
        setTimeout(() => {
          this.alert_success = false;
        }, 2000);
      }
      catch (error) {
        console.error('Gagal menghapus kategori', error);
        this.alert_danger = true;
        this.alert_text = 'Gagal menghapus kategori' + error
      }
      this.handle_clicked_no();
    },
    hide_alert_danger() {
      this.alert_danger = false;
      this.alert_text = '';
    },

    // Else for Closing Modal Detail Agenda
    hideModal() {
      this.$refs.modal.closeModal();
    }
  },
}
</script>