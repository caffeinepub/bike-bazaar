import { useParams, useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetListing, useGetMessagesForListing, useSendMessage } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MessageThread from '../components/MessageThread';
import MessageInput from '../components/MessageInput';

export default function Messages() {
  const { listingId } = useParams({ from: '/messages/$listingId' });
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const { data: listing, isLoading: listingLoading } = useGetListing(listingId);
  const { data: messages, isLoading: messagesLoading } = useGetMessagesForListing(listingId);
  const { mutate: sendMessage, isPending: isSending } = useSendMessage();

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please log in to view messages.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (listingLoading || messagesLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Skeleton className="h-8 w-32 mb-6" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Listing not found.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const handleSendMessage = (content: string) => {
    sendMessage(
      {
        receiver: listing.seller,
        content,
        listingId
      },
      {
        onError: (error) => {
          console.error('Failed to send message:', error);
        }
      }
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Button
        variant="ghost"
        className="mb-6 gap-2"
        onClick={() => navigate({ to: '/bike/$id', params: { id: listingId } })}
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Listing
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Listing Info */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">About This Bike</CardTitle>
          </CardHeader>
          <CardContent>
            <img
              src="/assets/generated/bike-placeholder.dim_400x300.png"
              alt={listing.title}
              className="w-full h-32 object-cover rounded-md mb-3"
            />
            <h3 className="font-semibold mb-1 line-clamp-2">{listing.title}</h3>
            <p className="text-sm text-muted-foreground mb-2">
              {listing.brand} {listing.model}
            </p>
            <p className="text-xl font-bold text-primary">
              ₹{Number(listing.price).toLocaleString()}
            </p>
          </CardContent>
        </Card>

        {/* Messages */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Messages</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <MessageThread messages={messages || []} currentUserId={identity.getPrincipal().toString()} />
            <MessageInput onSend={handleSendMessage} disabled={isSending} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
