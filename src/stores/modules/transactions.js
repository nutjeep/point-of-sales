import axios from 'axios';

const state = {
  transactions: [],
  pagination: {
    page: 1,
    perPage: 10,
    totalItems: 0,
    previousPageLink: null,
    nextPageLink: null
  }
}

const actions = {
  async fetchTransactions({ commit }, params ) {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.get(`${process.env.VUE_APP_ROOT_API}/pos-transactions`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        params: params
      });
      const data = await response.data;
      // console.log('data fetched: ', data);
      commit('setTransactions', data);
      commit('setPagination', data.pagination);
    }
    catch (error) {
      if (error.response && error.response.status == 404) {
        commit('setTransactions', []); // No data found
      } else {
        console.error('Failed to fetch transactions:', error);
      }
    }
  },
  async fetchAllTransactions({ commit }, params ) {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.get(`${process.env.VUE_APP_ROOT_API}/pos-transactions?`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        params: params
      });
      const data = await response.data;
      commit('setTransactions', data);
    }
    catch (error) {
      if (error.response && error.response.status == 404) {
        commit('setTransactions', []); // No data found
      } else {
        console.error('Failed to fetch transactions:', error);
      }
    }
  },
  createTransaction({ commit }, transaction) {
    return new Promise((resolve, reject) => {
      const token = localStorage.getItem('auth_token');
      axios.post(`${process.env.VUE_APP_ROOT_API}/pos-transactions`, transaction, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => {
        const data = response.data;
        commit('addTransaction', data);
        resolve(data);
      })
      .catch(error => {
        console.error('Failed to create transaction', error);
        reject(error);
      });
    });
  },
  // async fetchLastTransaction({ dispatch, state }) {
  //   await dispatch('fetchTransactions');
  //   const transactions = state.transactions;
  //   if (transactions.length === 0) return null;
  //   return transactions.reduce((prev, current) => (prev.id > current.id) ? prev : current);
  // },
  async updateTransaction({ commit }, transaction) {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.put(`${process.env.VUE_APP_ROOT_API}/pos-transactions/${transaction.id}`, transaction, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      commit('updateTransaction', response.data);
    }
    catch (error) {
      console.error('Failed to update Transaction:', error);
      throw error;
    }
  },
  async fetchTransactionById(_, id) {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.get(`${process.env.VUE_APP_ROOT_API}/pos-transactions/${id}`, {
        headers: {
        'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    }
    catch (error) {
      console.error('Failed to fetch transaction:', error);
      throw error;
    }
  },
  async fetchTransactionByCustomerId(_, customer_id) {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.get(`${process.env.VUE_APP_ROOT_API}/pos-transactions?customer_id=${customer_id}`, {
        headers: {
        'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    }
    catch(error) {
      console.error('Failed to fetch transaction by id:', error);
      throw error;
    }
  },
  async cancelTransaction({ commit }, id) {
    return new Promise((resolve, reject) => {
      const token = localStorage.getItem('auth_token');
      axios.delete(`${process.env.VUE_APP_ROOT_API}/pos-transactions/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => {
        commit('cancelTransaction', id);
        resolve(response.data);
      })
      .catch(error => {
        console.error('Failed to cancel transaction', error);
        reject(error);
      });
    });
  },
}

const mutations = {
  // setTransactions(state, transactions) {
  //   state.transactions = transactions.data;
  // },
  setTransactions(state, transactions) {
    if (transactions && transactions.data && Array.isArray(transactions.data)) {
      state.transactions = transactions.data;
    } else {
      state.transactions = []; // Set default ke array kosong jika tidak ada data valid
    }
  },
  setPagination(state, pagination) {
    state.pagination.page = pagination.page || 1;
    state.pagination.perPage = pagination.perPage || 10;
    state.pagination.totalItems = pagination.totalItems || 0;

    state.pagination.previousPageLink = pagination.previousPageLink ? pagination.previousPageLink.replace(/\/api\/v1\/pos-transactions\?/, '') : null;
    state.pagination.nextPageLink = pagination.nextPageLink ? pagination.nextPageLink.replace(/\/api\/v1\/pos-transactions\?/, '') : null;
  },
  addTransaction(state, transaction) {
    state.transactions = transaction.data;
  },
  updateTransaction(state, updatedTransaction) {
    state.transactions = [];
    const index = state.transactions.findIndex(transaction => transaction.id == updatedTransaction.id);
    if (index !== -1) {
      state.transactions.splice(index, 1, updatedTransaction);
    }
  },
  cancelTransaction(state, id) {
    state.transactions = state.transactions.filter(transaction => transaction.id !== id);
  }
}

const getters = {
  allTransactions: (state) => state.transactions,
  pagination: (state) => state.pagination
}

export default {
  namespaced: true,
  state, mutations, actions, getters
}