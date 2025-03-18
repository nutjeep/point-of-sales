import axios from 'axios';

const state = {
  roles: []
};

const getters = {
  allRoles: (state) => state.roles,
};

const actions = {
  async fetchRoles({ commit }) {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.get(`${process.env.VUE_APP_ROOT_API}/roles?id=2&id=3`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.data;
      commit('setRoles', data);
    }
    catch (error) {
      console.error('Failed to fetch employees:', error);
    }
  },
};

const mutations = {
  setRoles(state, roles) {
    state.roles = roles.data;
  }
};

export default {
  namespaced: true,
  state, mutations, actions, getters,
};