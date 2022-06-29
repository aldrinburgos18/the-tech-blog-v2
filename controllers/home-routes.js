const { sequelize } = require("../models/User");

const { Post, User, Comment } = require("../models");

const router = require("express").Router();

router.get("/", (req, res) => {
  console.log(req.session.loggedIn);
  if (req.session.loggedIn) {
    Post.findAll({
      attributes: [
        "id",
        "title",
        "coconut",
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
        },
        {
          model: User,
          attributes: ["firstname", "lastname", "username", "id"],
        },
      ],
    })
      .then((dbPostData) => {
        const posts = dbPostData.map((post) => post.get({ plain: true }));
        const username = req.session.username;
        res.render("homepage", { posts, username });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  } else {
    res.redirect("/login");
  }
});

router.get("/post/:id", (req, res) => {
  Post.findOne({
    where: {
      id: req.params.id,
    },
    attributes: [
      "id",
      "title",
      "coconut",
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
    include: [
      {
        model: Comment,
        include: [{ model: User, as: "commenter" }],
        attributes: ["comment_text", "created_at", "id"],
        order: [["created_at", "DESC"]],
      },
      {
        model: User,
        attributes: ["firstname", "lastname", "username", "id"],
      },
    ],
  })
    .then((dbPostData) => {
      if (!dbPostData) {
        res.status(404).json({ message: "No post found with this ID!" });
        return;
      }

      //serialize the data
      const post = dbPostData.get({ plain: true });
      var comments = post.comments;
      res.render("single-post", { post, comments });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get("/login", (req, res) => {
  if (req.session.loggedIn) {
    res.redirect("/");
    return;
  }

  res.render("login");
});

router.get("/register", (req, res) => {
  if (req.session.loggedIn) {
    res.redirect("/");
    return;
  }

  res.render("register");
});

module.exports = router;
