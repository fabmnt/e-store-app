'use client';

import { onError, onSuccess } from '@orpc/client';
import { useServerAction } from '@orpc/react/hooks';
import { useForm } from '@tanstack/react-form';
import { Loader, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { FieldInfo } from '@/components/field-info';
import { PasswordInput } from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { signInSchema } from '@/features/signin/schemas/signin-schema';
import { signIn } from '@/orpc/auth';

export function SignInForm() {
  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    validators: {
      onSubmit: signInSchema,
    },
    onSubmit: async ({ value }) => {
      await execute(value);
    },
  });

  const { execute, isPending } = useServerAction(signIn, {
    interceptors: [
      onError((e) => {
        toast.error(e.message);
      }),
      onSuccess(() => {
        form.reset();
        toast.success('Signed in successfully');
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
        <form.Field name="email">
          {(field) => (
            <>
              <Label htmlFor={field.name}>Email</Label>
              <div className="relative">
                <Mail className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
                <Input
                  className="h-11 pl-10"
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
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Checkbox
            className="h-4 w-4 rounded border-muted-foreground"
            id="remember-me"
          />
          <Label htmlFor="remember-me">Remember me</Label>
        </div>
        <Button
          className="h-auto p-0 font-normal text-sm"
          type="button"
          variant="link"
        >
          Forgot password?
        </Button>
      </div>

      <Button className="h-11 w-full font-medium text-base" type="submit">
        {isPending ? <Loader className="size-6 animate-spin" /> : 'Sign in'}
      </Button>
    </form>
  );
}
