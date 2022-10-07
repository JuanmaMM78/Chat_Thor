const express = require('express');
const router = express.Router();
const Mensaje = require('../models/mensaje.model');   /// Requerimos el modelo de mensaje al usuario

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/chat', async (req, res) => {
  /// Requerimos el modelo de mensaje al usuario
  /// Recuperar de la DB los ultimos 5 mensajes (aggreghate --> $sort, $limit)
  /// le pasa al array de mensajes a la vista a traves del metodo render
  /// dentro de la vista (chat.pug) recorrer el array y mostrar los mensajes dentro del UL

  const mensajes = await Mensaje.aggregate([
    { $sort: {createdAt: -1}},  /// Recuperar de la DB los ultimos 5 mensajes (aggreghate --> $sort, $limit)
    {$limit:5}
  ]);

  res.render('chat', {mensajes: mensajes.reverse()}); /// le pasa al array de mensajes a la vista a traves del metodo render, al reves del ultimo al primero
});

module.exports = router;
