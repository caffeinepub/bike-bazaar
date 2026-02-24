import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { BuyerProfile, ExternalBlob } from '../backend';

export function useGetMyBuyerProfile() {
  const { actor, isFetching } = useActor();

  return useQuery<BuyerProfile | null>({
    queryKey: ['myBuyerProfile'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getMyBuyerProfile();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsBuyerProfileComplete() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isBuyerProfileComplete'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isBuyerProfileComplete();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateBuyerProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      fullName: string;
      phoneNumber: string;
      email: string;
      address: string;
      aadhaarNumber: string;
      panNumber: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createBuyerProfile(
        data.fullName,
        data.phoneNumber,
        data.email,
        data.address,
        data.aadhaarNumber,
        data.panNumber
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myBuyerProfile'] });
      queryClient.invalidateQueries({ queryKey: ['isBuyerProfileComplete'] });
    },
  });
}

export function useUploadProfilePhoto() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (blob: ExternalBlob) => {
      if (!actor) throw new Error('Actor not available');
      return actor.uploadProfilePhoto(blob);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myBuyerProfile'] });
    },
  });
}

export function useUploadAadhaarDocument() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (blob: ExternalBlob) => {
      if (!actor) throw new Error('Actor not available');
      return actor.uploadAadhaarDocument(blob);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myBuyerProfile'] });
    },
  });
}

export function useUploadPanDocument() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (blob: ExternalBlob) => {
      if (!actor) throw new Error('Actor not available');
      return actor.uploadPanDocument(blob);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myBuyerProfile'] });
    },
  });
}

export function useCompleteBuyerProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.completeBuyerProfile();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myBuyerProfile'] });
      queryClient.invalidateQueries({ queryKey: ['isBuyerProfileComplete'] });
    },
  });
}

export function useGetAllBuyerProfiles() {
  const { actor, isFetching } = useActor();

  return useQuery<BuyerProfile[]>({
    queryKey: ['allBuyerProfiles'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllBuyerProfiles();
    },
    enabled: !!actor && !isFetching,
  });
}
