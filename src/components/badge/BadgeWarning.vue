<template>
  <span class="text-xs font-semibold tracking-wide uppercase text-center bg-secondary-orange-2 text-secondary-orange-1 px-2 py-1 rounded-lg min-w-20" :class="badge_class">{{ text }}</span>
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