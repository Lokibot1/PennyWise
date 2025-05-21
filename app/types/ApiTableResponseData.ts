
export type ApiTableResponseData<T> = {
    page: number
    size: number
    totalPages: number
    totalItems: number
    items: T[]
}