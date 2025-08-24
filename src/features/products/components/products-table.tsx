'use client';

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { EllipsisVerticalIcon, PencilIcon, TrashIcon } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { Product } from '../schemas/product-schema';
import { UpdateProductDialog } from './update-product-dialog';

type ProductsTableProps = {
  products: Product[];
};

const RowActions = ({ product }: { product: Product }) => {
  const [openEditDialog, setOpenEditDialog] = useState(false);

  return (
    <>
      <UpdateProductDialog
        onOpenChange={setOpenEditDialog}
        open={openEditDialog}
        product={product}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" variant="outline">
            <EllipsisVerticalIcon className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => setOpenEditDialog(true)}>
            <PencilIcon className="size-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem variant="destructive">
            <TrashIcon className="size-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
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
  columnHelper.display({
    header: 'Actions',
    cell: ({ row }) => <RowActions product={row.original} />,
  }),
];

export function ProductsTable({ products }: ProductsTableProps) {
  const table = useReactTable({
    data: products,
    columns: productsColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="overflow-hidden rounded-md border">
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
