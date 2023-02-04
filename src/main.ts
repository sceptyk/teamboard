import { createApp } from 'vue';
import { VueFire, VueFireAuth } from 'vuefire';
import App from '@/App.vue';
import router from '@/router';
import { firebaseApp } from '@/services/firebase';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat.js';

import 'vfonts/Lato.css';
import '@/assets/main.css';

dayjs.extend(LocalizedFormat);

const app = createApp(App);

app.use(VueFire, {
  firebaseApp,
  modules: [VueFireAuth()],
});

app.use(router);

app.mount('#app');
