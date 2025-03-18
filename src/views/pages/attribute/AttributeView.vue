<template>
  <ModalAttribute
    v-if="modalShowAttribute"
    @closeModal="closeModal"
    :attribute="selectedAttribute"/>
  <IndexView />
  <div
    id="overlay"
    class="fixed inset-0 bg-black bg-opacity-30 z-30"
    :class="{ 'hidden': !isBlur }"
  ></div>
  <section class="p-6">
    <PageTitle title="Atribut Produk" />
    <div class="bg-white w-3/4 lg:w-1/2 rounded-lg py-6 px-5 shadow-lg">
      <div id="table-header" class="mb-5 flex justify-between">
        <AddButton to_url="#" button_text="+ Tambah Atribut" button_class="text-base py-2 font-medium" @click="showModal"/>
      </div>
      <table class="table-auto w-full">
        <thead class="bg-color-1">
          <tr>
            <th class="p-3 border-b text-color-4 text-left">No</th>
            <th class="p-3 border-b text-color-4 text-left">Nama Atribut</th>
            <th class="p-3 border-b text-color-4 text-left"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="allAttributes.length == 0">
            <td colspan="3" class="p-3 text-center italic text-gray-400">Belum ada data</td>
          </tr>
          <tr v-else v-for="(attribute, index) in allAttributes" :key="attribute.id" :class="{'bg-blue-50' : index % 2 == 1}" class="hover:bg-blue-100">
            <td class="p-3">{{ index + 1 }}</td>
            <td class="p-3">{{ attribute.name }}</td>
            <td class="p-3 text-gray-500 flex">
              <button id="modal-edit-data" @click="editAttribute(attribute)" class="border border-gray-400 hover:border-green-500 hover:bg-green-400 flex justify-center items-center mx-1 p-2 rounded-md group">
                <PencilSquareIcon  class="h-4 w-4 group-hover:text-green-700"/>
              </button>
              <button id="delete-data" @click="deleteAttribute(attribute)" class="border border-gray-400 hover:border-red-500 hover:bg-red-400 flex justify-center items-center mx-1 p-2 rounded-md group">
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
import PageTitle from '@/components/PageTitle.vue';
import AddButton from '@/components/buttons/AddButton.vue';
import ModalAttribute from '@/components/modals/ModalAttribute.vue';
import { PencilSquareIcon, TrashIcon } from '@heroicons/vue/24/solid';
import { mapGetters, mapActions } from 'vuex';

export default {
  name: "AttributeView",
  components: {
    IndexView, PageTitle, AddButton, ModalAttribute,
    PencilSquareIcon, TrashIcon
  },
  data() {
    return {
      modalShowAttribute: false,
      isBlur: false,
      selectedAttribute: null,
    }
  },
  methods: {
    ...mapActions('attributes', ['deleteAttributeById']),
    showModal() {
      this.modalShowAttribute = true;
      this.isBlur = true;
      this.selectedAttribute = null;
    },
    closeModal() {
      setTimeout(() => {
        this.modalShowAttribute = false;
        this.isBlur = false;
        this.$store.dispatch('attributes/fetchAttributes');
      }, 200);
    },
    editAttribute(attribute) {
      this.selectedAttribute = attribute;
      this.modalShowAttribute = true;
      this.isBlur = true;
    },
    async deleteAttribute(attribute) {
      if (confirm(`Yakin ingin menghapus atribut ${attribute.name}?`)) {
        try {
          await this.deleteAttributeById(attribute.id);
          alert('Atribut berhasil dihapus');
          this.$store.dispatch('attributes/fetchAttributes');
        }
        catch (error) {
          console.error('Gagal menghapus atribut', error);
          alert('Gagal menghapus atribut');
        }
      }
    }
  },  
  computed: {
    ...mapGetters('attributes', ['allAttributes'])
  },
  created() {
    this.$store.dispatch('attributes/fetchAttributes');
  }
}
</script>