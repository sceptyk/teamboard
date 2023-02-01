import { createApp } from 'vue';
import { VueFire, VueFireAuth } from 'vuefire';
import App from '@/App.vue';
import router from '@/router';
import { firebaseApp } from '@/services/firebase';

import 'vfonts/Lato.css';
import '@/assets/main.css';

const app = createApp(App);

app.use(VueFire, {
  firebaseApp,
  modules: [VueFireAuth()],
});

app.use(router);

app.mount('#app');
