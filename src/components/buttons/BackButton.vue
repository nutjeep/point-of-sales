<template>
    <RouterLink :to="to_url" id="back-button" class="py-2 px-4 flex absolute items-center hover:text-primary-color-2">
        <ChevronLeftIcon class="w-4 h-4 mr-2"/> Kembali
    </RouterLink>
</template>

<script>
import { ChevronLeftIcon } from '@heroicons/vue/24/solid';

export default {
    name: 'BackButton',
    components: {
        ChevronLeftIcon,
    },
    props: {
        to_url: [String, Object],
    }
}
</script>