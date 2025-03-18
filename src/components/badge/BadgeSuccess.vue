<template>
  <span class="text-xs font-semibold tracking-wide uppercase min-w-20 text-center bg-secondary-green-2 text-secondary-green-1 px-2 py-1 rounded-lg" :class="badge_class">{{ text }}</span>
</template>

<script>
export default {
  name: "BadgeSuccess",
  props: {
    text: String,
    badge_class: String
  }
}
</script>