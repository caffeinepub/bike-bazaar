import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, Mail } from 'lucide-react';
import { SiInstagram, SiWhatsapp } from 'react-icons/si';
import { useGetFounderProfile } from '../hooks/useQueries';
import { Skeleton } from '@/components/ui/skeleton';

export default function AboutUs() {
  const { data: founderProfile, isLoading } = useGetFounderProfile();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-12 w-64 mb-8" />
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-48" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-3/4" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const profile = founderProfile || {
    name: 'Anuj Saha',
    address: 'Bijapur, Chhattisgarh',
    contactNumber: '7828226397',
    emailAddress: 'rohitmarpalli@gmail.com',
    instagramProfile: 'https://www.instagram.com/annujj_03_?igsh=MXdocnV1bjF0bDR6bQ==',
  };

  const whatsappLink = `https://wa.me/91${profile.contactNumber}`;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-display font-bold mb-2 text-primary">About Us</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Welcome to 2nd Bike Bajar Bijapur - Your trusted marketplace for quality second-hand bikes.
        </p>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">Meet the Founder</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-4">{profile.name}</h3>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="text-muted-foreground">{profile.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Contact Number</p>
                    <p className="text-muted-foreground">{profile.contactNumber}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-muted-foreground">{profile.emailAddress}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <h4 className="font-semibold mb-3">Connect with us</h4>
              <div className="flex gap-3">
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="gap-2"
                >
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <SiWhatsapp className="h-5 w-5" />
                    WhatsApp
                  </a>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="gap-2"
                >
                  <a
                    href={profile.instagramProfile}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <SiInstagram className="h-5 w-5" />
                    Instagram
                  </a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Our Mission</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              At 2nd Bike Bajar Bijapur, we're committed to making quality second-hand bikes accessible 
              to everyone in Bijapur and surrounding areas. We believe in transparency, trust, and 
              providing excellent service to both buyers and sellers. Whether you're looking to buy 
              your first bike or sell one you no longer need, we're here to help make the process 
              smooth and reliable.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
