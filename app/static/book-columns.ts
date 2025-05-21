// app/static/student-columns.ts
import { UBadge } from "#components";

export default [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "book_name",
    header: "Book Name",
  },
  {
    accessorKey: "isbn",
    header: "ISBN #",
  },
  {
    accessorKey: "shelf_location",
    header: "Shelf Location",
  },
  {
    accessorKey: "author_name",
    header: "Author Name",
  },
  {
    accessorKey: "publishers_name",
    header: "Publisher Name",
  },
  {
    accessorKey: "year",
    header: "Year",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = {
        available: "success" as const,
        borrowed: "secondary" as const,
      }[row.getValue("status") as string];

      return h(
        UBadge,
        { class: "capitalize", variant: "subtle", color: status },
        () => row.getValue("status")
      );
    },
  },
];
