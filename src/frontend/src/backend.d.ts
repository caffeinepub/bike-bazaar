import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface FounderProfile {
    instagramProfile: string;
    name: string;
    address: string;
    contactNumber: string;
    emailAddress: string;
}
export interface Message {
    id: string;
    content: string;
    listingId: string;
    sender: Principal;
    timestamp: bigint;
    receiver: Principal;
}
export interface BikeListing {
    id: string;
    model: string;
    title: string;
    contactInfo: string;
    mileage?: bigint;
    year: bigint;
    description: string;
    seller: Principal;
    listingDate: bigint;
    available: boolean;
    brand: string;
    price: bigint;
    condition: Condition;
}
export interface UserProfile {
    contactInfo: string;
    name: string;
}
export enum Condition {
    fair = "fair",
    good = "good",
    excellent = "excellent"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createListing(title: string, brand: string, model: string, year: bigint, price: bigint, mileage: bigint | null, condition: Condition, description: string, contactInfo: string): Promise<string>;
    deleteListing(id: string): Promise<void>;
    getAllListings(): Promise<Array<BikeListing>>;
    getAvailableListings(): Promise<Array<BikeListing>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getFounderProfile(): Promise<FounderProfile | null>;
    getListing(id: string): Promise<BikeListing>;
    getMessagesForListing(listingId: string): Promise<Array<Message>>;
    getMyListings(): Promise<Array<BikeListing>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    initializeFounder(): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    isFounder(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    searchListingsByBrand(brand: string): Promise<Array<BikeListing>>;
    searchListingsByPriceRange(minPrice: bigint, maxPrice: bigint): Promise<Array<BikeListing>>;
    sendMessage(receiver: Principal, content: string, listingId: string): Promise<void>;
    updateFounderProfile(profile: FounderProfile): Promise<void>;
    updateListing(id: string, title: string, brand: string, model: string, year: bigint, price: bigint, mileage: bigint | null, condition: Condition, description: string, contactInfo: string, available: boolean): Promise<void>;
}
