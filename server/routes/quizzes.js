
const express = require('express');
const Quizzes = require('../models/Quiz');
const checkAuth = require('../middleware/check-auth');
const Users = require('../models/Users');
const Score = require('../models/Scores');

const router = express.Router();

router.post('/create', checkAuth, (req, res) => {
    let quiz = new Quizzes({
        ...req.body.quiz,
        createdBy: req.body.createdBy,
        questions: req.body.quiz.questions.map(ques => ({
            ...ques,
            answers: ques.answers.map(ans => ({
                name: ans,
                selected: false
            }))
        }))
    });
    quiz.save().then(result => {
        res.status(200).json({ success: true });
    }).catch(err => {
        res.status(500).json({ success: false, error: err.message });
    });
});

router.get('/my-quizzes/:id', checkAuth, (req, res) => {
    Quizzes.find({ createdBy: req.params.id })
        .then(result => {
            res.status(200).json(result);
        }).catch(err => {
            res.status(500).json({ error: err.message });
        });
});

router.get('/all-quizzes', checkAuth, (req, res) => {
    Quizzes.find()
        .then(result => {
            res.status(200).json(result);
        }).catch(err => {
            res.status(500).json({ error: err.message });
        });
});

router.get('/get-quiz/:id', checkAuth, (req, res) => {
    Quizzes.findOne({ _id: req.params.id }).then(quiz => {
        res.status(200).json({ quiz });
    }).catch(err => {
        res.status(500).json({ error: err.message });
    });
});

router.post('/add-comment', checkAuth, (req, res) => {
    Quizzes.updateOne({ _id: req.body.quizId }, {
        $push: {
            comments: {
                sentFromId: req.body.sentFromId,
                message: req.body.message
            }
        }
    }).then(quiz => {
        res.status(200).json({ success: true });
    }).catch(err => {
        res.status(500).json({ error: err.message });
    });
});

router.post('/like-quiz', checkAuth, (req, res) => {
    Users.findOne({ _id: req.body.userId, likedQuizzes: { $in: [req.body.quizId] } }).then(async user => {
        if (!user) {
            await Users.updateOne({ _id: req.body.userId }, {
                $push: {
                    likedQuizzes: req.body.quizId
                }
            });
            await Quizzes.updateOne({ _id: req.body.quizId }, {
                $inc: {
                    likes: 1
                }
            });
            res.status(200).json({ message: 'Added To Liked' });
        } else {
            await Users.updateOne({ _id: req.body.userId }, {
                $pull: {
                    likedQuizzes: req.body.quizId
                }
            });
            await Quizzes.updateOne({ _id: req.body.quizId }, {
                $inc: {
                    likes: -1
                }
            });
            res.status(200).json({ message: 'Removed from liked' });
        }
    }).catch(err => {
        res.status(500).json({ error: err.message });
    });
});

router.post('/save-results', checkAuth, (req, res) => {
    let score = new Score({
        userId: req.body.currentUser,
        answers: req.body.answers,
        quizId: req.body.quizId
    });
    score.save().then(async resp => {
        await Quizzes.updateOne({ _id: req.body.quizId }, {
            $push: {
                scores: resp._id
            }
        });
        res.status(200).json({ scoreId: resp._id });
    }).catch(err => {
        res.status(500).json({ error: err.message });
    });
});

router.get('/results/:id', checkAuth, (req, res) => {
    if (!req.params.id) {
        res.status(400).send("No id provided in params");
    } else {
        Score.findOne({ _id: req.params.id }).then(data => {
            if (!data) {
                res.status(500).send("Error finding score");
            } else {
                Quizzes.findOne({ _id: data.quizId }).then(quiz => {
                    if (!quiz) {
                        res.status(500).send("Error getting quiz");
                    } else {
                        res.status(200).json({ score: data, quiz });
                    }
                }).catch(err => {
                    res.status(500).json({ error: err.message });
                });
            }
        }).catch(err => {
            res.status(500).json({ error: err.message });
        });
    }
});

module.exports = router;
