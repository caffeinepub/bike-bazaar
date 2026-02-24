import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { SiFacebook, SiX, SiInstagram, SiTelegram, SiWhatsapp } from 'react-icons/si';
import { Link2, Check } from 'lucide-react';
import { toast } from 'sonner';
import {
  getWhatsAppShareUrl,
  getFacebookShareUrl,
  getTwitterShareUrl,
  getTelegramShareUrl,
  copyToClipboard,
  getListingUrl,
  type ShareData
} from '../utils/shareHelpers';

interface ShareButtonsProps {
  listing: ShareData;
  variant?: 'compact' | 'full';
}

export default function ShareButtons({ listing, variant = 'compact' }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer,width=600,height=600');
  };

  const handleCopyLink = async () => {
    const url = getListingUrl(listing.id);
    const success = await copyToClipboard(url);
    
    if (success) {
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } else {
      toast.error('Failed to copy link');
    }
  };

  const shareButtons = [
    {
      name: 'WhatsApp',
      icon: SiWhatsapp,
      color: 'hover:text-[#25D366]',
      onClick: () => handleShare(getWhatsAppShareUrl(listing))
    },
    {
      name: 'Facebook',
      icon: SiFacebook,
      color: 'hover:text-[#1877F2]',
      onClick: () => handleShare(getFacebookShareUrl(listing))
    },
    {
      name: 'Twitter',
      icon: SiX,
      color: 'hover:text-foreground',
      onClick: () => handleShare(getTwitterShareUrl(listing))
    },
    {
      name: 'Telegram',
      icon: SiTelegram,
      color: 'hover:text-[#0088cc]',
      onClick: () => handleShare(getTelegramShareUrl(listing))
    },
    {
      name: 'Copy Link',
      icon: copied ? Check : Link2,
      color: copied ? 'text-green-600' : 'hover:text-primary',
      onClick: handleCopyLink
    }
  ];

  if (variant === 'compact') {
    return (
      <TooltipProvider>
        <div className="flex items-center gap-1">
          {shareButtons.map((button) => (
            <Tooltip key={button.name}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-8 w-8 ${button.color} transition-colors`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    button.onClick();
                  }}
                >
                  <button.icon className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{button.name}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </TooltipProvider>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {shareButtons.map((button) => (
        <Button
          key={button.name}
          variant="outline"
          size="sm"
          className={`gap-2 ${button.color} transition-colors`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            button.onClick();
          }}
        >
          <button.icon className="h-4 w-4" />
          {button.name}
        </Button>
      ))}
    </div>
  );
}
