import Vue from 'vue'
import App from './App.vue'
import VueRouter from "vue-router"
import vuetify from './plugins/vuetify';
import store from "../stores/index"
import routes from "../routes/index"
import * as VueGoogleMaps from "vue2-google-maps";

Vue.config.productionTip = false

Vue.use(VueRouter)

const router = new VueRouter({
    routes
})


Vue.use(VueGoogleMaps, {
    load: {
        key: "AIzaSyDWTx7bREpM5B6JKdbzOvMW-RRlhkukmVE",
        libraries: "places",
        region: 'VI',
        language: 'vi'
    }
});


new Vue({
    vuetify,
    router,
    store,
    render: h => h(App)
}).$mount('#app')