import api from "./config"



const getDonhang = async() => {
    try {
        const result = await api.get("/donhang/getall")
        return result
    } catch (err) {
        console.log(err)
    }
}

const TSMOrder = async(departureTime, home, tasks) => {
    try {
        const result = await api.post("/api/v1/routeOptimizer", { departureTime, home, tasks })

        return result
    } catch (err) {
        console.log(err)
    }
}


export default {
    getDonhang,
    TSMOrder
}