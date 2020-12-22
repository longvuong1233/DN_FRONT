import vue from "vue"
import vuex from "vuex"

import donhangStore from "./modules/donhang"
vue.use(vuex)


export default new vuex.Store({

    modules: {
        DONHANG: donhangStore
    }
})