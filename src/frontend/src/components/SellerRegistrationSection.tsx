import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Store, Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import SellerProfileForm from './SellerProfileForm';

export default function SellerRegistrationSection() {
  const { login, loginStatus, identity } = useInternetIdentity();
  const [showSellerForm, setShowSellerForm] = useState(false);
  const isLoggingIn = loginStatus === 'logging-in';
  const isAuthenticated = !!identity;

  const handleSellerRegistration = async () => {
    if (!isAuthenticated) {
      try {
        await login();
        toast.success('Authentication successful! Please complete your seller profile.');
        setShowSellerForm(true);
      } catch (error: any) {
        console.error('Seller registration error:', error);
        toast.error('Registration failed: ' + error.message);
      }
    } else {
      setShowSellerForm(true);
    }
  };

  return (
    <>
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="border-2 border-accent/20 shadow-xl">
              <CardHeader className="text-center space-y-4">
                <div className="mx-auto w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center">
                  <Store className="h-10 w-10 text-accent" />
                </div>
                <CardTitle className="text-3xl font-display">Register as Seller</CardTitle>
                <CardDescription className="text-base">
                  List your bikes, manage inventory, and reach thousands of buyers
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                      Seller Benefits
                    </h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="text-accent">•</span>
                        <span>List unlimited bikes for sale</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-accent">•</span>
                        <span>Manage your inventory easily</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-accent">•</span>
                        <span>Reach thousands of potential buyers</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-accent">•</span>
                        <span>Direct communication with buyers</span>
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                      Registration Process
                    </h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="text-accent">•</span>
                        <span>Authenticate with Internet Identity</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-accent">•</span>
                        <span>Provide shop name and business details</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-accent">•</span>
                        <span>Verify your seller account</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-accent">•</span>
                        <span>Start listing bikes immediately</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="bg-muted/50 rounded-lg p-6 space-y-4">
                  <p className="text-sm text-muted-foreground text-center">
                    Secure authentication using Internet Identity with support for multiple login methods
                  </p>
                  <Button
                    onClick={handleSellerRegistration}
                    disabled={isLoggingIn}
                    size="lg"
                    variant="outline"
                    className="w-full border-accent text-accent hover:bg-accent hover:text-accent-foreground"
                  >
                    {isLoggingIn ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin mr-2" />
                        Authenticating...
                      </>
                    ) : (
                      <>
                        <Store className="h-5 w-5 mr-2" />
                        Register as Seller
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Seller Profile Form Dialog */}
      <Dialog open={showSellerForm} onOpenChange={(open) => !open && setShowSellerForm(false)}>
        <DialogContent className="sm:max-w-2xl" onInteractOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>Complete Your Seller Profile</DialogTitle>
            <DialogDescription>
              Please provide your shop information to complete seller registration.
            </DialogDescription>
          </DialogHeader>
          <SellerProfileForm onSuccess={() => setShowSellerForm(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
}
