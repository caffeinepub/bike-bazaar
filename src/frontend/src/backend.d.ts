import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface FounderProfile {
    instagramProfile: string;
    name: string;
    address: string;
    contactNumber: string;
    emailAddress: string;
}
export interface BuyerProfile {
    aadhaarDocument?: ExternalBlob;
    createdAt: bigint;
    profilePhoto?: ExternalBlob;
    panDocument?: ExternalBlob;
    fullName: string;
    isProfileComplete: boolean;
    email: string;
    address: string;
    panNumber: string;
    aadhaarNumber: string;
    phoneNumber: string;
}
export interface UsageStat {
    visitors: bigint;
    listings: bigint;
    timestamp: bigint;
    users: bigint;
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
export interface WebsiteContent {
    heroSection: string;
    aboutPage: string;
    footerInfo: string;
}
export interface UserProfile {
    contactInfo: string;
    name: string;
}
export interface AnalyticsData {
    activeListings: bigint;
    totalVisitors: bigint;
    usageStats: Array<UsageStat>;
    registeredUsers: bigint;
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
    addUsageStat(stat: UsageStat): Promise<void>;
    adminLogin(email: string, password: string): Promise<boolean>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    completeBuyerProfile(): Promise<void>;
    createBuyerProfile(fullName: string, phoneNumber: string, email: string, address: string, aadhaarNumber: string, panNumber: string): Promise<void>;
    createListing(title: string, brand: string, model: string, year: bigint, price: bigint, mileage: bigint | null, condition: Condition, description: string, contactInfo: string): Promise<string>;
    deleteListing(id: string): Promise<void>;
    getAllBuyerProfiles(): Promise<Array<BuyerProfile>>;
    getAllListings(): Promise<Array<BikeListing>>;
    getAnalyticsData(): Promise<AnalyticsData>;
    getAvailableListings(): Promise<Array<BikeListing>>;
    getBuyerProfile(user: Principal): Promise<BuyerProfile | null>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getFounderProfile(): Promise<FounderProfile | null>;
    getListing(id: string): Promise<BikeListing>;
    getMessagesForListing(listingId: string): Promise<Array<Message>>;
    getMyBuyerProfile(): Promise<BuyerProfile | null>;
    getMyListings(): Promise<Array<BikeListing>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getWebsiteContent(): Promise<WebsiteContent>;
    initializeFounder(): Promise<void>;
    isBuyerProfileComplete(): Promise<boolean>;
    isCallerAdmin(): Promise<boolean>;
    isFounder(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    searchListingsByBrand(brand: string): Promise<Array<BikeListing>>;
    searchListingsByPriceRange(minPrice: bigint, maxPrice: bigint): Promise<Array<BikeListing>>;
    sendMessage(receiver: Principal, content: string, listingId: string): Promise<void>;
    updateFounderProfile(profile: FounderProfile): Promise<void>;
    updateListing(id: string, title: string, brand: string, model: string, year: bigint, price: bigint, mileage: bigint | null, condition: Condition, description: string, contactInfo: string, available: boolean): Promise<void>;
    updateWebsiteContent(content: WebsiteContent): Promise<void>;
    uploadAadhaarDocument(blob: ExternalBlob): Promise<void>;
    uploadPanDocument(blob: ExternalBlob): Promise<void>;
    uploadProfilePhoto(blob: ExternalBlob): Promise<void>;
}
