export function formatDate(timestamp) {
  // Convert the timestamp string into a Date object
  const date = new Date(timestamp);

  // Extract the day, month, and year
  const day = date.getDate();
  const year = date.getFullYear();

  // Define an array of month names
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Get the month name
  const month = months[date.getMonth()]; // Months are 0-indexed

  // Return the formatted date as "20 Oct 2024"
  return `${day} ${month} ${year}`;
}
