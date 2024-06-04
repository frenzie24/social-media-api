const router = require("express").Router();
const {

    getThoughts,
    getSingleThought,
    createThought,
    updateThought,
    deleteThought,
    addReaction,
    removeReaction,

} = require("../../controllers/thought-controller");

// /api/thoughts
router.route('/')
  .get(getThoughts)
  .post(createThought);

// /api/thoughts/:thoughtId

router.route('/:thoughtId')
  .get(getSingleThought)
  .put(updateThought)
  .delete(deleteThought);

// /api/thoughts/:thoughtId/reactions
//adds a reaction to the matching thought id's reaction array
router.route('/:thoughtId/reactions')
  .post(addReaction);

// /api/thoughts/:thoughtId/reactions/:reactionId
// deletes a reaction witht hematching reactionId and matching thoughtId
router.route('/:thoughtId/reactions/:reactionId')
.delete(removeReaction);

module.exports = router;
