import axios from 'axios'

if(!process.env.NEXT_PUBLIC_API_KEY){
    throw Error('Required API_KEY not found!')
}

export const apiClient = axios.create({
    baseURL: 'https://api.changenow.io/v2/exchange',
    headers: {
        'x-changenow-api-key': process.env.NEXT_PUBLIC_API_KEY
    }
})
