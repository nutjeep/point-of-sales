<template>
  <button
    :id="id"
    :class="button_class"
    :disabled="is_disable"
    type="submit"
    class="py-2 px-4 rounded-lg flex items-center justify-center">
      <slot>
        <span v-if="!loading">{{ button_name }}</span>
        <LoadingDot v-else />
      </slot>
    </button>
</template>

<script>
import LoadingDot from '../atoms/LoadingDot.vue';

export default {
  name: 'SubmitButton',
  components: {
    LoadingDot
  },
  props: {
    id: String,
    button_class: String,
    button_name: String,
    is_disable: Boolean,
    loading: Boolean
  }
}
</script>

<style scoped>
.loader {
  display: flex;
  justify-content: center;

  width: 60px;
  aspect-ratio: 4;
  --_g: no-repeat radial-gradient(circle closest-side, #fff 90%, #fff0);
  background: 
    var(--_g) 0%   50%,
    var(--_g) 50%  50%,
    var(--_g) 100% 50%;
  background-size: calc(100%/3) 100%;
  animation: l7 1s infinite linear;
}
@keyframes l7 {
  33%{background-size:calc(100%/3) 0%  ,calc(100%/3) 100%,calc(100%/3) 100%}
  50%{background-size:calc(100%/3) 100%,calc(100%/3) 0%  ,calc(100%/3) 100%}
  66%{background-size:calc(100%/3) 100%,calc(100%/3) 100%,calc(100%/3) 0%  }
}
</style>