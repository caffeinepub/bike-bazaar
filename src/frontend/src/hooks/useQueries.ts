import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { BikeListing, Message, Condition, FounderProfile } from '../backend';
import { Principal } from '@dfinity/principal';

export function useGetAvailableListings() {
  const { actor, isFetching } = useActor();

  return useQuery<BikeListing[]>({
    queryKey: ['availableListings'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAvailableListings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllListings() {
  const { actor, isFetching } = useActor();

  return useQuery<BikeListing[]>({
    queryKey: ['allListings'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllListings();
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
      queryClient.invalidateQueries({ queryKey: ['availableListings'] });
      queryClient.invalidateQueries({ queryKey: ['allListings'] });
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
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['availableListings'] });
      queryClient.invalidateQueries({ queryKey: ['allListings'] });
      queryClient.invalidateQueries({ queryKey: ['myListings'] });
      queryClient.invalidateQueries({ queryKey: ['listing', variables.id] });
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
      queryClient.invalidateQueries({ queryKey: ['availableListings'] });
      queryClient.invalidateQueries({ queryKey: ['allListings'] });
      queryClient.invalidateQueries({ queryKey: ['myListings'] });
    },
  });
}

export function useGetMessages(listingId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Message[]>({
    queryKey: ['messages', listingId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMessagesForListing(listingId);
    },
    enabled: !!actor && !isFetching && !!listingId,
    refetchInterval: 5000,
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

export function useGetFounderProfile() {
  const { actor, isFetching } = useActor();

  return useQuery<FounderProfile | null>({
    queryKey: ['founderProfile'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getFounderProfile();
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
