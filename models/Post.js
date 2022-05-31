const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

class Post extends Model {
  static upvote(body, models) {
    return models.Upvote.create({
      user_id: body.user_id,
      post_id: body.post_id,
    }).then(() => {
      return Post.findOne({
        where: {
          id: body.post_id,
        },
        attributes: [
          "id",
          "title",
          "coconut",
          "created_at",
          [
            sequelize.literal(
              "(SELECT COUNT (*) FROM upvote WHERE post.id = upvote.post_id)"
            ),
            "upvote_count",
          ],
        ],
      });
    });
  }

  static downvote(body, models) {
    return models.Downvote.create({
      user_id: body.user_id,
      post_id: body.post_id,
    }).then(() => {
      return Post.findOne({
        where: {
          id: body.post_id,
        },
        attributes: [
          "id",
          "title",
          "coconut",
          "created_at",
          [
            sequelize.literal(
              "(SELECT COUNT (*) FROM downvote WHERE post.id = downvote.post_id)"
            ),
            "downvote_count",
          ],
        ],
      });
    });
  }
}

Post.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    coconut: {
      type: DataTypes.STRING(120),
      allowNull: false,
    },

    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "user",
        key: "id",
      },
    },
  },
  {
    sequelize,
    freezeTableName: true,
    underscored: true,
    modelName: "post",
  }
);

module.exports = Post;
