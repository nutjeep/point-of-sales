<template>
  <span class="text-xs font-semibold text-center px-2 py-1 rounded-lg whitespace-nowrap" :class="badge_class">{{ text }}</span>
</template>

<script>
export default {
  name: "BadgePrimary",
  props: {
    text: String,
    badge_class: String
  }
}
</script>