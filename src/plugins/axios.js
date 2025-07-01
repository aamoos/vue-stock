import axios from 'axios'

const axiosInstance = axios.create({
    baseURL: '/api', // ✅ Vite 프록시가 처리해줌
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    },
})

// 요청 인터셉터
axiosInstance.interceptors.request.use(config => {
    return config
}, error => {
    return Promise.reject(error)
})

// 응답 인터셉터
axiosInstance.interceptors.response.use(response => {
    return response
}, error => {
    return Promise.reject(error)
})

export default axiosInstance
