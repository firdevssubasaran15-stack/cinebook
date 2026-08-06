class UsersEmotionsUtils {
  padEmotions(rows, limit) {
    const genericEmotions = ['mutluluk', 'huzur', 'heyecan', 'sevgi', 'umut', 'merak'];
    const tags = rows.map((r) => r.tag);

    if (tags.length < limit) {
      for (const emotion of genericEmotions) {
        if (!tags.includes(emotion)) {
          tags.push(emotion);
        }
        if (tags.length >= limit) break;
      }
    }

    return tags;
  }
}

module.exports = new UsersEmotionsUtils();
