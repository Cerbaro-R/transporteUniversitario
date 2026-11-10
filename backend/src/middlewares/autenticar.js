const { verificarToken } = require('../utils/token');

// Exige um token válido no header "Authorization: Bearer <token>".
// Se estiver ok, deixa disponível req.usuario = { id, perfil }.
function autenticar(req, res, next) {
  const [tipo, token] = (req.headers.authorization || '').split(' ');

  if (tipo !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Faça login para continuar.' });
  }

  try {
    const payload = verificarToken(token);
    req.usuario = { id: Number(payload.sub), perfil: payload.perfil };
    return next();
  } catch {
    return res.status(401).json({ message: 'Sessão expirada ou inválida. Faça login novamente.' });
  }
}

module.exports = autenticar;
