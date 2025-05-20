
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
