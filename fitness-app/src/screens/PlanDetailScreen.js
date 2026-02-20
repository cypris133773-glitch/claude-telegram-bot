import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView,
} from 'react-native';
import { getLevelColor } from '../data/workouts';

export default function PlanDetailScreen({ route, navigation }) {
  const { plan } = route.params;
  const levelColor = getLevelColor(plan.level);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Plan Header */}
        <View style={[styles.headerCard, { borderTopColor: plan.color }]}>
          <Text style={styles.planName}>{plan.name}</Text>
          <Text style={styles.planDesc}>{plan.description}</Text>
          <View style={styles.metaRow}>
            <MetaItem icon="🎯" label="Level" value={plan.level} color={levelColor} />
            <MetaItem icon="📅" label="Häufigkeit" value={`${plan.daysPerWeek}x/Woche`} color="#2196F3" />
            <MetaItem icon="📆" label="Dauer" value={`${plan.weeks} Wochen`} color="#4CAF50" />
          </View>
        </View>

        {/* Training Days */}
        <Text style={styles.sectionTitle}>Trainingstage</Text>
        {plan.days.map((day, index) => (
          <TouchableOpacity
            key={day.id}
            style={styles.dayCard}
            onPress={() => navigation.navigate('WorkoutDay', { day, planName: plan.name })}
          >
            <View style={[styles.dayIndex, { backgroundColor: plan.color }]}>
              <Text style={styles.dayIndexText}>{index + 1}</Text>
            </View>
            <View style={styles.dayInfo}>
              <Text style={styles.dayName}>{day.name}</Text>
              <Text style={styles.exerciseCount}>{day.exercises.length} Übungen</Text>
              <View style={styles.muscleRow}>
                {getMuscles(day.exercises).slice(0, 3).map((m, i) => (
                  <View key={i} style={styles.muscleTag}>
                    <Text style={styles.muscleTagText}>{m}</Text>
                  </View>
                ))}
              </View>
            </View>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        ))}

        {/* Overview */}
        <Text style={styles.sectionTitle}>Übungsübersicht</Text>
        {plan.days.map(day => (
          <View key={day.id} style={styles.overviewCard}>
            <Text style={styles.overviewDayName}>{day.name}</Text>
            {day.exercises.map(ex => (
              <View key={ex.id} style={styles.exRow}>
                <View style={styles.exBullet} />
                <Text style={styles.exName}>{ex.name}</Text>
                <Text style={styles.exDetail}>{ex.sets}x{ex.reps}</Text>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

function MetaItem({ icon, label, value, color }) {
  return (
    <View style={styles.metaItem}>
      <Text style={styles.metaIcon}>{icon}</Text>
      <Text style={styles.metaLabel}>{label}</Text>
      <Text style={[styles.metaValue, { color }]}>{value}</Text>
    </View>
  );
}

function getMuscles(exercises) {
  return [...new Set(exercises.map(e => e.muscle))];
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F0F23' },
  scroll: { padding: 16, paddingBottom: 32 },
  headerCard: {
    backgroundColor: '#1A1A2E', borderRadius: 16, padding: 20,
    borderTopWidth: 4, marginBottom: 24,
  },
  planName: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 8 },
  planDesc: { fontSize: 14, color: '#9E9E9E', lineHeight: 20, marginBottom: 16 },
  metaRow: { flexDirection: 'row', justifyContent: 'space-around' },
  metaItem: { alignItems: 'center', flex: 1 },
  metaIcon: { fontSize: 22, marginBottom: 4 },
  metaLabel: { fontSize: 11, color: '#9E9E9E', marginBottom: 2 },
  metaValue: { fontSize: 13, fontWeight: '700' },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#fff', marginBottom: 12 },
  dayCard: {
    backgroundColor: '#1A1A2E', borderRadius: 14, padding: 16, marginBottom: 10,
    flexDirection: 'row', alignItems: 'center',
  },
  dayIndex: {
    width: 36, height: 36, borderRadius: 18,
    justifyContent: 'center', alignItems: 'center', marginRight: 14,
  },
  dayIndexText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  dayInfo: { flex: 1 },
  dayName: { fontSize: 16, fontWeight: '600', color: '#fff', marginBottom: 4 },
  exerciseCount: { fontSize: 12, color: '#9E9E9E', marginBottom: 6 },
  muscleRow: { flexDirection: 'row', gap: 6 },
  muscleTag: { backgroundColor: '#2196F322', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2 },
  muscleTagText: { color: '#2196F3', fontSize: 10, fontWeight: '600' },
  arrow: { fontSize: 24, color: '#9E9E9E' },
  overviewCard: { backgroundColor: '#1A1A2E', borderRadius: 14, padding: 16, marginBottom: 10 },
  overviewDayName: { fontSize: 15, fontWeight: '700', color: '#fff', marginBottom: 10, borderBottomColor: '#2A2A3E', borderBottomWidth: 1, paddingBottom: 8 },
  exRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 5 },
  exBullet: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#2196F3', marginRight: 10 },
  exName: { flex: 1, color: '#ccc', fontSize: 14 },
  exDetail: { color: '#9E9E9E', fontSize: 13 },
});
