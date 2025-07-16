import React, { useState } from "react";
import { ChatWidget } from "./ChatWidget";
import { FloatingChatButton } from "./FloatingChatButton";

export const ChatManager: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const toggleChat = () => {
    if (isChatOpen) {
      setIsClosing(true);
      setTimeout(() => {
        setIsChatOpen(false);
        setIsClosing(false);
      }, 200); // Match animation duration
    } else {
      setIsChatOpen(true);
    }
  };

  const closeChat = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsChatOpen(false);
      setIsClosing(false);
    }, 200); // Match animation duration
  };

  return (
    <>
      {!isChatOpen && !isClosing && <FloatingChatButton onClick={toggleChat} />}
      <ChatWidget isOpen={isChatOpen} onClose={closeChat} isClosing={isClosing} />
    </>
  );
};