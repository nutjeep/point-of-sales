<template>
  <h1 class="font-bold text-3xl mb-3" :class="title_class">{{ title }}</h1>
</template>

<script>
export default {
  name: "PageTitle",
  props: {
    title: String,
    title_class: String
  }
}
</script>