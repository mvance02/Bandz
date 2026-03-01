import { View, Text, StyleSheet } from 'react-native';

interface StatsCardProps {
  title: string;
  value: string;
  subtitle: string;
  subtitleColor?: string;
}

export default function StatsCard({ title, value, subtitle, subtitleColor = '#fff' }: StatsCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.value}>{value}</Text>
      <Text style={[styles.subtitle, { color: subtitleColor }]}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: '#5cc960',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 4,
    minHeight: 120,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 13,
    fontWeight: '500',
    color: '#000',
    opacity: 0.8,
  },
  value: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#000',
    marginVertical: 4,
  },
  subtitle: {
    fontSize: 11,
    fontWeight: '500',
    color: '#000',
    opacity: 0.7,
  },
});
