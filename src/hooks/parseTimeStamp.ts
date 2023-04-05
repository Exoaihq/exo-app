// typescript
export function formatTimeStampToHumanReadableShortDateTime(
  timestamp: string
): string {
  // Create a Date object from the timestamp string
  const date = new Date(timestamp);

  // Extract the components from the Date object
  const month = date.getMonth() + 1; // Months are zero-based, so we need to add 1
  const day = date.getDate();
  const year = date.getFullYear().toString().slice(-2); // Get the last two digits of the year
  const hour = date.getHours();
  const minute = date.getMinutes();

  // Convert the hours to a 12-hour format
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  const amPm = hour < 12 ? "AM" : "PM";

  // Prepare formatted strings for each component
  const monthStr = month.toLocaleString("en-US", { minimumIntegerDigits: 1 });
  const dayStr = day.toLocaleString("en-US", { minimumIntegerDigits: 1 });
  const hourStr = hour12.toLocaleString("en-US", { minimumIntegerDigits: 1 });
  const minuteStr = minute.toLocaleString("en-US", { minimumIntegerDigits: 2 });

  // Combine the formatted strings into the final result
  return `${monthStr}/${dayStr}/${year} ${hourStr}:${minuteStr} ${amPm}`;
}

export function formatTimeStampToHumanReadableTime(timestamp: string): string {
  if (!timestamp) return "";
  // Create a Date object from the timestamp string
  const date = new Date(timestamp);

  const hour = date.getHours();
  const minute = date.getMinutes();

  // Convert the hours to a 12-hour format
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  const amPm = hour < 12 ? "AM" : "PM";

  const hourStr = hour12.toLocaleString("en-US", { minimumIntegerDigits: 1 });
  const minuteStr = minute.toLocaleString("en-US", { minimumIntegerDigits: 2 });

  // Combine the formatted strings into the final result
  return `${hourStr}:${minuteStr} ${amPm}`;
}

// Example usage:
const timestamp = "2023-04-01T14:10:49.73+00:00";
const formattedDate = formatTimeStampToHumanReadableShortDateTime(timestamp);
console.log(formattedDate); // Output: 4/1/23 2:10 PM
