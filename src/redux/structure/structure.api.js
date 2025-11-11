import axios from 'axios'
import Cookies from 'js-cookie'

// Create axios instance with default config
const apiClient = axios.create({
    withCredentials: false,
    headers: {
        'Content-Type': 'application/json',
    }
})

// Request interceptor to add auth headers
apiClient.interceptors.request.use(
    (config) => {
        const token = Cookies.get('tkn')
        const isAuth = Cookies.get('isAuth') || ""
        const isr = Cookies.get('isr') || ""
        
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`
        }
        config.headers['isauth'] = isAuth
        config.headers['isr'] = isr
        
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// Response interceptor for error handling
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 404) {
            Cookies.remove('isr')
            Cookies.remove('isAuth')
            Cookies.remove('tkn')
            window.location.href = "/"
        }
        return Promise.reject(error)
    }
)

export const get_api_structure = async (url, data) => {
    try {
        const res = await apiClient.get(url, { params: data })
        return {
            data: res.data.result,
            status: res.status
        }
    } catch (err) {
        if (err.response) {
            return {
                data: err.response.data?.result || err.response.data,
                status: err.response.status
            }
        }
        throw err
    }
}

export const post_api_structure = async (url, data) => {
    try {
        // Check if data is FormData to set correct Content-Type
        const isFormData = data instanceof FormData
        const config = isFormData 
            ? { headers: { 'Content-Type': 'multipart/form-data' } }
            : { headers: { 'Content-Type': 'application/json' } }
            
        const res = await apiClient.post(url, data, config)
        return {
            data: res.data.result,
            status: res.status
        }
    } catch (err) {
        if (err.response) {
            return {
                data: err.response.data?.result || err.response.data,
                status: err.response.status
            }
        }
        throw err
    }
}

export const patch_api_structure = async (url, data) => {
    try {
        // Check if data is FormData to set correct Content-Type
        const isFormData = data instanceof FormData
        const config = isFormData 
            ? { headers: { 'Content-Type': 'multipart/form-data' } }
            : { headers: { 'Content-Type': 'application/json' } }
            
        const res = await apiClient.patch(url, data, config)
        return {
            data: res.data.result,
            status: res.status
        }
    } catch (err) {
        if (err.response) {
            return {
                data: err.response.data?.result || err.response.data,
                status: err.response.status
            }
        }
        throw err
    }
}
