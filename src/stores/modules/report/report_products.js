import axios from 'axios';

const state = {
  report_products: []
}

const actions = {
  async fetchReportProducts({ commit }, params) {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.get(`${process.env.VUE_APP_ROOT_API}/reports/treatment`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        params: params
      });
      const data = await response.data;
      commit('setReportProducts', data);
    }
    catch (error) {
      console.error('Failed to fetch report product: ', error);
    }
  },
}

const mutations = {
  setReportProducts(state, report_products) {
    state.report_products = report_products.data;
  }
}

const getters = {
  allReportProduct: (state) => state.report_products
}

export default {
  namespaced: true,
  state, mutations, actions, getters
}