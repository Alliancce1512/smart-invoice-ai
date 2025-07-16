import React from "react";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FloatingChatButtonProps {
  onClick: () => void;
}

export const FloatingChatButton: React.FC<FloatingChatButtonProps> = ({ onClick }) => {
  return (
    <Button
      onClick={onClick}
      className="fixed bottom-4 right-4 h-14 w-14 rounded-full shadow-lg hover:scale-105 transition-transform z-40 bg-primary hover:bg-primary/90"
      size="sm"
    >
      <MessageCircle className="h-6 w-6" />
      <span className="sr-only">Open chat</span>
    </Button>
  );
};