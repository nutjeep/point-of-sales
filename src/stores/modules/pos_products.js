import axios from 'axios';

const state = {
  pos_products: []
}

const actions = {
  createPosProduct({ commit }, pos_product) {
    return new Promise((resolve, reject) => {
      const token = localStorage.getItem('auth_token');
      axios.post(`${process.env.VUE_APP_ROOT_API}/pos-order-items`, pos_product, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => {
        const data = response.data;
        commit('addPosProduct', data);
        resolve(data);
      })
      .catch(error => {
        console.error('Failed to create pos product', error);
        reject(error);
      });
    });
  },
  async updatePosProduct({ commit }, pos_product) {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.put(`${process.env.VUE_APP_ROOT_API}/pos-order-items/${pos_product.id}`, pos_product, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      commit('updatePosProduct', response.data);
    }
    catch (error) {
      console.error('Failed to update pos product:', error);
      throw error;
    }
  },
  async deletePosProductById({ commit }, id) {
    return new Promise((resolve, reject) => {
      const token = localStorage.getItem('auth_token');
      axios.delete(`${process.env.VUE_APP_ROOT_API}/pos-order-items/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => {
        commit('removePosProduct', id);
        resolve(response.data);
      })
      .catch(error => {
        console.error('Failed to delete Pos Product', error);
        reject(error);
      });
    });
  } 
}

const mutations = {
  addPosProduct(state, pos_product) {
    state.pos_products = pos_product.data;
  },
  updatePosProduct(state, updatedPosProduct) {
    const index = state.pos_products.findIndex(pos_product => pos_product.id == updatedPosProduct.id);
    if (index !== -1) {
      state.pos_products.splice(index, 1, updatedPosProduct);
    }
  },
  removePosProduct(state, id) {
    // Ensure pstate.pos_products is an array
    if (Array.isArray(state.pos_products)) {
      state.pos_products = state.pos_products.filter(pos_product => pos_product.id !== id);
    } else {
      state.pos_products = [];
    }
  }
}

const getters = {
  allPosProducts: (state) => state.pos_products,

}

export default {
  namespaced: true,
  state, mutations, actions, getters
}