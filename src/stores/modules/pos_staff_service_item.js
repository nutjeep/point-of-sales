import axios from 'axios';

const state = {
  pos_staff_service_item: []
}

const actions = {
  createPosStaffServiceItem({ commit }, staff_service_item) {
    return new Promise((resolve, reject) => {
      const token = localStorage.getItem('auth_token');
      axios.post(`${process.env.VUE_APP_ROOT_API}/employee-services`, staff_service_item, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => {
        const data = response.data;
        commit('addPosStaffServiceItem', data);
        resolve(data);
      })
      .catch(error => {
        console.error('Failed to create pos service', error);
        reject(error);
      });
    });
  },
  deletePosStaffServiceItem({commit}, staff_service_item) {
    return new Promise((resolve, reject) => {
      const token = localStorage.getItem('auth_token');
      axios.delete(`${process.env.VUE_APP_ROOT_API}/employee-services/${staff_service_item.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => {
        commit('removeStaffServiceItem', staff_service_item.id);
        resolve(response.data);
      })
      .catch(error => {
        console.error('Failed to delete Staff Service Item', error);
        reject(error);
      });
    });
  }
}

const mutations = {
  addPosStaffServiceItem(state, pos_staff_service) {
    state.pos_staff_service_item = pos_staff_service.data;
  },
  removeStaffServiceItem(state, id) {
    if (Array.isArray(state.pos_staff_service_item)) {
      state.pos_staff_service_item = state.pos_staff_service_item.filter(staff_service_item => staff_service_item.id !== id);
    } else {
      state.pos_staff_service_item = [];
    }
  }
}

const getters = {
  allPosStaffServiceItem: (state) => state.pos_staff_service_item,
}

export default {
  namespaced: true,
  state, mutations, actions, getters
}