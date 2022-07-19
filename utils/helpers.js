const { upvote } = require("../models/Post");

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
      return `
      <div class="d-flex justify-content-end">
        <div id="edit-button">
          <button class="btn fst-italic m-0 p-0" id="edit-post" value="off">
            <i class="oi oi-pencil"></i>
            Edit post
          </button>&nbsp;&nbsp;|&nbsp;&nbsp;
        </div>
        <button class="btn fst-italic m-0 p-0" id="delete-post">
          <i class="oi oi-trash"></i>
          Delete post
        </button>
      </div>`;
    }
  },
};
