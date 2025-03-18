<template>
  <div class="pagination mt-5">
    <div class="flex items-center justify-between border-gray-200 bg-white px-4 py-3 sm:px-6">
      <!-- <div class="flex flex-1 justify-between sm:hidden">
        <button @click="changePage(previousPageLink)" class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50" :disabled="!pagination?.previousPageLink">Previous</button>
        <button @click="changePage(nextPageLink)" class="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50" :disabled="!pagination?.nextPageLink">Next</button>
      </div> -->
      <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p class="text-sm text-gray-700">
            Showing
            {{ ' ' }}
            <span class="font-medium">{{ startItem }}</span>
            {{ ' ' }}
            to
            {{ ' ' }}
            <span class="font-medium">{{ endItem }}</span>
            {{ ' ' }}
            of
            {{ ' ' }}
            <span class="font-medium">{{ totalItems }}</span>
            {{ ' ' }}
            results
          </p>
        </div>
        <div>
          <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
            <button id="previous-page" @click="changePage(previousPageLink)" class="relative cursor-pointer inline-flex items-center rounded-l-md px-2 py-2 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
              <ChevronLeftIcon class="h-4 w-4" aria-hidden="true" />
              <span class="text-sm">Previous</span>
            </button>
            <button :id="'page-'+page" v-for="page in pages" :key="page" @click="changePage(page)" :class="{'bg-primary-color-2 text-white': page == currentPage}" class="relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
              {{ page }}
            </button>
            <button id="next-page" @click="changePage(nextPageLink)" class="relative cursor-pointer inline-flex items-center rounded-r-md px-2 py-2 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
              <span class="text-sm">Next</span>
              <ChevronRightIcon class="h-4 w-4" aria-hidden="true" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/solid';

export default {
  name: "PaginationComponent",
  components: {
    ChevronLeftIcon, ChevronRightIcon
  },
  props: {
    totalItems: Number,
    perPage: Number,
    currentPage: Number,
    previousPageLink: String,
    nextPageLink: String,
    searchQuery: String
  },
  computed: {
    startItem() {
      return (this.currentPage - 1) * this.perPage + 1;
    },
    endItem() {
      return Math.min(this.startItem + this.perPage - 1, this.totalItems);
    },
    pages() {
      return Math.ceil(this.totalItems / this.perPage);
    }
  },
  methods: {
    changePage(page) {
      console.log("page: ", page);
      console.log("prev pagination: ", this.previousPageLink);
      console.log("next pagination: ", this.nextPageLink);

      if (typeof page === 'string') {
        const params = new URLSearchParams(page);
        const cleanPage = params.get('page');
        const cleanLimit = params.get('limit');
        this.$emit('page-changed', cleanPage || 1, cleanLimit || 10, this.searchQuery); 
      } else {
        this.$emit('page-changed', page, this.perPage, this.searchQuery);
      }
    }
  }
}
</script>