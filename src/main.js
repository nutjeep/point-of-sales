import { createApp } from 'vue';
import store from './stores/index.js';
import App from './App.vue';
import router from './router';
import { globalVar } from './globalVar';
import './assets/tailwind.css';
import 'animate.css';
import './assets/css/animate.css';
import isAdmin from './helpers/isAdmin.js';

const app = createApp(App);
app.config.globalProperties.$globalVar = globalVar;
app.use(store);
app.use(router);
app.mixin(isAdmin);
app.mount('#app');