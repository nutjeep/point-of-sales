<template>
  <IndexView />
  <section class="p-6">
    <PageTitle title="Inventori" />
    <div class="bg-white w-full rounded-lg py-6 px-5 shadow-lg">
      <div id="table-header" class="mb-5 flex justify-between">
        <AddButton to_url="/inventori/tambah-inventori" button_text="+ Tambah Inventori" button_class="text-base py-2 font-medium" @click="showModal"/>
      </div>
      <table class="table-auto w-full">
        <thead class="bg-color-1">
          <tr>
            <th class="py-3 px-3 border-b text-color-4 text-left">No</th>
            <th class="py-3 px-3 border-b text-color-4 text-left">Nama Produk</th>
            <th class="py-3 px-3 border-b text-color-4 text-left">Atribut</th>
            <th class="py-3 px-3 border-b text-color-4 text-center">Stok</th>
            <th class="py-3 px-3 border-b text-color-4 text-center"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="allInventories.length == 0">
            <td colspan="5" class="p-3 text-center italic text-gray-400">Belum ada data</td>
          </tr>
          <tr v-for="(inventory, index) in allInventories" :key="inventory.id" :class="{'bg-blue-50' : index % 2 == 1}" class="hover:bg-blue-100">
            <td class="p-3 text-gray-500">{{ index + 1 }}</td>
            <td class="p-3 text-gray-500">{{ inventory?.Product?.name }}</td>
            <td class="p-3 text-gray-500">
              <div v-for="attribute in inventory?.InventoryAttributes" :key="attribute.id">
                {{ attribute?.Attribute?.name }} : {{ attribute?.AttributeList?.name }}
              </div>
            </td>
            <td class="p-3 text-gray-500 text-center">
              <span :class="inventory?.qty_available > 0 ? '' : 'rounded border border-red-500 text-red-500 p-2 text-sm'" >
                {{ inventory?.qty_available > 0 ?  inventory?.qty_available : 'Sold Out' }}
              </span>
            </td>
            <td class="p-3 text-gray-500 flex justify-center">
              <button id="edit-data" @click="editInventory(inventory)" class="border border-gray-400 hover:border-green-500 hover:bg-green-400 flex justify-center items-center mx-1 p-2 rounded-md group">
                <PencilSquareIcon class="h-4 w-4 group-hover:text-green-700"/>
              </button>
              <button @click="deleteInventory(inventory)" id="delete-data" class="border border-gray-400 hover:border-red-500 hover:bg-red-400 flex justify-center items-center mx-1 p-2 rounded-md group">
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
import { mapGetters, mapActions } from 'vuex';
import { PencilSquareIcon, TrashIcon } from '@heroicons/vue/24/solid';

export default {
  name: "InventoryView",
  components: {
    IndexView, PageTitle, AddButton,
    PencilSquareIcon, TrashIcon
  },
  computed: {
    ...mapGetters('inventories', ['allInventories'])
  },
  created() {
    this.$store.dispatch('inventories/fetchInventories');
  },
  methods: {
    ...mapActions('inventories', ['deleteInventoryById']),
    editInventory(inventory) {
      this.$router.push({ name: 'EditInventory', params: { id: inventory.id } });
    },
    async deleteInventory(inventory) {
      if (confirm(`Yakin ingin menghapus inventaris ${inventory.Product?.name}?`)) {
        try {
          await this.deleteInventoryById(inventory.id);
          alert('Inventory berhasil dihapus');
          this.$store.dispatch('inventories/fetchInventories');
        } catch (error) {
          console.error('Gagal menghapus inventori', error);
          alert('Gagal menghapus inventori');
        }
      }
    }
  }
}
</script>