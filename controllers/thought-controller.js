const { Thought, User, Reaction } = require("../models");
const { log, warn, info, error } = require('@frenzie24/logger')
const thoughtController = {
  // get all thoughts
  async getThoughts(req, res) {
    try {
      const thoughts = await Thought.find();
      return res.json(thoughts);
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  // get single thought by id
  async getSingleThought(req, res) {
    try {
      const thought = await Thought.findOne({ _id: req.params.thoughtId });
      if (!thought) {
        return res.status(404).json({ message: 'No thought found with this id!' });
        return;
      }
      return res.json(thought);
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  // create a thought
  async createThought(req, res) {
    try {
      const thought = await Thought.create(req.body);
      await User.findOneAndUpdate(
        { _id: req.body.userId },
        { $push: { thoughts: thought._id } },
        { new: true }
      );
      return res.json(thought);
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  // update thought
  async updateThought(req, res) {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        req.body,
        { new: true, runValidators: true }
      );
      if (!thought) {
        return res.status(404).json({ message: 'No thought found with this id!' });
        return;
      }
      return res.json(thought);
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  // delete thought
  async deleteThought(req, res) {
    try {
      const thought = await Thought.findOneAndDelete({ _id: req.params.thoughtId });
      if (!thought) {
        return res.status(404).json({ message: 'No thought found with this id!' });
        return;
      }
      await User.findOneAndUpdate(
        { thoughts: req.params.thoughtId },
        { $pull: { thoughts: req.params.thoughtId } },
        { new: true }
      );
      return res.json(thought);
    } catch (err) {
      return res.status(500).json(err);
    }
  },

  // add a reaction to a thought
  async addReaction(req, res) {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $addToSet: { reactions: req.body } },
        { new: true, runValidators: true }
      );
      if (!thought) {
        return res.status(404).json({ message: 'No thought found with this id!' });
        return;
      }
      return res.json(thought);
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  // remove reaction from a thought
  async removeReaction(req, res) {
    log('removing reactions')
    log(req.params);
    try {
      const thought = await Thought.findById(req.params.thoughtId);
      if (!thought) return res.status(404).json({ message: 'No thought found' });
      log(thought)

      const reaction = await thought.reactions.find(
        reaction => reaction._id.toString() === req.params.reactionId
      );
      log(reaction)
      if (!reaction) return res.status(404).json({ message: 'No reaction found' });
      thought.reactions.pull(reaction);
      const updatedThought = await thought.save();
     return res.json(updatedThought)
    } catch (err) {
      res.status(500).json({ message: err.message })
    }
  }
};

module.exports = thoughtController;
