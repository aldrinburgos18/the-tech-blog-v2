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
  showPostOwnerOptions: (loggedInId, postedById) => {
    if (loggedInId === postedById) {
      return `<div class="d-flex justify-content-end">
      <button class="btn fst-italic m-0 p-0" id="edit-post" value="off">Edit post</p>
  </div>`;
    }
  },
};
