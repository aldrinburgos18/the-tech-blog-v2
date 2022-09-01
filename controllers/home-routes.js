const { sequelize } = require("../models/User");

const { Post, User, Comment, Upvote, Downvote } = require("../models");

const router = require("express").Router();

router.get("/", (req, res) => {
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
        {
          model: Upvote,
          where: {
            user_id: req.session.user_id,
          },
          attributes: ["id", "user_id"],
          separate: true,
        },
        {
          model: Downvote,
          where: {
            user_id: req.session.user_id,
          },
          attributes: ["id", "user_id"],
          separate: true,
        },
      ],
    })
      .then((dbPostData) => {
        const posts = dbPostData.map((post) => post.get({ plain: true }));
        const username = req.session.username;
        const loggedInId = req.session.user_id;
        res.render("homepage", {
          posts,
          username,
          loggedInId,
          loggedIn: req.session.loggedIn,
        });
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
      const loggedInId = req.session.user_id;
      res.render("single-post", {
        post,
        comments,
        loggedInId,
        loggedIn: req.session.loggedIn,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get("/user/:id", (req, res) => {
  User.findOne({
    attributes: { exclude: ["password", "email"] },
    where: {
      id: req.params.id,
    },
    include: [
      {
        model: Post,
        order: [["created_at", "DESC"]],
        separate: true,
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
        include: {
          model: Comment,
          attributes: ["id"],
        },
      },
      {
        model: Comment,
        as: "comments",
        order: [["created_at", "DESC"]],
        attributes: ["id"],
      },
    ],
  })
    .then((dbPostData) => {
      const user = dbPostData.get({ plain: true });
      res.render("user", { user, loggedIn: req.session.loggedIn });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get("/create-post", (req, res) => {
  if (req.session.loggedIn) {
    res.render("create-post", { loggedIn: req.session.loggedIn });
    return;
  }

  res.redirect("/");
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

router.get("/dashboard", (req, res) => {
  if (!req.session.loggedIn) {
    res.redirect("/login");
    return;
  }

  User.findOne({
    attributes: { exclude: ["password", "email"] },
    where: {
      id: req.session.user_id,
    },
    include: [
      {
        model: Post,
        order: [["created_at", "DESC"]],
        separate: true,
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
        include: {
          model: Comment,
          attributes: ["id"],
        },
      },
      {
        model: Comment,
        as: "comments",
        order: [["created_at", "DESC"]],
        attributes: ["id"],
      },
    ],
  })
    .then((dbPostData) => {
      const user = dbPostData.get({ plain: true });
      res.render("dashboard", { user, loggedIn: req.session.loggedIn });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;
