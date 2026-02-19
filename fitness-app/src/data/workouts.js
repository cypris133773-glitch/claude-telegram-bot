// Vordefinierte Trainingspläne
export const WORKOUT_PLANS = [
  {
    id: '1',
    name: 'Anfänger Full-Body',
    level: 'Anfänger',
    daysPerWeek: 3,
    description: 'Perfekt für Einsteiger. Trainiert den ganzen Körper 3x pro Woche.',
    color: '#4CAF50',
    weeks: 8,
    days: [
      {
        id: 'd1',
        name: 'Tag A – Ganzkörper',
        exercises: [
          { id: 'e1', name: 'Kniebeuge', sets: 3, reps: '10-12', rest: 90, muscle: 'Beine', equipment: 'Körpergewicht' },
          { id: 'e2', name: 'Liegestütz', sets: 3, reps: '8-10', rest: 60, muscle: 'Brust', equipment: 'Körpergewicht' },
          { id: 'e3', name: 'Klimmzug (assistiert)', sets: 3, reps: '6-8', rest: 90, muscle: 'Rücken', equipment: 'Stange' },
          { id: 'e4', name: 'Schulterdrücken', sets: 3, reps: '10-12', rest: 60, muscle: 'Schultern', equipment: 'Hanteln' },
          { id: 'e5', name: 'Plank', sets: 3, reps: '30 Sek.', rest: 45, muscle: 'Core', equipment: 'Körpergewicht' },
        ],
      },
    ],
  },
  {
    id: '2',
    name: 'Push / Pull / Legs',
    level: 'Fortgeschritten',
    daysPerWeek: 6,
    description: 'Klassischer PPL-Split für maximalen Muskelaufbau.',
    color: '#2196F3',
    weeks: 12,
    days: [
      {
        id: 'd1',
        name: 'Push – Brust / Schultern / Trizeps',
        exercises: [
          { id: 'e1', name: 'Bankdrücken', sets: 4, reps: '8-10', rest: 120, muscle: 'Brust', equipment: 'Langhantel' },
          { id: 'e2', name: 'Schrägbankdrücken', sets: 3, reps: '10-12', rest: 90, muscle: 'Brust', equipment: 'Hanteln' },
          { id: 'e3', name: 'Schulterdrücken', sets: 4, reps: '8-10', rest: 90, muscle: 'Schultern', equipment: 'Langhantel' },
          { id: 'e4', name: 'Seitenheben', sets: 3, reps: '12-15', rest: 60, muscle: 'Schultern', equipment: 'Hanteln' },
          { id: 'e5', name: 'Trizeps-Dips', sets: 3, reps: '10-12', rest: 60, muscle: 'Trizeps', equipment: 'Körpergewicht' },
          { id: 'e6', name: 'Trizeps-Pushdown', sets: 3, reps: '12-15', rest: 60, muscle: 'Trizeps', equipment: 'Kabel' },
        ],
      },
      {
        id: 'd2',
        name: 'Pull – Rücken / Bizeps',
        exercises: [
          { id: 'e1', name: 'Klimmzüge', sets: 4, reps: '6-8', rest: 120, muscle: 'Rücken', equipment: 'Stange' },
          { id: 'e2', name: 'Langhantelrudern', sets: 4, reps: '8-10', rest: 90, muscle: 'Rücken', equipment: 'Langhantel' },
          { id: 'e3', name: 'Lat-Pulldown', sets: 3, reps: '10-12', rest: 90, muscle: 'Rücken', equipment: 'Kabel' },
          { id: 'e4', name: 'Seated Row', sets: 3, reps: '12-15', rest: 60, muscle: 'Rücken', equipment: 'Kabel' },
          { id: 'e5', name: 'Bizeps-Curl', sets: 3, reps: '10-12', rest: 60, muscle: 'Bizeps', equipment: 'Hanteln' },
          { id: 'e6', name: 'Hammer-Curl', sets: 3, reps: '12-15', rest: 60, muscle: 'Bizeps', equipment: 'Hanteln' },
        ],
      },
      {
        id: 'd3',
        name: 'Legs – Beine / Gesäß',
        exercises: [
          { id: 'e1', name: 'Kniebeuge', sets: 4, reps: '6-8', rest: 180, muscle: 'Beine', equipment: 'Langhantel' },
          { id: 'e2', name: 'Beinpresse', sets: 3, reps: '10-12', rest: 120, muscle: 'Beine', equipment: 'Maschine' },
          { id: 'e3', name: 'Ausfallschritte', sets: 3, reps: '12/Seite', rest: 90, muscle: 'Beine', equipment: 'Hanteln' },
          { id: 'e4', name: 'Rumänisches Kreuzheben', sets: 3, reps: '10-12', rest: 90, muscle: 'Oberschenkel', equipment: 'Langhantel' },
          { id: 'e5', name: 'Wadenheben', sets: 4, reps: '15-20', rest: 60, muscle: 'Waden', equipment: 'Körpergewicht' },
        ],
      },
    ],
  },
  {
    id: '3',
    name: 'Home Workout',
    level: 'Mittel',
    daysPerWeek: 4,
    description: 'Effektives Training ohne Geräte – überall durchführbar.',
    color: '#FF9800',
    weeks: 6,
    days: [
      {
        id: 'd1',
        name: 'Oberkörper',
        exercises: [
          { id: 'e1', name: 'Liegestütz', sets: 4, reps: '15-20', rest: 60, muscle: 'Brust', equipment: 'Körpergewicht' },
          { id: 'e2', name: 'Diamant-Liegestütz', sets: 3, reps: '10-12', rest: 60, muscle: 'Trizeps', equipment: 'Körpergewicht' },
          { id: 'e3', name: 'Stühldips', sets: 3, reps: '12-15', rest: 60, muscle: 'Trizeps', equipment: 'Stuhl' },
          { id: 'e4', name: 'Pike Push-ups', sets: 3, reps: '10-12', rest: 60, muscle: 'Schultern', equipment: 'Körpergewicht' },
          { id: 'e5', name: 'Tisch-Rudern', sets: 3, reps: '10-15', rest: 60, muscle: 'Rücken', equipment: 'Tisch' },
        ],
      },
      {
        id: 'd2',
        name: 'Unterkörper',
        exercises: [
          { id: 'e1', name: 'Kniebeuge', sets: 4, reps: '20-25', rest: 60, muscle: 'Beine', equipment: 'Körpergewicht' },
          { id: 'e2', name: 'Bulgarische Kniebeuge', sets: 3, reps: '12/Seite', rest: 90, muscle: 'Beine', equipment: 'Stuhl' },
          { id: 'e3', name: 'Glute Bridge', sets: 3, reps: '15-20', rest: 60, muscle: 'Gesäß', equipment: 'Körpergewicht' },
          { id: 'e4', name: 'Ausfallschritte', sets: 3, reps: '12/Seite', rest: 60, muscle: 'Beine', equipment: 'Körpergewicht' },
          { id: 'e5', name: 'Wadenheben', sets: 4, reps: '20-25', rest: 45, muscle: 'Waden', equipment: 'Körpergewicht' },
        ],
      },
    ],
  },
];

export const getLevelColor = (level) => {
  switch (level) {
    case 'Anfänger': return '#4CAF50';
    case 'Mittel': return '#FF9800';
    case 'Fortgeschritten': return '#F44336';
    default: return '#9E9E9E';
  }
};
