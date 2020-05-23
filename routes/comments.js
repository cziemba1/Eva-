const express = require("express");
const router = express.Router({ mergeParams: true });
const Evento = require("../models/eventos");
const Comment = require("../models/comments");
const middleware = require("../middleware");
//NEW
router.get("/new", middleware.isLoggedIn, (req, res) => {
  Evento.findById(req.params.id, (err, evento) => {
    if (err) {
      console.log(err);
    } else {
      res.render("comments/new", { evento: evento });
    }
  });
});

//CREATE
router.post("/", middleware.isLoggedIn, (req, res) => {
  Evento.findById(req.params.id, (err, evento) => {
    if (err) {
      console.log(err);
      res.redirect("/eventos");
    } else {
      Comment.create(req.body.comment, (err, comment) => {
        if (err) {
          console.log(err);
        } else {
          //add username and id to comment
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          comment.save();
          evento.comments.push(comment);
          evento.save();
          res.redirect(`/eventos/${evento._id}`);
        }
      });
    }
  });
});

//Comment edit
router.get(
  "/:comment_id/edit",
  middleware.checkCommentPropiedad,
  (req, res) => {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
      if (err) {
        res.redirect("back");
      } else {
        res.render("comments/edit", {
          evento_id: req.params.id,
          comment: foundComment,
        });
      }
    });
  }
);

//Comment update
router.put("/:comment_id", middleware.checkCommentPropiedad, (req, res) => {
  Comment.findByIdAndUpdate(
    req.params.comment_id,
    req.body.comment,
    (err, updatedComment) => {
      if (err) {
        res.redirect("back");
      } else {
        res.redirect(`/eventos/${req.params.id}`);
      }
    }
  );
});

//Comment destroy
router.delete("/:comment_id", middleware.checkCommentPropiedad, (req, res) => {
  Comment.findByIdAndRemove(req.params.comment_id, (err) => {
    if (err) {
      res.redirect("back");
    } else {
      res.redirect(`/eventos/${req.params.id}`);
    }
  });
});

module.exports = router;
