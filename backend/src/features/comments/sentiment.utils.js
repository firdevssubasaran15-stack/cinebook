class SentimentUtils {
  /**
   * Calculates sentiment score for a comment based on likes and dislikes
   * @param {Object} comment - The comment object containing like_count and dislike_count
   * @returns {Object} The comment object with added sentiment_score
   */
  static attachSentiment(comment) {
    const likes = comment.like_count || 0;
    const dislikes = comment.dislike_count || 0;
    const total = likes + dislikes;
    const score = total === 0 ? 0 : (likes - dislikes) / total;
    return { ...comment, sentiment_score: score };
  }

  /**
   * Applies external stats to a comment and calculates sentiment
   * @param {Object} comment - The base comment object
   * @param {Object} stats - Object containing like_count and dislike_count
   * @returns {Object} The updated comment object
   */
  static applyStatsAndSentiment(comment, stats) {
    const likes = stats.like_count || 0;
    const dislikes = stats.dislike_count || 0;
    const total = likes + dislikes;
    const score = total === 0 ? 0 : (likes - dislikes) / total;
    return { ...comment, like_count: likes, dislike_count: dislikes, sentiment_score: score };
  }
}

module.exports = SentimentUtils;
