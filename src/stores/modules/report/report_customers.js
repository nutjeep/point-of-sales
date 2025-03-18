import axios from 'axios';

const state = {
  report_customers: []
}

const actions = {
  async fetchReportCustomers({ commit }, params) {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.get(`${process.env.VUE_APP_ROOT_API}/reports/customer`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        params: params
      });
      const data = await response.data;
      commit('setReportCustomers', data);
    }
    catch (error) {
      console.error('Failed to fetch report customer: ', error);
    }
  },
}

const mutations = {
  setReportCustomers(state, report_customers) {
    state.report_customers = report_customers.data;
  }
}

const getters = {
  allReportCustomer: (state) => state.report_customers
}

export default {
  namespaced: true,
  state, mutations, actions, getters
}