<template>
  <div
    id="overlay"
    class="fixed inset-0 bg-black bg-opacity-30 z-30"
    :class="{ 'hidden': !isBlur }"
  ></div>
  <IndexView title="Produk Layanan"/>
  <AddButton  v-if="isAdmin" to_url="/produk/tambah-produk" />
  <AlertConfirmation
    v-if="alert_confirmation"
    @confirmNo="handle_clicked_no"
    @confirmYes="handle_clicked_yes"
    :animation_class="animation_alert_confirmation_class"
    text="Yakin menghapus produk?"
    text_class="text-xl font-medium" />

  <section class="p-6">
    <div class="bg-white rounded-lg py-6 px-5 shadow-lg">
      <AlertSuccess v-if="alert_success" :text="alert_text"/>
      <AlertDanger v-if="alert_danger" @hideAlertDanger="hide_alert_danger" :text="alert_text"/>

      <div class="mb-5 justify-between flex">
        <span><InputForm v-model="searchQuery" @input="handleSearch" placeholder="Cari..." input_class="w-80"/></span>
        <div v-if="this.$store.state.detail_user.user_login.is_super" class="flex">
          <!-- <button 
            @click="filterByOutlet(null)"
            :class="['px-3 me-2 text-sm rounded-lg border border-gray-500', selectedOutlet === null ? 'bg-gray-500 text-white font-bold' : '']">
            ALL
          </button> -->
          <button
            v-for="outlet in allOutlets"
            :key="outlet.id"
            @click="filterByOutlet(outlet.id)"
            :class="['px-3 me-2 text-sm rounded-lg border border-gray-500 uppercase', selectedOutlet === outlet.id ? 'bg-gray-500 text-white font-bold' : '']">
            {{ outlet.name }}
          </button>
        </div>
      </div>
      <div class="overflow-x-scroll">
        <table class="table-auto w-full">
          <thead class="bg-gray-300">
            <tr>
              <th class="p-3 border text-center">No</th>
              <th class="p-3 border text-left">Nama Produk</th>
              <th class="p-3 border text-left">Kategori</th>
              <th class="p-3 border text-left">Harga</th>
              <th class="p-3 border text-left">Harga Spesial</th>
              <th class="p-3 border text-center">Produk Aktif</th>
              <th v-if="this.$store.state.detail_user.user_login.is_super" class="p-3 border text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="allProducts.length == 0">
              <td colspan="7" class="p-3 text-center italic text-gray-400">Belum ada data</td>
            </tr>
            <tr v-for="(product, index) in filteredProducts" :key="product.id">
              <td class="p-3 border text-center">{{ index + 1 }}</td>
              <td class="p-3 border">{{ product.name }}</td>
              <td class="p-3 border">{{ product?.Category?.name }}</td>
              <td class="p-3 border">{{ formatRupiah(product.sale_price) }}</td>
              <td class="p-3 border">{{ formatRupiah(calculateDiscount(parseInt(product.sale_price), parseInt(product.discount))) }}</td>
              <td class="p-3 border text-center">
                <BadgeSuccess v-if="product.saleable" text="Iya"/>
                <BadgeDanger v-if="!product.saleable" text="Tidak"/>
              </td>
              <td v-if="this.$store.state.detail_user.user_login.is_super" class="p-3 border text-gray-500 flex justify-around">
                <button @click="editProduct(product)" id="edit-data" class="border border-gray-400 hover:border-green-500 hover:bg-green-400 p-2 rounded-md group">
                  <PencilSquareIcon class="h-4 w-4 group-hover:text-green-700"/>
                </button>
                <!-- <button @click="deleteProduct(product)" id="delete-data" class="border border-gray-400 hover:border-red-500 hover:bg-red-400 p-2 rounded-md group">
                  <TrashIcon class="h-4 w-4 group-hover:text-red-700"/>
                </button> -->
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <PaginationComponent
        :totalItems="pagination.totalItems"
        :perPage="parseInt(pagination.perPage)"
        :currentPage="parseInt(pagination?.page)"
        :previousPageLink="pagination?.previousPageLink"
        :nextPageLink="pagination?.nextPageLink"
        @page-changed="fetchProducts"
      />
    </div>
  </section>
