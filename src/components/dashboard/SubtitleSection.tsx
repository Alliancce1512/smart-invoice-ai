
import React from "react";

interface SubtitleSectionProps {
  animateSubtitle: boolean;
}

export const SubtitleSection: React.FC<SubtitleSectionProps> = ({ animateSubtitle }) => {
  return (
    <div 
      className={`text-center mb-4 relative overflow-hidden transform transition-all duration-700 ease-out ${
        animateSubtitle 
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-6'
      }`}
    >
      <div className="py-6 px-6 rounded-2xl overflow-hidden card-shadow">
        {/* Enhanced background with stronger visibility and matching shadow style */}
        <div className="absolute inset-0 bg-gradient-to-br from-smartinvoice-purple/20 via-smartinvoice-soft-gray/50 to-background/90 backdrop-blur-md z-0 border border-border shadow-md hover:shadow-lg transition-shadow rounded-2xl dark:from-smartinvoice-purple/30 dark:via-gray-800/60 dark:to-gray-900/50 dark:border-gray-700"></div>
        
        {/* Content with gradient text animation */}
        <div className="relative z-10">
          <p className="text-xl font-medium max-w-2xl mx-auto subtitle-gradient-text">
            Automate your invoice processing with powerful AI recognition
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubtitleSection;
