<template>
  <IndexView />
  <section class="p-6">
    <PageTitle title="Riwayat Transaksi" />
    <div class=" bg-white rounded-lg py-6 px-5 shadow-lg">
      <div id="table-header" class="mb-5 flex justify-between">
        <div id="date-filter" class="flex relative">
          <div class="flex flex-col me-3">
            <label for="" class="text-gray-500 font-medium">Tanggal Mulai</label>
            <input type="date" class="mt-1 py-2 w-64 border border-gray-400 rounded-md px-3 text-gray-500 placeholder:text-gray-400 sm:text-sm sm:leading-6 focus:outline-none focus:ring focus:ring-color-2">
          </div>
          <div class="flex flex-col me-3">
            <label for="" class="text-gray-500 font-medium">Tanggal Akhir</label>
            <input type="date" class="mt-1 py-2 w-64 border border-gray-400 rounded-md px-3 text-gray-500 placeholder:text-gray-400 sm:text-sm sm:leading-6 focus:outline-none focus:ring focus:ring-color-2">
          </div>
          <div class="flex items-end">
            <SubmitButton button_name="Terapkan" button_class="hover:bg-color-2 bg-color-1 text-white border border-color-1"/>
          </div>
        </div>
        <InputText placeholder="Cari ..." class="w-80"/>
      </div>
      <table class="table-auto w-full">
        <thead class="bg-color-1">
          <tr>
            <th class="py-3 px-3 border-b text-color-4 text-left">No</th>
            <th class="py-3 px-3 border-b text-color-4 text-left">Kode</th>
            <th class="py-3 px-3 border-b text-color-4 text-left">Produk</th>
            <th class="py-3 px-3 border-b text-color-4 text-left">Metode pembayaran</th>
            <th class="py-3 px-3 border-b text-color-4 text-left">Harga</th>
            <th class="py-3 px-3 border-b text-color-4 text-left">Waktu Transaksi</th>
            <th class="py-3 px-3 border-b"></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="py-3 px-3">
              <button class="border border-gray-400 hover:border-color-2 hover:bg-color-2 flex justify-center items-center mx-1 p-2 rounded-md group">
                <ChevronRightIcon class="w-5 h-5 text-gray-400 group-hover:text-white"/>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script>
import PageTitle from '@/components/PageTitle.vue';
import IndexView from '@/views/IndexView.vue';
import InputText from '@/components/form/InputForm.vue';
import SubmitButton from '@/components/form/SubmitButton.vue';
import { ChevronRightIcon } from '@heroicons/vue/24/solid';

export default {
  name: "TransactionView",
  components: {
    PageTitle, IndexView, InputText, SubmitButton,
    ChevronRightIcon
  }
}
</script>
