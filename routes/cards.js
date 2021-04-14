const router = require('express').Router();
const auth = require('../middlewares/auth');
const {
  getCards, deleteCard, createCard, likeCard, dislikeCard,
} = require('../controllers/cards');

const {
  validateGetCards, validateDeleteCard, validateCreateCard, validateLikeCard, validateDislikeCard,
} = require('../middlewares/validations');

router.use(auth);

router.get('/', validateGetCards, getCards);
router.delete('/:cardId', validateDeleteCard, deleteCard);
router.post('/', validateCreateCard, createCard);
router.put('/:cardId/likes', validateLikeCard, likeCard);
router.delete('/:cardId/likes', validateDislikeCard, dislikeCard);

module.exports = router;
