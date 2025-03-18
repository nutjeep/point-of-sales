export default {
  computed: {
    isAdmin() {
      const role = this.$store.state.detail_user.detail_user.Role?.name;
      const isSuper = this.$store.state.detail_user.user_login.is_super;
      return role === 'Admin' || isSuper;
    },
    hasOutletId() {
      return this.$store.state.detail_user.detail_user.outlet_id
    },
  }
};