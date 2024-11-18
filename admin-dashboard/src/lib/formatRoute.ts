export default function formatRoute(route) {
  return route
    .replace(/\//g, "") // Remove the leading slash
    .split("-") // Split the string by hyphen
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
    .join(" "); // Join the words with a space
}
