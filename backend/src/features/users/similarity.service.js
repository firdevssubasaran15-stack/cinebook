const { dbQuery, dbGet } = require('@/database/db');

class SimilarityService {
  calculateSimilarity(currentUserId, targetUserId) {
    if (!currentUserId || currentUserId === targetUserId) {
      return null;
    }

    let totalScore = 0;
    let totalWeight = 0;

    // 1. Library Overlap (Max Weight: 40)
    const currentUserLib = dbQuery('SELECT content_id FROM library WHERE user_id = ?', [currentUserId]).map(row => row.content_id);
    const targetUserLib = dbQuery('SELECT content_id FROM library WHERE user_id = ?', [targetUserId]).map(row => row.content_id);
    
    if (currentUserLib.length > 0 || targetUserLib.length > 0) {
      const intersection = currentUserLib.filter(id => targetUserLib.includes(id));
      const union = new Set([...currentUserLib, ...targetUserLib]);
      const libraryScore = (intersection.length / union.size) * 100;
      totalScore += libraryScore * 0.40;
      totalWeight += 0.40;
    }

    // 2. Feeling Tags on same content (Max Weight: 40)
    const commonContentsQuery = `
      SELECT DISTINCT f1.content_id
      FROM feelings f1
      JOIN feelings f2 ON f1.content_id = f2.content_id
      WHERE f1.user_id = ? AND f2.user_id = ?
    `;
    const commonContents = dbQuery(commonContentsQuery, [currentUserId, targetUserId]).map(row => row.content_id);

    if (commonContents.length > 0) {
      let tagSimilaritySum = 0;
      for (const contentId of commonContents) {
        const tags1 = dbQuery('SELECT t.tag FROM feelings f JOIN feeling_tags t ON f.id = t.feeling_id WHERE f.user_id = ? AND f.content_id = ?', [currentUserId, contentId]).map(r => r.tag);
        const tags2 = dbQuery('SELECT t.tag FROM feelings f JOIN feeling_tags t ON f.id = t.feeling_id WHERE f.user_id = ? AND f.content_id = ?', [targetUserId, contentId]).map(r => r.tag);
        
        if (tags1.length > 0 || tags2.length > 0) {
           const intersect = tags1.filter(t => tags2.includes(t));
           const un = new Set([...tags1, ...tags2]);
           tagSimilaritySum += (intersect.length / un.size) * 100;
        }
      }
      const avgTagSimilarity = tagSimilaritySum / commonContents.length;
      totalScore += avgTagSimilarity * 0.40;
      totalWeight += 0.40;
    }

    // 3. Weekly Emotion Match (Max Weight: 20)
    const getWeeklyEmotion = (uId) => {
      const res = dbGet(`
        SELECT t.tag, COUNT(*) as count
        FROM feelings f
        JOIN feeling_tags t ON f.id = t.feeling_id
        WHERE f.user_id = ? AND f.created_at >= datetime('now', '-7 days')
        GROUP BY t.tag
        ORDER BY count DESC, f.created_at DESC
        LIMIT 1;
      `, [uId]);
      return res ? res.tag : null;
    };

    const currentWeekly = getWeeklyEmotion(currentUserId);
    const targetWeekly = getWeeklyEmotion(targetUserId);

    if (currentWeekly || targetWeekly) {
      const isMatch = (currentWeekly && targetWeekly && currentWeekly === targetWeekly) ? 100 : 0;
      totalScore += isMatch * 0.20;
      totalWeight += 0.20;
    }

    if (totalWeight === 0) {
      // Nothing to compare
      return null;
    }

    // Scale back to 100% based on available metrics
    const finalPercentage = Math.round((totalScore / totalWeight));
    return finalPercentage;
  }
}

module.exports = new SimilarityService();
