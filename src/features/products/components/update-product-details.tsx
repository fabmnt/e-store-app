'use client';

import { onError, onSuccess } from '@orpc/client';
import { useServerAction } from '@orpc/react/hooks';
import { Loader, Pencil, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  addProductDetail,
  deleteProductDetail,
  updateProductDetail,
} from '@/rpc/products/products-actions';
import type { ProductDetail } from '../schemas/product-schema';

type UpdateProductDetailsProps = {
  productId: string;
  details: ProductDetail[];
};

export default function UpdateProductDetails({
  productId,
  details,
}: UpdateProductDetailsProps) {
  const [items, setItems] = useState<ProductDetail[]>(details ?? []);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const [newDetail, setNewDetail] = useState<string>('');

  useEffect(() => {
    setItems(details ?? []);
  }, [details]);

  console.log({ details });
  // Derived state can be added later if needed

  const { execute: executeAdd, isPending: isAdding } = useServerAction(
    addProductDetail,
    {
      interceptors: [
        onSuccess((created) => {
          setItems((prev) => [...prev, created]);
          setNewDetail('');
          toast.success('Detail added');
        }),
        onError((error) => {
          toast.error(error.message);
        }),
      ],
    }
  );

  const { execute: executeUpdate, isPending: isUpdating } = useServerAction(
    updateProductDetail,
    {
      interceptors: [
        onSuccess((updated) => {
          setItems((prev) =>
            prev.map((d) => (d.id === updated.id ? updated : d))
          );
          setEditingId(null);
          setEditValue('');
          toast.success('Detail updated');
        }),
        onError((error) => {
          toast.error(error.message);
        }),
      ],
    }
  );

  const { execute: executeDelete, isPending: isDeleting } = useServerAction(
    deleteProductDetail,
    {
      interceptors: [
        onSuccess((deleted) => {
          setItems((prev) => prev.filter((d) => d.id !== deleted.id));
          toast.success('Detail deleted');
        }),
        onError((error) => {
          toast.error(error.message);
        }),
      ],
    }
  );

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Input
          autoComplete="off"
          disabled={isAdding}
          onChange={(e) => setNewDetail(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && newDetail.trim().length > 0 && !isAdding) {
              executeAdd({ productId, detail: newDetail.trim() });
            }
          }}
          placeholder="Add a detail for this product"
          value={newDetail}
        />
        <Button
          disabled={isAdding || newDetail.trim().length === 0}
          onClick={() => executeAdd({ productId, detail: newDetail.trim() })}
          type="button"
        >
          {isAdding ? (
            <Loader className="size-4 animate-spin" />
          ) : (
            <>
              <Plus className="mr-2 size-4" />
              Add
            </>
          )}
        </Button>
      </div>

      {items.length === 0 && (
        <p className="text-muted-foreground text-sm">No details yet.</p>
      )}

      <ul className="flex flex-col gap-2">
        {items.map((detail) => (
          <li className="group relative" key={detail.id}>
            {editingId === detail.id ? (
              <div className="flex items-center gap-2">
                <Input
                  autoComplete="off"
                  disabled={isUpdating}
                  onChange={(e) => setEditValue(e.target.value)}
                  placeholder="Edit detail"
                  value={editValue}
                />
                <Button
                  className="w-20"
                  disabled={isUpdating || editValue.trim().length === 0}
                  onClick={() =>
                    executeUpdate({ id: detail.id, detail: editValue.trim() })
                  }
                  type="button"
                >
                  {isUpdating ? (
                    <Loader className="size-4 animate-spin" />
                  ) : (
                    'Save'
                  )}
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-2 rounded border px-3 py-2">
                <span className="text-sm">{detail.content}</span>
                <div className="invisible flex items-center gap-1 group-hover:visible">
                  <Button
                    onClick={() => {
                      setEditingId(detail.id);
                      setEditValue(detail.content);
                    }}
                    size="icon"
                    title="Edit detail"
                    variant="outline"
                  >
                    <Pencil className="size-4" />
                  </Button>
                  <Button
                    disabled={isDeleting}
                    onClick={() => executeDelete({ id: detail.id })}
                    size="icon"
                    title="Delete detail"
                    variant="destructive"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
