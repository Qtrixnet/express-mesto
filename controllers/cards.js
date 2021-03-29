const Card = require('../models/card');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndRemove(cardId)
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'Запрашиваемая карточка не найдена' });
      }
      return res.send(card);
    })
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

const createCard = (req, res) => {
  const owner = req.user._id;
  const { name, link } = req.body;
  Card.create({ name, link, owner })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(400).send({
          message: 'Переданы неправильные данные',
        });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
};

// const likeCard = (req, res) => {

// }

// const unLikeCard = (req, res) => {

// }

module.exports = {
  getCards,
  deleteCard,
  createCard,
  // likeCard,
  // unLikeCard,
};

// module.exports.createCard = (req, res) => {
//   console.log(req.user._id); // _id станет доступен
// };
