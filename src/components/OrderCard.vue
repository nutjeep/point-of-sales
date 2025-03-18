<template>
    <div class="order_card col-span-1 transition cursor-pointer relative bg-slate-200 shadow-md rounded-xl p-5 h-56 flex flex-col justify-between">
        <div class="card-header flex justify-between">
            <button :class="status_class" class="text-white py-1 px-2 rounded-md">{{ payment_status }}</button>
            <p class="text-end text-slate-500">{{ transaction_time }}</p>
        </div>
        <div class="flex justify-between">
            <div>
                <p>{{ customer_name }}</p>
                <h5 class="text-xl font-medium">{{ transaction_code }}</h5>
            </div>
            <div id="is_table">
                <p class="table_number bg-slate-300 px-1 rounded-md text-sm">{{ customer_location }}</p>
            </div>
        </div>
        <div>
            <h4 class="text-2xl font-bold">{{ grand_total }}</h4>
            <h2 class="absolute right-6 bottom-4 text-slate-300 text-5xl font-bold">{{ increament }}</h2>
        </div>
    </div>
</template>

<script>
export default {
    name: 'OrderCard',
    props: {
        status_class: String,
        payment_status: String,
        transaction_time: String,
        customer_name: String,
        transaction_code: String,
        customer_location: String,
        grand_total: String,
        increament: Number
    }
}
</script>

<style>
.order_card {
  background-size: 200% 100%;
  background-position: 0% 0%;
  transition: background-position 0.5s ease;
}

.order_card:hover {
  background-image: linear-gradient(to bottom right, #f4efbd, #a9a57b);
  background-position: 100% 100%;
}
.order_card:hover h2 {
    color:#F4EEA9;
}
.order_card:hover .table_number {
    background-color: #F4EEA9;
}
</style>