import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, TextInput, Modal } from 'react-native';
import { Image } from 'expo-image';
import Icon from '@/features/icon/components/Icon';
import { API_BASE_URL } from '@/constants/api';
import { userProfileStyles as styles } from '@/features/user/styles/userProfile.styles';

export default function EditProfileModal({ 
  editProfileModal, setEditProfileModal, pickImage, profile, 
  isUploadingImage, newUsername, setNewUsername, COLORS, 
  isSavingProfile, handleSaveUsername, t 
}) {
  return (
    <Modal
      visible={editProfileModal}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setEditProfileModal(false)}
    >
      <View className={styles.modalOverlay}>
        <View className={styles.editModalContainer}>
          <Text className="text-lg font-bold mb-5 text-text-lightPrimary dark:text-text-darkPrimary">
            {t('userProfile.editProfileTitle')}
          </Text>
          
          <TouchableOpacity onPress={pickImage} className={styles.editImageButton}>
            {profile?.profile_image ? (
              <Image 
                source={{ uri: `${API_BASE_URL}${profile.profile_image}` }} 
                className={styles.editImagePreview}
                contentFit="cover" 
              />
            ) : (
              <View className={styles.editImageFallback}>
                <Text className={styles.editImageFallbackText}>{profile?.username?.[0]?.toUpperCase()}</Text>
              </View>
            )}
            <View className={styles.editIconContainer}>
              {isUploadingImage ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Icon name="Camera" size={14} color="#fff" />
              )}
            </View>
          </TouchableOpacity>
          
          <View className="w-full mb-6">
            <Text className={styles.editInputLabel}>{t('userProfile.usernameLabel')}</Text>
            <TextInput
              className={styles.editInput}
              value={newUsername}
              onChangeText={setNewUsername}
              placeholder="Kullanıcı adı"
              placeholderTextColor={COLORS.textMuted}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View className={styles.editButtonsRow}>
            <TouchableOpacity 
              className={styles.editCancelButton}
              onPress={() => setEditProfileModal(false)}
              disabled={isSavingProfile}
            >
              <Text className={styles.editCancelText}>{t('userProfile.cancel')}</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              className={styles.editSaveButton}
              onPress={handleSaveUsername}
              disabled={isSavingProfile}
            >
              {isSavingProfile ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text className={styles.editSaveText}>{t('userProfile.save')}</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
