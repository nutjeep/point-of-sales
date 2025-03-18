import axios from 'axios';

const state = {
  pos_services: []
}

const actions = {
  async fetchPosServiceByTransactionId(_, transaction_id) {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.get(`${process.env.VUE_APP_ROOT_API}/pos-service-items?transaction_id=${transaction_id}`, {
        headers: {
        'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    }
    catch(error) {
      console.error('Failed to fetch pos service:', error);
      throw error;
    }
  },

  createPosService({ commit }, pos_service) {
    return new Promise((resolve, reject) => {
      const token = localStorage.getItem('auth_token');
      axios.post(`${process.env.VUE_APP_ROOT_API}/pos-service-items`, pos_service, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => {
        const data = response.data;
        commit('addPosService', data);
        resolve(data);
      })
      .catch(error => {
        console.error('Failed to create pos service', error);
        reject(error);
      });
    });
  },
  async updatePosService({ commit }, pos_service) {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.put(`${process.env.VUE_APP_ROOT_API}/pos-service-items/${pos_service.id}`, pos_service, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      commit('updatePosService', response.data);
    }
    catch (error) {
      console.error('Failed to update pos service:', error);
      throw error;
    }
  },
  async deletePosServiceById({ commit }, id) {
    return new Promise((resolve, reject) => {
      const token = localStorage.getItem('auth_token');
      axios.delete(`${process.env.VUE_APP_ROOT_API}/pos-service-items/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => {
        commit('removePosService', id);
        resolve(response.data);
      })
      .catch(error => {
        console.error('Failed to delete Pos Service', error);
        reject(error);
      });
    });
  } 
}

const mutations = {
  setPosServices(state, pos_services) {
    state.pos_services = pos_services.data;
  },
  addPosService(state, pos_service) {
    state.pos_services = pos_service.data;
  },
  updatePosService(state, updatedPosService) {
    state.pos_services = [];
    const index = state.pos_services.findIndex(pos_service => pos_service.id == updatedPosService.id);
    if (index !== -1) {
      state.pos_services.splice(index, 1, updatedPosService);
    }
  },
  removePosService(state, id) {
    if (Array.isArray(state.pos_services)) {
      state.pos_services = state.pos_services.filter(pos_service => pos_service.id !== id);
    } else {
      state.pos_services = [];
    }
  }
}

const getters = {
  allPosServices: (state) => state.pos_services,
}

export default {
  namespaced: true,
  state, mutations, actions, getters
}