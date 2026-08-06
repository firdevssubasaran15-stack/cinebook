import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from '../PrivilegeManager/styles';

export default function UserSearchResults({ searchResults, selectedUser, selectUser }) {
  if (!searchResults || searchResults.length === 0) return null;

  return (
    <>
      {searchResults.map((u) => (
        <TouchableOpacity
          key={u.id}
          className={`${styles.userRow} ${selectedUser?.id === u.id ? styles.userRowSelected : styles.userRowUnselected}`}
          onPress={() => selectUser(u)}
        >
          <View className={styles.avatarContainer}>
            <Text className={styles.avatarText}>{u.username[0].toUpperCase()}</Text>
          </View>
          <View className={styles.userInfoContainer}>
            <Text className={styles.usernameText}>{u.username}</Text>
            <Text className={styles.emailText}>{u.email}</Text>
          </View>
          {u.is_admin ? <Text className={styles.adminBadge}>ADMIN</Text> : null}
        </TouchableOpacity>
      ))}
    </>
  );
}
