'use client';

import { useForm } from '@tanstack/react-form';
import { NumericFormat } from 'react-number-format';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  type ProductCreate,
  productCreateSchema,
} from '../schemas/product-schema';

export function CreateProductDialog() {
  const form = useForm({
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      stock: 0,
      slug: '',
      categoryId: '',
      storeId: '',
    } as ProductCreate,
    validators: {
      onSubmit: productCreateSchema,
    },
    listeners: {
      onChange: ({ fieldApi }) => {
        console.log(fieldApi.name, ': ', fieldApi.state.value);
      },
    },
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Create new</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Product</DialogTitle>
        </DialogHeader>
        <div>
          <form
            id="create-product-form"
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
          >
            <div className="grid grid-cols-2 gap-4">
              <form.Field
                children={(field) => (
                  <div className="space-y-2">
                    <Label htmlFor={field.name}>Name</Label>
                    <Input
                      autoComplete="off"
                      id={field.name}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Shoes.."
                      value={field.state.value}
                    />
                  </div>
                )}
                name="name"
              />
              <form.Field
                children={(field) => (
                  <div className="space-y-2">
                    <Label htmlFor={field.name}>Price</Label>
                    <NumericFormat
                      allowNegative={false}
                      customInput={Input}
                      decimalScale={2}
                      fixedDecimalScale
                      id={field.name}
                      onBlur={field.handleBlur}
                      onValueChange={(value) => {
                        if (value.floatValue) {
                          field.handleChange(value.floatValue);
                        }
                      }}
                      placeholder="100"
                      value={field.state.value}
                    />
                  </div>
                )}
                name="price"
              />
            </div>
          </form>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button form="create-product-form" type="submit">
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
