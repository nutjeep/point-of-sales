<template>
  <IndexView />
  <section class="p-6">
    <BackButton class="mb-5" to_url="/inventori" />
    <PageTitle :title="isEdit ? 'Edit Inventori' : 'Tambah Inventori'"/>
    <div class="bg-white p-6 rounded-md shadow-md w-3/4 md:w-full lg:w-3/4">
      <div class="mb-3">
        <label class="mb-1 font-medium block">Nama Produk</label>
        <select v-model="inventory.product_id" class="w-full border border-gray-400 rounded-md px-3 py-2 text-gray-500 text-sm">
          <option value="">Pilih produk</option>
          <option v-for="product in filteredProducts" :key="product.id" :value="product.id">{{ product.name }}</option>
        </select>
      </div>
      <div class="grid grid-cols-12 gap-4 mb-5">
        <div class="col-span-5">
          <label class="mb-1 font-medium block">Pilih Atribut</label>
          <select v-model="selectedAttribute" @change="updateAttributeLists" class="w-full border border-gray-400 rounded-md px-3 py-2 text-gray-500 text-sm">
            <option value="">Pilih attribute</option>
            <option v-for="attribute in filteredAttributes" :key="attribute.id" :value="attribute.id">{{ attribute.name }}</option>
          </select>
        </div>
        <div class="col-span-5">
          <label class="mb-1 font-medium block">Atribut List</label>
          <div class="flex flex-wrap">
            <span v-if="filteredAttributeLists.length <= 0" class="text-gray-400 italic text-sm">Tidak ada atribut list</span>
            <span v-for="attributeList in filteredAttributeLists" :key="attributeList.id" 
              :class="{'bg-blue-700 text-white': isSelected(attributeList.id), 'bg-blue-200': !isSelected(attributeList.id)}" 
              class="text-sm px-2 rounded-md cursor-pointer m-1"
              @click="toggleAttributeList(attributeList.id)">
              {{ attributeList.name }}
            </span>
          </div>
        </div>
        <div class="col-span-2">
          <button @click="addSelectedItem" class="add-attribute w-full mt-7 bg-color-white text-color-2 border border-color-1 hover:bg-color-1 hover:text-white px-3 py-2 rounded-md text-sm font-semibold">+ Tambah</button>
        </div>
      </div>
      <div v-for="(item, index) in selectedItems" :key="index" class="selected-item mb-3 flex justify-between bg-blue-100 px-5 py-2 rounded-lg">
        <div>
          <span class="attribute-name">{{ item.attributeName }}</span>
          :
          <span class="attribute-list-name">{{ item.attributeListName }}</span>
        </div>
        <button @click="deleteSelectedItem(index, item.attributeId)" class="delete-item text-red-600 text-sm underline">
          <TrashIcon class="h-4 w-4 group-hover:text-red-700"/>
        </button>
      </div>
      <div class="grid grid-cols-12 gap-4 mb-5">
        <div class="col-span-6">
          <InputText id="inventory-qty-available" v-model="inventory.qty_available" input_class="w-full" label="Stok" label_class="mb-1 block text-start" type="text" placeholder="Stok"/>
        </div>
      </div>
      <div class="flex justify-center">
        <SubmitButton @click="submitInventory" id="submit" button_name="Simpan" button_class="mx-1 rounded-md bg-color-1 px-6 py-2 text-base font-semibold text-color-4 shadow-sm hover:bg-color-2 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-color-3 block"/>
      </div>
    </div>
  </section>
</template>

<script>
import IndexView from '@/views/IndexView.vue';
import PageTitle from '@/components/PageTitle.vue';
import BackButton from '@/components/buttons/BackButton.vue';
import SubmitButton from '@/components/form/SubmitButton.vue';
import InputText from '@/components/form/InputForm.vue';
import { mapGetters, mapActions } from 'vuex';
import { TrashIcon } from '@heroicons/vue/24/solid';

