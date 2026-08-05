import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, FlatList, Modal } from 'react-native';
import { router } from 'expo-router';
import { Image } from 'expo-image';
import Icon from '@/features/icon/components/Icon';
import { API_BASE_URL } from '@/constants/api';
import { userProfileStyles as styles } from '@/features/user/styles/userProfile.styles';

export default function UserListModal({ userListModal, setUserListModal, userListLoading, userList, COLORS, t }) {
  return (
    <Modal
      visible={userListModal.visible}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setUserListModal({ visible: false, type: null })}
    >
      <View className={styles.modalOverlay}>
        <View className={styles.listModalContainer}>
          <View className={styles.modalHeaderRow}>
            <Text className={styles.modalTitle}>
              {userListModal.type === 'followers' ? t('userProfile.modalFollowers') : t('userProfile.modalFollowing')}
            </Text>
            <TouchableOpacity onPress={() => setUserListModal({ visible: false, type: null })}>
              <Icon name="X" size={24} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>
          
          {userListLoading ? (
            <ActivityIndicator size="large" color={COLORS.primary} className="my-5" />
          ) : userList.length === 0 ? (
            <Text className="text-center my-5 text-text-lightSecondary dark:text-text-darkSecondary">
              {userListModal.type === 'followers' ? t('userProfile.noFollowers') : t('userProfile.noFollowing')}
            </Text>
          ) : (
            <FlatList
              data={userList}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className={styles.modalUserItem}
                  onPress={() => {
                    setUserListModal({ visible: false, type: null });
                    router.push(`/user/${item.id}`);
                  }}
                >
                  {item.profile_image ? (
                    <Image source={{ uri: `${API_BASE_URL}${item.profile_image}` }} className={styles.modalUserImage} contentFit="cover" />
                  ) : (
                    <View className={styles.modalUserImageFallback}>
                      <Text className="text-white font-bold text-base">{item.username[0].toUpperCase()}</Text>
                    </View>
                  )}
                  <Text className={styles.modalUserText}>@{item.username}</Text>
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      </View>
    </Modal>
  );
}
