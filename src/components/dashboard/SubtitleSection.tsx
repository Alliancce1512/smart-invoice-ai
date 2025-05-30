import React from "react";
interface SubtitleSectionProps {
  animateSubtitle: boolean;
}
export const SubtitleSection: React.FC<SubtitleSectionProps> = ({
  animateSubtitle
}) => {
  return <div className={`text-center mb-6 sm:mb-8 px-4 relative transform transition-all duration-700 ease-out ${animateSubtitle ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
      <h2 className="subtitle-gradient-text text-xl sm:text-2xl md:text-3xl font-medium max-w-3xl mx-auto">One platform. Smarter invoices. No headaches.</h2>
    </div>;
};
export default SubtitleSection;