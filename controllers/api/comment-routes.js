const router = require("express").Router();
const { Comment, User } = require("../../models");

router.get("/", (req, res) => {
  Comment.findAll({
    attributes: ["id", "comment_text", "post_id", "created_at"],
    include: [
      {
        model: User,
        as: "commenter",
        attributes: ["firstname", "lastname", "username", "id"],
      },
    ],
  })
    .then((dbCommentData) => res.json(dbCommentData))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

router.post("/", (req, res) => {
  if (req.session) {
    Comment.create({
      comment_text: req.body.comment_text,
      post_id: req.body.post_id,
      //use the id from the session
      user_id: req.session.user_id,
    })
      .then((dbCommentData) => res.json(dbCommentData))
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  }
});

router.delete("/:id", (req, res) => {
  Comment.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then((dbCommentData) => {
      if (!dbCommentData) {
        res.status(404).json({ message: "No comment found with that ID!" });
        return;
      }
      res.json({
        message: "Comment deleted successfully.",
        changes: dbCommentData,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;
