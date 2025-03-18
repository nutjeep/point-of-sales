<template>
    <label class="font-medium" :class="label_class">{{ label }}</label>
    <input
        :id="id"
        :type="type"
        :name="name"
        :placeholder="placeholder"
        :class="input_class"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        class="block mt-1 flex-1 border border-gray-400 rounded-lg px-3 py-2 text-gray-700 placeholder:text-gray-400 sm:text-sm sm:leading-6 focus:outline-none focus:ring focus:ring-color-2"
    >
</template>

<script>
export default {
    name: 'InputText',
    props: {
        label: String,
        label_class: String,
        id: String,
        type: String,
        name: String,
        placeholder: String,
        input_class: String,
        modelValue: String
    },
    emits: ['update:modelValue'],
}
</script>