const knex = require('../conexao');
const jwt = require('jsonwebtoken');

const verificarToken = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json('Não autorizado.');
  }

  try {
    const token = authorization.replace('Bearer ', '').trim();

    const { id } = jwt.verify(token, process.env.SENHA_HASH);

    const consumidorExiste = await knex('consumidor').where({ id }).first();

    if (!consumidorExiste) {
      return res.status(404).json('Usuário não encontrado');
    }

    const { senha, ...consumidor } = consumidorExiste;
    

    req.consumidor = consumidor;
    
    next();
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

module.exports = verificarToken;