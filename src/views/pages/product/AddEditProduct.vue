<template>
  <Topbar2 :pageTitle="isEdit ? 'Edit Produk' : 'Tambah Produk'" back_url="/produk"/>
  <section class="p-6 px-40 xl:px-56 md:px-20 mt-[100px]">
    <AlertSuccess v-if="alert_success" :text="alert_text"/>
    <AlertDanger v-if="alert_danger" @closeAlertDanger="hideAlertDanger()" :text="alert_text"/>
    <div class="grid grid-cols-12 gap-6 mb-6">
      <div class="col-span-6">
        <InputForm :is_required="true" id="product-name" v-model="product.name" input_class="w-full mb-3" label="Nama" placeholder="Nama produk" label_class="mb-1 block text-start" type="text"/>        
        <div class="relative mb-3">
          <label for="" class="mb-1 block text-start font-medium">Durasi</label>
          <input v-model="product.duration" placeholder="Cth: 50" class="block text-lg mt-1 flex-1 border border-gray-400 rounded-lg px-3 py-1 text-gray-500 placeholder:text-gray-400 placeholder:text-[12px] sm:text-sm sm:leading-6 focus:outline-none focus:ring focus:ring-gray-500 w-full" type="number">
          <span class="absolute bottom-0 right-0 py-1 px-3 border border-gray-400 rounded-r-lg bg-gray-200 text-gray-500">
            Menit
          </span>
        </div>
        <div class="mb-3">
          <label class="font-medium" for="">Kategori</label>
          <select id="category" v-model="product.category_id" class="block mt-1 flex-1 border border-gray-400 rounded-md px-3 py-2 text-gray-500 sm:text-sm sm:leading-6 focus:outline-none focus:ring focus:ring-gray-500 w-full">
            <option :value="null" disabled selected>Pilih kategori</option>
            <option v-for="category in allCategories" :key="category.id" :value="category.id">{{ category.name }}</option>
          </select>
        </div>
        <InputRupiah :is_required="true" v-model="product.sale_price" label="Harga" input_class="w-full mb-3" placeholder="Cth: 200.000"/>
        <div class="relative mb-3">
          <label for="" class="mb-1 block text-start font-medium">Diskon</label>
          <input v-model="product.discount" placeholder="Cth: 50" class="block text-lg mt-1 flex-1 border border-gray-400 rounded-lg px-3 py-1 text-gray-500 placeholder:text-gray-400 placeholder:text-[12px] sm:text-sm sm:leading-6 focus:outline-none focus:ring focus:ring-gray-500 w-full" type="number">
          <span class="absolute bottom-0 right-0 py-1 px-3 border font-medium border-gray-400 rounded-r-lg bg-gray-200 text-gray-500">
            %
          </span>
        </div>
        <InputRupiah :is_disabled="true" v-model="special_price" label="Harga Setelah Diskon" input_class="w-full mb-3"/>
        <div class="mb-3">
          <label for="" class="font-medium">Cabang</label>
          <template v-if="userLogin.outlet_id">
            <div class="mt-2">
              <span class="uppercase bg-gray-300 rounded-lg px-3 py-1 font-medium">{{ outletName }}</span>
            </div>
          </template>
          <template v-else>
            <!-- EDIT PRODUK -->
            <select v-if="!isEdit" v-model="selectedOutlet" class="mt-1 block w-full text-lg flex-1 border border-gray-400 rounded-lg px-3 py-2 text-gray-500 placeholder:text-gray-300 placeholder:text-[12px] sm:text-sm sm:leading-6 focus:outline-none focus:ring focus:ring-gray-500">
              <option value="all" selected>Semua Cabang</option>
              <option v-for="outlet in allOutlets" :key="outlet.id" :value="outlet.id">{{ outlet.name }}</option>
            </select>
            <!-- ADD PRODUCT -->
            <select v-else v-model="product.outlet_id" class="mt-1 block w-full text-lg flex-1 border border-gray-400 rounded-lg px-3 py-2 text-gray-500 placeholder:text-gray-300 placeholder:text-[12px] sm:text-sm sm:leading-6 focus:outline-none focus:ring focus:ring-gray-500">
              <option v-for="outlet in allOutlets" :key="outlet.id" :value="outlet.id">{{ outlet.name }}</option>
            </select>
          </template>
        </div>
        <SwitchGroup as="div" class="flex gap-x-4 sm:col-span-2">
          <SwitchLabel class="text-sm leading-6 text-gray-600">
            <span class="font-semibold">Produk Aktif ?</span>
          </SwitchLabel>
          <div class="flex h-6 items-center">
            <Switch v-model="product.saleable" :class="[product.saleable ? 'bg-primary-color-2' : 'bg-gray-200', 'flex w-8 flex-none cursor-pointer rounded-full p-px ring-1 ring-inset ring-gray-900/5 transition-colors duration-200 ease-in-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600']">
              <span aria-hidden="true" :class="[product.saleable ? 'translate-x-3.5' : 'translate-x-0', 'h-4 w-4 transform rounded-full bg-white shadow-sm ring-1 ring-gray-900/5 transition duration-200 ease-in-out']" />
            </Switch>
          </div>
        </SwitchGroup>
      </div>
      <div class="col-span-6">
        <TextArea v-model="product.desc" textarea_class="mb-6" id="product-description" rows="4" label="Deskripsi (optional)" />
        <div class="mb-3 w-40">
          <div v-if="preview_image" class="flex flex-col overflow-hidden">
            <img :src="preview_image" alt="Uploaded Image" class="w-full max-h-40 mt-2 object-cover rounded-lg border border-gray-400"/>

            <button @click="removeImage" class="mt-2 bg-secondary-red-1 text-secondary-red-2 rounded-lg px-2 py-1 flex justify-center">
              <TrashIcon class="w-4 h-4" />
            </button>
          </div>

          <div v-if="product.path && !preview_image" class="flex flex-col overflow-hidden">
            <img :src="imageUrl + product.path" alt="Uploaded Image" class="w-full max-h-40 mt-2 object-cover rounded-lg border border-gray-400"/>

            <button @click="removeImage" class="mt-2 bg-secondary-red-1 text-secondary-red-2 rounded-lg px-2 py-1 flex justify-center">
              <TrashIcon class="w-4 h-4" />
            </button>
          </div>
          
          <div v-if="!preview_image && !product.path" class="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900 bg-white py-5">
            <div class="text-center">
              <PhotoIcon class="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
              <div class="mt-4 flex justify-center text-sm leading-6 text-gray-600">
                <label for="file-upload" class="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500">
                  <span>Foto Produk</span>
                  <input id="file-upload" name="file-upload" type="file" class="sr-only" @change="handleImageUpload"/>
                </label>
              </div>
              <p class="text-xs leading-5 text-gray-600">Max size 500KB</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="grid grid-cols-12 gap-10">
      <div class="col-span-6">
      </div>
      <div class="col-span-6 flex justify-end">
        <CancelButton class="mb-10 me-3" to_url="/produk" />
        <span><SubmitButton :loading="loadingSubmit" :is_disable="loadingSubmit" @click="submit()" button_name="Simpan" class="bg-primary-color-2 text-white"/></span>
      </div>
    </div>
  </section>
