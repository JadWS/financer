import { axiosClient } from "./axiosClient"

const transactionsUrl = '/transactions'
const categoriesUrl = '/categories'
const mappingUrl = '/mapping'

export const getAllTransactions = async () => {
    const res = await axiosClient.get(`${transactionsUrl}`)
    return res.data
}

export const createNewTransaction = async (obj: any) => {
    const res = await axiosClient.post(`${transactionsUrl}`, obj)
    return res.data
}

export const getAllMaps = async () => {
    const res = await axiosClient.get(`${mappingUrl}`)
    return res.data
}

export const createNewMap = async (obj: any) => {
    const res = await axiosClient.post(`${mappingUrl}`, obj)
    return res.data
}

export const editMap = async (obj: any) => {
    const res = await axiosClient.put(`${mappingUrl}/${obj.id}`, obj)
    return res.data
}

export const deleteMap = async (id: number) => {
    const res = await axiosClient.delete(`${mappingUrl}/${id}`)
    return res.data
}

export const getAllCategories = async () => {
    const res = await axiosClient.get(`${categoriesUrl}`)
    return res.data
}

export const createNewCategory = async (obj: any) => {
    const res = await axiosClient.post(`${categoriesUrl}`, obj)
    return res.data
}

export const editCategory = async (obj: any) => {
    const res = await axiosClient.put(`${categoriesUrl}/${obj.id}`, obj)
    return res.data
}

export const deleteCategory = async (id: number) => {
    const res = await axiosClient.delete(`${categoriesUrl}/${id}`)
    return res.data
}