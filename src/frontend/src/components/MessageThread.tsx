import { useEffect, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Message } from '../backend';
import { useGetCallerUserProfile } from '../hooks/useGetCallerUserProfile';

interface MessageThreadProps {
  messages: Message[];
  currentUserId: string;
}

export default function MessageThread({ messages, currentUserId }: MessageThreadProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { data: userProfile } = useGetCallerUserProfile();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No messages yet. Start the conversation!
      </div>
    );
  }

  return (
    <ScrollArea className="h-96 pr-4" ref={scrollRef}>
      <div className="space-y-4">
        {messages.map((message) => {
          const isCurrentUser = message.sender.toString() === currentUserId;
          const timestamp = new Date(Number(message.timestamp) / 1000000);

          return (
            <div
              key={message.id}
              className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  isCurrentUser
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                <p className={`text-xs mt-1 ${isCurrentUser ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                  {timestamp.toLocaleString()}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
}
