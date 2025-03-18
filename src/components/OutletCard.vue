<template>
  <div class="card bg-white rounded-lg shadow-lg pb-4">
    <div class="card-header bg-color-1 rounded-t-lg">
      <h2 class="text-xl font-semibold text-center text-white py-3 mb-3">{{ outlet_name }}</h2>
    </div>
    <div class="card-body pt-2 px-6">
      <p class="text-center mb-5">{{ outlet_address }}</p>
      <p class="text-center font-medium">{{ outlet_phone }}</p>
      <div class="flex justify-center mt-5">
        <button id="edit-data" @click="editOutlet(outlet_id)" class="bg-emerald-900 flex justify-center items-center mx-2 p-3 rounded-full">
          <PencilSquareIcon class="h-5 w-5 text-white"/>
        </button>
        <button id="delete-data" @click="deleteOutlet(outlet_id)" class="bg-red-600 flex justify-center items-center mx-2 p-3 rounded-full">
          <TrashIcon class="h-5 w-5 text-white"/>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { PencilSquareIcon, TrashIcon } from '@heroicons/vue/24/solid';

export default {
  name: "OutletCard",
  components: {
    PencilSquareIcon, TrashIcon
  },
  props: {
    outlet_id: [Number, String],
    outlet_name: String,
    outlet_address: String,
    outlet_phone: String
  },
  methods: {
    editOutlet() {
      // this.$router.push(`/outlet/edit-outlet/${this.outlet_id}`);
      this.$emit('editThisOutlet');
    },
    deleteOutlet() {
      this.$emit('deleteThisOutlet');
    }
  }
}
</script>