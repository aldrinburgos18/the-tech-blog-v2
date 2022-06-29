var days = ["Sun", "Mon", "Tue", "Wed", "Thurs", "Fri", "Sat"];

var months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "June",
  "July",
  "Aug",
  "Sept",
  "Oct",
  "Nov",
  "Dec",
];

Date.prototype.getMonthName = function () {
  return months[this.getMonth()];
};

Date.prototype.getDayName = function () {
  return days[this.getDay()];
};

module.exports = {
  format_date: (date) => {
    return `${new Date(date).getDayName()}, ${new Date(
      date
    ).getMonthName()} ${new Date(date).getDate()} ${new Date(
      date
    ).getFullYear()}`;
  },
};
