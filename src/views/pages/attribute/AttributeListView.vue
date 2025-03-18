<template>
  <IndexView />
  <ModalAttributeList
    v-if="modalShowAttributeList"
    @closeModal="closeModal"
    :attribute_list="selectedAttributeList" />
  <div
    id="overlay"
    class="fixed inset-0 bg-black bg-opacity-30 z-30"
    :class="{ 'hidden': !isBlur }"
  ></div>
  <section class="p-6">
    <PageTitle title="Atribut List" />
    <div class="bg-white w-3/4 rounded-lg py-6 px-5 shadow-lg">
      <div id="table-header" class="mb-5 flex justify-between">
        <AddButton to_url="#" button_text="+ Tambah Atribut List" button_class="text-base py-2 font-medium" @click="showModal"/>
      </div>
      <table class="table-auto w-full">
        <thead class="bg-color-1">
          <tr>
            <th class="py-3 px-3 border-b text-color-4 text-left">No</th>
            <th class="py-3 px-3 border-b text-color-4 text-left">Master Atribut</th>
            <th class="py-3 px-3 border-b text-color-4 text-left">Nama</th>
            <th class="py-3 px-3 border-b text-color-4 text-left"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="groupByAttributeLists.length == 0">
            <td colspan="4" class="p-3 text-center italic text-gray-400">Belum ada data</td>
          </tr>
          <tr v-else v-for="(attribute_list, index) in groupByAttributeLists" :key="attribute_list.id" :class="{'bg-blue-50' : index % 2 == 1}" class="hover:bg-blue-100">
            <td class="py-3 px-3">{{ index + 1 }}</td>
            <td class="py-3 px-3">{{ attribute_list?.Attribute?.name }}</td>
            <td class="py-3 px-3">{{ attribute_list?.name }}</td>
            <td class="py-3 px-3 text-gray-500 flex">
              <button @click="editAttributeList(attribute_list)" id="modal-edit-data" class="border border-gray-400 hover:border-green-500 hover:bg-green-400 flex justify-center items-center mx-1 p-2 rounded-md group">
                <PencilSquareIcon class="h-4 w-4 group-hover:text-green-700"/>
              </button>
              <button @click="deleteAttributeList(attribute_list)" id="delete-data" class="border border-gray-400 hover:border-red-500 hover:bg-red-400 flex justify-center items-center mx-1 p-2 rounded-md group">
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
import { PencilSquareIcon, TrashIcon } from '@heroicons/vue/24/solid';
import { mapActions, mapGetters } from 'vuex';
import ModalAttributeList from '@/components/modals/ModalAttributeList.vue';

export default {
  name: "AttributeListView",
  components: {
    IndexView, PageTitle, AddButton, ModalAttributeList,
    PencilSquareIcon, TrashIcon
  },
  data() {
    return {
      modalShowAttributeList: false,
      isBlur: false,
      selectedAttributeList: null,
    }
  },
  methods: {
    ...mapActions('attribute_lists', ['deleteAttributeListById']),
    showModal() {
      this.selectedAttributeList = null;
      this.modalShowAttributeList = true;
      this.isBlur = true;
    },
    closeModal() {
      setTimeout(()=> {
        this.modalShowAttributeList = false;
        this.isBlur = false;
        this.$store.dispatch('attribute_lists/fetchAttributeLists');
      }, 300);
    },
    editAttributeList(attribute_list) {
      this.selectedAttributeList = attribute_list;
      this.modalShowAttributeList = true;
      this.isBlur = true;
    },
    async deleteAttributeList(attribute_list) {
      if (confirm(`Yakin ingin menghapus atribute list ${attribute_list.name}?`)) {
        try {
          await this.deleteAttributeListById(attribute_list.id);
          alert('Attribute List berhasil dihapus');
          this.$store.dispatch('attribute_lists/fetchAttributeLists');
        } catch (error) {
          console.error('Gagal menghapus atribut list', error);
          alert('Gagal menghapus atribut list');
        }
      }
    }
  },
  computed: {
    ...mapGetters('attribute_lists', ['allAttributeLists']),
    groupByAttributeLists() {
      // Sort attributes by Attribute name
      return this.allAttributeLists.slice().sort((a, b) => {
        const nameA = a.Attribute.name.toUpperCase();
        const nameB = b.Attribute.name.toUpperCase();
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        return 0;
      });
    }
  },
  created() {
    this.$store.dispatch('attribute_lists/fetchAttributeLists');
  }, 
}
</script>