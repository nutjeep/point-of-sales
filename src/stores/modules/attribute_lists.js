import axios from 'axios';

const state = {
  attribute_lists: []
};

const getters = {
  allAttributeLists: (state) => state.attribute_lists
};

const actions = {
  async fetchAttributeLists({ commit }) {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.get(`${process.env.VUE_APP_ROOT_API}/attribute-lists`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.data;
      commit('setAttributeLists', data);
    }
    catch (error) {
      console.error('Failed to fetch attribute_lists: ', error);
    }
  },
  createAttributeList({ commit }, attributeList) {
    return new Promise((resolve, reject) => {
      const token = localStorage.getItem('auth_token');
      axios.post(`${process.env.VUE_APP_ROOT_API}/attribute-lists`, attributeList, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => {
        const data = response.data;
        commit('AddAttributeList', data);
        resolve(data);
      })
      .catch(error => {
        console.error('Failed to create attribute list', error);
        reject(error);
      });
    });
  },
  updateAttributeList({ commit }, attribute_list) {
    return new Promise((resolve, reject) => {
      const token = localStorage.getItem('auth_token');
      axios.put(`${process.env.VUE_APP_ROOT_API}/attribute-lists/${attribute_list.id}`, attribute_list, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => {
        const data = response.data;
        commit('updateAttributeList', data);
        resolve(data);
      })
      .catch(error => {
        console.error('Failed to update attribute list: ', error);
        reject(error);
      });
    });
  },
  async deleteAttributeListById({ commit }, id) {
    return new Promise((resolve, reject) => {
      const token = localStorage.getItem('auth_token');
      axios.delete(`${process.env.VUE_APP_ROOT_API}/attribute-lists/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => {
        commit('removeAttributeList', id);
        resolve(response.data);
      })
      .catch(error => {
        console.error('Failed to delete attribute list', error);
        reject(error);
      });
    });
  }
}

const mutations = {
  setAttributeLists(state, attribute_lists) {
    state.attribute_lists = attribute_lists.data;
  },
  addAttributeList(state, attributeList) {
    state.attribute_lists.push(attributeList)
  },
  updateAttributeList(state, updatedAttributeList) {
    const index = state.attribute_lists.findIndex(attribute_list => attribute_list.id == updatedAttributeList.id);
    if (index !== -1) {
      state.attribute_lists.splice(index, 1, updatedAttributeList);
    }
  },
  removeAttributeList(state, id) {
    state.attribute_lists = state.attribute_lists.filter(attribute_list => attribute_list.id !== id);
  }
}

export default {
  namespaced: true,
  state, mutations, actions, getters
}