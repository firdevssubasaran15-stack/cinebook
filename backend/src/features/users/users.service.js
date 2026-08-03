const { dbQuery, dbGet, dbRun } = require('@/database/db');
const similarityService = require('./similarity.service');
const notificationsService = require('@/features/notifications/notifications.service');

class UsersService {
  getProfile(userId, currentUserId = null) {
    const user = dbGet('SELECT id, username, profile_image, created_at FROM users WHERE id = ?', [userId]);
    if (!user) throw new Error('Kullanıcı bulunamadı.');

    const followersCount = dbGet('SELECT COUNT(*) as count FROM followers WHERE following_id = ?', [userId]).count;
    const followingCount = dbGet('SELECT COUNT(*) as count FROM followers WHERE follower_id = ?', [userId]).count;
    
    let isFollowing = false;
    if (currentUserId) {
      const follow = dbGet('SELECT * FROM followers WHERE follower_id = ? AND following_id = ?', [currentUserId, userId]);
      isFollowing = !!follow;
    }

    const weeklyEmotion = dbGet(`
      SELECT t.tag, COUNT(*) as count
      FROM feelings f
      JOIN feeling_tags t ON f.id = t.feeling_id
      WHERE f.user_id = ? AND f.created_at >= datetime('now', '-7 days')
      GROUP BY t.tag
      ORDER BY count DESC, f.created_at DESC
      LIMIT 1;
    `, [userId]);
    
    let similarityPercentage = null;
    if (currentUserId && currentUserId !== userId) {
      similarityPercentage = similarityService.calculateSimilarity(currentUserId, userId);
    }

    return {
      ...user,
      followersCount,
      followingCount,
      isFollowing,
      similarityPercentage,
      weeklyEmotion: weeklyEmotion ? weeklyEmotion.tag : null
    };
  }

  toggleFollow(followerId, followingId) {
    if (followerId === followingId) {
      throw new Error('Kendinizi takip edemezsiniz.');
    }

    const user = dbGet('SELECT id FROM users WHERE id = ?', [followingId]);
    if (!user) throw new Error('Kullanıcı bulunamadı.');

    const existingFollow = dbGet('SELECT * FROM followers WHERE follower_id = ? AND following_id = ?', [followerId, followingId]);

    if (existingFollow) {
      dbRun('DELETE FROM followers WHERE follower_id = ? AND following_id = ?', [followerId, followingId]);
      return { following: false };
    } else {
      dbRun('INSERT INTO followers (follower_id, following_id) VALUES (?, ?)', [followerId, followingId]);
      
      // Bildirim gönder
      const follower = dbGet('SELECT username FROM users WHERE id = ?', [followerId]);
      if (follower) {
        notificationsService.createNotification(
          followingId,
          'follow',
          `@${follower.username} seni takip etmeye başladı.`,
          followerId
        );
      }

      return { following: true };
    }
  }

  getFollowers(userId) {
    const query = `
      SELECT u.id, u.username, u.profile_image
      FROM followers f
      JOIN users u ON f.follower_id = u.id
      WHERE f.following_id = ?
    `;
    return dbQuery(query, [userId]);
  }

  getFollowing(userId) {
    const query = `
      SELECT u.id, u.username, u.profile_image
      FROM followers f
      JOIN users u ON f.following_id = u.id
      WHERE f.follower_id = ?
    `;
    return dbQuery(query, [userId]);
  }

  updateProfileImage(userId, imagePath) {
    dbRun('UPDATE users SET profile_image = ? WHERE id = ?', [imagePath, userId]);
    return dbGet('SELECT id, username, profile_image FROM users WHERE id = ?', [userId]);
  }

  updateUsername(userId, newUsername) {
    if (!newUsername || newUsername.trim().length < 3 || newUsername.trim().length > 20) {
      throw new Error('Kullanıcı adı 3 ile 20 karakter arasında olmalıdır.');
    }
    
    const sanitizedUsername = newUsername.trim().toLowerCase();
    
    if (!/^[a-z0-9_]+$/.test(sanitizedUsername)) {
      throw new Error('Kullanıcı adı sadece küçük harf, rakam ve alt çizgi içerebilir.');
    }

    const existingUser = dbGet('SELECT id FROM users WHERE username = ? COLLATE NOCASE', [sanitizedUsername]);
    if (existingUser && existingUser.id !== userId) {
      throw new Error('Bu kullanıcı adı zaten kullanılıyor.');
    }

    dbRun('UPDATE users SET username = ? WHERE id = ?', [sanitizedUsername, userId]);
    
    // Return all properties needed by AuthContext to update properly
    return dbGet('SELECT id, username, email, is_admin, theme_preference, profile_image, notifications_enabled, notification_interval FROM users WHERE id = ?', [userId]);
  }

  searchUsers(query) {
    if (!query || query.trim().length < 2) {
      return [];
    }
    const searchQuery = `%${query.trim().toLowerCase()}%`;
    return dbQuery('SELECT id, username, profile_image, created_at FROM users WHERE username LIKE ? LIMIT 10', [searchQuery]);
  }

  updateNotificationSettings(userId, enabled, interval) {
    const isEnabled = enabled ? 1 : 0;
    
    if (interval) {
      dbRun('UPDATE users SET notifications_enabled = ?, notification_interval = ? WHERE id = ?', [isEnabled, interval, userId]);
    } else {
      dbRun('UPDATE users SET notifications_enabled = ? WHERE id = ?', [isEnabled, userId]);
    }
    
    return dbGet('SELECT id, username, email, is_admin, theme_preference, profile_image, notifications_enabled, notification_interval FROM users WHERE id = ?', [userId]);
  }

  getTopEmotions(userId, limit = 5) {
    const rows = dbQuery(`
      SELECT t.tag, COUNT(*) as count
      FROM feelings f
      JOIN feeling_tags t ON f.id = t.feeling_id
      WHERE f.user_id = ?
      GROUP BY t.tag
      ORDER BY count DESC, f.created_at DESC
      LIMIT ?
    `, [userId, limit]);
    
    // If the user has fewer than 5 emotions, fill the rest with generic popular ones
    const genericEmotions = ['mutluluk', 'huzur', 'heyecan', 'sevgi', 'umut', 'merak'];
    const tags = rows.map(r => r.tag);
    
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

module.exports = new UsersService();
