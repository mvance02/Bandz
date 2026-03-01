import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export type SlotState = 'locked' | 'active' | 'late' | 'submitted' | 'missed';

interface SnapSlotProps {
  state: SlotState;
  slotName: 'Morning' | 'Midday' | 'Evening';
  imageUri?: string;
  timestamp?: string;
  expectedWindow?: string;
  onPress?: () => void;
}

export default function SnapSlot({
  state,
  slotName,
  imageUri,
  timestamp,
  expectedWindow,
  onPress,
}: SnapSlotProps) {
  const renderContent = () => {
    switch (state) {
      case 'submitted':
        return (
          <View style={styles.submittedContent}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.photo} resizeMode="cover" />
            ) : (
              <View style={[styles.photo, styles.placeholderPhoto]}>
                <Ionicons name="checkmark-circle" size={32} color="#5cc960" />
              </View>
            )}
            <View style={[styles.timestampBadge, styles.greenBadge]}>
              <Text style={styles.timestampText}>{timestamp}</Text>
            </View>
          </View>
        );

      case 'missed':
      case 'late':
        return (
          <TouchableOpacity style={styles.missedContent} onPress={onPress}>
            <View style={styles.iconContainer}>
              <Ionicons name="notifications-off" size={28} color="#888" />
            </View>
            <Text style={styles.missedText}>
              You missed your Bandz notification! Take a late pic and get delayed credit!
            </Text>
            <View style={[styles.timestampBadge, styles.redBadge]}>
              <Text style={styles.timestampText}>{timestamp}</Text>
            </View>
          </TouchableOpacity>
        );

      case 'locked':
        return (
          <View style={styles.lockedContent}>
            <View style={styles.iconContainer}>
              <Ionicons name="lock-closed" size={28} color="#888" />
            </View>
            <Text style={styles.lockedText}>
              Expect your {slotName.toLowerCase()} notification between {expectedWindow}
            </Text>
          </View>
        );

      case 'active':
        return (
          <TouchableOpacity style={styles.activeContent} onPress={onPress}>
            <View style={[styles.iconContainer, styles.activeIcon]}>
              <Ionicons name="camera" size={28} color="#000" />
            </View>
            <Text style={styles.activeText}>Tap to capture now!</Text>
            <View style={[styles.timestampBadge, styles.greenBadge]}>
              <Text style={styles.timestampText}>NOW</Text>
            </View>
          </TouchableOpacity>
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {renderContent()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    marginHorizontal: 4,
    minHeight: 160,
    overflow: 'hidden',
  },
  submittedContent: {
    flex: 1,
    position: 'relative',
  },
  photo: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  placeholderPhoto: {
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timestampBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    right: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignItems: 'center',
  },
  greenBadge: {
    backgroundColor: '#5cc960',
  },
  redBadge: {
    backgroundColor: '#ef4444',
  },
  timestampText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  missedContent: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#3a3a3a',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  missedText: {
    color: '#888',
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 16,
    marginBottom: 8,
  },
  lockedContent: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockedText: {
    color: '#888',
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 16,
  },
  activeContent: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a3a1a',
  },
  activeIcon: {
    backgroundColor: '#5cc960',
  },
  activeText: {
    color: '#5cc960',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },
});
