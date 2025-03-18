<template>
  <div
  id="overlay"
  class="fixed inset-0 bg-black bg-opacity-30 z-30"
  :class="{ 'hidden': !isBlur }"
  ></div>
  
  <IndexView title="Cabang"/>
  <AddButton id="add-data" to_url="/outlet/tambah-outlet" button_text="+ Tambah Outlet" button_class="py-2 font-medium text-base"/>

  <AlertConfirmation
    v-if="alert_confirmation"
    @confirmNo="handle_clicked_no"
    @confirmYes="handle_clicked_yes"
    :animation_class="animation_alert_confirmation_class"
    text="Yakin menghapus outlet?"
    text_class="text-xl font-medium"
  />

  <section class="p-6">
    <AlertSuccess v-if="alert_success" :text="alert_text"/>
    <AlertDanger v-if="alert_danger" @hideAlertDanger="hide_alert_danger" :text="alert_text"/>

    <template v-if="allOutlets.length <= 0">
      <p class="text-center italic text-gray-400">~ Belum ada data ~</p>
    </template>
    <div class="grid gap-6 grid-cols-3 md:grid-cols-2 lg:grid-cols-4">
      <OutletCard
        v-for="outlet in allOutlets"
        :key="outlet.id"
        :outlet_id="outlet.id"
        :outlet_name="outlet.name"
        :outlet_address="outlet.address"
        :outlet_phone="outlet.phone_number"
        @deleteThisOutlet="deleteOutlet(outlet)"
        @editThisOutlet="editOutlet(outlet)"/>
    </div>
  </section>
</template>

<script>
import IndexView from '@/views/IndexView.vue';
import AddButton from '@/components/buttons/AddButton.vue';
import OutletCard from '@/components/OutletCard.vue';
import AlertSuccess from '@/components/alerts/AlertSuccess.vue';
import AlertDanger from '@/components/alerts/AlertDanger.vue';
import AlertConfirmation from "@/components/alerts/AlertConfirmation.vue";
import { mapGetters, mapActions } from 'vuex';

export default {
  name: "OutletView",
  components: {
    IndexView, OutletCard, AddButton, AlertConfirmation, AlertSuccess, AlertDanger
  },
  data() {
    return {
      alert_success: false,
      alert_danger: false,
      alert_text: 'Outlet berhasil dihapus',

      isBlur: false,
      outlet_to_delete: null,
      alert_confirmation: false,
      animation_alert_confirmation_class: "",
    }
  },
  computed: {
    ...mapGetters('outlets', ['allOutlets'])
  },
  created() {
    this.$store.dispatch('outlets/fetchOutlets');
  },
  methods: {
    ...mapActions('outlets', ['deleteOutletById', 'fetchOutlets']),

    handle_clicked_no() {
      this.isBlur = false;
      this.alert_confirmation = true;
      this.animation_alert_confirmation_class =  'animate__backOutUp';
    },
    async handle_clicked_yes(outlet) {
      if(!this.outlet_to_delete) return;

      outlet = this.outlet_to_delete;
      try {
        await this.deleteOutletById(outlet.id);
        this.fetchOutlets();
        this.isBlur = false;
        
        this.alert_success = true;
        this.alert_text = 'Outlet berhasil dihapus';
        setTimeout(() => {
          this.alert_success = false;
        }, 2000);
      }
      catch (error) {
        this.alert_danger = true;
        this.alert_text = 'Gagal menghapus outlet: ' + error
      }
      this.handle_clicked_no();
    },
    editOutlet(outlet) {
      this.$router.push({ name: 'EditOutlet', params: { id: outlet.id } });
    },
    deleteOutlet(outlet) {
      this.isBlur = true
      this.outlet_to_delete = outlet;

      // Show Alert Confirmation
      this.alert_confirmation = true;
      this.animation_alert_confirmation_class = 'animate__backInDown';
    },
    hide_alert_danger() {
      this.alert_danger = false;
      this.alert_text = '';
    }
  }
}
</script>