import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { UserPlus, Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export default function BuyerRegistrationSection() {
  const { login, loginStatus } = useInternetIdentity();
  const isLoggingIn = loginStatus === 'logging-in';

  const handleBuyerRegistration = async () => {
    try {
      await login();
      toast.success('Authentication successful! Please complete your buyer profile.');
    } catch (error: any) {
      console.error('Buyer registration error:', error);
      toast.error('Registration failed: ' + error.message);
    }
  };

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="border-2 border-secondary/20 shadow-xl">
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto w-20 h-20 rounded-full bg-secondary/10 flex items-center justify-center">
                <UserPlus className="h-10 w-10 text-secondary" />
              </div>
              <CardTitle className="text-3xl font-display">Register as Buyer</CardTitle>
              <CardDescription className="text-base">
                Browse bikes, contact sellers, and find your perfect ride
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    Buyer Benefits
                  </h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Browse all available bikes in the marketplace</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Contact sellers directly via messaging</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Save your favorite listings</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Get notifications on new listings</span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    Quick Registration
                  </h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Authenticate with Internet Identity</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Support for passkeys, Google, Apple, Microsoft</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Complete your profile with basic details</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Start browsing immediately</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-muted/50 rounded-lg p-6 space-y-4">
                <p className="text-sm text-muted-foreground text-center">
                  Secure authentication using Internet Identity with support for multiple login methods
                </p>
                <Button
                  onClick={handleBuyerRegistration}
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
                      <UserPlus className="h-5 w-5 mr-2" />
                      Register as Buyer
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
