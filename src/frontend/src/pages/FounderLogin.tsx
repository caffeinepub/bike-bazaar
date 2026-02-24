import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useIsFounder } from '../hooks/useQueries';
import { useActor } from '../hooks/useActor';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Store, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function FounderLogin() {
  const navigate = useNavigate();
  const { login, identity, loginStatus } = useInternetIdentity();
  const { data: isFounder, isLoading: isCheckingFounder } = useIsFounder();
  const { actor } = useActor();
  const queryClient = useQueryClient();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState<'credentials' | 'authenticate'>('credentials');
  const [error, setError] = useState('');

  const isAuthenticated = !!identity;
  const validEmail = 'rohitmarpalli@gmail.com';
  const validPassword = '83050@Mr';

  const initializeFounder = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.initializeFounder();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['isFounder'] });
    },
  });

  useEffect(() => {
    if (isAuthenticated && step === 'authenticate' && !isCheckingFounder) {
      if (!isFounder) {
        initializeFounder.mutate(undefined, {
          onSuccess: () => {
            toast.success('Welcome, Founder! Redirecting to Admin Panel...');
            setTimeout(() => navigate({ to: '/admin' }), 1000);
          },
          onError: (error) => {
            toast.error('Failed to initialize founder: ' + error.message);
            setStep('credentials');
          },
        });
      } else {
        toast.success('Welcome back, Founder!');
        navigate({ to: '/admin' });
      }
    }
  }, [isAuthenticated, step, isFounder, isCheckingFounder, initializeFounder, navigate]);

  const handleCredentialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      setError('Please enter both email and password');
      return;
    }

    if (trimmedEmail !== validEmail || trimmedPassword !== validPassword) {
      setError('Invalid founder credentials');
      toast.error('Invalid email or password');
      return;
    }

    setStep('authenticate');
  };

  const handleAuthenticate = async () => {
    try {
      await login();
    } catch (error: any) {
      console.error('Authentication error:', error);
      toast.error('Authentication failed: ' + error.message);
      setStep('credentials');
      setError('Authentication failed. Please try again.');
    }
  };

  if (isAuthenticated && (isCheckingFounder || initializeFounder.isPending)) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <Card>
            <CardContent className="pt-6 flex flex-col items-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">Verifying founder status...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (step === 'authenticate' && !isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                <Store className="h-8 w-8 text-accent" />
              </div>
              <CardTitle>Founder Authentication</CardTitle>
              <CardDescription>
                Please authenticate with Internet Identity
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertDescription>
                  Credentials verified. Click below to authenticate with Internet Identity.
                </AlertDescription>
              </Alert>
              <Button
                onClick={handleAuthenticate}
                disabled={loginStatus === 'logging-in'}
                className="w-full"
                size="lg"
              >
                {loginStatus === 'logging-in' ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  <>
                    <Store className="mr-2 h-4 w-4" />
                    Authenticate with Internet Identity
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setStep('credentials');
                  setEmail('');
                  setPassword('');
                }}
                className="w-full"
              >
                Back
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-4">
              <Store className="h-8 w-8 text-accent" />
            </div>
            <CardTitle>Founder Login</CardTitle>
            <CardDescription>
              Enter your founder credentials to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCredentialSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter founder email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Enter rohitmarpalli@gmail.com
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter founder password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Enter 83050@Mr
                </p>
              </div>

              <Button type="submit" className="w-full" size="lg">
                <Store className="mr-2 h-4 w-4" />
                Continue
              </Button>

              <div className="text-center">
                <Button
                  type="button"
                  variant="link"
                  onClick={() => navigate({ to: '/' })}
                  className="text-sm"
                >
                  Back to Home
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
