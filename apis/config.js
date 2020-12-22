const axios = require("axios")

const instance = axios.create({
    baseURL: 'http://127.0.0.1:3000',
});

export default instance