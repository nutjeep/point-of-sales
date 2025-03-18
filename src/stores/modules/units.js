const state = {
  units: []
};

const mutations = {
  setUnits(state, units) {
    state.units = units;
  }
};

const actions = {
  async fetchUnits({ commit }) {
    try {
      const response = await fetch('http://localhost:3000/units');
      const data = await response.json();
      commit('setUnits', data);
    }
    catch (error) {
      console.error('Failed to fetch units: ', error);
    }
  } 
};

const getters = {
  allUnits: (state) => state.units
};

export default {
  namespaced: true,
  state, mutations, actions, getters
}