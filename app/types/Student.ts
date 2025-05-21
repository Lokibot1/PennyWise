
export type Student = {
    id: number
    student_id: string
    first_name: string
    last_name: string
    middle_name: string
    contact_number: string
    email_address: string
    status: 'active' | 'inactive'
    house_no?: string
    street_name?: string
    barangay?: string
    municipality?: string
    created_at?: Date
    updated_at?: Date
}