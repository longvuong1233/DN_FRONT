import donhangPage from "../src/components/donhangPage.vue";
import shipPage from "../src/components/shipPage.vue"
const routes = [{
        path: "/",
        component: donhangPage,
        name: "home"
    },
    {
        path: "/ship",
        component: shipPage,
        name: "ship"
    }
];

export default routes;