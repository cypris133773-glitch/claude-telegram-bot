import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  StyleSheet, SafeAreaView, Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LEVELS = ['Anfänger', 'Mittel', 'Fortgeschritten'];
const COLORS = ['#2196F3', '#4CAF50', '#FF9800', '#F44336', '#9C27B0', '#00BCD4'];

export default function CreatePlanScreen({ navigation }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [level, setLevel] = useState('Anfänger');
  const [color, setColor] = useState('#2196F3');
  const [daysPerWeek, setDaysPerWeek] = useState('3');
  const [weeks, setWeeks] = useState('8');
  const [days, setDays] = useState([]);
  const [newDayName, setNewDayName] = useState('');

  const addDay = () => {
    if (!newDayName.trim()) return;
    setDays(prev => [
      ...prev,
      { id: `d${Date.now()}`, name: newDayName.trim(), exercises: [] },
    ]);
    setNewDayName('');
  };

  const removeDay = (id) => {
    setDays(prev => prev.filter(d => d.id !== id));
  };

  const savePlan = async () => {
    if (!name.trim()) {
      Alert.alert('Fehler', 'Bitte gib einen Namen für den Plan ein.');
      return;
    }
    if (days.length === 0) {
      Alert.alert('Fehler', 'Füge mindestens einen Trainingstag hinzu.');
      return;
    }
    try {
      const newPlan = {
        id: `custom-${Date.now()}`,
        name: name.trim(),
        description: description.trim() || 'Eigener Trainingsplan',
        level,
        color,
        daysPerWeek: parseInt(daysPerWeek, 10) || 3,
        weeks: parseInt(weeks, 10) || 8,
        days,
      };
      const existing = await AsyncStorage.getItem('customPlans');
      const list = existing ? JSON.parse(existing) : [];
      list.push(newPlan);
      await AsyncStorage.setItem('customPlans', JSON.stringify(list));
      Alert.alert('Gespeichert! ✅', 'Dein Trainingsplan wurde erstellt.', [
        { text: 'Zu den Plänen', onPress: () => navigation.navigate('Plans') },
      ]);
      // Reset
      setName(''); setDescription(''); setLevel('Anfänger');
      setColor('#2196F3'); setDaysPerWeek('3'); setWeeks('8'); setDays([]);
    } catch (e) {
      Alert.alert('Fehler', 'Plan konnte nicht gespeichert werden.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Plan erstellen</Text>
        <Text style={styles.subtitle}>Erstelle deinen eigenen Trainingsplan</Text>

        <Section title="Grundinformationen">
          <Label>Name *</Label>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="z.B. Mein PPL Split"
            placeholderTextColor="#666"
          />
          <Label>Beschreibung</Label>
          <TextInput
            style={[styles.input, styles.textarea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Beschreibe deinen Plan..."
            placeholderTextColor="#666"
            multiline
            numberOfLines={3}
          />
        </Section>

        <Section title="Details">
          <Label>Level</Label>
          <View style={styles.optionRow}>
            {LEVELS.map(l => (
              <TouchableOpacity
                key={l}
                style={[styles.optionBtn, level === l && styles.optionBtnActive]}
                onPress={() => setLevel(l)}
              >
                <Text style={[styles.optionText, level === l && styles.optionTextActive]}>{l}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.row}>
            <View style={styles.halfField}>
              <Label>Tage/Woche</Label>
              <TextInput
                style={styles.input}
                value={daysPerWeek}
                onChangeText={setDaysPerWeek}
                keyboardType="number-pad"
                maxLength={1}
              />
            </View>
            <View style={styles.halfField}>
              <Label>Wochen</Label>
              <TextInput
                style={styles.input}
                value={weeks}
                onChangeText={setWeeks}
                keyboardType="number-pad"
                maxLength={2}
              />
            </View>
          </View>

          <Label>Farbe</Label>
          <View style={styles.colorRow}>
            {COLORS.map(c => (
              <TouchableOpacity
                key={c}
                style={[styles.colorCircle, { backgroundColor: c }, color === c && styles.colorCircleActive]}
                onPress={() => setColor(c)}
              />
            ))}
          </View>
        </Section>

        <Section title="Trainingstage">
          <View style={styles.addDayRow}>
            <TextInput
              style={[styles.input, styles.addDayInput]}
              value={newDayName}
              onChangeText={setNewDayName}
              placeholder="z.B. Push – Brust/Schultern"
              placeholderTextColor="#666"
            />
            <TouchableOpacity style={styles.addDayBtn} onPress={addDay}>
              <Text style={styles.addDayBtnText}>+</Text>
            </TouchableOpacity>
          </View>

          {days.length === 0 && (
            <Text style={styles.emptyDays}>Noch keine Trainingstage hinzugefügt</Text>
          )}

          {days.map((d, i) => (
            <View key={d.id} style={styles.dayItem}>
              <View style={[styles.dayNum, { backgroundColor: color }]}>
                <Text style={styles.dayNumText}>{i + 1}</Text>
              </View>
              <Text style={styles.dayItemName}>{d.name}</Text>
              <TouchableOpacity onPress={() => removeDay(d.id)}>
                <Text style={styles.removeDay}>✕</Text>
              </TouchableOpacity>
            </View>
          ))}
        </Section>

        <TouchableOpacity style={styles.saveBtn} onPress={savePlan}>
          <Text style={styles.saveBtnText}>Plan speichern 💾</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function Section({ title, children }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function Label({ children }) {
  return <Text style={styles.label}>{children}</Text>;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F0F23' },
  scroll: { padding: 16, paddingBottom: 40 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#fff', marginBottom: 6 },
  subtitle: { fontSize: 14, color: '#9E9E9E', marginBottom: 24 },
  section: { backgroundColor: '#1A1A2E', borderRadius: 16, padding: 16, marginBottom: 16 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#fff', marginBottom: 14 },
  label: { fontSize: 13, color: '#9E9E9E', marginBottom: 6, marginTop: 10 },
  input: {
    backgroundColor: '#12122A', borderRadius: 10, padding: 12,
    color: '#fff', fontSize: 15, borderWidth: 1, borderColor: '#2A2A3E',
  },
  textarea: { height: 80, textAlignVertical: 'top' },
  optionRow: { flexDirection: 'row', gap: 8 },
  optionBtn: {
    flex: 1, backgroundColor: '#12122A', borderRadius: 10, paddingVertical: 10,
    alignItems: 'center', borderWidth: 1, borderColor: '#2A2A3E',
  },
  optionBtnActive: { backgroundColor: '#2196F322', borderColor: '#2196F3' },
  optionText: { color: '#9E9E9E', fontSize: 13, fontWeight: '600' },
  optionTextActive: { color: '#2196F3' },
  row: { flexDirection: 'row', gap: 12 },
  halfField: { flex: 1 },
  colorRow: { flexDirection: 'row', gap: 12, marginTop: 4 },
  colorCircle: { width: 36, height: 36, borderRadius: 18 },
  colorCircleActive: { borderWidth: 3, borderColor: '#fff' },
  addDayRow: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  addDayInput: { flex: 1 },
  addDayBtn: {
    backgroundColor: '#2196F3', width: 44, height: 44, borderRadius: 10,
    justifyContent: 'center', alignItems: 'center',
  },
  addDayBtnText: { color: '#fff', fontSize: 24, fontWeight: 'bold', lineHeight: 28 },
  emptyDays: { color: '#666', fontSize: 13, textAlign: 'center', paddingVertical: 16 },
  dayItem: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#12122A',
    borderRadius: 10, padding: 12, marginTop: 8,
  },
  dayNum: { width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  dayNumText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
  dayItemName: { flex: 1, color: '#fff', fontSize: 14 },
  removeDay: { color: '#F44336', fontSize: 16, paddingHorizontal: 4 },
  saveBtn: {
    backgroundColor: '#4CAF50', borderRadius: 14, paddingVertical: 16, alignItems: 'center',
  },
  saveBtnText: { color: '#fff', fontSize: 17, fontWeight: 'bold' },
});
