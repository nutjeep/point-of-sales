import axios from 'axios';

const state = {
  outlets: []
};

const getters = {
  allOutlets: (state) => state.outlets,
};

const actions = {
  async fetchOutlets({ commit }) {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.get(`${process.env.VUE_APP_ROOT_API}/outlets`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.data;
      commit('setOutlets', data);
    }
    catch (error) {
      console.error('Failed to fetch outlets:', error);
    }
  },
  createOutlet({ commit }, outlet) {
    return new Promise((resolve, reject) => {
      const token = localStorage.getItem('auth_token');
      axios.post(`${process.env.VUE_APP_ROOT_API}/outlets`, outlet, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => {
        const data = response.data;
        commit('addOutlet', data);
        resolve(data);
      })
      .catch(error => {
        console.error('Failed to create outlet: ', error);
        reject(error);
      });
    });
  },
  async fetchOutletById(_, id) {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.get(`${process.env.VUE_APP_ROOT_API}/outlets/${id}`, {
        headers: {
        'Authorization': `Bearer ${token}`
        }
      });
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch outlet:', error);
      throw error;
    }
  },
  updateOutlet({ commit }, outlet) {
    return new Promise((resolve, reject) => {
      const token = localStorage.getItem('auth_token');
      axios.put(`${process.env.VUE_APP_ROOT_API}/outlets/${outlet.id}`, outlet, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => {
        const data = response.data;
        commit('updateOutlet', data);
        resolve(data);
      })
      .catch(error => {
        console.error('Failed to update outlet: ', error);
        reject(error);
      });
    });
  },
  async deleteOutletById({ commit }, id) {
    return new Promise((resolve, reject) => {
      const token = localStorage.getItem('auth_token');
      axios.delete(`${process.env.VUE_APP_ROOT_API}/outlets/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => {
        commit('removeOutlet', id);
        resolve(response.data);
      })
      .catch(error => {
        console.error('Failed to delete outlet', error);
        reject(error);
      });
    });
  }
};

const mutations = {
  setOutlets(state, outlets) {
    state.outlets = outlets.data;
  },
  addOutlet(state, outlet) {
    state.outlets.push(outlet)
  },
  updateOutlet(state, updatedOutlet) {
    const index = state.outlets.findIndex(outlet => outlet.id == updatedOutlet.id);
    if (index !== -1) {
      state.outlets.splice(index, 1, updatedOutlet);
    }
  },
  removeOutlet(state, id) {
    state.outlets = state.outlets.filter(outlet => outlet.id !== id);
  }
};

export default {
  namespaced: true,
  state, mutations, actions, getters,
};