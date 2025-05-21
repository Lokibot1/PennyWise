// app/static/student-columns.ts
import {UBadge} from "#components";

export default [
    {
        accessorKey: 'student_id',
        header: 'Student ID',
    },
    {
        accessorKey: 'full_name',
        header: 'Full Name',
    },
    {
        accessorKey: 'contact_number',
        header: 'Contact Number',
    },
    {
        accessorKey: 'email_address',
        header: 'Email Address',
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
            const status = {
                active: 'success' as const,
                inactive: 'error' as const,
            }[row.getValue('status') as string]

            return h(UBadge, { class: 'capitalize',  variant: 'subtle', color: status }, () =>
                row.getValue('status')
            )
        }
    },
]
