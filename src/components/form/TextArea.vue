<template>
  <div class="flex flex-col">
    <label :class="label_class" class="font-medium mb-1" for="">{{ label }}</label>
    <textarea class="px-3 py-2 border border-gray-400 rounded-md text-sm"
      :rows="rows"
      :id="id"
      :class="textarea_class"
      :value="modelValue"
      :disabled="is_disabled"
      @input="$emit('update:modelValue', $event.target.value)"
    ></textarea>
  </div>
</template>

<script>
export default {
  name: 'TextArea',
  emits: ['update:modelValue'],
  props: {
    label: String,
    label_class: String,
    id: String,
    name: String,
    class: String,
    modelValue: String,
    textarea_class: String,
    rows: String,
    is_disabled: Boolean
  },
}
</script>