</template>

<script>
import Topbar2 from '@/components/Topbar2.vue';
import InputForm from '@/components/form/InputForm.vue';
import InputRupiah from '@/components/form/InputRupiah.vue';
import TextArea from '@/components/form/TextArea.vue';
import CancelButton from '@/components/buttons/CancelButton.vue';
import SubmitButton from '@/components/form/SubmitButton.vue';
import AlertSuccess from '@/components/alerts/AlertSuccess.vue';
import AlertDanger from '@/components/alerts/AlertDanger.vue';
import { PhotoIcon, TrashIcon } from '@heroicons/vue/24/solid';
import { Switch, SwitchGroup, SwitchLabel } from '@headlessui/vue'
import { mapActions, mapGetters } from 'vuex';

export default {
  name: "AddEditProduct",
  props: ['id'],
  components: {
    Topbar2, InputForm, TextArea, CancelButton, SubmitButton, Switch, SwitchGroup, SwitchLabel, AlertSuccess, AlertDanger, InputRupiah,
    PhotoIcon, TrashIcon
  },
  data() {
    return {
      alert_success: false,
      alert_danger: false,
      alert_text: '',

      loadingSubmit: false,

      product: {
        id: null,
        name: '',
        duration: null,
        category_id: null,
        sale_price: 0,
        outlet_id: '',
        discount: 0,
        desc: '',
        saleable: true,
        path: '',
      },
      product_image: null,
      special_price: 0,
      isEdit: false,

      preview_image: '',
      image_path: '',

      selectedOutlet: 'all',
      allOutlet: [],
    }
  },
  computed: {
    ...mapGetters('categories', ['allCategories']),
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
    },

    imageUrl() {
      if (this.product.path) {
        return process.env.VUE_APP_API_IMAGE_URL;
      } else {
        return '';
      }
    },
  },
  watch: {
    'product.sale_price': 'calculateSpecialPrice',
    'product.discount': 'calculateSpecialPrice',

    selectedOutlet(newValue) {
      if (newValue === 'all') {
        // Jika "Semua Cabang" dipilih, isi product.outlet_id dengan semua ID outlet
        this.allOutlet = this.allOutlets.map(outlet => outlet.id);
      } else {
        // Jika hanya satu cabang yang dipilih, isi product.outlet_id dengan satu ID
        this.allOutlet = [newValue];
      }
    }
  },
  mounted() {
    if(this.allOutlets.length > 0) {
      this.allOutlet = this.allOutlets.map(outlet => outlet.id);
    }
  },
  async created(){
    this.$store.dispatch('categories/fetchCategories');
    this.$store.dispatch('outlets/fetchOutlets');

    const productId = this.id;
    if (productId) {
      this.isEdit = true;

      try {
        const response = await this.fetchProductById(productId);
        const productData = response.data;
        
        this.product = {
          id: productData.id,
          name: productData.name,
          duration: productData.duration,
          sale_price: parseInt(productData.sale_price),
          discount: parseInt(productData.discount),
          category_id: productData.category_id || null,
          desc: productData.desc,
          saleable: productData.saleable,
          path: productData.path,
          outlet_id: productData.outlet_id,
        };
        this.calculateSpecialPrice();
      }
      catch (error) {
        console.error('Failed to fetch product', error);
      }
    }
  },
  methods: {
    ...mapActions('products', ['createProduct', 'fetchProductById', 'updateProduct']),
    ...mapActions('images', ['uploadImages']),

    calculateSpecialPrice() {
      if (this.product.sale_price && this.product.discount) {
        const discountFactor = 1 - (this.product.discount / 100);
        this.special_price = this.product.sale_price * discountFactor;
      }
      else {
        this.special_price = 0;
      }
    },

    handleImageUpload(event) {
      this.product_image = event.target.files[0];
      const max_size = 501024 ; // 500 KB
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

      console.log('@change poto prod: ', this.product_image);
      if(this.product_image) {

        if (!allowedTypes.includes(this.product_image.type)) {
          this.alert_danger = true;
          this.alert_text = 'Hanya file gambar (JPEG, PNG, WEBP) yang diizinkan.';
          return;
        }
        
        if(this.product_image.size > max_size) {
          this.alert_danger = true;
          this.alert_text = 'Ukuran file melebihi 500KB. Harap unggah file yang lebih kecil.';
          return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
          this.preview_image = e.target.result;
        };
        reader.readAsDataURL(this.product_image);
      }
    },
    removeImage() {
      if(this.id && this.product.path) {
        this.imageUrl = '';
        this.product.path = '';
      }

      this.preview_image = null;
    },
    
    async submit() {
      if(!this.product.discount) {
        this.product.discount = 0;
      }
      if(!this.product.name) {
        this.alert_danger = true;
        this.alert_text = 'Field Nama harus diisi!';
        return;
      }
      if(!this.product.sale_price) {
        this.alert_danger = true;
        this.alert_text = 'Field Harga harus diisi!';
        return;
      }

      this.product.sale_price = parseInt(this.product.sale_price, 10);

      this.loadingSubmit = true;

      if(this.isEdit) {
        try {
          if (this.product_image) { 
            const formData = new FormData();
            formData.append('product_images[]', this.product_image);

            const responseUploadImage = await this.uploadImages(formData);
            this.product.path = responseUploadImage.data.path;
          }

          await this.updateProduct(this.product);
          this.alert_success = true;
          this.alert_text = 'Berhasil ubah data produk';
          setTimeout(() => {
            this.alert_success = false;
            this.$router.push('/produk');
          }, 500);
        }
        catch (error) {
          this.alert_danger = true;
          this.alert_text = 'Gagal menambah produk baru: ' + error;
          console.error('Gagal update produk', error);
        }
      }
      else {
        try {
          if (this.product_image) { 
            const formData = new FormData();
            formData.append('product_images[]', this.product_image);

            const responseUploadImage = await this.uploadImages(formData);
            this.product.path = responseUploadImage.data.path;
          }

          const product = {
            name: this.product.name,
            duration: this.product.duration,
            category_id: this.product.category_id,
            sale_price: this.product.sale_price,
            outlet_id: '',
            discount: this.product.discount,
            desc: this.product.desc,
            saleable: this.product.saleable,
            path: this.product.path
          };

          // Menggunakan map untuk menghasilkan array objek
          const result = this.allOutlet.map(outlet_id => ({
            ...product, // Copy all property from variable (object) product
            outlet_id: outlet_id 
          }));

          await this.createProduct(result);

          this.alert_success = true;
          this.alert_text = 'Berhasil menambah produk';
          
          setTimeout(() => {
            this.alert_success = false;
            this.$router.push('/produk');
          }, 500);
        }
        catch (error) {
          this.alert_danger = true;
          this.alert_text = 'Gagal menambah produk: ' + error
          console.error('Gagal menambah produk', error);
        }
        finally {
          this.loadingSubmit = false;
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