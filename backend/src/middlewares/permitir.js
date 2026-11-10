// Libera a rota só para os perfis informados. Use DEPOIS de autenticar.
// Ex.: routes.get('/passageiros', autenticar, permitir('organizador'), ...)
function permitir(...perfis) {
  return (req, res, next) => {
    if (!req.usuario || !perfis.includes(req.usuario.perfil)) {
      return res.status(403).json({ message: 'Permissão insuficiente.' });
    }
    return next();
  };
}

module.exports = permitir;
