import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { userProfileStyles as styles } from '@/features/user/styles/userProfile.styles';

export default function UserProfileTabs({ activeTab, setActiveTab, t }) {
  return (
    <View className={styles.tabsContainer}>
      <TouchableOpacity 
        className={`${styles.tabButtonBase} ${activeTab === 'comments' ? styles.tabButtonActive : styles.tabButtonInactive}`}
        onPress={() => setActiveTab('comments')}
      >
        <Text className={activeTab === 'comments' ? styles.tabTextActive : styles.tabTextInactive}>{t('userProfile.tabComments')}</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        className={`${styles.tabButtonBase} ${activeTab === 'lists' ? styles.tabButtonActive : styles.tabButtonInactive}`}
        onPress={() => setActiveTab('lists')}
      >
        <Text className={activeTab === 'lists' ? styles.tabTextActive : styles.tabTextInactive}>{t('userProfile.tabLists')}</Text>
      </TouchableOpacity>
    </View>
  );
}
