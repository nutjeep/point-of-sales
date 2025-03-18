import axios from 'axios';

const state = {
  attendances: []
};

const getters = {
  allAttendances: (state) => state.attendances,
};

const actions = {
  async fetchAttendances({ commit }) {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.get(`${process.env.VUE_APP_ROOT_API}/attendances`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.data;
      commit('setAttendances', data);
    }
    catch (error) {
      console.error('Failed to fetch attendances:', error);
    }
  },
};

const mutations = {
  setAttendances(state, attendances) {
    state.attendances = attendances.data;
  },
};

export default {
  namespaced: true,
  state, mutations, actions, getters,
};