<template>
    <label class="font-medium" :class="label_class">{{ label }} <span v-if="is_required" class="text-red-700">*</span></label>
    <input
        :id="id"
        :type="type"
        :value="modelValue"
        :class="input_class"
        :placeholder="placeholder"
        :disabled="is_disabled"
        :required="is_required"
        v-bind="$attrs"
        @input="$emit('update:modelValue', $event.target.value)"
        class="block text-lg mt-1 flex-1 border border-gray-400 rounded-lg px-3 py-1 text-gray-600 placeholder:text-gray-400 placeholder:text-[12px] sm:text-sm sm:leading-6 focus:outline-none focus:ring focus:ring-gray-500"
    >
</template>

<script>
export default {
    name: 'InputForm',
    props: {
        label: String,
        label_class: String,
        id: String,
        type: String,
        name: String,
        placeholder: String,
        input_class: String,
        modelValue: [String, Number],
        is_disabled: Boolean,
        is_required: Boolean,
    },
    emits: ['update:modelValue'],
    inheritAttrs: false
}
</script>