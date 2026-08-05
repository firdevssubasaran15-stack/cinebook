class UsersValidator {
  validateUsername(newUsername) {
    if (!newUsername || newUsername.trim().length < 3 || newUsername.trim().length > 20) {
      throw new Error('Kullanıcı adı 3 ile 20 karakter arasında olmalıdır.');
    }
    
    const sanitizedUsername = newUsername.trim().toLowerCase();
    
    if (!/^[a-z0-9_]+$/.test(sanitizedUsername)) {
      throw new Error('Kullanıcı adı sadece küçük harf, rakam ve alt çizgi içerebilir.');
    }

    return sanitizedUsername;
  }
}

module.exports = new UsersValidator();
