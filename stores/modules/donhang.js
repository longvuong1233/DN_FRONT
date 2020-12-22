import api from "../../apis/index"





const state = {
    loading: false,
    OrderSort: [],
    tasks: [],
    departureTime: "",
    home: {
        "lat": 10.731785748347498,
        "lng": 106.69928612872141
    }

}

const getters = {
    getLoading(state) {
        return state.loading
    },
    getTasks: (state) => {
        return state.tasks
    },
    getOrderSort: (state) => {
        return state.OrderSort
    },
    getHome: (state) => {
        return state.home
    },
    getdepartureTime: (state) => {
        return state.departureTime
    }
}

const mutations = {
    loading(state, payload) {
        state.loading = payload
    },
    setdepartureTime(state, payload) {
        state.departureTime = payload
    },
    setTasks(state, payload) {
        state.tasks = payload
    },
    setOrderSort(state, payload) {
        let temp = payload.map((ele) => {
            return ele.id
        });
        state.OrderSort = temp

    }

}

const actions = {


    async TSMOrder({ commit }, data) {
        const { departureTime, home, tasks } = data

        commit("loading", true)
        const result = await api.TSMOrder(departureTime, home, tasks)

        commit("setOrderSort", result.data.result.schedule)
        commit("loading", false)
    }


}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}