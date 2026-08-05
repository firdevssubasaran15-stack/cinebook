const usersRepository = require('./users.repository');
const similarityService = require('./similarity.service');
const notificationsService = require('@/features/notifications/notifications.service');
const feelingsRepository = require('@/features/feelings/feelings.repository');

class UsersService {
  getProfile(userId, currentUserId = null) {
    const user = usersRepository.findById(userId);
    if (!user) throw new Error('Kullanıcı bulunamadı.');

    const followersCount = usersRepository.getFollowersCount(userId);
    const followingCount = usersRepository.getFollowingCount(userId);
    
    let isFollowing = false;
    if (currentUserId) {
      const follow = usersRepository.findFollow(currentUserId, userId);
      isFollowing = !!follow;
    }

    const weeklyEmotion = feelingsRepository.getUserWeeklyEmotion(userId);
    
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

    const user = usersRepository.checkUserExists(followingId);
    if (!user) throw new Error('Kullanıcı bulunamadı.');

    const existingFollow = usersRepository.findFollow(followerId, followingId);

    if (existingFollow) {
      usersRepository.deleteFollow(followerId, followingId);
      return { following: false };
    } else {
      usersRepository.insertFollow(followerId, followingId);
      
      // Bildirim gönder
      const follower = usersRepository.getUsername(followerId);
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
    return usersRepository.getFollowers(userId);
  }

  getFollowing(userId) {
    return usersRepository.getFollowing(userId);
  }

  updateProfileImage(userId, imagePath) {
    usersRepository.updateProfileImage(userId, imagePath);
    return usersRepository.getUserProfileBasic(userId);
  }

  updateUsername(userId, newUsername) {
    if (!newUsername || newUsername.trim().length < 3 || newUsername.trim().length > 20) {
      throw new Error('Kullanıcı adı 3 ile 20 karakter arasında olmalıdır.');
    }
    
    const sanitizedUsername = newUsername.trim().toLowerCase();
    
    if (!/^[a-z0-9_]+$/.test(sanitizedUsername)) {
      throw new Error('Kullanıcı adı sadece küçük harf, rakam ve alt çizgi içerebilir.');
    }

    const existingUser = usersRepository.findByUsername(sanitizedUsername);
    if (existingUser && existingUser.id !== userId) {
      throw new Error('Bu kullanıcı adı zaten kullanılıyor.');
    }

    usersRepository.updateUsername(userId, sanitizedUsername);
    
    // Return all properties needed by AuthContext to update properly
    return usersRepository.getUserAuthProfile(userId);
  }

  searchUsers(query) {
    if (!query || query.trim().length < 2) {
      return [];
    }
    const searchQuery = `%${query.trim().toLowerCase()}%`;
    return usersRepository.searchByUsername(searchQuery);
  }

  updateNotificationSettings(userId, enabled, interval) {
    const isEnabled = enabled ? 1 : 0;
    
    usersRepository.updateNotificationSettings(userId, isEnabled, interval);
    
    return usersRepository.getUserAuthProfile(userId);
  }

  getTopEmotions(userId, limit = 5) {
    const rows = feelingsRepository.getUserTopEmotions(userId, limit);
    
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

  getUserPrivileges(userId) {
    return usersRepository.getUserPrivileges(userId);
  }

  getUsername(userId) {
    return usersRepository.getUsername(userId);
  }
}

module.exports = new UsersService();
