import { createApp } from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify.js';
import './styles.css';

const app = createApp(App);

app.config.errorHandler = (err, _instance, info) => {
  console.error('[app]', err, info);
};

app.use(vuetify).mount('#app');
