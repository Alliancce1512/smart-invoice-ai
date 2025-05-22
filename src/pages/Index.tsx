
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import SubtitleSection from "@/components/dashboard/SubtitleSection";
import QuickActions from "@/components/dashboard/QuickActions";
import RecentActivity from "@/components/dashboard/RecentActivity";
import FeaturesSection from "@/components/dashboard/FeaturesSection";
import SuccessDialog, { SuccessMessage } from "@/components/dashboard/SuccessDialog";

const Index = () => {
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState<SuccessMessage | null>(null);
  const [animateSubtitle, setAnimateSubtitle] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check for success message in session storage
    const messageJson = sessionStorage.getItem("invoiceSuccessMessage");
    if (messageJson) {
      try {
        const message = JSON.parse(messageJson) as SuccessMessage;
        setSuccessMessage(message);
        setShowSuccessDialog(true);
        // Clear the message so it doesn't show again on refresh
        sessionStorage.removeItem("invoiceSuccessMessage");
      } catch (error) {
        console.error("Failed to parse success message:", error);
      }
    }
    
    // Trigger subtitle animation after a short delay
    setTimeout(() => {
      setAnimateSubtitle(true);
    }, 300);
  }, []);

  const handleProcessAnother = () => {
    setShowSuccessDialog(false);
    navigate("/upload");
  };
  
  return (
    <Layout>
      <div className="w-full max-w-5xl mx-auto py-4 space-y-8 bg-background">
        {/* Enhanced subtitle/tagline section */}
        <SubtitleSection animateSubtitle={animateSubtitle} />

        {/* Quick action cards */}
        <QuickActions />
        
        {/* Recent Activity section */}
        <RecentActivity />
        
        {/* Features section */}
        <FeaturesSection />
      </div>

      {/* Success dialog after submission */}
      <SuccessDialog 
        open={showSuccessDialog}
        onOpenChange={setShowSuccessDialog}
        successMessage={successMessage}
        onProcessAnother={handleProcessAnother}
      />
    </Layout>
  );
};

export default Index;
