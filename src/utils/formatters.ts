
import { format } from "date-fns";

export const formatCurrency = (amount: string | number, currency: string = "USD") => {
  if (!amount) return "-";
  
  try {
    const numericAmount = typeof amount === "string" ? parseFloat(amount) : amount;
    if (isNaN(numericAmount)) return "-";
    
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
    }).format(numericAmount);
  } catch (error) {
    return `${currency || "$"}${parseFloat(amount as string).toFixed(2)}`;
  }
};

export const formatDate = (dateString: string) => {
  try {
    return format(new Date(dateString), "dd.MM.yyyy");
  } catch (error) {
    return dateString;
  }
};

export const formatDateTime = (dateString: string | null) => {
  if (!dateString) return "Not available";
  try {
    return format(new Date(dateString), "dd.MM.yyyy HH:mm");
  } catch (error) {
    return dateString || "Not available";
  }
};

// Helper function to format time elapsed since a given date
export const formatTimeElapsed = (dateString: string | null) => {
  if (!dateString) return "Not available";
  
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMilliseconds = now.getTime() - date.getTime();
    
    // Convert to seconds, minutes, hours, days
    const seconds = Math.floor(diffInMilliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) {
      return days === 1 ? "Yesterday" : `${days} days ago`;
    } else if (hours > 0) {
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    } else if (minutes > 0) {
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    } else {
      return "Just now";
    }
  } catch (error) {
    return "Not available";
  }
};
