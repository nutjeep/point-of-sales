<template>
  <span class="text-xs font-semibold tracking-wide uppercase min-w-20 text-center bg-secondary-red-2 text-secondary-red-1 px-2 py-1 rounded-lg" :class="badge_class">{{ text }}</span>
</template>

<script>
export default {
  name: "BadgeDanger",
  props: {
    text: String,
    badge_class: String
  }
}
</script>