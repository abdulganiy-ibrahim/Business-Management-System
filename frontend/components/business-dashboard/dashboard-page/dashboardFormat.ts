const BUSINESS_TIME_ZONE = "Africa/Lagos";

// "2026-10-21T14:30:00Z" -> "21 Oct, 15:30"
export const formatBusinessDateTime = (isoDate: string) =>
  new Date(isoDate).toLocaleString("en-GB", {
    timeZone: BUSINESS_TIME_ZONE,
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });