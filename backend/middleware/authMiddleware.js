/**
 * Autoryzuje dostęp na podstawie roli użytkownika
 * @param {Array} allowedRoles - Tablica dozwolonych ról
 * @returns {Function} - Middleware Express
 */
function authorizeRole(allowedRoles = []) {
  return (req, res, next) => {
    // Pobierz rolę użytkownika z nagłówka
    const userRole = req.headers['x-user-role'];
    
    // Sprawdź czy rola istnieje i czy jest dozwolona
    if (!userRole || !allowedRoles.includes(userRole)) {
      return res.status(403).json({ error: 'Brak dostępu' });
    }
    
    // Dodaj rolę do obiektu req dla łatwego dostępu w kontrolerach
    req.userRole = userRole;
    
    // Kontynuuj przetwarzanie żądania
    next();
  };
}

module.exports = { authorizeRole };
