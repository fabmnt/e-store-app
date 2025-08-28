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
import type { Tag } from '@/features/products/schemas/product-schema';
import { DeleteTagDialog } from './delete-tag-dialog';
import { UpdateTagDialog } from './update-tag-dialog';

const columnHelper = createColumnHelper<Tag>();

const RowActions = ({ tag }: { tag: Tag }) => {
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  return (
    <>
      <UpdateTagDialog
        onOpenChange={setOpenEditDialog}
        open={openEditDialog}
        tag={tag}
      />
      <DeleteTagDialog
        onOpenChange={setOpenDeleteDialog}
        open={openDeleteDialog}
        tag={tag}
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

const columns = [
  columnHelper.accessor('name', { header: 'Name' }),
  columnHelper.accessor('slug', { header: 'Slug' }),
  columnHelper.accessor('description', {
    header: 'Description',
    cell: ({ row }) => row.original.description || '-',
  }),
  columnHelper.display({
    header: 'Actions',
    cell: ({ row }) => <RowActions tag={row.original} />,
  }),
];

type TagsTableProps = { tags: Tag[] };

export function TagsTable({ tags }: TagsTableProps) {
  const table = useReactTable({
    data: tags,
    columns,
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
        </TableBody>
      </Table>
    </div>
  );
}
