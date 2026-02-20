import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WORKOUT_PLANS } from '../data/workouts';

const DAYS_DE = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
const MONTHS_DE = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];

export default function HomeScreen({ navigation }) {
  const [activePlanId, setActivePlanId] = useState(null);
  const [completedWorkouts, setCompletedWorkouts] = useState([]);
  const today = new Date();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const planId = await AsyncStorage.getItem('activePlanId');
      const workouts = await AsyncStorage.getItem('completedWorkouts');
      if (planId) setActivePlanId(planId);
      if (workouts) setCompletedWorkouts(JSON.parse(workouts));
    } catch (e) {
      console.error(e);
    }
  };

  const activePlan = WORKOUT_PLANS.find(p => p.id === activePlanId);
  const thisWeekCount = completedWorkouts.filter(w => {
    const d = new Date(w.date);
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    return d >= startOfWeek;
  }).length;

  const streak = calculateStreak(completedWorkouts);

  return (
    <SafeAreaView style={styles.container}>
<ScrollView contentContainerStyle={styles.scroll}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Guten Tag! 💪</Text>
          <Text style={styles.date}>
            {DAYS_DE[today.getDay()]}, {today.getDate()}. {MONTHS_DE[today.getMonth()]} {today.getFullYear()}
          </Text>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <StatCard label="Diese Woche" value={thisWeekCount} unit="Einheiten" color="#2196F3" />
          <StatCard label="Streak" value={streak} unit="Tage" color="#FF9800" />
          <StatCard label="Gesamt" value={completedWorkouts.length} unit="Workouts" color="#4CAF50" />
        </View>

        {/* Active Plan */}
        <Text style={styles.sectionTitle}>Aktiver Plan</Text>
        {activePlan ? (
          <TouchableOpacity
            style={[styles.activePlanCard, { borderLeftColor: activePlan.color }]}
            onPress={() => navigation.navigate('PlanDetail', { plan: activePlan })}
          >
            <Text style={styles.planName}>{activePlan.name}</Text>
            <Text style={styles.planMeta}>
              {activePlan.level} · {activePlan.daysPerWeek}x/Woche · {activePlan.weeks} Wochen
            </Text>
            <Text style={styles.planDescription}>{activePlan.description}</Text>
            <View style={styles.startBtn}>
              <Text style={styles.startBtnText}>Training starten →</Text>
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.noPlanCard}
            onPress={() => navigation.navigate('Plans')}
          >
            <Text style={styles.noPlanIcon}>📋</Text>
            <Text style={styles.noPlanText}>Noch kein Plan ausgewählt</Text>
            <Text style={styles.noPlanSub}>Tippe hier, um einen Plan zu wählen</Text>
          </TouchableOpacity>
        )}

        {/* Recent Workouts */}
        {completedWorkouts.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Letzte Trainings</Text>
            {completedWorkouts.slice(-3).reverse().map((w, i) => (
              <View key={i} style={styles.recentCard}>
                <Text style={styles.recentName}>{w.dayName}</Text>
                <Text style={styles.recentDate}>{formatDate(w.date)}</Text>
              </View>
            ))}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function StatCard({ label, value, unit, color }) {
  return (
    <View style={[styles.statCard, { borderTopColor: color }]}>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statUnit}>{unit}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function calculateStreak(workouts) {
  if (!workouts.length) return 0;
  const sorted = [...workouts].sort((a, b) => new Date(b.date) - new Date(a.date));
  let streak = 0;
  let current = new Date();
  current.setHours(0, 0, 0, 0);
  for (const w of sorted) {
    const d = new Date(w.date);
    d.setHours(0, 0, 0, 0);
    const diff = (current - d) / 86400000;
    if (diff <= 1) { streak++; current = d; }
    else break;
  }
  return streak;
}

function formatDate(iso) {
  const d = new Date(iso);
  return `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F0F23' },
  scroll: { padding: 16, paddingBottom: 32 },
  header: { marginBottom: 20 },
  greeting: { fontSize: 28, fontWeight: 'bold', color: '#fff' },
  date: { fontSize: 14, color: '#9E9E9E', marginTop: 4 },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 24 },
  statCard: {
    flex: 1, backgroundColor: '#1A1A2E', borderRadius: 12,
    padding: 14, alignItems: 'center', borderTopWidth: 3,
  },
  statValue: { fontSize: 26, fontWeight: 'bold' },
  statUnit: { fontSize: 10, color: '#9E9E9E', marginTop: 2 },
  statLabel: { fontSize: 11, color: '#ccc', marginTop: 4, textAlign: 'center' },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#fff', marginBottom: 12 },
  activePlanCard: {
    backgroundColor: '#1A1A2E', borderRadius: 16, padding: 20,
    borderLeftWidth: 4, marginBottom: 24,
  },
  planName: { fontSize: 20, fontWeight: 'bold', color: '#fff', marginBottom: 6 },
  planMeta: { fontSize: 13, color: '#9E9E9E', marginBottom: 8 },
  planDescription: { fontSize: 14, color: '#ccc', lineHeight: 20, marginBottom: 16 },
  startBtn: {
    backgroundColor: '#2196F3', borderRadius: 10, paddingVertical: 12,
    paddingHorizontal: 20, alignSelf: 'flex-start',
  },
  startBtnText: { color: '#fff', fontWeight: '600', fontSize: 15 },
  noPlanCard: {
    backgroundColor: '#1A1A2E', borderRadius: 16, padding: 32,
    alignItems: 'center', marginBottom: 24, borderWidth: 1, borderColor: '#333', borderStyle: 'dashed',
  },
  noPlanIcon: { fontSize: 40, marginBottom: 12 },
  noPlanText: { fontSize: 16, color: '#fff', fontWeight: '600', marginBottom: 6 },
  noPlanSub: { fontSize: 13, color: '#9E9E9E' },
  recentCard: {
    backgroundColor: '#1A1A2E', borderRadius: 12, padding: 16,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8,
  },
  recentName: { color: '#fff', fontSize: 15, fontWeight: '500' },
  recentDate: { color: '#9E9E9E', fontSize: 13 },
});
