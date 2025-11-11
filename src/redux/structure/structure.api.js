import axios from 'axios'
import Cookies from 'js-cookie'

axios.defaults.headers.common['Authorization'] = "Bearer " + Cookies.get('tkn')
axios.defaults.headers.common['isauth'] = Cookies.get('isAuth') || ""
axios.defaults.headers.common['isr'] = Cookies.get('isr') || ""
const header = {
    'Content-type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'multipart/form-data',
    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
}


export const get_api_structure = async (url, data) => {

    return await axios.get(url, header)
        .then((res) => {
            // console.log(res)
            const data = res.data.result
            const status = res.status
            return {
                data, status
            }
        }).catch((err) => {
            // console.log(err)
            if (err.response.status === 404) {
                Cookies.remove('isr')
                Cookies.remove('isAuth')
                Cookies.remove('tkn')
                window.location.href = "/"
            }
            const data = err.response.data.result
            const status = err.response.status
            return {
                data, status
            }
        })
}


export const post_api_structure = async (url, data) => {
    const header = {
        'Content-type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'multipart/form-data',
        "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
    }
    return await axios.post(url, data, header)
        .then((res) => {
            // console.log(res)
            const data = res.data.result
            const status = res.status
            return {
                data, status
            }
        }).catch((err) => {
            // console.log(err)
            if (err.response.status === 404) {
                Cookies.remove('isr')
                Cookies.remove('isAuth')
                Cookies.remove('tkn')
                window.location.href = "/"
            }
            const data = err.response.data.result
            const status = err.response.status
            return {
                data, status
            }
        })
}


export const patch_api_structure = async (url, data) => {
    return await axios.patch(url, data, header)
        .then((res) => {
            // console.log(res)
            const data = res.data.result
            const status = res.status
            return {
                data, status
            }
        }).catch((err) => {
            // console.log(err)
            if (err.response.status === 404) {
                Cookies.remove('isr')
                Cookies.remove('isAuth')
                Cookies.remove('tkn')
                window.location.href = "/"
            }
            const data = err.response.data.result
            const status = err.response.status
            return {
                data, status
            }
        })
}
