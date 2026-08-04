import { useState, useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import { router } from 'expo-router';
import { sharedListsApi } from '@/api/endpoints/shared-lists.api';

export const useInvitations = (user) => {
  const [invitation, setInvitation] = useState(null);
  const slideAnim = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    if (!user) return;

    const checkInvitations = async () => {
      try {
        const res = await sharedListsApi.getPendingInvitations();
        const invites = res.data.data;
        if (invites && invites.length > 0) {
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

    checkInvitations();
    const interval = setInterval(checkInvitations, 15000);

    return () => clearInterval(interval);
  }, [user, invitation]);

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

  return {
    invitation,
    slideAnim,
    handleAccept,
    handleReject
  };
};
