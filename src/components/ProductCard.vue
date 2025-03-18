<template>
    <div class="card col-span-2 bg-slate-200 shadow-md rounded-xl p-5 h-80  flex flex-col justify-between">
        <div class="card-image rounded-md h-1/2 bg-gray-300 grid place-items-center">
            <p class="text-center">Image</p>
        </div>
        <div class="card-body">
            <p>{{ productName }}</p>
            <h5 class="font-bold text-xl">{{ productPrice }}</h5>
        </div>
        <button @click="showSelectedProduct(product)" class="text-color-1 w-full py-2 border-2 border-color-1 rounded-md hover:bg-color-1 hover:text-white bottom-0" id="add_product">
            + Tambah order
        </button>
    </div>
</template>

<script>
export default {
    name: 'ProductCard',
    props: {
        productName: String,
        productPrice: String,
        product: Object,
    },
    methods: {
        showSelectedProduct(product) {
            this.$emit('showSelectedProduct', product);
        },
        formatPrice(price){
            return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(price);
        }
    }
}
</script>