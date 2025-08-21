import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { SignUpForm } from '@/features/signup/components/signup-form';

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="space-y-2 text-center">
          <h1 className="font-bold text-3xl tracking-tight">Create account</h1>
          <p className="text-muted-foreground">
            Join us today and start your shopping journey
          </p>
        </div>

        {/* Sign Up Form */}
        <Card className="border-0 bg-card/95 shadow-lg backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-center text-xl">Sign up</CardTitle>
            <CardDescription className="text-center">
              Create your account to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SignUpForm />
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center">
          <p className="text-muted-foreground text-sm">
            Already have an account?{' '}
            <Button
              asChild
              className="h-auto p-0 font-normal text-sm"
              variant="link"
            >
              <a href="/auth/signin">Sign in</a>
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
}
