'use client';

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { Product } from '../schemas/product-schema';

type ProductsTableProps = {
  products: Product[];
};

const columnHelper = createColumnHelper<Product>();

const productsColumns = [
  columnHelper.accessor('name', {
    header: 'Name',
    cell: ({ row }) => row.original.name,
  }),
  columnHelper.accessor('slug', {
    header: 'Slug',
    cell: ({ row }) => row.original.slug,
  }),
  columnHelper.accessor('description', {
    header: 'Description',
    cell: ({ row }) => row.original.description || '-',
  }),
  columnHelper.accessor('price', {
    header: 'Price',
    cell: ({ row }) => row.original.price.toFixed(2),
  }),
  columnHelper.accessor('stock', {
    header: 'Stock',
    cell: ({ row }) => row.original.stock,
  }),
];

export function ProductsTable({ products }: ProductsTableProps) {
  const table = useReactTable({
    data: products,
    columns: productsColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
          {table.getRowModel().rows.length === 0 && (
            <TableRow>
              <TableCell
                className="h-24 text-center"
                colSpan={productsColumns.length}
              >
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
