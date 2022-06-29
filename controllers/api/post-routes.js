const router = require("express").Router();
const { Post, User, Upvote, Downvote, Comment } = require("../../models");
const { sequelize } = require("../../models/User");

router.get("/", (req, res) => {
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
        include: [{ model: User, as: "commenter", attributes: ["username"] }],
        attributes: ["comment_text", "created_at", "id"],
        order: [["created_at", "DESC"]],
      },
      {
        model: User,
        attributes: ["firstname", "lastname", "username", "id"],
      },
    ],
  })
    .then((dbPostData) => res.json(dbPostData))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get("/:id", (req, res) => {
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
        include: [{ model: User, as: "commenter", attributes: ["username"] }],
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
        res.status(404).json({ message: "No post found with that ID!" });
        return;
      }
      console.log(dbPostData);
      res.json(dbPostData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.post("/", (req, res) => {
  Post.create({
    title: req.body.title,
    coconut: req.body.coconut,
    user_id: req.body.user_id,
  })
    .then((dbPostData) => res.json(dbPostData))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.put("/upvote", (req, res) => {
  //custom static method
  Post.upvote(req.body, { Upvote })
    .then((dbPostData) => res.json(dbPostData))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

router.put("/downvote", (req, res) => {
  //custom static method
  Post.downvote(req.body, { Downvote })
    .then((dbPostData) => res.json(dbPostData))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

router.put("/:id", (req, res) => {
  Post.update(
    {
      title: req.body.title,
      coconut: req.body.coconut,
    },
    {
      where: {
        id: req.params.id,
      },
    }
  )
    .then((dbPostData) => {
      if (!dbPostData) {
        res.status(404).json({ message: "No post found with this id" });
        return;
      }
      res.json(dbPostData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.delete("/:id", (req, res) => {
  Post.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then((dbPostData) => {
      if (!dbPostData) {
        res.status(404).json({ message: "No coconuts found with that ID!" });
        return;
      }
      res.json(dbPostData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;
