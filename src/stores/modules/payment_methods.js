import axios from 'axios';

const state = {
  payment_methods: []
};

const getters = {
  allPaymentMethods: (state) => state.payment_methods
};

const actions = {
  async fetchPaymentMethods({ commit }) {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.get(`${process.env.VUE_APP_ROOT_API}/payment-methods`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.data;
      commit('setPaymentMethods', data);
    }
    catch (error) {
      console.error('Failed to fetch payment methods: ', error);
    }
  },
  createPaymentMethod({ commit }, payment_method) {
    return new Promise((resolve, reject) => {
      const token = localStorage.getItem('auth_token');
      axios.post(`${process.env.VUE_APP_ROOT_API}/payment-methods`, payment_method, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => {
        const data = response.data;
        commit('addPaymentMethod', data);
        resolve(data);
      })
      .catch(error => {
        console.error('Failed to create payment method: ', error.response.data);
        reject(error);
      });
    });
  },
  updatePaymentMethod({ commit }, paymentMethod) {
    return new Promise((resolve, reject) => {
      const token = localStorage.getItem('auth_token');
      axios.put(`${process.env.VUE_APP_ROOT_API}/payment-methods/${paymentMethod.id}`, paymentMethod, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => {
        const data = response.data;
        commit('updatePaymentMethod', data);
        resolve(data);
      })
      .catch(error => {
        console.error('Failed to update Payment Method: ', error);
        reject(error);
      });
    });
  },
  async deletePaymentMethodById({ commit }, id) {
    return new Promise((resolve, reject) => {
      const token = localStorage.getItem('auth_token');
      axios.delete(`${process.env.VUE_APP_ROOT_API}/payment-methods/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => {
        commit('removePaymentMethod', id);
        resolve(response.data);
      })
      .catch(error => {
        console.error('Failed to delete Payment Method', error);
        reject(error);
      });
    });
  }
}

const mutations = {
  setPaymentMethods(state, payment_methods) {
    state.payment_methods = payment_methods.data;
  },
  addPaymentMethod(state, payment_method) {
    state.payment_methods.push(payment_method);
  }
};

export default {
  namespaced: true,
  state, mutations, actions, getters
};