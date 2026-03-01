import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Header, StatsCard, SnapSlot, SlotState } from '../components';
import { patientAPI, PatientStatsResponse, DailyPrompt, PhotoSubmission } from '../api';

// For demo, use patient ID 1 (would come from auth in real app)
const DEMO_PATIENT_ID = 1;

// Patient avatar URLs (matching web app by name)
const PATIENT_AVATARS: Record<string, string> = {
  'Bryce Peterson': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
  'Emma Wilson': 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face',
  'Jacob Martinez': 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face',
  'Sophia Chen': 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop&crop=face',
  'Liam Johnson': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face',
  'Olivia Brown': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face',
  'Noah Davis': 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=face',
  'Ava Garcia': 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face',
};

// Time windows for each slot (displayed to user)
const TIME_WINDOWS: Record<string, string> = {
  Morning: '8:00-10:00 am',
  Midday: '12:00-3:00 pm',
  Evening: '7:00-9:00 pm',
};

const SLOT_NAMES: Record<number, 'Morning' | 'Midday' | 'Evening'> = {
  1: 'Morning',
  2: 'Midday',
  3: 'Evening',
};

type RootStackParamList = {
  Home: { submittedPhoto?: { promptId: number; imageUri: string; timestamp: string } } | undefined;
  Camera: { slotId: number; slotName: string; promptId: number };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Determine slot state based on prompt timing and submission status
function getSlotState(prompt: DailyPrompt): SlotState {
  if (prompt.submission) {
    return 'submitted';
  }
  
  const now = new Date();
  const notificationTime = new Date(prompt.notification_sent_at);
  const deadlineTime = new Date(prompt.submission_deadline_at);
  
  if (now < notificationTime) {
    return 'locked';
  }
  
  if (now >= notificationTime && now <= deadlineTime) {
    return 'active';
  }
  
  // Past deadline but same day
  const today = new Date().toDateString();
  if (new Date(prompt.date).toDateString() === today) {
    return 'late';
  }
  
  return 'missed';
}

function formatTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  }).toLowerCase();
}

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute();
  const [loading, setLoading] = useState(true);
  const [statsData, setStatsData] = useState<PatientStatsResponse | null>(null);
  const [prompts, setPrompts] = useState<DailyPrompt[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [streak, setStreak] = useState<number>(0);
  const [notifications, setNotifications] = useState<string[]>([]);
  const [submittedPhotos, setSubmittedPhotos] = useState<Record<number, { imageUri: string; timestamp: string }>>({});

  // Fetch data on mount
  useEffect(() => {
    fetchData();
  }, []);

  // Handle photo submission from Camera screen
  useEffect(() => {
    const params = route.params as { submittedPhoto?: { promptId: number; imageUri: string; timestamp: string } };
    if (params?.submittedPhoto) {
      setSubmittedPhotos(prev => ({
        ...prev,
        [params.submittedPhoto!.promptId]: {
          imageUri: params.submittedPhoto!.imageUri,
          timestamp: params.submittedPhoto!.timestamp,
        }
      }));
      // Update the prompt to show as submitted
      setPrompts(prev => prev.map(p => 
        p.id === params.submittedPhoto!.promptId
          ? { ...p, submission: { 
              id: 0, 
              daily_prompt_id: p.id, 
              image_url: params.submittedPhoto!.imageUri, 
              submitted_at: params.submittedPhoto!.timestamp, 
              is_on_time: true, 
              band_present: null, 
              reviewed_by: null 
            } as PhotoSubmission }
          : p
      ));
    }
  }, [route.params]);

  // Calculate streak and check notifications
  useEffect(() => {
    if (prompts.length > 0) {
      calculateStreak();
      checkNotifications();
    }
  }, [prompts, statsData]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [stats, todaysPrompts] = await Promise.all([
        patientAPI.getStats(DEMO_PATIENT_ID),
        patientAPI.getTodaysPrompts(DEMO_PATIENT_ID),
      ]);
      
      setStatsData(stats);
      setPrompts(todaysPrompts);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data');
      // Use fallback demo data (matching actual database)
      setStatsData({
        patient: { id: 1, name: 'Bryce Peterson', practice: 'Bennion Orthodontics' },
        stats: { onTimeSnaps: 74, onTimeChange: '-33%', totalSnaps: 74, totalDays: 1, ranking: 0 },
      });
      setPrompts([
        { id: 1, patient_id: 1, date: new Date().toISOString().split('T')[0], slot: 1, 
          notification_sent_at: new Date(new Date().setHours(9, 0)).toISOString(),
          submission_deadline_at: new Date(new Date().setHours(9, 2)).toISOString(),
          submission: { id: 1, daily_prompt_id: 1, image_url: '', submitted_at: new Date(new Date().setHours(8, 42)).toISOString(), is_on_time: true, band_present: true, reviewed_by: null }
        },
        { id: 2, patient_id: 1, date: new Date().toISOString().split('T')[0], slot: 2,
          notification_sent_at: new Date(new Date().setHours(14, 15)).toISOString(),
          submission_deadline_at: new Date(new Date().setHours(14, 17)).toISOString(),
          submission: null
        },
        { id: 3, patient_id: 1, date: new Date().toISOString().split('T')[0], slot: 3,
          notification_sent_at: new Date(new Date().setHours(20, 0)).toISOString(),
          submission_deadline_at: new Date(new Date().setHours(20, 2)).toISOString(),
          submission: null
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSlotPress = (prompt: DailyPrompt) => {
    const state = getSlotState(prompt);
    const slotName = SLOT_NAMES[prompt.slot];
    
    if (state === 'active' || state === 'late' || state === 'missed') {
      navigation.navigate('Camera', { 
        slotId: prompt.slot, 
        slotName, 
        promptId: prompt.id 
      });
    } else if (state === 'locked') {
      Alert.alert(
        'Slot Locked',
        `This slot will unlock during ${TIME_WINDOWS[slotName]}`
      );
    }
  };

  // Calculate current streak (consecutive days with all 3 photos submitted)
  const calculateStreak = () => {
    // Check if today all 3 prompts are submitted
    const todayAllSubmitted = prompts.length === 3 && prompts.every(p => p.submission !== null);
    
    if (todayAllSubmitted && statsData) {
      // Estimate streak: if they have high total snaps relative to days, likely good streak
      // In real app, would fetch historical data to calculate exact consecutive days
      const daysEnrolled = statsData.stats.totalDays || 1;
      const totalSnaps = statsData.stats.totalSnaps || 0;
      const expectedSnaps = daysEnrolled * 3;
      const completionRate = totalSnaps / expectedSnaps;
      
      // If completion rate is high, estimate a good streak
      // For demo: show a streak based on recent performance
      if (completionRate > 0.8) {
        // Estimate streak as a percentage of days enrolled (max 30 days for demo)
        const estimatedStreak = Math.min(Math.floor(daysEnrolled * completionRate), 30);
        setStreak(estimatedStreak);
      } else {
        // Low completion, streak likely broken
        setStreak(0);
      }
    } else {
      // Today not complete, streak is 0
      setStreak(0);
    }
  };

  // Check for notification conditions
  const checkNotifications = () => {
    const newNotifications: string[] = [];
    
    if (!statsData) return;
    
    // Check if below 50% completion all time
    if (statsData.stats.onTimeSnaps < 50) {
      newNotifications.push(`⚠️ Your completion rate is ${statsData.stats.onTimeSnaps}%. Aim for 100%!`);
    }
    
    // Check for 3 day streak of not submitting
    // Estimate: if total snaps is very low compared to days enrolled, likely missing days
    const daysEnrolled = statsData.stats.totalDays || 1;
    const totalSnaps = statsData.stats.totalSnaps || 0;
    const expectedSnaps = daysEnrolled * 3;
    const missingSnaps = expectedSnaps - totalSnaps;
    const missingDays = Math.floor(missingSnaps / 3);
    
    if (missingDays >= 3) {
      newNotifications.push(`🚨 You haven't submitted all 3 photos for ${missingDays} days. Get back on track!`);
    }
    
    // Photo reminders (active prompts)
    prompts.forEach(prompt => {
      const state = getSlotState(prompt);
      if (state === 'active') {
        const slotName = SLOT_NAMES[prompt.slot];
        newNotifications.push(`📸 Time to take your ${slotName} photo!`);
      }
    });
    
    setNotifications(newNotifications);
  };

  const handleNotificationPress = () => {
    if (notifications.length === 0) {
      Alert.alert('Notifications', 'No new notifications');
    } else {
      Alert.alert(
        'Notifications',
        notifications.join('\n\n'),
        [{ text: 'OK' }]
      );
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#5cc960" />
        <Text style={styles.loadingText}>Loading your dashboard...</Text>
      </View>
    );
  }

  const patient = statsData?.patient || { id: 1, name: 'Bryce Peterson', practice: 'Bennion Orthodontics' };
  const stats = statsData?.stats || { onTimeSnaps: 0, onTimeChange: '+0%', totalSnaps: 0, totalDays: 0, ranking: 50 };
  const avatarUrl = PATIENT_AVATARS[patient.name] || null;

  return (
    <View style={styles.container}>
      <Header 
        onNotificationPress={handleNotificationPress}
        streak={streak}
        hasNotifications={notifications.length > 0}
      />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            {avatarUrl ? (
              <Image source={{ uri: avatarUrl }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Ionicons name="person" size={60} color="#666" />
              </View>
            )}
            <View style={styles.bandzBadge}>
              <Text style={styles.bandzBadgeText}>B</Text>
            </View>
          </View>
          <Text style={styles.patientName}>{patient.name}</Text>
          <Text style={styles.practiceName}>{patient.practice}</Text>
        </View>

        {/* Stats Section */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Stats</Text>
          <View style={styles.statsRow}>
            <StatsCard
              title="On Time Snaps"
              value={`${stats.onTimeSnaps}%`}
              subtitle={`${stats.onTimeChange} WoW`}
            />
            <StatsCard
              title="Total Snaps"
              value={stats.totalSnaps.toString()}
              subtitle={`${stats.totalDays} Days`}
            />
            <StatsCard
              title="Ranking"
              value={`${stats.ranking}%`}
              subtitle={`of ${patient.practice} patients`}
            />
          </View>
        </View>

        {/* Today's Snaps Section */}
        <View style={styles.todaysSnapsSection}>
          <Text style={styles.sectionTitle}>Today's Snaps</Text>
          <View style={styles.snapsContainer}>
            <View style={styles.snapsRow}>
              {prompts.map((prompt) => {
                const state = getSlotState(prompt);
                const slotName = SLOT_NAMES[prompt.slot];
                // Check if we have a locally submitted photo
                const localPhoto = submittedPhotos[prompt.id];
                const submission = prompt.submission || (localPhoto ? {
                  id: 0,
                  daily_prompt_id: prompt.id,
                  image_url: localPhoto.imageUri,
                  submitted_at: localPhoto.timestamp,
                  is_on_time: true,
                  band_present: null,
                  reviewed_by: null,
                } as PhotoSubmission : null);
                
                const timestamp = submission 
                  ? formatTime(submission.submitted_at)
                  : state === 'missed' || state === 'late'
                    ? formatTime(prompt.notification_sent_at)
                    : undefined;
                
                return (
                  <SnapSlot
                    key={prompt.id}
                    state={submission ? 'submitted' : state}
                    slotName={slotName}
                    imageUri={submission?.image_url || undefined}
                    timestamp={timestamp}
                    expectedWindow={TIME_WINDOWS[slotName]}
                    onPress={() => handleSlotPress(prompt)}
                  />
                );
              })}
            </View>
          </View>
          
          <TouchableOpacity style={styles.viewMoreButton}>
            <Text style={styles.viewMoreText}>View more snaps</Text>
          </TouchableOpacity>
        </View>

        {error && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>⚠️ Using demo data - {error}</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#888',
    marginTop: 16,
    fontSize: 16,
  },
  content: {
    flex: 1,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bandzBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#000',
  },
  bandzBadgeText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  patientName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  practiceName: {
    fontSize: 14,
    color: '#888',
  },
  statsSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: -4,
  },
  todaysSnapsSection: {
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    marginHorizontal: 16,
    padding: 20,
    marginBottom: 32,
  },
  snapsContainer: {
    marginTop: 8,
  },
  snapsRow: {
    flexDirection: 'row',
    marginHorizontal: -4,
  },
  viewMoreButton: {
    backgroundColor: '#333',
    borderRadius: 24,
    paddingVertical: 14,
    marginTop: 20,
    alignItems: 'center',
  },
  viewMoreText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  errorBanner: {
    backgroundColor: '#332200',
    marginHorizontal: 16,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: '#fbbf24',
    fontSize: 12,
    textAlign: 'center',
  },
});
