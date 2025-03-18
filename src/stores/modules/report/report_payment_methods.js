import axios from 'axios';

const state = {
  report_payment_methods: []
}

const actions = {
  async fetchReportPaymentMethods({ commit }, params) {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.get(`${process.env.VUE_APP_ROOT_API}/reports/payment-method`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        params: params
      });
      const data = await response.data;
      commit('setReportPaymentMethods', data);
    }
    catch (error) {
      console.error('Failed to fetch report payment methods: ', error);
    }
  },
}

const mutations = {
  setReportPaymentMethods(state, report_payment_methods) {
    state.report_payment_methods = report_payment_methods.data;
  }
}

const getters = {
  allReportPaymentMethod: (state) => state.report_payment_methods
}

export default {
  namespaced: true,
  state, mutations, actions, getters
}