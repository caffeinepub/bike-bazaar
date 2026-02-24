import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Shield, Loader2 } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';

export default function AdminLoginSection() {
  const { login, loginStatus, identity } = useInternetIdentity();
  const navigate = useNavigate();
  const isLoggingIn = loginStatus === 'logging-in';

  useEffect(() => {
    if (identity) {
      navigate({ to: '/admin' });
    }
  }, [identity, navigate]);

  const handleLogin = async () => {
    try {
      await login();
    } catch (error) {
      console.error('Admin login error:', error);
    }
  };

  return (
    <section className="py-16 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="border-2 border-primary/20 shadow-xl">
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                <Shield className="h-10 w-10 text-primary" />
              </div>
              <CardTitle className="text-3xl font-display">Admin Access</CardTitle>
              <CardDescription className="text-base">
                Secure administrator login for marketplace management
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="relative">
                <img
                  src="/assets/generated/admin-dashboard-hero.dim_800x400.png"
                  alt="Admin Dashboard"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-lg flex items-end p-6">
                  <p className="text-white font-semibold text-lg">
                    Manage users, listings, and platform settings
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-muted/50 rounded-lg p-6 space-y-3">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    Internet Identity Authentication
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Secure login using Internet Identity with support for passkeys, Google, Apple, and Microsoft accounts.
                  </p>
                  <Button
                    onClick={handleLogin}
                    disabled={isLoggingIn}
                    size="lg"
                    className="w-full"
                  >
                    {isLoggingIn ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin mr-2" />
                        Authenticating...
                      </>
                    ) : (
                      <>
                        <Shield className="h-5 w-5 mr-2" />
                        Login as Admin
                      </>
                    )}
                  </Button>
                </div>

                <div className="text-center text-sm text-muted-foreground">
                  <p>Only authorized administrators can access the admin panel</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
