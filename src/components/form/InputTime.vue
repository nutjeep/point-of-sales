<template>
  <div>
    <label :for="id" class="font-medium" :class="label_class">
      {{ label }} <span v-if="is_required" class="text-red-700">*</span>
    </label>
    <input
      :id="id"
      v-model="timeValue"
      :class="input_class"
      :placeholder="placeholder"
      :disabled="is_disabled"
      :required="is_required"
      v-bind="$attrs"
      @input="updateValue"
      type="time"
      step="60"
      class="block text-lg mt-1 flex-1 border border-gray-400 rounded-lg px-3 py-1 text-gray-600 placeholder:text-gray-400 placeholder:text-[12px] sm:text-sm sm:leading-6 focus:outline-none focus:ring focus:ring-gray-500"
    >
  </div>
</template>

<script>
export default {
  name: 'InputTime',
  props: {
    label: String,
    label_class: String,
    id: String,
    name: String,
    placeholder: String,
    input_class: String,
    modelValue: {
      type: String,
      default: ''
    },
    is_disabled: Boolean,
    is_required: Boolean,
  },
  emits: ['update:modelValue'],
  data() {
    return {
      timeValue: this.modelValue
    }
  },
  watch: {
    modelValue(newValue) {
      this.timeValue = newValue;
    }
  },
  methods: {
    updateValue(event) {
      const value = event.target.value;
      this.timeValue = value;
      this.$emit('update:modelValue', value);
    },
  },
  inheritAttrs: false
}
</script>