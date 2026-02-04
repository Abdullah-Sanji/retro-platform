import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { ConvexClient } from 'convex/browser';
import { ConvexClientKey } from './composables/useConvex';
import App from './App.vue';
import './style.css';

const app = createApp(App);

// Setup Pinia
const pinia = createPinia();
app.use(pinia);

// Setup Convex
const convexClient = new ConvexClient(import.meta.env.VITE_CONVEX_URL);

// Provide Convex client globally
app.provide(ConvexClientKey, convexClient);

app.mount('#app');