import axios from 'axios';

const state = {
  images: [],
};

const actions = {
  uploadImages({ commit }, image) {
    return new Promise((resolve, reject) => {
      const token = localStorage.getItem('auth_token');
      axios.post(`${process.env.VUE_APP_ROOT_API}/upload-products/uploads/`, image, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      })
      .then(response => {
        const data = response.data;
        commit('addImage', data);
        resolve(data);
      })
      .catch(error => {
        console.error('Failed to create image', error);
        reject(error);
      });
    });
  },
  async deleteImage({ commit }, id) {
    return new Promise((resolve, reject) => {
      const token = localStorage.getItem('auth_token');
      axios.delete(`${process.env.VUE_APP_ROOT_API}/upload-products/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => {
        commit('removeImage', id);
        resolve(response.data);
      })
      .catch(error => {
        console.error('Failed to delete image', error);
        reject(error);
      });
    });
  },
};

const mutations = {
  addImage(state, image) {
    state.images.push(image);
  },
  removeImage(state, id) {
    state.images = state.images.filter(image => image.id !== id);
  }
};

const getters = {
  allImages: (state) => state.images,
};

export default {
  namespaced: true,
  state, mutations, actions, getters
}