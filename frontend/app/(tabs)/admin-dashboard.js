import React from 'react';
import { View, ScrollView } from 'react-native';
import { Redirect } from 'expo-router';
import { useAuth } from '@/context/AuthContext';

import AdminHeader from '@/features/admin/components/AdminHeader';
import BroadcastManager from '@/features/admin/components/BroadcastManager';
import AddContentForm from '@/features/admin/components/AddContentForm';
import PrivilegeManager from '@/features/admin/components/PrivilegeManager';

export default function AdminDashboard() {
  const { isAdmin, privileges } = useAuth();
  const hasAccess = isAdmin || privileges?.can_view_admin_panel === 1;

  if (!hasAccess) {
    return <Redirect href="/home" />;
  }

  return (
    <ScrollView className="flex-1 bg-light-bg dark:bg-dark-bg" contentContainerStyle={{ paddingBottom: 48 }}>
      <AdminHeader />
      <View className="p-4 mt-2">
        <BroadcastManager />
        <AddContentForm />
        <PrivilegeManager />
      </View>
    </ScrollView>
  );
}
