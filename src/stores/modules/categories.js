import axios from 'axios';

const state = {
    categories: []
};

const getters = {
    allCategories: (state) => state.categories,
};

const actions = {
    async fetchCategories({ commit }) {
        try {
            const token = localStorage.getItem('auth_token');
            const response = await axios.get(`${process.env.VUE_APP_ROOT_API}/categories`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.data;
            commit('setCategories', data);
        }
        catch (error) {
            console.error('Failed to fetch categories:', error);
        }
    },
    createCategory({ commit }, category) {
        return new Promise((resolve, reject) => {
            const token = localStorage.getItem('auth_token');
            axios.post(`${process.env.VUE_APP_ROOT_API}/categories`, category, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(response => {
                const data = response.data;
                commit('addCategory', data);
                resolve(data);
            })
            .catch(error => {
                console.error('Failed to create category: ', error);
                reject(error);
            });
        });
    },
    updateCategory({ commit }, category) {
        return new Promise((resolve, reject) => {
            const token = localStorage.getItem('auth_token');
            axios.put(`${process.env.VUE_APP_ROOT_API}/categories/${category.id}`, category, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(response => {
                const data = response.data;
                commit('updateCategory', data);
                resolve(data);
            })
            .catch(error => {
                console.error('Failed to update category: ', error);
                reject(error);
            });
        });
    },
    async deleteCategoryById({ commit }, id) {
        return new Promise((resolve, reject) => {
            const token = localStorage.getItem('auth_token');
            axios.delete(`${process.env.VUE_APP_ROOT_API}/categories/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(response => {
                commit('removeCategory', id);
                resolve(response.data);
            })
            .catch(error => {
                console.error('Failed to delete category', error);
                reject(error);
            });
        });
    }
};

const mutations = {
    setCategories(state, categories) {
        state.categories = categories.data;
    },
    addCategory(state, category) {
        state.categories.push(category)
    },
    updateCategory(state, updatedCategory) {
        const index = state.categories.findIndex(category => category.id == updatedCategory.id);
        if (index !== -1) {
            state.categories.splice(index, 1, updatedCategory);
        }
    },
    removeCategory(state, id) {
        state.categories = state.categories.filter(category => category.id !== id);
    }
};
  
export default {
    namespaced:true,
    state, mutations, actions, getters,
};