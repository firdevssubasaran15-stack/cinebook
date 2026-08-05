const sharedListsRepository = require('./shared-lists.repository');
const usersService = require('@/features/users/users.service');
const contentService = require('@/features/content/content.service');
const sharedListsPolicy = require('./shared-lists.policy');

class SharedListsService {
  _mapMembersWithOwner(ownerId, members) {
    const owner = usersService.getProfile(ownerId);
    const ownerMember = { 
      id: owner.id, 
      username: owner.username, 
      profile_image: owner.profile_image, 
      status: 'owner' 
    };
    return [ownerMember, ...members];
  }
  createList(userId, name, type) {
    if (!name || name.trim().length < 2) {
      throw new Error('Liste adı en az 2 karakter olmalıdır.');
    }
    if (type !== 'watching' && type !== 'reading') {
      throw new Error('Geçersiz liste türü.');
    }

    const trimmedName = name.trim();
    const result = sharedListsRepository.insertList(trimmedName, type, userId);
    return { id: result.lastInsertRowid, name: trimmedName, type, owner_id: userId, is_public: 1 };
  }

  getMyLists(userId) {
    return sharedListsRepository.getMyLists(userId);
  }

  getUserPublicLists(userId) {
    return sharedListsRepository.getUserPublicLists(userId);
  }

  getListDetails(listId, userId) {
    const list = sharedListsRepository.findById(listId);
    if (!list) throw new Error('Liste bulunamadı.');

    sharedListsPolicy.canView(list, userId);

    const members = sharedListsRepository.getListMembers(listId);
    const allMembers = this._mapMembersWithOwner(list.owner_id, members);
    
    const contents = sharedListsRepository.getListContents(listId);
    const isSaved = sharedListsRepository.findSavedList(listId, userId);

    return { ...list, members: allMembers, contents, is_saved_by_user: !!isSaved };
  }

  inviteUser(listId, ownerId, targetUserId) {
    const list = sharedListsRepository.findById(listId);
    if (!list) throw new Error('Liste bulunamadı.');
    
    sharedListsPolicy.canInvite(list, ownerId, targetUserId);

    const targetUser = usersService.getProfile(targetUserId);
    if (!targetUser) throw new Error('Davet edilecek kullanıcı bulunamadı.');

    const existing = sharedListsRepository.findAnyMemberStatus(listId, targetUserId);
    if (existing) {
      if (existing.status === 'accepted') throw new Error('Kullanıcı zaten bu listeye üye.');
      if (existing.status === 'pending') throw new Error('Kullanıcıya zaten davet gönderilmiş.');
    }

    sharedListsRepository.insertMemberPending(listId, targetUserId);
    return { success: true };
  }

  acceptInvite(listId, userId) {
    const existing = sharedListsRepository.findPendingMember(listId, userId);
    if (!existing) throw new Error('Geçerli bir davet bulunamadı.');

    sharedListsRepository.updateMemberAccepted(listId, userId);
    return { success: true };
  }

  rejectInvite(listId, userId) {
    sharedListsRepository.deletePendingMember(listId, userId);
    return { success: true };
  }

  addContent(listId, userId, contentId) {
    const list = sharedListsRepository.findById(listId);
    if (!list) throw new Error('Liste bulunamadı.');

    sharedListsPolicy.canAddContent(list, userId);

    const content = contentService.getById(contentId);
    if (!content) throw new Error('İçerik bulunamadı.');

    const existing = sharedListsRepository.findListContent(listId, contentId);
    if (existing) throw new Error('Bu içerik zaten listede.');

    sharedListsRepository.insertListContent(listId, contentId, userId);
    return { success: true };
  }

  getPendingInvitations(userId) {
    return sharedListsRepository.getPendingInvitations(userId);
  }

  toggleVisibility(listId, userId) {
    const list = sharedListsRepository.findById(listId);
    if (!list) throw new Error('Liste bulunamadı.');
    
    sharedListsPolicy.canToggleVisibility(list, userId);

    const newVisibility = list.is_public === 1 ? 0 : 1;
    sharedListsRepository.updateListVisibility(listId, newVisibility);
    
    return { ...list, is_public: newVisibility };
  }

  saveList(listId, userId) {
    const list = sharedListsRepository.findById(listId);
    if (!list) throw new Error('Liste bulunamadı.');
    
    sharedListsPolicy.canSave(list, userId);
    
    const existing = sharedListsRepository.findSavedList(listId, userId);
    if (existing) return { success: true };

    sharedListsRepository.insertSavedList(listId, userId);
    return { success: true };
  }

  unsaveList(listId, userId) {
    sharedListsRepository.deleteSavedList(listId, userId);
    return { success: true };
  }
}

module.exports = new SharedListsService();
