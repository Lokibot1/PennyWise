
export type Book = {
    id: number
    book_name: string
    isbn: string
    shelf_location: string
    author_name: string
    publishers_name: string
    year: number
    status: 'available' | 'borrowed'
    created_at?: Date
    updated_at?: Date
}