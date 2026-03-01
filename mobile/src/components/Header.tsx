import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface HeaderProps {
  onNotificationPress?: () => void;
  streak?: number;
  hasNotifications?: boolean;
}

export default function Header({ onNotificationPress, streak, hasNotifications }: HeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.leftSection}>
        <TouchableOpacity onPress={onNotificationPress} style={styles.iconButton}>
          <Ionicons name="notifications" size={28} color="#fff" />
          {hasNotifications && <View style={styles.notificationBadge} />}
        </TouchableOpacity>
        {streak !== undefined && streak > 0 && (
          <View style={styles.streakContainer}>
            <Ionicons name="flame" size={16} color="#5cc960" />
            <Text style={styles.streakText}>{streak} day{streak !== 1 ? 's' : ''}</Text>
          </View>
        )}
      </View>
      
      <Image
        source={require('../../assets/BANDZLOGO.jpg')}
        style={styles.logo}
        resizeMode="contain"
      />
      
      <View style={styles.rightSection} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  rightSection: {
    width: 40, // Placeholder to balance layout
  },
  iconButton: {
    padding: 4,
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ef4444',
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  streakText: {
    color: '#5cc960',
    fontSize: 14,
    fontWeight: '600',
  },
  logo: {
    height: 28,
    width: 120,
  },
});
