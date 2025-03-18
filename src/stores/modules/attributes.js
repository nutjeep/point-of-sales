import axios from 'axios';

const state = {
  attributes: []
};

const getters = {
  allAttributes: (state) => state.attributes
};

const actions = {
  async fetchAttributes({ commit }) {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.get(`${process.env.VUE_APP_ROOT_API}/attributes`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.data;
      commit('setAttributes', data);
    }
    catch (error) {
      console.error('Failed to fetch attributes: ', error);
    }
  },
  createAttribute({ commit }, attribute) {
    return new Promise((resolve, reject) => {
      const token = localStorage.getItem('auth_token');
      axios.post(`${process.env.VUE_APP_ROOT_API}/attributes`, attribute, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => {
        const data = response.data;
        commit('addAttribute', data);
        resolve(data);
      })
      .catch(error => {
        console.error('Failed to create attribute: ', error);
        reject(error);
      });
    });
  },
  updateAttribute({ commit }, attribute) {
    return new Promise((resolve, reject) => {
      const token = localStorage.getItem('auth_token');
      axios.put(`${process.env.VUE_APP_ROOT_API}/attributes/${attribute.id}`, attribute, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => {
        const data = response.data;
        commit('updateAttribute', data);
        resolve(data);
      })
      .catch(error => {
        console.error('Failed to update attribute: ', error);
        reject(error);
      });
    });
  },
  async deleteAttributeById({ commit }, id) {
    return new Promise((resolve, reject) => {
      const token = localStorage.getItem('auth_token');
      axios.delete(`${process.env.VUE_APP_ROOT_API}/attributes/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => {
        commit('removeAttribute', id);
        resolve(response.data);
      })
      .catch(error => {
        console.error('Failed to delete attribute', error);
        reject(error);
      });
    });
  }
}

const mutations = {
  setAttributes(state, attributes) {
    state.attributes = attributes.data;
  },
  addAttribute(state, attribute) {
    state.attributes.push(attribute);
  },
  updateAttribute(state, updatedAttribute) {
    const index = state.attributes.findIndex(attribute => attribute.id == updatedAttribute.id);
    if (index !== -1) {
      state.attributes.splice(index, 1, updatedAttribute);
    }
  },
  removeAttribute(state, id) {
    state.attributes = state.attributes.filter(attribute => attribute.id !== id);
  }
}

export default {
  namespaced: true,
  state, mutations, actions, getters
}