import React, { useState } from "react";
import { ChatWidget } from "./ChatWidget";
import { FloatingChatButton } from "./FloatingChatButton";

export const ChatManager: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const closeChat = () => {
    setIsChatOpen(false);
  };

  return (
    <>
      {!isChatOpen && <FloatingChatButton onClick={toggleChat} />}
      <ChatWidget isOpen={isChatOpen} onClose={closeChat} />
    </>
  );
};