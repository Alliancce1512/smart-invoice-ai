import React, { useState, useRef, useEffect } from "react";
import { Send, X, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAuthHeaders } from "@/utils/api";
import { toast } from "sonner";
interface Message {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
}
interface ChatWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  isClosing: boolean;
}
export const ChatWidget: React.FC<ChatWidgetProps> = ({
  isOpen,
  onClose,
  isClosing
}) => {
  const [messages, setMessages] = useState<Message[]>([{
    id: "welcome",
    content: "Hi! I'm Smarty, your AI assistant. How can I help you with SmartInvoice today?",
    sender: "bot",
    timestamp: new Date()
  }]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);
    try {
      const response = await fetch("https://n8n.presiyangeorgiev.eu/webhook/smartinvoice/send-chat-message", {
        method: "POST",
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: inputValue,
          userId: localStorage.getItem("smartinvoice_user_id") || "anonymous",
          timestamp: new Date().toISOString()
        })
      });
      if (response.ok) {
        const data = await response.json();
        const botResponse: Message = {
          id: (Date.now() + 1).toString(),
          content: data.response || "Thank you for your message! I'll get back to you soon.",
          sender: "bot",
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botResponse]);
      } else {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      console.error("Chat error:", error);
      toast.error("Failed to send message. Please try again.");
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, I'm having trouble connecting right now. Please try again later.",
        sender: "bot",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };
  if (!isOpen && !isClosing) return null;
  return <Card className={`fixed bottom-20 right-4 w-80 h-96 shadow-lg border-border bg-card z-50 ${isClosing ? 'animate-scale-out' : 'animate-scale-in'}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-sm">
            <MessageCircle className="h-4 w-4 text-primary" />
            Smarty
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-6 w-6 p-0 hover:bg-muted">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="flex flex-col h-full p-0">
        <ScrollArea className="flex-1 px-4">
          <div className="space-y-3 pb-4">
            {messages.map(message => <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[75%] rounded-lg px-3 py-2 text-sm ${message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                  {message.content}
                </div>
              </div>)}
            {isLoading && <div className="flex justify-start">
                <div className="bg-muted text-muted-foreground rounded-lg px-3 py-2 text-sm">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-current rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-current rounded-full animate-pulse delay-75"></div>
                    <div className="w-2 h-2 bg-current rounded-full animate-pulse delay-150"></div>
                  </div>
                </div>
              </div>}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
        
        <div className="border-t border-border p-4 px-0 py-[12px]">
          <div className="flex gap-2">
            <Input value={inputValue} onChange={e => setInputValue(e.target.value)} onKeyPress={handleKeyPress} placeholder="Type your message..." disabled={isLoading} className="flex-1" />
            <Button onClick={sendMessage} disabled={!inputValue.trim() || isLoading} size="sm" className="px-3">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>;
};