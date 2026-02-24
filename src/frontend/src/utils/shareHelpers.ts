// Utility functions for generating platform-specific share URLs and messages

export interface ShareData {
  id: string;
  title: string;
  brand: string;
  model: string;
  price: bigint;
}

export function getListingUrl(listingId: string): string {
  const baseUrl = window.location.origin;
  return `${baseUrl}/listings/${listingId}`;
}

export function formatShareMessage(data: ShareData): string {
  const price = Number(data.price).toLocaleString();
  return `Check out this ${data.brand} ${data.model} - ${data.title}\nPrice: ₹${price}\n`;
}

export function getWhatsAppShareUrl(data: ShareData): string {
  const message = formatShareMessage(data);
  const url = getListingUrl(data.id);
  const text = encodeURIComponent(`${message}${url}`);
  return `https://wa.me/?text=${text}`;
}

export function getFacebookShareUrl(data: ShareData): string {
  const url = getListingUrl(data.id);
  return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
}

export function getTwitterShareUrl(data: ShareData): string {
  const message = formatShareMessage(data);
  const url = getListingUrl(data.id);
  const text = encodeURIComponent(message);
  return `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(url)}&hashtags=BikeBazaar,SecondHandBike`;
}

export function getTelegramShareUrl(data: ShareData): string {
  const message = formatShareMessage(data);
  const url = getListingUrl(data.id);
  const text = encodeURIComponent(`${message}${url}`);
  return `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${text}`;
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy to clipboard:', err);
    return false;
  }
}

// Profile share utilities
export type UserRole = 'admin' | 'founder' | 'buyer' | 'seller';

export interface ProfileShareLinks {
  main: string;
  shop?: string;
}

export function generateProfileShareLink(role: UserRole, shopId?: string): ProfileShareLinks {
  const baseUrl = window.location.origin;
  
  switch (role) {
    case 'seller':
      return {
        main: baseUrl,
        shop: shopId ? `${baseUrl}/shop/${shopId}` : baseUrl
      };
    case 'buyer':
      return {
        main: baseUrl
      };
    case 'admin':
      return {
        main: `${baseUrl}/admin-login`
      };
    case 'founder':
      return {
        main: `${baseUrl}/founder-login`
      };
    default:
      return {
        main: baseUrl
      };
  }
}

export async function copyProfileLinkToClipboard(link: string): Promise<boolean> {
  return copyToClipboard(link);
}

export function getProfileShareWhatsAppUrl(link: string, message: string): string {
  const text = encodeURIComponent(`${message}\n${link}`);
  return `https://wa.me/?text=${text}`;
}

export function getProfileShareFacebookUrl(link: string): string {
  return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}`;
}

export function getProfileShareTwitterUrl(link: string, message: string): string {
  const text = encodeURIComponent(message);
  return `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(link)}&hashtags=BikeBazaar`;
}

export function getProfileShareTelegramUrl(link: string, message: string): string {
  const text = encodeURIComponent(message);
  return `https://t.me/share/url?url=${encodeURIComponent(link)}&text=${text}`;
}
