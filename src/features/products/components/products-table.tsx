'use client';

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { EllipsisVerticalIcon, PencilIcon, TrashIcon } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
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
import type { ProductWithImages } from '../schemas/product-schema';
import { DeleteProductDialog } from './delete-product-dialog';
import { UpdateProductDialog } from './update-product-dialog';

type ProductsTableProps = {
  products: ProductWithImages[];
};

const RowActions = ({ product }: { product: ProductWithImages }) => {
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  return (
    <>
      <UpdateProductDialog
        onOpenChange={setOpenEditDialog}
        open={openEditDialog}
        product={product}
      />
      <DeleteProductDialog
        onOpenChange={setOpenDeleteDialog}
        open={openDeleteDialog}
        productId={product.id}
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
          <DropdownMenuItem
            onClick={() => setOpenDeleteDialog(true)}
            variant="destructive"
          >
            <TrashIcon className="size-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

const columnHelper = createColumnHelper<ProductWithImages>();

const productsColumns = [
  columnHelper.accessor('name', {
    header: 'Name',
    cell: ({ row }) => row.original.name,
  }),
  columnHelper.accessor('slug', {
    header: 'Slug',
    cell: ({ row }) => row.original.slug,
  }),
  columnHelper.accessor('category', {
    header: 'Category',
    cell: ({ row }) => row.original.category?.name || 'Uncategorized',
  }),
  columnHelper.accessor('tags', {
    header: 'Tags',
    cell: ({ row }) => {
      const maxTags = 2;
      return (
        <div className="flex flex-wrap gap-2">
          {row.original.tags?.length === 0 && (
            <span className="text-muted-foreground">No tags</span>
          )}
          {row.original.tags.slice(0, maxTags).map((tag) => (
            <Badge key={tag.id}>{tag.name}</Badge>
          ))}
          {row.original.tags.length > maxTags && (
            <Badge variant="outline">
              +{row.original.tags.length - maxTags}
            </Badge>
          )}
        </div>
      );
    },
  }),
  columnHelper.accessor('description', {
    header: 'Description',
    cell: ({ row }) => (
      <p className="max-w-[30ch] truncate text-muted-foreground text-sm xl:max-w-[20ch]">
        {row.original.description}
      </p>
    ),
  }),
  columnHelper.accessor('price', {
    header: 'Price',
    cell: ({ row }) => row.original.price.toFixed(2),
  }),
  columnHelper.accessor('stock', {
    header: 'Stock',
    cell: ({ row }) => row.original.stock,
  }),
  columnHelper.accessor('images', {
    header: 'Images',
    cell: ({ row }) => row.original.images?.length,
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
    <div className="">
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
