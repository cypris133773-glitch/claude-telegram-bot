import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView, Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WORKOUT_PLANS, getLevelColor } from '../data/workouts';

export default function PlansScreen({ navigation }) {
  const [activePlanId, setActivePlanId] = useState(null);
  const [customPlans, setCustomPlans] = useState([]);

  useEffect(() => {
    loadData();
    const unsubscribe = navigation.addListener('focus', loadData);
    return unsubscribe;
  }, [navigation]);

  const loadData = async () => {
    const id = await AsyncStorage.getItem('activePlanId');
    const custom = await AsyncStorage.getItem('customPlans');
    if (id) setActivePlanId(id);
    if (custom) setCustomPlans(JSON.parse(custom));
  };

  const activatePlan = async (planId) => {
    await AsyncStorage.setItem('activePlanId', planId);
    setActivePlanId(planId);
    Alert.alert('Plan aktiviert', 'Dieser Trainingsplan ist jetzt aktiv!');
  };

  const allPlans = [...WORKOUT_PLANS, ...customPlans];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Trainingspläne</Text>
        <Text style={styles.subtitle}>Wähle einen Plan und starte deine Transformation</Text>

        {allPlans.map(plan => (
          <PlanCard
            key={plan.id}
            plan={plan}
            isActive={activePlanId === plan.id}
            onPress={() => navigation.navigate('PlanDetail', { plan })}
            onActivate={() => activatePlan(plan.id)}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

function PlanCard({ plan, isActive, onPress, onActivate }) {
  const levelColor = getLevelColor(plan.level);
  return (
    <TouchableOpacity style={[styles.card, isActive && styles.activeCard]} onPress={onPress}>
      <View style={[styles.colorBar, { backgroundColor: plan.color }]} />
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardName}>{plan.name}</Text>
          {isActive && <View style={styles.activeBadge}><Text style={styles.activeBadgeText}>AKTIV</Text></View>}
        </View>
        <Text style={styles.cardDesc}>{plan.description}</Text>
        <View style={styles.tags}>
          <Tag label={plan.level} color={levelColor} />
          <Tag label={`${plan.daysPerWeek}x/Woche`} color="#607D8B" />
          <Tag label={`${plan.weeks} Wochen`} color="#607D8B" />
        </View>
        <View style={styles.cardFooter}>
          <Text style={styles.dayCount}>{plan.days.length} Trainingstage</Text>
          {!isActive && (
            <TouchableOpacity style={styles.activateBtn} onPress={onActivate}>
              <Text style={styles.activateBtnText}>Aktivieren</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

function Tag({ label, color }) {
  return (
    <View style={[styles.tag, { backgroundColor: color + '33', borderColor: color }]}>
      <Text style={[styles.tagText, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F0F23' },
  scroll: { padding: 16, paddingBottom: 32 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#fff', marginBottom: 6 },
  subtitle: { fontSize: 14, color: '#9E9E9E', marginBottom: 24 },
  card: {
    backgroundColor: '#1A1A2E', borderRadius: 16, marginBottom: 16,
    flexDirection: 'row', overflow: 'hidden', borderWidth: 1, borderColor: '#2A2A3E',
  },
  activeCard: { borderColor: '#2196F3', borderWidth: 2 },
  colorBar: { width: 6 },
  cardContent: { flex: 1, padding: 16 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  cardName: { fontSize: 18, fontWeight: 'bold', color: '#fff', flex: 1 },
  activeBadge: { backgroundColor: '#2196F3', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  activeBadgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  cardDesc: { fontSize: 13, color: '#9E9E9E', lineHeight: 19, marginBottom: 12 },
  tags: { flexDirection: 'row', gap: 8, flexWrap: 'wrap', marginBottom: 12 },
  tag: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1 },
  tagText: { fontSize: 11, fontWeight: '600' },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  dayCount: { color: '#9E9E9E', fontSize: 13 },
  activateBtn: { backgroundColor: '#2196F3', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 8 },
  activateBtnText: { color: '#fff', fontSize: 13, fontWeight: '600' },
});
