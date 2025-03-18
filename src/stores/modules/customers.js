import axios from 'axios';

const state = {
  customers: [],
  pagination: {
    page: 1,
    perPage: 10,
    totalItems: 0,
    previousPageLink: null,
    nextPageLink: null
  }
};

const actions = {
  async fetchCustomers({ commit }, params) {
    try {
      const token = localStorage.getItem('auth_token');
      // console.log("Fetching customers with:", { page, limit, search });
      const response = await axios.get(`${process.env.VUE_APP_ROOT_API}/customers`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        params: params
      });
      const data = await response.data;
      commit('setCustomers', data);
      commit('setPagination', data.pagination);
    }
    catch (error) {
      console.error('Failed to fetch customers: ', error);
    }
  },
  async fetchAllCustomers({ commit }) {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.get(`${process.env.VUE_APP_ROOT_API}/customers`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.data;
      commit('setCustomers', data);
    }
    catch (error) {
      console.error('Failed to fetch customers: ', error);
    }
  },
  createCustomer({ commit }, customer) {
    return new Promise((resolve, reject) => {
      const token = localStorage.getItem('auth_token');
      axios.post(`${process.env.VUE_APP_ROOT_API}/customers`, customer, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => {
        const data = response.data;
        commit('addCustomer', data);
        resolve(data);
      })
      .catch(error => {
        console.error('Failed to create customer', error);
        reject(error);
      });
    });
  },
  async fetchCustomerById(_, id) {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.get(`${process.env.VUE_APP_ROOT_API}/customers/${id}`, {
        headers: {
        'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch customer:', error);
      throw error;
    }
  },
  async updateCustomer({ commit }, customer) {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.put(`${process.env.VUE_APP_ROOT_API}/customers/${customer.id}`, customer, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      commit('updateCustomer', response.data);
    } catch (error) {
      console.error('Failed to update customer:', error);
      throw error;
    }
  },
  async deleteCustomerById({ commit }, id) {
    return new Promise((resolve, reject) => {
      const token = localStorage.getItem('auth_token');
      axios.delete(`${process.env.VUE_APP_ROOT_API}/customers/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => {
        commit('removeCustomer', id);
        resolve(response.data);
      })
      .catch(error => {
        console.error('Failed to delete customer', error);
        reject(error);
      });
    });
  },
  // async fetchLastCustomer({ dispatch, state }) {
  //   await dispatch('fetchCustomers');
  //   const customers = state.customers;
  //   if (customers.length === 0) return null;
  //   return customers.reduce((prev, current) => (prev.id > current.id) ? prev : current);
  // }
};

const mutations = {
  setCustomers(state, customers) {
    state.customers = customers.data;
  },
  setPagination(state, pagination) {
    state.pagination.page = pagination.page || 1;
    state.pagination.perPage = pagination.perPage || 10;
    state.pagination.totalItems = pagination.totalItems || 0;

    state.pagination.previousPageLink = pagination.previousPageLink ? pagination.previousPageLink.replace(/\/api\/v1\/customers\?/, '') : null;
    state.pagination.nextPageLink = pagination.nextPageLink ? pagination.nextPageLink.replace(/\/api\/v1\/customers\?/, '') : null;
  },
  addCustomer(state, customer) {
    state.customers.push(customer);
  },
  updateCustomer(state, updatedCustomer) {
    const index = state.customers.findIndex(customer => customer.id == updatedCustomer.id);
    if (index !== -1) {
      state.customers.splice(index, 1, updatedCustomer);
    }
  },
  removeCustomer(state, id) {
    state.customers = state.customers.filter(customer => customer.id !== id);
  }
};

const getters = {
  allCustomers: (state) => state.customers,
  pagination: (state) => state.pagination
};

export default {
  namespaced: true,
  state, mutations, actions, getters
}