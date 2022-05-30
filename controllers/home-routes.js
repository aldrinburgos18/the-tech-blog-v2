const { sequelize } = require("../models/User");

const { Post, User, Comment } = require("../models");

const router = require("express").Router();

router.get("/", (req, res) => {
  Post.findAll({
    attributes: [
      "id",
      "title",
      "schweet",
      "created_at",
      [
        sequelize.literal(
          "(SELECT COUNT(*) FROM upvote WHERE post.id = upvote.post_id)"
        ),
        "upvote_count",
      ],
      [
        sequelize.literal(
          "(SELECT COUNT(*) FROM downvote WHERE post.id = downvote.post_id)"
        ),
        "downvote_count",
      ],
    ],
    order: [["created_at", "DESC"]],
    include: [
      {
        model: Comment,
        include: [{ model: User, as: "commenter", attributes: ["username"] }],
        attributes: ["comment_text", "created_at", "id"],
        order: [["created_at", "DESC"]],
      },
      {
        model: User,
        attributes: ["username", "id"],
      },
    ],
  })
    .then((dbPostData) => {
      const posts = dbPostData.map((post) => post.get({ plain: true }));
      res.render("homepage", { posts });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;
