import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Tabs, router } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { sharedListsApi } from '@/api/endpoints/shared-lists.api';
import Icon from '@/features/icon/components/Icon';

function TabIcon({ name, focused, colors }) {
  return (
    <Icon 
      name={name} 
      size={24} 
      color={focused ? colors.primary : colors.textMuted} 
      weight={focused ? 'fill' : 'regular'} 
    />
  );
}

export default function TabsLayout() {
  const { user, isAdmin, privileges } = useAuth();
  const { colors: COLORS } = useTheme();

  // Notification State
  const [invitation, setInvitation] = useState(null);
  const slideAnim = React.useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    if (!user) return;

    const checkInvitations = async () => {
      try {
        const res = await sharedListsApi.getPendingInvitations();
        const invites = res.data.data;
        if (invites && invites.length > 0) {
          // Show the first one
          if (!invitation || invitation.id !== invites[0].id) {
            setInvitation(invites[0]);
            showToast();
          }
        } else {
          hideToast();
        }
      } catch (err) {
        // ignore silently
      }
    };

    checkInvitations(); // Initial check
    const interval = setInterval(checkInvitations, 15000); // Check every 15 seconds

    return () => clearInterval(interval);
  }, [user]);

  const showToast = () => {
    Animated.spring(slideAnim, { toValue: 20, useNativeDriver: true }).start();
  };

  const hideToast = () => {
    Animated.timing(slideAnim, { toValue: -150, duration: 300, useNativeDriver: true }).start(() => {
      setInvitation(null);
    });
  };

  const handleAccept = async () => {
    if (!invitation) return;
    try {
      await sharedListsApi.acceptInvite(invitation.id);
      hideToast();
      router.push(`/shared-list/${invitation.id}`);
    } catch(err) {
      console.log('Accept err', err);
    }
  };

  const handleReject = async () => {
    if (!invitation) return;
    try {
      await sharedListsApi.rejectInvite(invitation.id);
      hideToast();
    } catch(err) {
      console.log('Reject err', err);
    }
  };

  return (
    <View style={{ flex: 1 }}>
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textMuted,
        headerStyle: { backgroundColor: COLORS.background },
        headerTintColor: COLORS.textPrimary,
        headerTitleStyle: { fontWeight: '700' }
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Ana Sayfa',
          headerShown: false,
          tabBarIcon: ({ focused }) => <TabIcon name="House" focused={focused} colors={COLORS} />,
        }}
      />
      <Tabs.Screen
        name="movies"
        options={{
          title: 'Filmler',
          tabBarIcon: ({ focused }) => <TabIcon name="FilmStrip" focused={focused} colors={COLORS} />,
        }}
      />
      <Tabs.Screen
        name="series"
        options={{
          title: 'Diziler',
          tabBarIcon: ({ focused }) => <TabIcon name="Television" focused={focused} colors={COLORS} />,
        }}
      />
      <Tabs.Screen
        name="books"
        options={{
          title: 'Kitaplar',
          tabBarIcon: ({ focused }) => <TabIcon name="Books" focused={focused} colors={COLORS} />,
        }}
      />
      <Tabs.Screen
        name="library"
        options={{
          title: 'Kitaplık',
          headerShown: false,
          tabBarIcon: ({ focused }) => <TabIcon name="BookmarkSimple" focused={focused} colors={COLORS} />,
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          href: null,
          title: 'Bildirimler',
        }}
      />
      {(isAdmin || privileges?.can_view_admin_panel === 1) ? (
        <Tabs.Screen
          name="admin-dashboard"
          options={{
            title: 'Admin',
            headerShown: false,
            tabBarIcon: ({ focused }) => <TabIcon name="Gear" focused={focused} colors={COLORS} />,
          }}
        />
      ) : (
        <Tabs.Screen
          name="admin-dashboard"
          options={{ href: null }}
        />
      )}
    </Tabs>

      {/* Üstten Düşen Bildirim (Toast) */}
      <Animated.View style={[
        styles.toastContainer, 
        { 
          backgroundColor: COLORS.surfaceElevated, 
          borderColor: COLORS.border,
          transform: [{ translateY: slideAnim }] 
        }
      ]}>
        {invitation && (
          <View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 8 }}>
              <Icon name="EnvelopeSimpleOpen" size={20} color={COLORS.primary} weight="fill" />
              <Text style={{ color: COLORS.textPrimary, fontWeight: 'bold', flex: 1 }}>Yeni Liste Daveti!</Text>
            </View>
            <Text style={{ color: COLORS.textSecondary, fontSize: 13, marginBottom: 12 }}>
              <Text style={{ fontWeight: 'bold', color: COLORS.textPrimary }}>@{invitation.owner_username}</Text> seni "{invitation.name}" listesine davet ediyor.
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 12 }}>
              <TouchableOpacity onPress={handleReject} style={{ paddingVertical: 6, paddingHorizontal: 12 }}>
                <Text style={{ color: COLORS.textMuted, fontWeight: '600' }}>Reddet</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleAccept} style={{ backgroundColor: COLORS.primary, paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8 }}>
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Kabul Et</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    top: 20,
    left: 16,
    right: 16,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
    zIndex: 1000
  }
});
