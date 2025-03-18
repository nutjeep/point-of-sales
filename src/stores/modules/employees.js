import axios from 'axios';

// state =  objek untuk menyimpan data aplikasi secara global
const state = {
    employees: [],
    pagination: {
        page: 1,
        perPage: 10,
        totalItems: 0,
        previousPageLink: null,
        nextPageLink: null
    }
};

// getters = mendapatkan data dari `state`. objek ini digunakan untuk memproses / memanipulasi data dari `state` sebelum disajikan ke komponen
const getters = {
    allEmployees: (state) => state.employees,
    pagination: (state) => state.pagination
};

// actions = metode yang digunakan untuk melakukan operasi asinkron seperti pengambilan data dari API
const actions = {
    async fetchEmployees({ commit }, params) {
        try {
          const token = localStorage.getItem('auth_token');
          const response = await axios.get(`${process.env.VUE_APP_ROOT_API}/users`, {
            headers: {
              'Authorization': `Bearer ${token}`
            },
            params: params
          });
          const data = await response.data;
          commit('setEmployees', data);
          commit('setPagination', data.pagination);
        }
        catch (error) {
          console.error('Failed to fetch employees: ', error);
        }
    },
    async fetchAllEmployees({ commit }) {
        try {
            const token = localStorage.getItem('auth_token');
            const response = await axios.get(`${process.env.VUE_APP_ROOT_API}/users`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            });
            const data = await response.data;
            commit('setEmployees', data);
        }
        catch (error) {
            console.error('Failed to fetch employees:', error);
        }
    },
    createEmployee({ commit }, employee) {
        return new Promise((resolve, reject) => {
            const token = localStorage.getItem('auth_token');
            axios.post(`${process.env.VUE_APP_ROOT_API}/users`, employee, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(response => {
                const data = response.data;
                commit('addEmployee', data);
                resolve(data);
            })
            .catch(error => {
                console.error('Failed to create employee', error);
                reject(error);
            });
        });
    },
    async fetchEmployeeById(_, id) {
        try {
            const token = localStorage.getItem('auth_token');
            const response = await axios.get(`${process.env.VUE_APP_ROOT_API}/users/${id}`, {
                headers: {
                'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Failed to fetch employee:', error);
            throw error;
        }
    },
    async updateEmployee({ commit }, employee) {
        try {
          const token = localStorage.getItem('auth_token');
          const response = await axios.put(`${process.env.VUE_APP_ROOT_API}/users/${employee.id}`, employee, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          commit('updateEmployee', response.data);
        }
        catch (error) {
          console.error('Failed to update employee:', error);
          throw error;
        }
    },
    async deleteEmployeeById({ commit }, id) {
        return new Promise((resolve, reject) => {
            const token = localStorage.getItem('auth_token');
            axios.delete(`${process.env.VUE_APP_ROOT_API}/users/${id}`, {
                headers: {
                'Authorization': `Bearer ${token}`
                }
            })
            .then(response => {
                commit('removeEmployee', id);
                resolve(response.data);
            })
            .catch(error => {
                console.error('Failed to delete Employee', error);
                reject(error);
            });
        });
    }
};

// mutations = adalah satu-satunya cara untuk mengubah state di Vuex. Mereka selalu sinkron dan menerima state sebagai argumen pertama dan payload sebagai argumen kedua.
const mutations = {
    setEmployees(state, employees) {
        state.employees = employees.data;
    },
    setPagination(state, pagination) {
        state.pagination.page = pagination.page || 1;
        state.pagination.perPage = pagination.perPage || 10;
        state.pagination.totalItems = pagination.totalItems || 0;
    
        state.pagination.previousPageLink = pagination.previousPageLink ? pagination.previousPageLink.replace(/\/api\/v1\/users\?/, '') : null;
        state.pagination.nextPageLink = pagination.nextPageLink ? pagination.nextPageLink.replace(/\/api\/v1\/users\?/, '') : null;
    },
    addEmployee(state, employee) {
        state.employees.push(employee);
    },
    updateEmployee(state, updatedEmployee) {
        const index = state.employees.findIndex(employee => employee.id == updatedEmployee.id);
        if (index !== -1) {
          state.employees.splice(index, 1, updatedEmployee);
        }
    },
    removeEmployee(state, id) {
        state.employees = state.employees.filter(employee => employee.id !== id);
    }
};

export default {
    namespaced: true,
    state, mutations, actions, getters,
};