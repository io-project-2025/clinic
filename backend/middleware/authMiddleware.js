/**
 * Autoryzuje dostęp na podstawie roli użytkownika
 * @param {Array} allowedRoles - Tablica dozwolonych ról
 * @returns {Function} - Middleware Express
 */
function authorizeRole(allowedRoles = []) {
  return (req, res, next) => {
    const userRole = req.headers['x-user-role'];
    const userId = req.headers['x-user-id'];

    if (!userRole || !allowedRoles.includes(userRole)) {
      return res.status(403).json({ error: 'Brak dostępu' });
    }
    if (!userId) {
      return res.status(400).json({ error: 'Brak id użytkownika w nagłówkach' });
    }

    req.user = { id: userId, role: userRole };
    next();
  };
}

module.exports = {authorizeRole}