import React from 'react';
import { View } from 'react-native';
import UserProfileInfo from './UserProfileInfo';
import UserSearchBar from './UserSearchBar';
import UserProfileTabs from './UserProfileTabs';

export default function UserProfileHeader(props) {
  return (
    <View>
      <UserProfileInfo {...props} />
      <UserSearchBar {...props} />
      <UserProfileTabs {...props} />
    </View>
  );
}
