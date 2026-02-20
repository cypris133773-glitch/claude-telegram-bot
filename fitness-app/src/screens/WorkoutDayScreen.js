import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView, Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function WorkoutDayScreen({ route, navigation }) {
  const { day, planName } = route.params;
  const [completed, setCompleted] = useState({});
  const [expanded, setExpanded] = useState(null);

  const toggleSet = (exId, setIdx) => {
    const key = `${exId}-${setIdx}`;
    setCompleted(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleExpand = (exId) => {
    setExpanded(prev => (prev === exId ? null : exId));
  };

  const totalSets = day.exercises.reduce((sum, ex) => sum + ex.sets, 0);
  const doneSets = Object.values(completed).filter(Boolean).length;
  const progress = totalSets > 0 ? doneSets / totalSets : 0;

  const finishWorkout = async () => {
    if (doneSets < totalSets) {
      Alert.alert(
        'Training beenden?',
        `Du hast noch ${totalSets - doneSets} Sätze übrig. Trotzdem beenden?`,
        [
          { text: 'Weiter trainieren', style: 'cancel' },
          { text: 'Beenden', onPress: saveWorkout },
        ],
      );
    } else {
      await saveWorkout();
    }
  };

  const saveWorkout = async () => {
    try {
      const existing = await AsyncStorage.getItem('completedWorkouts');
      const list = existing ? JSON.parse(existing) : [];
      list.push({ dayName: day.name, planName, date: new Date().toISOString(), setsCompleted: doneSets, totalSets });
      await AsyncStorage.setItem('completedWorkouts', JSON.stringify(list));
      Alert.alert('Workout abgeschlossen! 🎉', 'Super gemacht! Dein Training wurde gespeichert.', [
        { text: 'Zurück zur Übersicht', onPress: () => navigation.navigate('Main') },
      ]);
    } catch (e) {
      Alert.alert('Fehler', 'Training konnte nicht gespeichert werden.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Header */}
        <Text style={styles.dayName}>{day.name}</Text>
        <Text style={styles.planName}>{planName}</Text>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
          </View>
          <Text style={styles.progressText}>{doneSets} / {totalSets} Sätze</Text>
        </View>

        {/* Exercises */}
        {day.exercises.map(ex => (
          <View key={ex.id} style={styles.exCard}>
            <TouchableOpacity style={styles.exHeader} onPress={() => toggleExpand(ex.id)}>
              <View>
                <Text style={styles.exName}>{ex.name}</Text>
                <Text style={styles.exMeta}>
                  {ex.sets} Sätze · {ex.reps} Wdh · {ex.rest}s Pause · {ex.muscle}
                </Text>
              </View>
              <Text style={styles.expandIcon}>{expanded === ex.id ? '▲' : '▼'}</Text>
            </TouchableOpacity>

            {/* Sets */}
            <View style={styles.setsContainer}>
              {Array.from({ length: ex.sets }, (_, i) => {
                const key = `${ex.id}-${i}`;
                const done = completed[key];
                return (
                  <TouchableOpacity
                    key={i}
                    style={[styles.setBtn, done && styles.setBtnDone]}
                    onPress={() => toggleSet(ex.id, i)}
                  >
                    <Text style={[styles.setBtnText, done && styles.setBtnTextDone]}>
                      {done ? '✓' : `S${i + 1}`}
                    </Text>
                    <Text style={[styles.setReps, done && styles.setRepsDone]}>{ex.reps}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Info Panel */}
            {expanded === ex.id && (
              <View style={styles.infoPanel}>
                <InfoRow label="Muskelgruppe" value={ex.muscle} />
                <InfoRow label="Equipment" value={ex.equipment} />
                <InfoRow label="Wiederholungen" value={ex.reps} />
                <InfoRow label="Pause" value={`${ex.rest} Sekunden`} />
              </View>
            )}
          </View>
        ))}

        {/* Finish Button */}
        <TouchableOpacity style={styles.finishBtn} onPress={finishWorkout}>
          <Text style={styles.finishBtnText}>Training beenden 🏁</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function InfoRow({ label, value }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F0F23' },
  scroll: { padding: 16, paddingBottom: 40 },
  dayName: { fontSize: 22, fontWeight: 'bold', color: '#fff', marginBottom: 4 },
  planName: { fontSize: 13, color: '#9E9E9E', marginBottom: 16 },
  progressContainer: { marginBottom: 24 },
  progressBar: { height: 8, backgroundColor: '#2A2A3E', borderRadius: 4, overflow: 'hidden', marginBottom: 6 },
  progressFill: { height: '100%', backgroundColor: '#2196F3', borderRadius: 4 },
  progressText: { color: '#9E9E9E', fontSize: 13, textAlign: 'right' },
  exCard: { backgroundColor: '#1A1A2E', borderRadius: 14, marginBottom: 12, overflow: 'hidden' },
  exHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16,
  },
  exName: { fontSize: 16, fontWeight: '600', color: '#fff', marginBottom: 4 },
  exMeta: { fontSize: 12, color: '#9E9E9E' },
  expandIcon: { color: '#9E9E9E', fontSize: 12 },
  setsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingHorizontal: 16, paddingBottom: 16 },
  setBtn: {
    flex: 1, minWidth: 70, backgroundColor: '#2A2A3E', borderRadius: 10,
    paddingVertical: 12, alignItems: 'center', borderWidth: 1, borderColor: '#3A3A4E',
  },
  setBtnDone: { backgroundColor: '#2196F322', borderColor: '#2196F3' },
  setBtnText: { color: '#9E9E9E', fontWeight: '700', fontSize: 14 },
  setBtnTextDone: { color: '#2196F3' },
  setReps: { color: '#666', fontSize: 11, marginTop: 2 },
  setRepsDone: { color: '#2196F399' },
  infoPanel: { backgroundColor: '#12122A', padding: 16, borderTopColor: '#2A2A3E', borderTopWidth: 1 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  infoLabel: { color: '#9E9E9E', fontSize: 13 },
  infoValue: { color: '#fff', fontSize: 13, fontWeight: '500' },
  finishBtn: {
    backgroundColor: '#4CAF50', borderRadius: 14, paddingVertical: 16,
    alignItems: 'center', marginTop: 8,
  },
  finishBtnText: { color: '#fff', fontSize: 17, fontWeight: 'bold' },
});
