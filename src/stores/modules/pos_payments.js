import axios from 'axios';

const state = {
  pos_payments: []
}

const actions = {
  createPosPayment({ commit }, pos_payment) {
    return new Promise((resolve, reject) => {
      const token = localStorage.getItem('auth_token');
      axios.post(`${process.env.VUE_APP_ROOT_API}/pos-payments`, pos_payment, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => {
        const data = response.data;
        commit('addPosPayment', data);
        resolve(data);
      })
      .catch(error => {
        console.error('Failed to create POS PAYMENT', error);
        reject(error);
      });
    });
  },
  async fetchPosPaymentByTransactionId(_, transaction_id) {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.get(`${process.env.VUE_APP_ROOT_API}/pos-payments?transaction_id=${transaction_id}`, {
        headers: {
        'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    }
    catch (error) {
      console.error('fetching payment failed:', error);
      throw error;
    }
  }
}

const mutations = {
  addPosPayment(state, pos_payment) {
    state.pos_payments = pos_payment.data;
  },
}

const getters = {
  allPosPayments: (state) => state.pos_payments,
}

export default {
  namespaced: true,
  state, mutations, actions, getters
}