const User = require("./User");
const Post = require("./Post");
const Upvote = require("./Upvote");
const Downvote = require("./Downvote");

//Post associations
User.hasMany(Post, {
  foreignKey: "user_id",
});
Post.belongsTo(User, {
  foreignKey: "user_id",
});

//Upvote associations
User.belongsToMany(Post, {
  through: Upvote,
  as: "upvoted_posts",
  foreignKey: "user_id",
});
Post.belongsToMany(User, {
  through: Upvote,
  as: "upvoted_posts",
  foreignKey: "post_id",
});
Upvote.belongsTo(User, {
  foreignKey: "user_id",
});
Upvote.belongsTo(Post, {
  foreignKey: "post_id",
});
User.hasMany(Upvote, {
  foreignKey: "user_id",
});
Post.hasMany(Upvote, {
  foreignKey: "post_id",
});

//Downvote associations
User.belongsToMany(Post, {
  through: Downvote,
  as: "downvoted_posts",
  foreignKey: "user_id",
});
Post.belongsToMany(User, {
  through: Downvote,
  as: "downvoted_posts",
  foreignKey: "post_id",
});
Downvote.belongsTo(User, {
  foreignKey: "user_id",
});
Downvote.belongsTo(Post, {
  foreignKey: "post_id",
});
User.hasMany(Downvote, {
  foreignKey: "user_id",
});
Post.hasMany(Downvote, {
  foreignKey: "post_id",
});

module.exports = { User, Post, Upvote, Downvote };
