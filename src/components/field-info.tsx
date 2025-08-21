import type { AnyFieldApi } from '@tanstack/react-form';

export function FieldInfo({ field }: { field: AnyFieldApi }) {
  const meta = field.getMeta();
  return (
    <>
      {meta.isTouched && meta.errors.length > 0 && (
        <div className="text-red-500 text-sm">
          {meta.errors.map((error) => error.message).join(', ')}
        </div>
      )}
    </>
  );
}
