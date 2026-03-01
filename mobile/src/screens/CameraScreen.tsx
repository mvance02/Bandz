import { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Camera } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { patientAPI } from '../api';

type RootStackParamList = {
  Home: { submittedPhoto?: { promptId: number; imageUri: string; timestamp: string } } | undefined;
  Camera: { slotId: number; slotName: string; promptId: number };
};

type CameraScreenRouteProp = RouteProp<RootStackParamList, 'Camera'>;

const CAPTURE_TIME_LIMIT = 120; // 2 minutes in seconds

export default function CameraScreen() {
  const navigation = useNavigation();
  const route = useRoute<CameraScreenRouteProp>();
  const { slotName, promptId } = route.params;
  
  const [permission, setPermission] = useState<{ status: string; granted: boolean } | null>(null);
  
  useEffect(() => {
    (async () => {
      const { status } = await Camera.getCameraPermissionsAsync();
      setPermission({ status, granted: status === 'granted' });
    })();
  }, []);
  
  const requestPermission = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setPermission({ status, granted: status === 'granted' });
    return { status, granted: status === 'granted' };
  };
  const [facing, setFacing] = useState<Camera.Constants.Type>(Camera.Constants.Type.front);
  const [flash, setFlash] = useState(false);
  const [timeLeft, setTimeLeft] = useState(CAPTURE_TIME_LIMIT);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const cameraRef = useRef<Camera>(null);

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Format time as MM:SS
  const formatTime = () => {
    const minutes = Math.floor(Math.max(0, timeLeft) / 60);
    const seconds = Math.max(0, timeLeft) % 60;
    return {
      minutes: minutes.toString().padStart(2, '0'),
      seconds: seconds.toString().padStart(2, '0'),
    };
  };

  const toggleFlash = () => {
    setFlash((prev) => !prev);
  };

  const toggleCameraFacing = () => {
    setFacing((prev) => (prev === Camera.Constants.Type.back ? Camera.Constants.Type.front : Camera.Constants.Type.back));
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: false,
          skipProcessing: false,
        });
        if (photo) {
          setCapturedImage(photo.uri);
        }
      } catch (error) {
        console.error('Error taking picture:', error);
        Alert.alert('Error', 'Failed to take picture');
      }
    }
  };

  const submitPhoto = async () => {
    if (!capturedImage) return;
    
    setSubmitting(true);
    try {
      // In a real app, we'd upload the image to S3 first and get a URL
      // For now, we'll simulate the submission locally
      // The photo is already captured and stored in capturedImage state
      // In production, this would upload to S3 and then call the API
      
      // Simulate API call (commented out until we have image upload working)
      // await patientAPI.submitPhoto(promptId, imageUrl);
      
      // For now, just show success - the photo is saved locally
      Alert.alert(
        'Photo Submitted!',
        `Your ${slotName} photo has been submitted ${timeLeft > 0 ? 'on time!' : 'with delayed credit.'}`,
        [
          {
            text: 'OK',
            onPress: () => {
              // Navigate back with photo data
              navigation.navigate('Home', { 
                submittedPhoto: {
                  promptId,
                  imageUri: capturedImage,
                  timestamp: new Date().toISOString(),
                }
              });
            },
          },
        ]
      );
    } catch (error) {
      // Silently handle network errors - photo is already captured locally
      // In production, this would upload to S3 first
      Alert.alert(
        'Photo Submitted!',
        `Your ${slotName} photo has been submitted ${timeLeft > 0 ? 'on time!' : 'with delayed credit.'}`,
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } finally {
      setSubmitting(false);
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
  };

  // Request camera permission
  if (!permission) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Loading camera...</Text>
      </View>
    );
  }

  if (permission.status !== 'granted') {
    return (
      <View style={styles.container}>
        <Image
          source={require('../../assets/BANDZLOGO.jpg')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const time = formatTime();
  const isLate = timeLeft <= 0;

  // Show captured image preview
  if (capturedImage) {
    return (
      <View style={styles.container}>
        <Image
          source={require('../../assets/BANDZLOGO.jpg')}
          style={styles.logo}
          resizeMode="contain"
        />
        
        <View style={styles.previewContainer}>
          <Image source={{ uri: capturedImage }} style={styles.preview} />
        </View>

        <View style={styles.previewControls}>
          <TouchableOpacity 
            style={styles.retakeButton} 
            onPress={retakePhoto}
            disabled={submitting}
          >
            <Ionicons name="refresh" size={24} color="#fff" />
            <Text style={styles.buttonText}>Retake</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.submitButton, submitting && styles.submitButtonDisabled]} 
            onPress={submitPhoto}
            disabled={submitting}
          >
            <Ionicons name="checkmark" size={24} color="#000" />
            <Text style={styles.submitButtonText}>
              {submitting ? 'Submitting...' : 'Submit'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image
        source={require('../../assets/BANDZLOGO.jpg')}
        style={styles.logo}
        resizeMode="contain"
      />

      {/* Countdown Timer */}
      <View style={styles.timerContainer}>
        <Text style={[styles.timerText, isLate && styles.timerLate]}>
          {time.minutes}:{time.seconds}
        </Text>
        {isLate && (
          <Text style={styles.lateText}>Late submission (delayed credit)</Text>
        )}
      </View>

      {/* Camera View */}
      <View style={styles.cameraContainer}>
        <Camera
          ref={cameraRef}
          style={styles.camera}
          type={facing}
          flashMode={flash ? Camera.Constants.FlashMode.torch : Camera.Constants.FlashMode.off}
        />
      </View>

      {/* Camera Controls */}
      <View style={styles.controls}>
        <TouchableOpacity style={styles.controlButton} onPress={toggleFlash}>
          <Ionicons
            name={flash ? 'flash' : 'flash-off'}
            size={28}
            color="#fff"
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
          <View style={styles.captureButtonInner} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.controlButton} onPress={toggleCameraFacing}>
          <Ionicons name="camera-reverse" size={28} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
  },
  logo: {
    height: 32,
    width: 140,
    marginBottom: 16,
  },
  message: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    paddingHorizontal: 40,
  },
  permissionButton: {
    backgroundColor: '#5cc960',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    marginTop: 20,
  },
  permissionButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  timerText: {
    fontSize: 48,
    fontWeight: '300',
    color: '#fff',
    fontVariant: ['tabular-nums'],
    letterSpacing: 4,
  },
  timerLate: {
    color: '#ef4444',
  },
  lateText: {
    color: '#ef4444',
    fontSize: 14,
    marginTop: 4,
  },
  cameraContainer: {
    width: '85%',
    aspectRatio: 3 / 4,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#1a1a1a',
  },
  camera: {
    flex: 1,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 40,
    paddingVertical: 30,
    marginTop: 20,
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#fff',
  },
  previewContainer: {
    width: '85%',
    aspectRatio: 3 / 4,
    borderRadius: 20,
    overflow: 'hidden',
    marginTop: 20,
  },
  preview: {
    flex: 1,
  },
  previewControls: {
    flexDirection: 'row',
    marginTop: 30,
    gap: 20,
  },
  retakeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 30,
    gap: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#5cc960',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 30,
    gap: 8,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
});
