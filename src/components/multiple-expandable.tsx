import { X } from 'lucide-react';
import { useState } from 'react';
import { Badge, BadgeButton } from '@/components/ui/badge';
import { Button, ButtonArrow } from '@/components/ui/button';
import {
  Command,
  CommandCheck,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import type { Tag } from '@/features/products/schemas/product-schema';

type SelectTagsProps = {
  tags: Tag[];
  selectedTags: Tag[];
  onTagsChange: (tags: Tag[]) => void;
};
export function SelectTags({
  tags,
  selectedTags,
  onTagsChange,
}: SelectTagsProps) {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const toggleSelection = (value: Tag) => {
    const newValues = selectedTags.includes(value)
      ? selectedTags.filter((v) => v.id !== value.id)
      : [...selectedTags, value];
    onTagsChange(newValues);
  };

  const removeSelection = (value: Tag) => {
    const newValues = selectedTags.filter((v) => v.id !== value.id);
    onTagsChange(newValues);
  };

  // Define maxShownItems before using visibleItems
  const maxShownItems = 2;
  const visibleItems = expanded
    ? selectedTags
    : selectedTags.slice(0, maxShownItems);
  const hiddenCount = selectedTags.length - visibleItems.length;

  return (
    <div className="w-full">
      <Popover onOpenChange={setOpen} open={open}>
        <PopoverTrigger asChild>
          <Button
            aria-expanded={open}
            autoHeight={true}
            className="relative w-full px-1.5 py-1"
            mode="input"
            placeholder={selectedTags.length === 0}
            role="combobox"
            variant="outline"
          >
            <div className="flex flex-wrap items-center gap-1 pe-2.5">
              {selectedTags.length > 0 ? (
                <>
                  {visibleItems.map((val) => {
                    return (
                      <Badge key={val.id} variant="outline">
                        {val.name}
                        <BadgeButton
                          onClick={(e) => {
                            e.stopPropagation();
                            removeSelection(val);
                          }}
                        >
                          <X />
                        </BadgeButton>
                      </Badge>
                    );
                  })}
                  {/* Always show "Less" button when expanded */}
                  {hiddenCount > 0 || expanded ? (
                    <Badge
                      appearance="ghost"
                      className="cursor-pointer px-1.5 text-muted-foreground hover:bg-accent"
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpanded((prev) => !prev);
                      }}
                    >
                      {expanded ? 'Show Less' : `+${hiddenCount} more`}
                    </Badge>
                  ) : null}
                </>
              ) : (
                <span className="px-2.5">Select tags</span>
              )}
            </div>
            <ButtonArrow className="absolute end-3 top-2" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-(--radix-popper-anchor-width) p-0">
          <Command>
            <CommandInput placeholder="Search tag..." />
            <CommandList>
              <CommandEmpty>No tag found.</CommandEmpty>
              <CommandGroup>
                {tags.map((tag) => (
                  <CommandItem
                    key={tag.id}
                    onSelect={() => toggleSelection(tag)}
                    value={tag.id}
                  >
                    <span className="truncate">{tag.name}</span>
                    {selectedTags.includes(tag) && <CommandCheck />}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
