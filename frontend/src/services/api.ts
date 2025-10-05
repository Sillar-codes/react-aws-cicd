import axios from 'axios'
import { Item, ItemRequest } from '../types/item'
import { API_BASE_URL } from '@/config'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

api.interceptors.request.use(config => {
  const token = localStorage.getItem('idToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

api.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('idToken')
      window.location.href = '/signin'
    }

    return Promise.reject(error)
  }
)

export const itemService = {
  async createItem(item: ItemRequest): Promise<Item> {
    const response = await api.post<Item>('/items', item)

    return response.data
  },

  async getItem(id: string): Promise<Item> {
    const response = await api.get<Item>(`/items/${id}`)

    return response.data
  },

  async getAllItems(): Promise<Item[]> {
    const response = await api.get<Item[]>(`/items/all`)

    return response.data
  },

  async listItems(): Promise<Item[]> {
    const response = await api.get<Item[]>('/items')

    return response.data
  },

  async updateItem(id: string, item: ItemRequest): Promise<Item> {
    const response = await api.put<Item>(`/items/${id}`, item)

    return response.data
  },

  async deleteItem(id: string): Promise<void> {
    await api.delete(`/items/${id}`)
  }
}