</template>

<script>
import IndexView from '@/views/IndexView.vue';
import InputForm from '@/components/form/InputForm.vue';
import AddButton from '@/components/buttons/AddButton.vue';
import BadgeSuccess from '@/components/badge/BadgeSuccess.vue';
import BadgeDanger from '@/components/badge/BadgeDanger.vue';
import AlertConfirmation from '@/components/alerts/AlertConfirmation.vue';
import AlertSuccess from '@/components/alerts/AlertSuccess.vue';
import AlertDanger from '@/components/alerts/AlertDanger.vue';
import PaginationComponent from '@/components/PaginationComponent.vue';
import { calculateDiscount } from '@/helpers/calculation';
import { formatRupiah } from '@/helpers/formating';
import { mapGetters, mapActions } from 'vuex';
import { PencilSquareIcon } from '@heroicons/vue/24/solid';
import { debounce } from 'lodash';

export default {
  name: "ProductManagementView",
  components: {
    IndexView, InputForm, AddButton, BadgeSuccess, BadgeDanger, AlertConfirmation, AlertSuccess, AlertDanger, PaginationComponent,
    PencilSquareIcon
  },
  data() {
    return {
      isBlur: false,
      searchQuery: '',

      selectedOutlet: null, //filter by outlet

      alert_success: false,
      alert_danger: false,
      alert_text: '',
      alert_confirmation: false,
      animation_alert_confirmation_class: '',
      product_to_delete: null,
    }
  },
  computed: {
    ...mapGetters('products', ['allProducts', 'pagination']),
    ...mapGetters('outlets', ['allOutlets']),

    userLogin() {
      const user = this.$store.state.detail_user.detail_user;
      return user;
    },
    filteredProducts() {
      let products = this.allProducts;

      if (this.selectedOutlet !== null) {
        products = products.filter(product => product.outlet_id == this.selectedOutlet);
      }

      if (!this.$store.state.detail_user.user_login?.is_super && this.userLogin.outlet_id) {
        products = products.filter(product => product.outlet_id == this.userLogin.outlet_id);
      }
      return products;
    },
  },
  created(){
    this.$store.dispatch('outlets/fetchOutlets');
    if(this.userLogin.outlet_id) {
      this.selectedOutlet = this.userLogin.outlet_id;
    }
    else if(this.$store.state.detail_user.user_login?.is_super && this.allOutlets.length > 0) {
      this.selectedOutlet = this.allOutlets[0].id;
    }
    this.fetchProducts(this.pagination.page);
  },
  methods: {
    ...mapActions('products', ['deleteProductById', 'fetchProducts']),
    formatRupiah, calculateDiscount,

    filterByOutlet(outletId) {
      this.selectedOutlet = outletId;
      this.fetchProducts(1);
    },

    async fetchProducts(page = 1, limit = 10) {
      const params = {
        page,
        limit,
        product_search: this.searchQuery || '',
        outlet_id: this.selectedOutlet 
      };
      await this.$store.dispatch('products/fetchProducts', params);
    },
    handleSearch: debounce(function () {
      console.log('search query: ', this.searchQuery); 
      this.fetchProducts(1); 
    }, 300),
    editProduct(product) {
      console.log('product selected: ', product);
      this.$router.push({ name: 'EditProduct', params: { id: product.id } });
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
    // async deleteProduct(product) {
    //   this.isBlur = true;
    //   this.product_to_delete = product;
    //   this.showAlertConfirmation();
    // },
    async handle_clicked_yes(product) {
      if(!this.product_to_delete) return;
      product = this.product_to_delete;
      try {
        await this.deleteProductById(product.id);
        this.fetchProducts(this.pagination.page || 1);
        this.alert_success = true;
        this.alert_text = 'Produk berhasil dihapus'
        setTimeout(() => {
          this.alert_success = false;
        }, 2000);
      }
      catch (error) {
        console.error('Gagal menghapus produk', error);
        this.alert_danger = true;
        this.alert_text = 'Gagal menghapus produk' + error
      }
      this.handle_clicked_no();
    },
    hide_alert_danger() {
      this.alert_danger = false;
      this.alert_text = '';
    }
  },
}
</script>