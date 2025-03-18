<template>
    <IndexView />
    <section class="p-6">
        <BackButton class="mb-5" to_url="/attendance" />
        <div class="w-1/2">
            <div id="employe" class="mb-5 shadow-md bg-color-1 py-2 px-3 text-white">
                <h1 class="font-bold text-xl ">Nama Karyawan</h1>
                <p>Kasir</p>
            </div>
            <div id="time" class="flex justify-between border-b border-gray-300 py-4 px-3">
                <div>
                    <p class="text-sm">Waktu Masuk :</p>
                    <h5 class="font-medium">Rabu, 15 Mei 2024 | 08.00</h5>
                </div>
                <div>
                    <p class="text-sm">Waktu Keluar :</p>
                    <h5 class="font-medium">Rabu, 15 Mei 2024 | 15.00</h5>
                </div>
            </div>
            <div id="balance" class="flex justify-between border-b border-gray-300 py-4 px-3">
                <div>
                    <p class="text-sm">Saldo awal : </p>
                    <h5 class="font-medium">Rp100.000</h5>
                </div>
                <div>
                    <p class="text-sm">Saldo akhir : </p>
                    <h5 class="font-medium">Rp372.000</h5>
                </div>
            </div>
            <div id="note" class="border-b border-gray-300 py-4 px-3">
                <p class="text-sm">Catatan : </p>
                <h5 class="font-medium">Masuk shift pagi</h5>
            </div>
        </div>
    </section>
</template>

<script>
import IndexView from '@/views/IndexView.vue';
import BackButton from '@/components/buttons/BackButton.vue';


export default {
    name: 'AttendanceDetailView',
    components: {
        IndexView, BackButton
    }
}
</script>