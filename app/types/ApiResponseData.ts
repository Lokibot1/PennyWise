
export type ApiResponseData<T> = {
    success: boolean
    message?: string
    data: T
    errors?: {
        [key: string]: string[]
    }
    meta?: {
        current_page: number
        last_page: number
        per_page: number
        total: number
    }
}