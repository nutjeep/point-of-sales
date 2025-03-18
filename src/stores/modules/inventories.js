import axios from 'axios';

const state = {
  inventories: []
};

const getters = {
  allInventories: (state) => state.inventories
};

const actions = {
  async fetchInventories({ commit }) {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.get(`${process.env.VUE_APP_ROOT_API}/inventories`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.data;
      commit('setInventories', data);
    }
    catch (error) {
      console.error('Failed to fetch inventories: ', error);
    }
  },
  createInventory({ commit }, inventory) {
    return new Promise((resolve, reject) => {
      const token = localStorage.getItem('auth_token');
      axios.post(`${process.env.VUE_APP_ROOT_API}/inventories`, inventory, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => {
        const data = response.data;
        commit('addInventory', data);
        resolve(data);
      })
      .catch(error => {
        console.error('Failed to create inventory', error);
        reject(error);
      });
    });
  },
  async fetchInventoryById(_, id) {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.get(`${process.env.VUE_APP_ROOT_API}/inventories/${id}`, {
          headers: {
          'Authorization': `Bearer ${token}`
          }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch inventory:', error);
      throw error;
    }
  },
  async updateInventory({ commit }, inventory) {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.put(`${process.env.VUE_APP_ROOT_API}/inventories/${inventory.id}`, inventory, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      commit('updateInventory', response.data);
    }
    catch (error) {
      console.error('Failed to update inventory:', error);
      throw error;
    }
  },
  async deleteInventoryById({ commit }, id) {
    return new Promise((resolve, reject) => {
      const token = localStorage.getItem('auth_token');
      axios.delete(`${process.env.VUE_APP_ROOT_API}/inventories/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => {
        commit('removeInventory', id);
        resolve(response.data);
      })
      .catch(error => {
        console.error('Failed to delete inventory', error);
        reject(error);
      });
    });
  }
}

const mutations = {
  setInventories(state, inventories) {
    state.inventories = inventories.data;
  },
  addInventory(state, inventory) {
    state.inventories.push(inventory);
  },
  updateInventory(state, updatedInventory) {
    const index = state.inventories.findIndex(inventory => inventory.id == updatedInventory.id);
    if (index !== -1) {
      state.inventories.splice(index, 1, updatedInventory);
    }
  },
  removeInventory(state, id) {
    state.inventories = state.inventories.filter(inventory => inventory.id !== id);
  }
}

export default {
  namespaced: true,
  state, mutations, actions, getters
}