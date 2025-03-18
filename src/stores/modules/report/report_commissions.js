import axios from 'axios';

const state = {
  report_commissions: []
}

const actions = {
  async fetchReportCommissions({ commit }, params) {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.get(`${process.env.VUE_APP_ROOT_API}/reports/commission`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        params: params
      });
      const data = await response.data;
      commit('setReportCommissions', data);
    }
    catch (error) {
      console.error('Failed to fetch report commission: ', error);
    }
  },
}

const mutations = {
  setReportCommissions(state, report_commissions) {
    state.report_commissions = report_commissions.data;
  }
}

const getters = {
  allReportCommission: (state) => state.report_commissions
}

export default {
  namespaced: true,
  state, mutations, actions, getters
}