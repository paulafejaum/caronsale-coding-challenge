import axios from "axios";

const instance = axios.create({

    baseURL: "https://caronsale-backend-service-dev.herokuapp.com/api/"
});

export default instance;