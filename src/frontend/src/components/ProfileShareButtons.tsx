import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { SiFacebook, SiX, SiWhatsapp } from 'react-icons/si';
import { Send } from 'lucide-react';
import { toast } from 'sonner';
import {
  generateProfileShareLink,
  copyProfileLinkToClipboard,
  getProfileShareWhatsAppUrl,
  getProfileShareFacebookUrl,
  getProfileShareTwitterUrl,
  getProfileShareTelegramUrl,
  type UserRole,
  type ProfileShareLinks
} from '../utils/shareHelpers';

interface ProfileShareButtonsProps {
  userRole: UserRole;
  shopId?: string;
}

export default function ProfileShareButtons({ userRole, shopId }: ProfileShareButtonsProps) {
  const [copiedMain, setCopiedMain] = useState(false);
  const [copiedShop, setCopiedShop] = useState(false);

  const links: ProfileShareLinks = generateProfileShareLink(userRole, shopId);

  const handleCopyLink = async (link: string, type: 'main' | 'shop') => {
    const success = await copyProfileLinkToClipboard(link);
    if (success) {
      if (type === 'main') {
        setCopiedMain(true);
        setTimeout(() => setCopiedMain(false), 2000);
      } else {
        setCopiedShop(true);
        setTimeout(() => setCopiedShop(false), 2000);
      }
      toast.success('Link copied to clipboard!');
    } else {
      toast.error('Failed to copy link');
    }
  };

  const getShareMessage = (type: 'main' | 'shop') => {
    if (userRole === 'seller' && type === 'shop') {
      return 'Check out my shop on 2nd Bike Bajar Bijapur!';
    }
    return 'Join me on 2nd Bike Bajar Bijapur - Your trusted marketplace for second-hand bikes!';
  };

  const renderShareButtons = (link: string, label: string, type: 'main' | 'shop') => {
    const message = getShareMessage(type);
    const isCopied = type === 'main' ? copiedMain : copiedShop;

    return (
      <div className="space-y-3">
        {label && <h4 className="text-sm font-semibold text-muted-foreground">{label}</h4>}
        
        {/* Copy Link Button */}
        <Button
          variant="outline"
          className="w-full justify-start gap-2"
          onClick={() => handleCopyLink(link, type)}
        >
          {isCopied ? (
            <>
              <Check className="h-4 w-4 text-green-600" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              <span>Copy Link</span>
            </>
          )}
        </Button>

        {/* Social Media Share Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => window.open(getProfileShareWhatsAppUrl(link, message), '_blank')}
          >
            <SiWhatsapp className="h-4 w-4 text-green-600" />
            <span>WhatsApp</span>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => window.open(getProfileShareFacebookUrl(link), '_blank')}
          >
            <SiFacebook className="h-4 w-4 text-blue-600" />
            <span>Facebook</span>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => window.open(getProfileShareTwitterUrl(link, message), '_blank')}
          >
            <SiX className="h-4 w-4" />
            <span>Twitter</span>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => window.open(getProfileShareTelegramUrl(link, message), '_blank')}
          >
            <Send className="h-4 w-4 text-blue-500" />
            <span>Telegram</span>
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Main Link */}
      {renderShareButtons(links.main, userRole === 'seller' ? 'Website Link' : '', 'main')}

      {/* Shop Link (only for sellers) */}
      {userRole === 'seller' && links.shop && (
        <div className="pt-4 border-t">
          {renderShareButtons(links.shop, 'Shop Link', 'shop')}
        </div>
      )}
    </div>
  );
}
