import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Pressable, Keyboard, Platform, Linking } from 'react-native';
import { Slot, useRouter, usePathname, useSegments, router } from 'expo-router';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import URLParse from 'url-parse';
export default function Layout() {
  const currentRouter = useRouter();

   
  // const { userId } = currentRouter.query;
  const currentPath = usePathname();
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  
  // Track which tab is active
  const isDashboardActive = currentPath === '/screen/Resident/dashboardscreen' || currentPath === '/';
  const isNoticesActive = currentPath === '/screen/Resident/notices';

  // Navigate to dashboard on initial render if we're at the root
  useEffect(() => {

    if (currentPath === '/') {
      router.replace('/screen/Resident/dashboardscreen');
    }
    
  }, []);

  const navigateTo = (route: string) => {
    currentRouter.push(route as any);
  };

  // Listen for keyboard events
  useEffect(() => {
    const keyboardShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardHideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardShowListener.remove();
      keyboardHideListener.remove();
    };
  }, []);

  return (
    <View style={styles.container}>
      {/* Main content area */}
      <View style={styles.content}>
        <Slot />
      </View>

      {/* Fixed bottom navbar - hidden when keyboard is visible */}
      {!isKeyboardVisible && (
        <View style={styles.navbarContainer}>
          <View style={styles.navbar}>
            <Pressable
              style={[
                styles.navButton,
                isDashboardActive && styles.activeNavButton
              ]}
              onPress={() => navigateTo('/screen/Resident/dashboardscreen')}
            >
              <MaterialCommunityIcons 
                name="view-dashboard" 
                size={26} 
                color={isDashboardActive ? "#fff" : "#555"} 
              />
            </Pressable>
            
            <View style={styles.navSpacer} />
            
            <Pressable
              style={[
                styles.navButton,
                isNoticesActive && styles.activeNavButton
              ]}
              onPress={() => navigateTo('/screen/Resident/notices')}
            >
              <MaterialCommunityIcons 
                name="bell" 
                size={26} 
                color={isNoticesActive ? "#fff" : "#555"} 
              />
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EFF3F6",
  },
  content: {
    flex: 1,
    paddingBottom: 90, // Only needed when navbar is visible
  },
  navbarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingBottom: 10,
    backgroundColor: 'transparent',
    zIndex: 1000,
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    height: 70,
    borderRadius: 35,
    paddingHorizontal: 40,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  navButton: {
    padding: 14,
    borderRadius: 30,
    backgroundColor: '#D1E7DD',
  },
  activeNavButton: {
    backgroundColor: '#5A8F7B',
  },
  navSpacer: {
    flex: 1,
  },
});
