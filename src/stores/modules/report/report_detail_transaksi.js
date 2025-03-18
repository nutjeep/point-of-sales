import axios from 'axios';

const state = {
  report_detail_transaksi: [],
  pagination: {
    page: 1,
    perPage: 10,
    totalItems: 0,
    previousPageLink: null,
    nextPageLink: null
  }
}

const actions = {
  async fetchReportDetailTransaksi({ commit }, params) {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.get(`${process.env.VUE_APP_ROOT_API}/reports/detail-transaksi`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        params: params
      });
      const data = await response.data.data;
      console.log('data: ', data);
      
      commit('setReportDetailTransaksi', data);
      commit('setPagination', data.pagination);
    }
    catch (error) {
      if (error.response && error.response.status == 404) {
        commit('setReportDetailTransaksi', []); // No data found
      } else {
        console.error('Failed to fetch commissions:', error);
      }
    }
  },
}

const mutations = {
  setReportDetailTransaksi(state, report_detail_transaksi) {
    state.report_detail_transaksi = report_detail_transaksi.data;
  },

  setPagination(state, pagination) {
    state.pagination.page = pagination.page || 1;
    state.pagination.perPage = pagination.perPage || 10;
    state.pagination.totalItems = pagination.totalItems || 0;

    state.pagination.previousPageLink = pagination.previousPageLink ? pagination.previousPageLink.replace(/\/api\/v1\/customers\?/, '') : null;
    state.pagination.nextPageLink = pagination.nextPageLink ? pagination.nextPageLink.replace(/\/api\/v1\/customers\?/, '') : null;
  },
}

const getters = {
  allDetailTransaksi: (state) => state.report_detail_transaksi,
  pagination: (state) => state.pagination
}

export default {
  namespaced: true,
  state, mutations, actions, getters
}