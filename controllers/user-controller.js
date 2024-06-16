const { User, Thought } = require("../models");

const {log, info, warn, error} = require('@frenzie24/logger')

const userController = {
  // get all users
  async getUsers(req, res) {
    try {
      const users = await User.find()
      return res.json(users)
    } catch(err) {
      return res.status(500).json(err);
    }
  },
  // get single user by id
  async getSingleUser(req, res) {
    try {
      const user = await User.findOne({ _id: req.params.userId })
        .populate('thoughts')
        .populate('friends');
      if (!user) {
        return res.status(404).json({ message: 'No user found with this id!' });
        return;
      }
      return res.json(user);
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  // create a new user
  async createUser(req, res) {
    log(req.body);
    try {
      const user = await User.create(req.body);
      return res.json(user);
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  // update a user
  async updateUser(req, res) {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        req.body,
        { new: true, runValidators: true }
      );
      if (!user) {
        return res.status(404).json({ message: 'No user found with this id!' });
        return;
      }
      return res.json(user);
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  // delete user (BONUS: and delete associated thoughts)
  async deleteUser(req, res) {
    try {
      const user = await User.findOneAndDelete({ _id: req.params.userId });
      if (!user) {
        return res.status(404).json({ message: 'No user found with this id!' });
        return;
      }
      return res.json(user);
    } catch (err) {
      return res.status(500).json(err);
    }
  },

  // add friend to friend list
  async addFriend(req, res) {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $addToSet: { friends: req.params.friendId } },
        { new: true }
      );
      if (!user) {
        return res.status(404).json({ message: 'No user found with this id!' });
        return;
      }
      return res.json(user);
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  // remove friend from friend list
  async removeFriend(req, res) {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $pull: { friends: req.params.friendId } },
        { new: true }
      );
      if (!user) {
        return res.status(404).json({ message: 'No user found with this id!' });
        return;
      }
      return res.json(user);
    } catch (err) {
      return res.status(500).json(err);
    }
  },
};

module.exports = userController;
