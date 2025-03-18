<template>
  <label class="font-medium" :class="label_class">{{ label }} <span v-if="is_required" class="text-red-700">*</span></label>
  <div class="col-span-5 md:col-span-7 relative">
    <span class="absolute bottom-0 left-0 py-1 px-3 border font-medium border-gray-400 rounded-l-lg bg-gray-200 text-gray-500">
      Rp
    </span>
    <input
      :id="id"
      :value="formattedValue"
      :class="input_class"
      :disabled="is_disabled"
      :required="is_required"
      v-bind="$attrs"
      @input="handleInput"
      type="text"
      :placeholder="placeholder"
      class="pl-14 pr-3 block text-lg mt-1 flex-1 border border-gray-400 rounded-lg px-3 py-1 text-gray-600 placeholder:text-gray-400 placeholder:text-[12px] sm:text-sm sm:leading-6 focus:outline-none focus:ring focus:ring-gray-500"
    >
  </div>
</template>

<script>
export default {
  name: 'InputRupiah',
  props: {
    label: String,
    label_class: String,
    id: String,
    name: String,
    placeholder: String,
    input_class: String,
    modelValue: [String, Number],
    is_disabled: Boolean,
    is_required: Boolean,
  },
  emits: ['update:modelValue'],
  inheritAttrs: false,
  computed: {
    formattedValue() {
      return this.formatRupiah(this.modelValue);
    },
  },
  methods: {
    formatRupiah(value) {
      let numericValue = typeof value === 'string' ? parseInt(value.replace(/\D/g, ''), 10) : value;
      if (isNaN(numericValue)) return '';
      return new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 }).format(numericValue);
    },
    unformatRupiah(value) {
      return value.replace(/\D/g, '');
    },
    handleInput(event) {
      const inputValue = event.target.value;
      const unformattedValue = this.unformatRupiah(inputValue);
      const numericValue = parseInt(unformattedValue, 10);
      
      this.$emit('update:modelValue', numericValue);
      event.target.value = this.formatRupiah(numericValue);
    }
  }
}
</script>