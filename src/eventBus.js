import { createApp } from 'vue';
import mitt from 'mitt';

const emitter = mitt();
const app = createApp({});
app.config.globalProperties.emitter = emitter;

export default app;