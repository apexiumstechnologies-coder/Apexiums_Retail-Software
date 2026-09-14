    import axios from 'axios'


    const axiosInstance = axios.create({
      // baseURL : 'http://localhost:5000/api',
    baseURL : 'https://apexiumsretail-software-production.up.railway.app/api',
        withCredentials : true
    }) 

    export default axiosInstance