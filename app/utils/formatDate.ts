export const formatDate = (date: string) => {
  //   convert this 2024-12-10T07:22:01.536Z to this 1 Nov 2024 | 2:00 PM
  const dateArray = date.split("T");
  const dateString = dateArray[0];
  const dateArray2 = dateString.split("-");
  const year = dateArray2[0];
  const month = dateArray2[1];
  const day = dateArray2[2];
  const timeArray = dateArray[1].split(":");
  const hours = timeArray[0];
  const minutes = timeArray[1];
  const amPm = Number(hours) >= 12 ? "PM" : "AM";
  const hour = Number(hours) % 12;
  const hour12 = hour === 0 ? 12 : hour;

  //   December instead of 12, same for all months
  let monthName;

  switch (month) {
    case "01":
      monthName = "January";
      break;
    case "02":
      monthName = "February";
      break;
    case "03":
      monthName = "March";
      break;
    case "04":
      monthName = "April";
      break;
    case "05":
      monthName = "May";
      break;
    case "06":
      monthName = "June";
      break;
    case "07":
      monthName = "July";
      break;
    case "08":
      monthName = "August";
      break;
    case "09":
      monthName = "September";
      break;
    case "10":
      monthName = "October";
      break;
    case "11":
      monthName = "November";
      break;
    case "12":
      monthName = "December";
      break;
    default:
      monthName = "Unknown";
  }

  return `${day} ${monthName} ${year} | ${hour12}:${minutes} ${amPm}`;
};