export default {
  name: "AddEditInventory",
  components: {
    IndexView, PageTitle, BackButton, SubmitButton, InputText,
    TrashIcon
  },
  props: ['id'],
  data() {
    return {
      selectedAttribute: '',
      selectedAttributeLists: [],
      selectedItems: [],
      inventory: {
        id: null,
        product_id: '',
        qty_available: 0,
        max_stock_level: 0,
        min_stock_level: 0,
        reorder_point: 0,
        warehouse_id: 1,
        added_attributes: []
      },
      isEdit: false
    }
  },
  computed: {
    ...mapGetters('products', ['allProducts']),
    ...mapGetters('attributes', ['allAttributes']),
    ...mapGetters('attribute_lists', ['allAttributeLists']),

    filteredProducts() {
      return this.allProducts.filter(product => !product.is_service);
    },

    filteredAttributes() {
      const selectedAttributeIds = this.selectedItems.map(item => item.attributeId);
      return this.allAttributes.filter(attr => !selectedAttributeIds.includes(attr.id));
    },

    filteredAttributeLists() {
      return this.allAttributeLists.filter(list => list.Attribute.id == this.selectedAttribute);
    },
  },
  methods: {
    ...mapActions('inventories', ['createInventory', 'updateInventory', 'fetchInventoryById']),

    async submitInventory() {
      try {
        if(this.isEdit) {
          this.inventory.added_attributes = this.selectedItems.map(item => ({
            Attribute: {id: item.attributeId},
            AttributeList: {id: item.attributeListId}
          }));

          // console.log('updated data: ', this.inventory);
          await this.updateInventory(this.inventory);
          alert('Data inventory berhasil diubah!');
        }
        else {
          this.inventory.added_attributes = this.selectedItems.map(item => ({
            attribute: {id: item.attributeId},
            attribute_list: {id: item.attributeListId}
          }));

          // console.log('new data: ', this.inventory);
          await this.createInventory(this.inventory);
          alert('Data inventory berhasil ditambah!');
        }
        this.$router.push('/inventori');
      }
      catch (error) {
        console.error('Failed to create inventory', error);
        alert('Failed to create inventory', error);
      }
    },

    updateAttributeLists() {
      this.selectedAttributeLists = [];
    },
    toggleAttributeList(id) {
      this.selectedAttributeLists = [id]; // Only allow one selection
    },
    isSelected(id) {
      return this.selectedAttributeLists.includes(id);
    },
    addSelectedItem() {
      if (this.selectedAttribute && this.selectedAttributeLists.length > 0) {
        const attributeName = this.allAttributes.find(attr => attr.id == this.selectedAttribute).name;
        const attributeListName = this.allAttributeLists.find(attrList => attrList.id == this.selectedAttributeLists[0]).name;

        this.selectedItems.push({
          attributeName,
          attributeListName,
          attributeId: this.selectedAttribute,
          attributeListId: this.selectedAttributeLists[0]
        });

        // Reset selections
        this.selectedAttribute = null;
        this.selectedAttributeLists = [];
      }
    },
    deleteSelectedItem(index) {
      this.selectedItems.splice(index, 1);
    },
    async loadInventoryData(inventoryId) {
      try {
        const response = await this.fetchInventoryById(inventoryId);
        const inventoryData = response.data;
        console.log('loaded data: ', inventoryData);
        this.inventory = {
          id: inventoryData.id,
          product_id: inventoryData.product_id,
          qty_available: inventoryData.qty_available,
          max_stock_level: inventoryData.max_stock_level,
          min_stock_level: inventoryData.min_stock_level,
          reorder_point: inventoryData.reorder_point,
          warehouse_id: inventoryData.warehouse_id,
          added_attributes: inventoryData.InventoryAttributes.map(attr => ({
            attribute: {id: attr.Attribute.id},
            attribute_list: {id: attr.AttributeList.id}
          }))
        };

        // Populate selectedItems
        this.selectedItems = inventoryData.InventoryAttributes.map(attr => ({
          attributeName: attr.Attribute.name,
          attributeListName: attr.AttributeList.name,
          attributeId: attr.Attribute.id,
          attributeListId: attr.AttributeList.id
        }));
      } catch (error) {
        console.error('Failed to fetch inventory', error);
      }
    }
  },
  async created() {
    this.$store.dispatch('products/fetchProducts');
    this.$store.dispatch('attributes/fetchAttributes');
    this.$store.dispatch('attribute_lists/fetchAttributeLists');

    const inventoryId = this.id;
    // console.log('product_id: ', inventoryId);
    if(inventoryId) {
      this.isEdit = true;
      await this.loadInventoryData(inventoryId);
    }
  }
}
</script>
