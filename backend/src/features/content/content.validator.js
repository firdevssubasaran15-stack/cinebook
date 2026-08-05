const SHORT_TITLE_WHITELIST = [
  { type: 'book', title: 'K', author: 'Franz Kafka' },
  { type: 'book', title: 'V.', author: 'Thomas Pynchon' },
  { type: 'book', title: 'O', author: 'Stephen King' },
  { type: 'movie', title: 'Z', author: 'Costa-Gavras' },
  { type: 'movie', title: '9', author: 'Shane Acker' },
  { type: 'movie', title: 'O', author: 'Tim Blake Nelson' },
  { type: 'series', title: 'V', author: 'Kenneth Johnson' },
  { type: 'series', title: 'V', author: 'Scott Peters' },
  { type: 'series', title: 'K', author: 'GoHands' },
  { type: 'series', title: 'K', author: 'Shingo Suzuki' },
  { type: 'series', title: 'ER', author: 'Michael Crichton' },
];

class ContentValidator {
  validateShortTitle(type, title, directorAuthor) {
    if (title.length === 1 || title === 'V.' || title.toUpperCase() === 'ER') {
      const isWhitelisted = SHORT_TITLE_WHITELIST.some(w => {
        if (w.type !== type || w.title.toLowerCase() !== title.toLowerCase()) return false;
        
        const whiteWords = w.author.toLowerCase().split(/\s+/);
        const inputWords = directorAuthor.toLowerCase().split(/\s+/);
        
        return inputWords.some(word => word.length > 2 && whiteWords.includes(word)) || 
               w.author.toLowerCase().includes(directorAuthor.toLowerCase());
      });

      if (!isWhitelisted) {
        throw new Error('Tek harfli/rakamlı veya kısıtlanmış kısa isimler yalnızca özel istisna listesine uyan yönetmen/yazarlarla girilebilir.');
      }
    }
  }

  validateType(type) {
    if (!['movie', 'series', 'book'].includes(type)) {
      throw new Error("Geçersiz içerik türü. 'movie', 'series' veya 'book' olmalı.");
    }
  }

  validateRequiredFields(title, directorAuthor) {
    if (!title || !directorAuthor) {
      throw new Error('Başlık ve yönetmen/yazar zorunludur.');
    }
  }
}

module.exports = new ContentValidator();
