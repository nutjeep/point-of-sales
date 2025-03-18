<template>
  <IndexView />
  <div class="grid grid-cols-12 gap-0 h-full">
    <section id="order_list" class="relative col-span-12 bg-white shadow-xl overflow-y-scroll">
        <div class="topbar-products bg-color-4 h-16 flex items-center overflow-x-scroll px-5">
            <RouterLink to="/dashboard">
                <ArrowLeftIcon class="h-5 w-5 text-bolder" />
            </RouterLink>
        </div>
        <div class="p-6 grid md:grid-cols-3 md:gap-4 lg:grid-cols-4 lg:gap-6 xl:grid-cols-6">
            <OrderCard v-for="(trans, index) in allTransactions" :key="trans.id"
                :increament="index+1"
                :payment_status="trans.payment_status == '1' ? 'Pending' : 'Done'"
                :status_class="trans.payment_status == '1' ? 'bg-red-600' : 'bg-green-600'"
                :transaction_time="formatTime(trans.createdAt)"
                :customer_name="trans.customer?.firstName || '~~ nama pelanggan ~~'"
                :transaction_code="trans.transaction_code"
                :customer_location="trans.customer_location"
                :subtotal="formatRupiah(trans.subtotal)"
                @click="selectTransaction(trans)"
            />
        </div>
    </section>
  </div>
</template>

<script>
import IndexView from '@/views/IndexView.vue';
import OrderCard from '@/components/OrderCard.vue'
import { formatRupiah } from '@/helpers/formating';
import { formatTime } from '@/helpers/formating';
import { mapGetters } from 'vuex';
import { ArrowLeftIcon } from '@heroicons/vue/24/solid';

export default {
    name: 'OrderListView',
    components: { 
        IndexView, OrderCard,
        ArrowLeftIcon
    },
    methods: {
        formatRupiah,
        formatTime,
        selectTransaction(transaction) {
            console.log('Selected Transaction: ', transaction);
            this.$router.push({ name: 'EditTransaction', params: { id: transaction.id } });
        }
    },
    created() {
        this.$store.dispatch('transactions/fetchTransactions');
    },
    computed: {
        ...mapGetters('transactions', ['allTransactions']),
    }
}
</script>

<style>
section#order_list {
    box-shadow: 5px 10px 15px rgba(0,0,0,0.2);
}
#button_payment {
    box-shadow: 4px 4px 10px rgba(0,0,0,0.5);
}
</style>