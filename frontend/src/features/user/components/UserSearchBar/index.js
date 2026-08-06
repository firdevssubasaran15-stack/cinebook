import React from 'react';
import { View, Text, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { Image } from 'expo-image';
import Icon from '@/features/icon/components/Icon';
import { API_BASE_URL } from '@/constants/api';
import { userProfileStyles as styles } from '@/features/user/styles/userProfile.styles';

export default function UserSearchBar({ 
  userSearchQuery, handleUserSearch, userSearchLoading, userSearchResults, COLORS, t 
}) {
  return (
    <View className={styles.searchContainer}>
      <View className={styles.searchInputRow}>
        <Icon name="MagnifyingGlass" size={20} color={COLORS.textSecondary} />
        <TextInput
          className={styles.searchInput}
          placeholder={t('userProfile.searchUserPlaceholder')}
          placeholderTextColor={COLORS.textMuted}
          value={userSearchQuery}
          onChangeText={handleUserSearch}
        />
        {userSearchLoading && <ActivityIndicator size="small" color={COLORS.primary} style={{ marginLeft: 8 }} />}
      </View>
      
      {userSearchResults.length > 0 && (
        <View className={styles.searchResultsContainer}>
          {userSearchResults.map(u => (
            <TouchableOpacity 
              key={u.id} className={styles.searchResultItem}
              onPress={() => { handleUserSearch(''); router.push(`/user/${u.id}`); }}
            >
              {u.profile_image ? (
                <Image source={{ uri: `${API_BASE_URL}${u.profile_image}` }} className={styles.searchResultImage} contentFit="cover" />
              ) : (
                <View className={styles.searchResultImageFallback}>
                  <Text className="text-white font-bold">{u.username[0].toUpperCase()}</Text>
                </View>
              )}
              <Text className={styles.searchResultText}>@{u.username}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}
