'use client';

import { onError, onSuccess } from '@orpc/client';
import { useServerAction } from '@orpc/react/hooks';
import { useForm } from '@tanstack/react-form';
import { Loader, Mail, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { FieldInfo } from '@/components/field-info';
import { PasswordInput } from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { signUpSchema } from '@/features/signup/schemas/signup-schema';
import { signUp } from '@/rpc/auth';

export function SignUpForm() {
  const router = useRouter();
  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
    validators: {
      onSubmit: signUpSchema,
    },
    onSubmit: async ({ value }) => {
      await execute(value);
    },
  });

  const { execute, isPending } = useServerAction(signUp, {
    interceptors: [
      onError((e) => {
        toast.error(e.message);
      }),
      onSuccess(() => {
        form.reset();
        toast.success('Account created successfully');
        router.push('/auth/signin');
      }),
    ],
  });

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <div className="space-y-2">
        <form.Field name="name">
          {(field) => (
            <>
              <Label htmlFor={field.name}>Full Name</Label>
              <div className="relative">
                <User className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
                <Input
                  className="h-11 pl-10"
                  disabled={isPending}
                  id={field.name}
                  onBlur={field.handleBlur}
                  onChange={(e) => {
                    field.handleChange(e.target.value);
                  }}
                  placeholder="Enter your full name"
                  type="text"
                  value={field.state.value}
                />
              </div>
              <FieldInfo field={field} />
            </>
          )}
        </form.Field>
      </div>

      <div className="space-y-2">
        <form.Field name="email">
          {(field) => (
            <>
              <Label htmlFor={field.name}>Email</Label>
              <div className="relative">
                <Mail className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
                <Input
                  className="h-11 pl-10"
                  disabled={isPending}
                  id={field.name}
                  onBlur={field.handleBlur}
                  onChange={(e) => {
                    field.handleChange(e.target.value);
                  }}
                  placeholder="Enter your email"
                  type="email"
                  value={field.state.value}
                />
              </div>
              <FieldInfo field={field} />
            </>
          )}
        </form.Field>
      </div>

      <div className="space-y-2">
        <form.Field name="password">
          {(field) => (
            <>
              <Label htmlFor={field.name}>Password</Label>
              <PasswordInput
                disabled={isPending}
                id={field.name}
                onBlur={field.handleBlur}
                onChange={(e) => {
                  field.handleChange(e.target.value);
                }}
                value={field.state.value}
              />
              <FieldInfo field={field} />
            </>
          )}
        </form.Field>
      </div>

      <Button className="h-11 w-full font-medium text-base" type="submit">
        {isPending ? (
          <Loader className="size-6 animate-spin" />
        ) : (
          'Create account'
        )}
      </Button>
    </form>
  );
}
