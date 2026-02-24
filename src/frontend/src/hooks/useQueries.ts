import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { BikeListing, Message, Condition, FounderProfile, BuyerProfile, UserRole, UserProfile, WebsiteContent, AnalyticsData } from '../backend';
import { Principal } from '@icp-sdk/core/principal';

export function useGetAllListings() {
  const { actor, isFetching } = useActor();

  return useQuery<BikeListing[]>({
    queryKey: ['listings'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllListings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAvailableListings() {
  const { actor, isFetching } = useActor();

  return useQuery<BikeListing[]>({
    queryKey: ['listings', 'available'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAvailableListings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetListing(id: string) {
  const { actor, isFetching } = useActor();

  return useQuery<BikeListing>({
    queryKey: ['listing', id],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getListing(id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useGetMyListings() {
  const { actor, isFetching } = useActor();

  return useQuery<BikeListing[]>({
    queryKey: ['myListings'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyListings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateListing() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      title: string;
      brand: string;
      model: string;
      year: bigint;
      price: bigint;
      mileage: bigint | null;
      condition: Condition;
      description: string;
      contactInfo: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createListing(
        data.title,
        data.brand,
        data.model,
        data.year,
        data.price,
        data.mileage,
        data.condition,
        data.description,
        data.contactInfo
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listings'] });
      queryClient.invalidateQueries({ queryKey: ['myListings'] });
    },
  });
}

export function useUpdateListing() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      id: string;
      title: string;
      brand: string;
      model: string;
      year: bigint;
      price: bigint;
      mileage: bigint | null;
      condition: Condition;
      description: string;
      contactInfo: string;
      available: boolean;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateListing(
        data.id,
        data.title,
        data.brand,
        data.model,
        data.year,
        data.price,
        data.mileage,
        data.condition,
        data.description,
        data.contactInfo,
        data.available
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listings'] });
      queryClient.invalidateQueries({ queryKey: ['myListings'] });
    },
  });
}

export function useDeleteListing() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteListing(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listings'] });
      queryClient.invalidateQueries({ queryKey: ['myListings'] });
    },
  });
}

export function useGetMessagesForListing(listingId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Message[]>({
    queryKey: ['messages', listingId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMessagesForListing(listingId);
    },
    enabled: !!actor && !isFetching && !!listingId,
  });
}

export function useSendMessage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      receiver: Principal;
      content: string;
      listingId: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.sendMessage(data.receiver, data.content, data.listingId);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['messages', variables.listingId] });
    },
  });
}

export function useIsFounder() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isFounder'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isFounder();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateFounderProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: FounderProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateFounderProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['founderProfile'] });
    },
  });
}

export function useGetCallerUserRole() {
  const { actor, isFetching } = useActor();

  return useQuery<UserRole>({
    queryKey: ['callerUserRole'],
    queryFn: async () => {
      if (!actor) return 'guest' as UserRole;
      return actor.getCallerUserRole();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAdminDashboardMetrics() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['adminMetrics'],
    queryFn: async () => {
      if (!actor) return null;
      
      const [listings, users] = await Promise.all([
        actor.getAllListings(),
        actor.getAllBuyerProfiles(),
      ]);

      const totalListings = listings.length;
      const activeListings = listings.filter(l => l.available).length;
      const soldListings = totalListings - activeListings;
      const totalUsers = users.length;
      const activeBuyers = users.filter(u => u.isProfileComplete).length;

      return {
        totalListings,
        activeListings,
        soldListings,
        totalUsers,
        activeBuyers,
        recentActivityCount: Math.min(listings.length, 10),
      };
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}

export function useRecentActivity() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['recentActivity'],
    queryFn: async () => {
      if (!actor) return [];
      
      const listings = await actor.getAllListings();
      
      const activities = listings.slice(0, 10).map(listing => ({
        type: listing.available ? 'Listing' : 'Sale',
        description: `${listing.available ? 'New listing' : 'Sold'}: ${listing.title}`,
        timestamp: listing.listingDate,
      }));

      return activities;
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 30000,
  });
}

export function useGetWebsiteContent() {
  const { actor, isFetching } = useActor();

  return useQuery<WebsiteContent>({
    queryKey: ['websiteContent'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getWebsiteContent();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateWebsiteContent() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (content: WebsiteContent) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateWebsiteContent(content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['websiteContent'] });
    },
  });
}

export function useGetAnalyticsData() {
  const { actor, isFetching } = useActor();

  return useQuery<AnalyticsData>({
    queryKey: ['analyticsData'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAnalyticsData();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 30000,
    staleTime: 30000,
  });
}
