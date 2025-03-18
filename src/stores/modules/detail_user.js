import axios from 'axios';

const state = {
  detail_user: {},
  user_login: {}
};

const getters = {
  user: (state) => state.detail_user
};

const actions = {
  async fetchUser({ commit }) {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.get(`${process.env.VUE_APP_ROOT_API}/auth/auto-login`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      // return response.data;
      const data = await response.data;
      commit('setUserDetail', data);
    }
    catch (error) {
      console.error('Failed to fetch user: ', error)
    }
  },
  async updateUser({ commit }, userData) {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.put(`${process.env.VUE_APP_ROOT_API}/users/${userData.id}`, userData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = response.data;
      commit('setUserDetail', data);
      return data;
    }
    catch (error) {
      console.error('Failed to update user: ', error);
      throw error;
    }
  },
  async changePassword({ commit }, dataPassword ) {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.put(`${process.env.VUE_APP_ROOT_API}/users/${dataPassword.id}`, dataPassword, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = response.data;
      commit('setUserDetail', data);
      return data;
    }
    catch (error) {
      console.error('Failed to change password: ', error);
      throw error;
    }
  }
};

const mutations = {
  setUserDetail(state, detail_user) {
    state.detail_user = detail_user.data;
  },
  setUserLogin(state, user) {
    state.user_login = user;
  }
};

export default {
  namespaced: true,
  state, mutations, actions, getters
}