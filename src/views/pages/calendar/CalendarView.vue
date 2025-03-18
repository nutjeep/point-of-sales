<template>
  <IndexView title="Kalender"/>
  <AddButton id="to-new-appointment" :to_url="{ name: 'AddAppoinment' }" />
  <div
    @click="hideModal()"
    id="overlay"
    class="fixed inset-0 bg-black bg-opacity-30 z-40"
    :class="{ 'hidden': !isBlur }"
  ></div>
  <ModalDetailAgenda
    ref="modal"
    v-if="modalDetailAgenda"
    :detailAgenda="selectedAgenda"
    @closeModalDetailAgenda="hideModalDetailAgenda"/>
  <!-- <AddButton to_url="#"
    @click="toggleMenu"
    :button_class="buttonClass"
    />

  <transition name="fade">
    <div v-if="cardMenu" class="border-b-4 border-secondary-red-1 overflow-hidden"
         :class="['card', 'bg-white', 'z-40', 'absolute', 'bottom-[5.5rem]', 'right-[2rem]', 'rounded-lg', 'shadow-md', 'border', 'transition-all', 'duration-300', 'ease-in-out', 'animate__animated', animationClass]" 
         @animationend="animationEnd">
      <ul>
        <li class="px-6 py-2 cursor-pointer flex items-center hover:bg-secondary-red-2 hover:text-secondary-red-1"><PlusIcon class="w-5 h-5 me-2" />Sales</li>
        <li class="px-6 py-2 cursor-pointer flex items-center hover:bg-secondary-red-2 hover:text-secondary-red-1"><PlusIcon class="w-5 h-5 me-2" />Blocking Time</li>
        <li class="px-6 py-2 cursor-pointer flex items-center hover:bg-secondary-red-2 hover:text-secondary-red-1"><PlusIcon class="w-5 h-5 me-2" />Appoinment</li>
      </ul>
    </div>
  </transition> -->
  <section class="p-6">
    <div class="flex justify-end mb-3">
      <button @click="changeTab('tab-view-1')" id="to-calendar" :class="activeTab === 'tab-view-1' ? 'bg-primary-color-3 text-white' : 'bg-gray-300 text-gray-800'" class="py-2 px-4 border rounded-lg me-3">
        <WindowIcon class="w-6 h-6"/>
      </button>
      <button @click="changeTab('tab-view-2')" id="to-calendar-list" :class="activeTab === 'tab-view-2' ? 'bg-primary-color-3 text-white' : 'bg-gray-300 text-gray-800'" class="bg-gray-300 text-gray-800 py-2 px-4 border rounded-lg">
        <ListBulletIcon class="w-6 h-6"/>
      </button>
    </div>
    <div class="bg-white rounded-lg p-6 shadow-lg">
      <div v-if="activeTab === 'tab-view-1'" class="view-1">
        <CalendarTabView1 />
      </div>

      <div v-if="activeTab === 'tab-view-2'" class="view-2">
        <CalendarTabView2 @selectedAgenda="handleDataAgenda"/>
      </div>
    </div>
  </section>
</template>

<script>
import IndexView from '@/views/IndexView.vue';
import AddButton from '@/components/buttons/AddButton.vue';
import CalendarTabView1 from './CalendarTabView1.vue';
import CalendarTabView2 from './CalendarTabView2.vue';
import ModalDetailAgenda from '@/components/modals/ModalDetailAgenda.vue';
import { WindowIcon, ListBulletIcon } from '@heroicons/vue/24/solid';
import { mapGetters } from 'vuex';

export default {
  name: "CalendarView",
  components: {
    IndexView, AddButton, ModalDetailAgenda, CalendarTabView1, CalendarTabView2,
    WindowIcon, ListBulletIcon
  },
  data() {
    return {
      activeTab: 'tab-view-1',

      selectedAgenda: null,

      cardMenu: false,
      isVisible: false,
      animationClass: '',
      isBlur: false,
      modalDetailAgenda: false,
    }
  },
  methods: {
    changeTab(target) {
      this.activeTab = target;
    },
    toggleMenu() {
      if (this.cardMenu) {
        this.closeMenu();
      } else {
        this.showMenu();
      }
    },
    showMenu() {
      this.cardMenu = true;
      this.animationClass = 'animate__zoomInRight';
    },
    closeMenu() {
      this.animationClass = 'animate__zoomOutRight';
    },
    animationEnd() {
      if (this.animationClass === 'animate__zoomOutRight') {
        this.cardMenu = false;
      }
    },
    handleDataAgenda(data){
      this.selectedAgenda = data;
      this.showModalDetailAgenda();
    },
    showModalDetailAgenda() {
      this.isBlur = true;
      this.modalDetailAgenda = true;
    },
    hideModalDetailAgenda(){
      this.activeTab = 'tab-view-2';
      setTimeout(() => {
        this.modalDetailAgenda = false;
      }, 500);
      window.location.reload();
      this.isBlur = false;
    },

    // Else for Closing Modal Detail Agenda
    hideModal() {
      this.$refs.modal.closeModal();
    }
  },
  computed: {
    ...mapGetters('employees', ['allEmployees']),

    buttonClass() {
      return this.cardMenu
        ? 'bg-secondary-red-1 -rotate-45 transition-all duration-300 ease-in-out'
        : 'bg-secondary-blue-1 transition-all duration-300 ease-in-out';
    }
  },
  created() {
    this.$store.dispatch('employees/fetchAllEmployees');
    this.$store.dispatch('outlets/fetchOutlets');
  },
}
</script>