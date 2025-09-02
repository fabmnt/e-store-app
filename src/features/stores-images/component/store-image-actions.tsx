'use client';

import { useServerAction } from '@orpc/react/hooks';
import { EllipsisVerticalIcon } from 'lucide-react';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { updateStoreImageType } from '@/rpc/stores-images/stores-images-actions';

type StoreImageActionsProps = {
  storeImageId: string;
};

export function StoreImageActions({ storeImageId }: StoreImageActionsProps) {
  const { storeId } = useParams<{ storeId: string }>();
  const { execute } = useServerAction(updateStoreImageType);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon">
          <EllipsisVerticalIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          onClick={(e) => {
            e.preventDefault();
            toast.promise(
              execute({ id: storeImageId, type: 'cover', storeId }),
              {
                loading: 'Setting as cover...',
                success: 'Cover set successfully',
                error: 'Failed to set as cover',
              }
            );
          }}
        >
          Set as cover
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={(e) => {
            e.preventDefault();
            toast.promise(
              execute({ id: storeImageId, type: 'logo', storeId }),
              {
                loading: 'Setting as logo...',
                success: 'Logo set successfully',
                error: 'Failed to set as logo',
              }
            );
          }}
        >
          Set as logo
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={(e) => {
            e.preventDefault();
            toast.promise(
              execute({ id: storeImageId, type: 'banner', storeId }),
              {
                loading: 'Setting as banner...',
                success: 'Banner set successfully',
                error: 'Failed to set as banner',
              }
            );
          }}
        >
          Set as banner
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
