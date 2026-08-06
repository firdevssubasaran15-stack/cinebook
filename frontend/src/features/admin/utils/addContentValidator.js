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

export const validateContentInput = (type, title, directorAuthor) => {
  const t = title.trim();
  const d = directorAuthor.trim();
  
  if (!t || !d) {
    return { isValid: false, error: 'Başlık ve yönetmen/yazar zorunludur.' };
  }

  if (t.length === 1 || t === 'V.' || t.toUpperCase() === 'ER') {
    const isWhitelisted = SHORT_TITLE_WHITELIST.some(w => {
      if (w.type !== type || w.title.toLowerCase() !== t.toLowerCase()) return false;
      
      const whiteWords = w.author.toLowerCase().split(/\s+/);
      const inputWords = d.toLowerCase().split(/\s+/);
      
      return inputWords.some(word => word.length > 2 && whiteWords.includes(word)) || 
             w.author.toLowerCase().includes(d.toLowerCase());
    });

    if (!isWhitelisted) {
      return { isValid: false, error: 'Tek harfli/rakamlı veya kısıtlanmış kısa isimler yalnızca özel istisna listesine uyan yönetmen/yazarlarla girilebilir.' };
    }
  }

  return { isValid: true, t, d };
};
