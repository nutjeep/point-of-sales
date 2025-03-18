import axios from 'axios';

const state = {
  invoices: [],
  pagination: {
    page: 1,
    perPage: 10,
    totalItems: 0,
    previousPageLink: null,
    nextPageLink: null
  }
}

const actions = {
  async fetchInvoices({ commit }, params) {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.get(`${process.env.VUE_APP_ROOT_API}/invoices`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        params: params
      });
      const data = await response.data;
      console.log('data invoice: ', data);
      commit('setInvoices', data);
      commit('setPagination', data.pagination);
    }
    catch (error) {
      console.error('Failed to fetch Invoices: ', error);
    }
  },
  createInvoice({ commit }, invoice) {
    return new Promise((resolve, reject) => {
      const token = localStorage.getItem('auth_token');
      axios.post(`${process.env.VUE_APP_ROOT_API}/invoices`, invoice, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => {
        const data = response.data;
        commit('addInvoice', data);
        resolve(data);
      })
      .catch(error => {
        console.error('Failed to create invoice', error);
        reject(error);
      });
    });
  },
  async updateInvoice({ commit }, invoice) {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.put(`${process.env.VUE_APP_ROOT_API}/invoices/${invoice.id}`, invoice, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      commit('updateInvoice', response.data);
    } catch (error) {
      console.error('Failed to update Invoice:', error);
      throw error;
    }
  },
  async fetchInvoiceById(_, id) {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.get(`${process.env.VUE_APP_ROOT_API}/invoices/${id}`, {
        headers: {
        'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch invoice:', error);
      throw error;
    }
  },
}

const mutations = {
  setInvoices(state, invoices) {
    state.invoices = invoices.data;
  },
  setPagination(state, pagination) {
    state.pagination.page = pagination.page || 1;
    state.pagination.perPage = pagination.perPage || 10;
    state.pagination.totalItems = pagination.totalItems || 0;

    state.pagination.previousPageLink = pagination.previousPageLink ? pagination.previousPageLink.replace(/\/api\/v1\/customers\?/, '') : null;
    state.pagination.nextPageLink = pagination.nextPageLink ? pagination.nextPageLink.replace(/\/api\/v1\/customers\?/, '') : null;
  },
  addInvoice(state, invoice) {
    state.invoices = invoice.data;
  },
  updateInvoice(state, updatedInvoice) {
    const index = state.invoices.findIndex(invoice => invoice.id == updatedInvoice.id);
    if (index !== -1) {
      state.customers.splice(index, 1, updatedInvoice);
    }
  }
}

const getters = {
  allInvoices: (state) => state.invoices,
  pagination: (state) => state.pagination
}

export default {
  namespaced: true,
  state, mutations, actions, getters
}