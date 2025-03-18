import axios from 'axios';

const state = {
    products: [],
    pagination: {
        page: 1,
        perPage: 10,
        totalItems: 0,
        previousPageLink: null,
        nextPageLink: null
    }
};
  
const getters = {
    allProducts: (state) => state.products,
    pagination: (state) => state.pagination
};

const actions = {
    async fetchProducts({ commit }, params) {
        try {
          const token = localStorage.getItem('auth_token');
          const response = await axios.get(`${process.env.VUE_APP_ROOT_API}/products`, {
            headers: {
              'Authorization': `Bearer ${token}`
            },
            params: params
          });
          const data = await response.data;
          commit('setProducts', data);
          commit('setPagination', data.pagination);
        }
        catch (error) {
          console.error('Failed to fetch products: ', error);
        }
    },
    async fetchAllProduct({ commit }) {
        try {
            const token = localStorage.getItem('auth_token');
            const response = await axios.get(`${process.env.VUE_APP_ROOT_API}/products`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.data;
            commit('setProducts', data);
        }
        catch (error) {
            console.error('Failed to fetch products:', error);
        }
    },
    createProduct({commit}, product) {
        return new Promise((resolve, reject) => {
            const token = localStorage.getItem('auth_token');
            axios.post(`${process.env.VUE_APP_ROOT_API}/products`, product, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(response => {
                const data = response.data;
                commit('addProduct', data);
                resolve(data);
            })
            .catch(error => {
                console.error('Failed to create product', error);
                reject(error);
            });
        });
    },
    async fetchProductById(_, id) {
        try {
            const token = localStorage.getItem('auth_token');
            const response = await axios.get(`${process.env.VUE_APP_ROOT_API}/products/${id}`, {
                headers: {
                'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Failed to fetch product:', error);
            throw error;
        }
    },
    async updateProduct({ commit }, product) {
        try {
          const token = localStorage.getItem('auth_token');
          const response = await axios.put(`${process.env.VUE_APP_ROOT_API}/products/${product.id}`, product, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          commit('updateProduct', response.data);
        }
        catch (error) {
          console.error('Failed to update product:', error);
          throw error;
        }
    },
    async deleteProductById({ commit }, id) {
        return new Promise((resolve, reject) => {
            const token = localStorage.getItem('auth_token');
            axios.delete(`${process.env.VUE_APP_ROOT_API}/products/${id}`, {
                headers: {
                'Authorization': `Bearer ${token}`
                }
            })
            .then(response => {
                commit('removeProduct', id);
                resolve(response.data);
            })
            .catch(error => {
                console.error('Failed to delete product', error);
                reject(error);
            });
        });
      }
};

const mutations = {
    setProducts(state, products) {
        state.products = products.data;
    },
    setPagination(state, pagination) {
        state.pagination.page = pagination.page || 1;
        state.pagination.perPage = pagination.perPage || 10;
        state.pagination.totalItems = pagination.totalItems || 0;
    
        state.pagination.previousPageLink = pagination.previousPageLink ? pagination.previousPageLink.replace(/\/api\/v1\/products\?/, '') : null;
        state.pagination.nextPageLink = pagination.nextPageLink ? pagination.nextPageLink.replace(/\/api\/v1\/products\?/, '') : null;
    },
    addProduct(state, product) {
        state.products.push(product);
    },
    updateProduct(state, updatedProduct) {
        const index = state.products.findIndex(product => product.id == updatedProduct.id);
        if (index !== -1) {
            state.products.splice(index, 1, updatedProduct);
        }
    },
    removeProduct(state, id) {
        state.products = state.products.filter(product => product.id !== id);
    }
};
  
export default {
    namespaced:true,
    state, mutations, actions, getters,
};    
  