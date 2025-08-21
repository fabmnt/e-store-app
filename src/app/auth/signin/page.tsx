import { ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { SignInForm } from '@/features/signin/components/signin-form';

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="space-y-2 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <ShoppingBag className="h-6 w-6 text-primary" />
          </div>
          <h1 className="font-bold text-3xl tracking-tight">Welcome back</h1>
          <p className="text-muted-foreground">
            Sign in to your account to continue shopping
          </p>
        </div>

        {/* Sign In Form */}
        <Card className="border-0 bg-card/95 shadow-lg backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-center text-xl">Sign in</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SignInForm />
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center">
          <p className="text-muted-foreground text-sm">
            Don't have an account?{' '}
            <Button className="h-auto p-0 font-normal text-sm" variant="link">
              Sign up
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
}
