// =============================================
// ALPHA PROGRESSION – Deutsche Version
// =============================================

// ── DATENBANK DER ÜBUNGEN ──────────────────
const UEBUNGEN_DB = [
  // BRUST
  { id: 1,  name: "Bankdrücken",                 muskel: "Brust",     equipment: ["Langhantel","Bank"],           schwierigkeit: "Mittel",  beschreibung: "Lege dich flach auf die Bank. Greife die Stange schulterbreit. Senke die Stange zur Brust und drücke sie explosiv zurück.", video: "🏋️", sätze: 4, wiederholungen: "6-10", rir: 2 },
  { id: 2,  name: "Schrägbankdrücken",           muskel: "Brust",     equipment: ["Langhantel","Schrägbank"],     schwierigkeit: "Mittel",  beschreibung: "Wie Bankdrücken, jedoch auf einer geneigten Bank (30-45°). Betont den oberen Brustbereich.", video: "🏋️", sätze: 3, wiederholungen: "8-12", rir: 2 },
  { id: 3,  name: "Kurzhantel Fliegende",        muskel: "Brust",     equipment: ["Kurzhanteln","Bank"],          schwierigkeit: "Leicht",  beschreibung: "Liege auf der Bank, halte Kurzhanteln über der Brust. Spreize die Arme nach unten und außen, dann zurück.", video: "🏋️", sätze: 3, wiederholungen: "10-15", rir: 2 },
  { id: 4,  name: "Kabelzug Butterfly",          muskel: "Brust",     equipment: ["Kabelzug"],                   schwierigkeit: "Leicht",  beschreibung: "Stehe in der Mitte des Kabelzugs. Führe die Kabel in einer Bogenbewegung vor der Brust zusammen.", video: "🏋️", sätze: 3, wiederholungen: "12-15", rir: 2 },
  { id: 5,  name: "Dips",                        muskel: "Brust",     equipment: ["Dipstange"],                  schwierigkeit: "Mittel",  beschreibung: "Stütze dich auf den Barren. Beuge dich nach vorne und senke dich ab. Drücke dich wieder hoch.", video: "💪", sätze: 3, wiederholungen: "8-12", rir: 2 },
  { id: 6,  name: "Liegestütze",                 muskel: "Brust",     equipment: ["Körpergewicht"],              schwierigkeit: "Leicht",  beschreibung: "Klassische Liegestütze. Halte den Körper gerade und senke die Brust zum Boden.", video: "💪", sätze: 3, wiederholungen: "10-20", rir: 2 },
  // RÜCKEN
  { id: 7,  name: "Kreuzheben",                  muskel: "Rücken",    equipment: ["Langhantel"],                 schwierigkeit: "Schwer",  beschreibung: "Stehe hüftbreit. Beuge dich mit geradem Rücken und hebe die Stange vom Boden. Strecke Hüfte und Knie gleichzeitig.", video: "🏋️", sätze: 4, wiederholungen: "4-6",  rir: 2 },
  { id: 8,  name: "Klimmzüge",                   muskel: "Rücken",    equipment: ["Klimmzugstange"],             schwierigkeit: "Schwer",  beschreibung: "Hänge an der Stange, Schulterbreiter Griff. Ziehe dich hoch bis das Kinn über der Stange ist.", video: "💪", sätze: 4, wiederholungen: "6-10", rir: 2 },
  { id: 9,  name: "Langhantelrudern",            muskel: "Rücken",    equipment: ["Langhantel"],                 schwierigkeit: "Mittel",  beschreibung: "Beuge dich mit geradem Rücken nach vorne. Ziehe die Stange zu deinem Bauch und senke sie kontrolliert.", video: "🏋️", sätze: 4, wiederholungen: "8-12", rir: 2 },
  { id: 10, name: "Latzug",                      muskel: "Rücken",    equipment: ["Kabelzug"],                   schwierigkeit: "Leicht",  beschreibung: "Sitze am Latzuggerät. Greife die Stange breit und ziehe sie zur Brust. Halte den Rücken leicht nach hinten geneigt.", video: "🏋️", sätze: 3, wiederholungen: "10-12", rir: 2 },
  { id: 11, name: "Kabelrudern sitzend",         muskel: "Rücken",    equipment: ["Kabelzug"],                   schwierigkeit: "Leicht",  beschreibung: "Sitze am Rudergerät. Ziehe den Griff zu deinem Bauch, halte die Ellenbogen nahe am Körper.", video: "🏋️", sätze: 3, wiederholungen: "10-15", rir: 2 },
  { id: 12, name: "Kurzhantelrudern",            muskel: "Rücken",    equipment: ["Kurzhanteln","Bank"],          schwierigkeit: "Leicht",  beschreibung: "Stütze dich mit einer Hand auf der Bank. Ziehe die Kurzhantel in einer Ruderbewegung zur Seite.", video: "💪", sätze: 3, wiederholungen: "10-12", rir: 2 },
  { id: 13, name: "Face Pull",                   muskel: "Rücken",    equipment: ["Kabelzug"],                   schwierigkeit: "Leicht",  beschreibung: "Ziehe den Kabelzug in Augenhöhe zu deinem Gesicht. Betont die hinteren Schultern und Rhomboiden.", video: "🏋️", sätze: 3, wiederholungen: "15-20", rir: 2 },
  // SCHULTERN
  { id: 14, name: "Schulterdrücken",             muskel: "Schultern", equipment: ["Langhantel"],                 schwierigkeit: "Mittel",  beschreibung: "Stehe aufrecht. Drücke die Stange von Schulterbreite über den Kopf. Strecke die Arme vollständig aus.", video: "🏋️", sätze: 4, wiederholungen: "6-10", rir: 2 },
  { id: 15, name: "Seitheben",                   muskel: "Schultern", equipment: ["Kurzhanteln"],                schwierigkeit: "Leicht",  beschreibung: "Hebe die Kurzhanteln seitlich auf Schulterhöhe. Leicht angewinkelte Ellenbogen, kontrollierte Bewegung.", video: "💪", sätze: 4, wiederholungen: "12-15", rir: 2 },
  { id: 16, name: "Frontheben",                  muskel: "Schultern", equipment: ["Kurzhanteln"],                schwierigkeit: "Leicht",  beschreibung: "Hebe die Kurzhanteln alternierend nach vorne auf Schulterhöhe.", video: "💪", sätze: 3, wiederholungen: "12-15", rir: 2 },
  { id: 17, name: "Arnold Press",                muskel: "Schultern", equipment: ["Kurzhanteln"],                schwierigkeit: "Mittel",  beschreibung: "Beginne mit Handflächen zu dir, drehe sie beim Drücken nach außen. Vollständige Rotation für maximale Aktivierung.", video: "🏋️", sätze: 3, wiederholungen: "10-12", rir: 2 },
  { id: 18, name: "Reverse Flyes",               muskel: "Schultern", equipment: ["Kurzhanteln"],                schwierigkeit: "Leicht",  beschreibung: "Beuge dich nach vorne, hebe die Kurzhanteln zu den Seiten. Betont die hinteren Schultern.", video: "💪", sätze: 3, wiederholungen: "12-15", rir: 2 },
  { id: 19, name: "Kurzhantel Schulterdrücken",  muskel: "Schultern", equipment: ["Kurzhanteln"],                schwierigkeit: "Leicht",  beschreibung: "Sitze aufrecht, drücke die Kurzhanteln von Schulterbreite über den Kopf.", video: "💪", sätze: 3, wiederholungen: "10-12", rir: 2 },
  // ARME – BIZEPS
  { id: 20, name: "Bizepscurl Langhantel",       muskel: "Bizeps",    equipment: ["Langhantel"],                 schwierigkeit: "Leicht",  beschreibung: "Stehe aufrecht, Unterarme nach oben curlen. Ellenbogen bleiben am Körper.", video: "💪", sätze: 3, wiederholungen: "8-12", rir: 2 },
  { id: 21, name: "Hammercurls",                 muskel: "Bizeps",    equipment: ["Kurzhanteln"],                schwierigkeit: "Leicht",  beschreibung: "Curle die Kurzhanteln mit neutralem Griff (Daumen oben). Betont den Brachialis.", video: "💪", sätze: 3, wiederholungen: "10-12", rir: 2 },
  { id: 22, name: "Konzentrationscurls",         muskel: "Bizeps",    equipment: ["Kurzhanteln"],                schwierigkeit: "Leicht",  beschreibung: "Sitze, stütze den Ellenbogen am Oberschenkel. Curle die Kurzhantel für maximale Kontraktion.", video: "💪", sätze: 3, wiederholungen: "10-15", rir: 2 },
  { id: 23, name: "EZ-Stangen Curl",             muskel: "Bizeps",    equipment: ["EZ-Stange"],                  schwierigkeit: "Leicht",  beschreibung: "Curle die EZ-Stange für eine natürlichere Handgelenksposition.", video: "🏋️", sätze: 3, wiederholungen: "10-12", rir: 2 },
  { id: 24, name: "Kabelzug Curl",               muskel: "Bizeps",    equipment: ["Kabelzug"],                   schwierigkeit: "Leicht",  beschreibung: "Nutze den unteren Kabelzug für konstante Spannung während der gesamten Bewegung.", video: "🏋️", sätze: 3, wiederholungen: "12-15", rir: 2 },
  // ARME – TRIZEPS
  { id: 25, name: "Trizepsdrücken am Kabel",     muskel: "Trizeps",   equipment: ["Kabelzug"],                   schwierigkeit: "Leicht",  beschreibung: "Drücke das Seil am Kabelzug nach unten. Ellenbogen bleiben eng am Körper.", video: "🏋️", sätze: 4, wiederholungen: "10-15", rir: 2 },
  { id: 26, name: "Skull Crushers",              muskel: "Trizeps",   equipment: ["Langhantel","Bank"],           schwierigkeit: "Mittel",  beschreibung: "Liege auf der Bank. Senke die Stange zur Stirn, Ellenbogen oben, strecke zurück.", video: "🏋️", sätze: 3, wiederholungen: "8-12", rir: 2 },
  { id: 27, name: "Trizeps Dips",                muskel: "Trizeps",   equipment: ["Bank","Stuhl"],                schwierigkeit: "Leicht",  beschreibung: "Stütze dich hinter dir auf einer Bank. Beuge und strecke die Ellenbogen.", video: "💪", sätze: 3, wiederholungen: "10-15", rir: 2 },
  { id: 28, name: "Trizeps Overhead",            muskel: "Trizeps",   equipment: ["Kurzhantel"],                 schwierigkeit: "Leicht",  beschreibung: "Halte eine Kurzhantel über dem Kopf. Beuge den Ellenbogen nach hinten und strecke zurück.", video: "💪", sätze: 3, wiederholungen: "12-15", rir: 2 },
  // BEINE
  { id: 29, name: "Kniebeugen",                  muskel: "Beine",     equipment: ["Langhantel","Rack"],           schwierigkeit: "Schwer",  beschreibung: "Stange auf den Schultern. Knie nach außen, Hüfte unter Kniehöhe senken, explosiv aufstehen.", video: "🏋️", sätze: 4, wiederholungen: "5-8",  rir: 2 },
  { id: 30, name: "Beinpresse",                  muskel: "Beine",     equipment: ["Beinpresse"],                 schwierigkeit: "Leicht",  beschreibung: "Sitze an der Beinpresse. Drücke die Plattform vollständig durch ohne die Knie zu überstrecken.", video: "🏋️", sätze: 4, wiederholungen: "10-15", rir: 2 },
  { id: 31, name: "Rumänisches Kreuzheben",      muskel: "Beine",     equipment: ["Langhantel"],                 schwierigkeit: "Mittel",  beschreibung: "Senke die Stange an den Beinen entlang. Hüfte nach hinten drücken, Rücken gerade, Hamstrings dehnen.", video: "🏋️", sätze: 4, wiederholungen: "8-12", rir: 2 },
  { id: 32, name: "Beinstrecker",                muskel: "Beine",     equipment: ["Beinstrecker"],               schwierigkeit: "Leicht",  beschreibung: "Sitze am Gerät. Strecke die Beine vollständig aus und senke kontrolliert.", video: "🏋️", sätze: 3, wiederholungen: "12-15", rir: 2 },
  { id: 33, name: "Beinbeuger liegend",          muskel: "Beine",     equipment: ["Beinbeuger"],                 schwierigkeit: "Leicht",  beschreibung: "Liege am Beinbeuger. Curle die Unterschenkel zur Gesäßmuskulatur.", video: "🏋️", sätze: 3, wiederholungen: "12-15", rir: 2 },
  { id: 34, name: "Ausfallschritte",             muskel: "Beine",     equipment: ["Kurzhanteln","Körpergewicht"], schwierigkeit: "Mittel",  beschreibung: "Trete einen großen Schritt nach vorne. Senke das hintere Knie fast zum Boden. Wechsle die Seiten.", video: "💪", sätze: 3, wiederholungen: "10-12", rir: 2 },
  { id: 35, name: "Wadenheben",                  muskel: "Beine",     equipment: ["Maschine","Körpergewicht"],   schwierigkeit: "Leicht",  beschreibung: "Stelle die Zehenspitzen auf eine Erhöhung. Hebe die Fersen so hoch wie möglich, senke vollständig.", video: "💪", sätze: 4, wiederholungen: "15-20", rir: 2 },
  { id: 36, name: "Goblet Squat",                muskel: "Beine",     equipment: ["Kurzhantel","Kettlebell"],    schwierigkeit: "Leicht",  beschreibung: "Halte eine Kurzhantel vor der Brust. Kniebeuge mit aufrechtem Oberkörper und tiefer Position.", video: "💪", sätze: 3, wiederholungen: "12-15", rir: 2 },
  { id: 37, name: "Sumo Kreuzheben",             muskel: "Beine",     equipment: ["Langhantel"],                 schwierigkeit: "Mittel",  beschreibung: "Breite Fußposition, Zehen nach außen. Griffbreiter als die Knie. Hebe mit geradem Rücken.", video: "🏋️", sätze: 4, wiederholungen: "5-8",  rir: 2 },
  { id: 38, name: "Hip Thrust",                  muskel: "Beine",     equipment: ["Langhantel","Bank"],           schwierigkeit: "Mittel",  beschreibung: "Schultern an der Bank, Stange auf den Hüften. Drücke die Hüfte nach oben und spanne das Gesäß an.", video: "🏋️", sätze: 4, wiederholungen: "10-15", rir: 2 },
  // BAUCH / CORE
  { id: 39, name: "Crunches",                    muskel: "Bauch",     equipment: ["Körpergewicht","Matte"],      schwierigkeit: "Leicht",  beschreibung: "Liege auf dem Rücken, Knie gebeugt. Hebe die Schulterblätter vom Boden und spanne den Bauch an.", video: "💪", sätze: 3, wiederholungen: "15-20", rir: 2 },
  { id: 40, name: "Plank",                       muskel: "Bauch",     equipment: ["Körpergewicht","Matte"],      schwierigkeit: "Leicht",  beschreibung: "Unterarmstütz. Halte den Körper gerade wie ein Brett. Bauch und Gesäß anspannen.", video: "💪", sätze: 3, wiederholungen: "30-60 Sek.", rir: 2 },
  { id: 41, name: "Russian Twists",              muskel: "Bauch",     equipment: ["Körpergewicht","Gewichtsscheibe"], schwierigkeit: "Leicht", beschreibung: "Sitze mit angehobenen Füßen. Drehe den Oberkörper abwechselnd nach links und rechts.", video: "💪", sätze: 3, wiederholungen: "20-30", rir: 2 },
  { id: 42, name: "Beinheben liegend",           muskel: "Bauch",     equipment: ["Körpergewicht","Matte"],      schwierigkeit: "Mittel",  beschreibung: "Liege auf dem Rücken. Hebe die gestreckten Beine auf 90° und senke kontrolliert.", video: "💪", sätze: 3, wiederholungen: "12-15", rir: 2 },
  { id: 43, name: "Kabelzug Crunch",             muskel: "Bauch",     equipment: ["Kabelzug"],                   schwierigkeit: "Leicht",  beschreibung: "Knie vor dem Kabelzug. Ziehe das Seil nach unten während du den Rumpf beugst.", video: "🏋️", sätze: 3, wiederholungen: "15-20", rir: 2 },
  { id: 44, name: "Hängendes Beinheben",         muskel: "Bauch",     equipment: ["Klimmzugstange"],             schwierigkeit: "Schwer",  beschreibung: "Hänge an der Stange. Hebe die Beine auf 90° oder höher ohne zu schwingen.", video: "💪", sätze: 3, wiederholungen: "10-15", rir: 2 },
  // GANZKÖRPER / OLYMPISCH
  { id: 45, name: "Burpees",                     muskel: "Ganzkörper",equipment: ["Körpergewicht"],              schwierigkeit: "Mittel",  beschreibung: "Springe hoch, gehe in Liegestützposition, mache eine Liegestütze, springe zurück. Schnelle Ausführung.", video: "💪", sätze: 3, wiederholungen: "10-15", rir: 2 },
  { id: 46, name: "Clean and Jerk",              muskel: "Ganzkörper",equipment: ["Langhantel"],                 schwierigkeit: "Schwer",  beschreibung: "Olympische Übung. Hebe die Stange in einer Bewegung auf die Schultern (Clean), dann über den Kopf (Jerk).", video: "🏋️", sätze: 5, wiederholungen: "3-5",  rir: 2 },
  { id: 47, name: "Reißen",                      muskel: "Ganzkörper",equipment: ["Langhantel"],                 schwierigkeit: "Schwer",  beschreibung: "Olympische Übung. Hebe die Stange in einer schnellen Bewegung direkt über den Kopf.", video: "🏋️", sätze: 5, wiederholungen: "3-5",  rir: 2 },
  { id: 48, name: "Kettlebell Swing",            muskel: "Ganzkörper",equipment: ["Kettlebell"],                 schwierigkeit: "Mittel",  beschreibung: "Schwinge die Kettlebell zwischen den Beinen hindurch und explosiv auf Schulterhöhe.", video: "💪", sätze: 4, wiederholungen: "15-20", rir: 2 },
];

// ── WORKOUT-PLÄNE ──────────────────────────
const STANDARD_PLAENE = [
  {
    id: 1, name: "Push / Pull / Beine – 6 Tage", ziel: "Muskelaufbau", level: "Fortgeschritten",
    tage: [
      { tag: "Montag",     typ: "Push",   übungen: [1,2,3,14,15,25] },
      { tag: "Dienstag",   typ: "Pull",   übungen: [7,9,10,20,21,44] },
      { tag: "Mittwoch",   typ: "Beine",  übungen: [29,31,32,33,35,38] },
      { tag: "Donnerstag", typ: "Push",   übungen: [2,4,5,17,16,26] },
      { tag: "Freitag",    typ: "Pull",   übungen: [8,11,12,23,24,43] },
      { tag: "Samstag",    typ: "Beine",  übungen: [30,36,34,37,33,35] },
      { tag: "Sonntag",    typ: "Ruhetag",übungen: [] },
    ]
  },
  {
    id: 2, name: "Oberkörper / Unterkörper – 4 Tage", ziel: "Kraft & Masse", level: "Mittel",
    tage: [
      { tag: "Montag",     typ: "Oberkörper", übungen: [1,9,14,20,25,3] },
      { tag: "Dienstag",   typ: "Unterkörper",übungen: [29,31,32,33,35,38] },
      { tag: "Mittwoch",   typ: "Ruhetag",    übungen: [] },
      { tag: "Donnerstag", typ: "Oberkörper", übungen: [2,10,17,22,26,4] },
      { tag: "Freitag",    typ: "Unterkörper",übungen: [30,37,34,33,35,36] },
      { tag: "Samstag",    typ: "Ruhetag",    übungen: [] },
      { tag: "Sonntag",    typ: "Ruhetag",    übungen: [] },
    ]
  },
  {
    id: 3, name: "Ganzkörper – 3 Tage", ziel: "Einsteiger & Fettverbrennung", level: "Einsteiger",
    tage: [
      { tag: "Montag",     typ: "Ganzkörper A", übungen: [1,7,29,14,39,40] },
      { tag: "Dienstag",   typ: "Ruhetag",      übungen: [] },
      { tag: "Mittwoch",   typ: "Ganzkörper B", übungen: [6,8,30,19,41,42] },
      { tag: "Donnerstag", typ: "Ruhetag",      übungen: [] },
      { tag: "Freitag",    typ: "Ganzkörper C", übungen: [5,9,31,15,43,45] },
      { tag: "Samstag",    typ: "Ruhetag",      übungen: [] },
      { tag: "Sonntag",    typ: "Ruhetag",      übungen: [] },
    ]
  }
];

// ── LOKALER SPEICHER ───────────────────────
const STORE = {
  get: (key, def) => { try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : def; } catch { return def; } },
  set: (key, val) => { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} }
};

// ── STATE ──────────────────────────────────
let state = {
  seite: "dashboard",
  aktivesTraining: null,
  trainingslog: STORE.get("trainingslog", []),
  gewicht: STORE.get("gewicht", []),
  pr: STORE.get("pr", {}),
  aktiverPlan: STORE.get("aktiverPlan", null),
  uebungFilter: { muskel: "Alle", suche: "" },
  timerInterval: null,
  timerSekunden: 0,
  timerLäuft: false,
};

// ── UTILS ──────────────────────────────────
const $ = id => document.getElementById(id);
const fmt = n => n < 10 ? "0"+n : ""+n;

function zeitFormat(sek) {
  const m = Math.floor(sek / 60), s = sek % 60;
  return `${fmt(m)}:${fmt(s)}`;
}

function heuteStr() {
  return new Date().toLocaleDateString("de-DE", { weekday:"long", day:"2-digit", month:"long", year:"numeric" });
}

function wochentag() {
  return new Date().toLocaleDateString("de-DE", { weekday: "long" });
}

function uebungById(id) {
  return UEBUNGEN_DB.find(u => u.id === id);
}

function saveLog() { STORE.set("trainingslog", state.trainingslog); }
function savePR() { STORE.set("pr", state.pr); }

function updatePR(name, gewicht, wdh) {
  const e1rm = gewicht * (1 + wdh / 30);
  if (!state.pr[name] || e1rm > state.pr[name]) {
    state.pr[name] = e1rm;
    savePR();
    return true;
  }
  return false;
}

// ── NAVIGATION ─────────────────────────────
function navigate(seite) {
  state.seite = seite;
  document.querySelectorAll(".nav-item").forEach(el => {
    el.classList.toggle("active", el.dataset.seite === seite);
  });
  render();
}

// ── TIMER ──────────────────────────────────
function timerStart(sekunden) {
  stopTimer();
  state.timerSekunden = sekunden;
  state.timerLäuft = true;
  $("timer-display").textContent = zeitFormat(sekunden);
  $("timer-bar").style.width = "100%";
  const total = sekunden;
  state.timerInterval = setInterval(() => {
    state.timerSekunden--;
    const pct = (state.timerSekunden / total) * 100;
    $("timer-display").textContent = zeitFormat(state.timerSekunden);
    $("timer-bar").style.width = pct + "%";
    if (state.timerSekunden <= 0) {
      stopTimer();
      $("timer-display").textContent = "Fertig! 🎉";
      $("timer-bar").style.width = "0%";
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(state.timerInterval);
  state.timerLäuft = false;
}

// ── TRAINING STARTEN ───────────────────────
function trainingStarten(übungsIds) {
  const übungen = übungsIds.map(id => {
    const u = uebungById(id);
    return {
      id: u.id,
      name: u.name,
      muskel: u.muskel,
      sätze: Array.from({ length: u.sätze }, () => ({ gewicht: "", wdh: "", rir: u.rir, fertig: false }))
    };
  });
  state.aktivesTraining = {
    startzeit: new Date(),
    übungen,
    notizen: ""
  };
  navigate("training");
}

function satzeintragen(übIdx, satzIdx, feld, wert) {
  state.aktivesTraining.übungen[übIdx].sätze[satzIdx][feld] = wert;
}

function satzAbhaken(übIdx, satzIdx) {
  const satz = state.aktivesTraining.übungen[übIdx].sätze[satzIdx];
  satz.fertig = !satz.fertig;
  if (satz.fertig && satz.gewicht && satz.wdh) {
    const name = state.aktivesTraining.übungen[übIdx].name;
    updatePR(name, parseFloat(satz.gewicht), parseInt(satz.wdh));
    timerStart(90);
  }
  renderTraining();
}

function trainingBeenden() {
  if (!state.aktivesTraining) return;
  const log = {
    id: Date.now(),
    datum: new Date().toISOString(),
    dauer: Math.round((new Date() - state.aktivesTraining.startzeit) / 60000),
    übungen: state.aktivesTraining.übungen,
    notizen: state.aktivesTraining.notizen
  };
  state.trainingslog.unshift(log);
  saveLog();
  state.aktivesTraining = null;
  stopTimer();
  navigate("fortschritt");
}

// ── RENDER DASHBOARD ───────────────────────
function renderDashboard() {
  const letztes = state.trainingslog[0];
  const gesamtTrainings = state.trainingslog.length;
  const prAnzahl = Object.keys(state.pr).length;
  const woche = state.trainingslog.filter(l => {
    const d = new Date(l.datum);
    const jetzt = new Date();
    const diff = (jetzt - d) / (1000 * 60 * 60 * 24);
    return diff <= 7;
  }).length;

  let heutigePlan = "";
  if (state.aktiverPlan !== null) {
    const plan = STANDARD_PLAENE[state.aktiverPlan];
    const tag = wochentag();
    const heute = plan.tage.find(t => t.tag === tag);
    if (heute && heute.übungen.length > 0) {
      heutigePlan = `
        <div class="card card-highlight mt-1">
          <div class="card-header"><span class="badge badge-primary">${heute.typ}</span> Heutiges Training</div>
          <div class="card-body">
            <p class="text-muted mb-1">${plan.name}</p>
            <div class="übungen-mini">
              ${heute.übungen.map(id => {
                const u = uebungById(id);
                return u ? `<span class="chip">${u.name}</span>` : "";
              }).join("")}
            </div>
            <button class="btn btn-primary mt-1" onclick="trainingStarten([${heute.übungen.join(",")}])">Training starten ▶</button>
          </div>
        </div>`;
    }
  }

  $("main-content").innerHTML = `
    <div class="dashboard">
      <div class="dashboard-header">
        <div>
          <h2>Guten Tag! 💪</h2>
          <p class="text-muted">${heuteStr()}</p>
        </div>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-value">${gesamtTrainings}</div>
          <div class="stat-label">Trainings gesamt</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${woche}</div>
          <div class="stat-label">Diese Woche</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${prAnzahl}</div>
          <div class="stat-label">Persönliche Bestleistungen</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${letztes ? letztes.dauer + " min" : "–"}</div>
          <div class="stat-label">Letztes Training</div>
        </div>
      </div>

      ${heutigePlan}

      <div class="card mt-1">
        <div class="card-header">Schnellstart</div>
        <div class="card-body quick-actions">
          ${STANDARD_PLAENE.map(p => `
            <button class="btn btn-secondary" onclick="trainingStarten([${p.tage[0].übungen.join(",")}])">
              ${p.name.split("–")[0].trim()}
            </button>
          `).join("")}
          <button class="btn btn-outline" onclick="navigate('uebungen')">Eigene Übungen wählen</button>
        </div>
      </div>

      ${letztes ? `
      <div class="card mt-1">
        <div class="card-header">Letztes Training</div>
        <div class="card-body">
          <p class="text-muted">${new Date(letztes.datum).toLocaleDateString("de-DE")} · ${letztes.dauer} Minuten</p>
          <div class="übungen-mini">
            ${letztes.übungen.map(u => `<span class="chip">${u.name}</span>`).join("")}
          </div>
        </div>
      </div>` : ""}
    </div>`;
}

// ── RENDER ÜBUNGEN ─────────────────────────
function renderUebungen() {
  const muskeln = ["Alle", ...new Set(UEBUNGEN_DB.map(u => u.muskel))];
  const gefiltert = UEBUNGEN_DB.filter(u => {
    const muskelOk = state.uebungFilter.muskel === "Alle" || u.muskel === state.uebungFilter.muskel;
    const sucheOk = u.name.toLowerCase().includes(state.uebungFilter.suche.toLowerCase());
    return muskelOk && sucheOk;
  });

  $("main-content").innerHTML = `
    <div class="uebungen-page">
      <h2>Übungsbibliothek</h2>
      <p class="text-muted">${UEBUNGEN_DB.length}+ Übungen mit Anleitungen</p>

      <div class="filter-bar">
        <input type="text" class="search-input" placeholder="Übung suchen..." value="${state.uebungFilter.suche}"
          oninput="state.uebungFilter.suche=this.value; renderUebungen()">
      </div>

      <div class="muskel-chips">
        ${muskeln.map(m => `
          <button class="chip ${state.uebungFilter.muskel === m ? "active" : ""}"
            onclick="state.uebungFilter.muskel='${m}'; renderUebungen()">${m}</button>
        `).join("")}
      </div>

      <div class="uebungen-grid">
        ${gefiltert.map(u => `
          <div class="uebung-card" onclick="uebungDetail(${u.id})">
            <div class="uebung-emoji">${u.video}</div>
            <div class="uebung-info">
              <div class="uebung-name">${u.name}</div>
              <div class="uebung-meta">
                <span class="badge badge-${muskelColor(u.muskel)}">${u.muskel}</span>
                <span class="badge badge-schwierigkeit-${u.schwierigkeit.toLowerCase()}">${u.schwierigkeit}</span>
              </div>
              <div class="uebung-detail">${u.sätze} Sätze · ${u.wiederholungen} Wdh</div>
            </div>
          </div>
        `).join("")}
      </div>
    </div>`;
}

function uebungDetail(id) {
  const u = uebungById(id);
  const modal = document.createElement("div");
  modal.className = "modal-overlay";
  modal.innerHTML = `
    <div class="modal">
      <div class="modal-header">
        <span>${u.video} ${u.name}</span>
        <button onclick="this.closest('.modal-overlay').remove()">✕</button>
      </div>
      <div class="modal-body">
        <div class="badges-row">
          <span class="badge badge-${muskelColor(u.muskel)}">${u.muskel}</span>
          <span class="badge badge-schwierigkeit-${u.schwierigkeit.toLowerCase()}">${u.schwierigkeit}</span>
        </div>
        <div class="detail-grid">
          <div><strong>Sätze</strong><br>${u.sätze}</div>
          <div><strong>Wiederholungen</strong><br>${u.wiederholungen}</div>
          <div><strong>RIR</strong><br>${u.rir}</div>
          <div><strong>Equipment</strong><br>${u.equipment.join(", ")}</div>
        </div>
        <div class="anleitung-box">
          <h4>Ausführung</h4>
          <p>${u.beschreibung}</p>
        </div>
        ${state.pr[u.name] ? `<div class="pr-box">🏆 Persönliche Bestleistung: <strong>${state.pr[u.name].toFixed(1)} kg</strong> (geschätztes 1RM)</div>` : ""}
      </div>
      <div class="modal-footer">
        <button class="btn btn-primary" onclick="this.closest('.modal-overlay').remove(); trainingStarten([${u.id}])">Training starten</button>
      </div>
    </div>`;
  document.body.appendChild(modal);
}

function muskelColor(m) {
  const map = { Brust:"blue", Rücken:"green", Schultern:"purple", Bizeps:"orange", Trizeps:"orange", Beine:"red", Bauch:"teal", Ganzkörper:"gold" };
  return map[m] || "blue";
}

// ── RENDER PLÄNE ───────────────────────────
function renderPlaene() {
  $("main-content").innerHTML = `
    <div class="plaene-page">
      <h2>Trainingspläne</h2>
      <p class="text-muted">KI-generierte Pläne für deinen Fortschritt</p>

      <div class="plan-generator card">
        <div class="card-header">🤖 Plan-Generator</div>
        <div class="card-body">
          <div class="generator-form">
            <div class="form-group">
              <label>Trainingsziel</label>
              <select id="gen-ziel" class="form-control">
                <option>Muskelaufbau</option>
                <option>Kraftzuwachs</option>
                <option>Fettabbau</option>
                <option>Kondition</option>
              </select>
            </div>
            <div class="form-group">
              <label>Trainingserfahrung</label>
              <select id="gen-level" class="form-control">
                <option>Einsteiger (0-1 Jahr)</option>
                <option>Mittel (1-3 Jahre)</option>
                <option>Fortgeschritten (3+ Jahre)</option>
              </select>
            </div>
            <div class="form-group">
              <label>Trainingstage pro Woche</label>
              <select id="gen-tage" class="form-control">
                <option>3 Tage</option>
                <option>4 Tage</option>
                <option>5 Tage</option>
                <option>6 Tage</option>
              </select>
            </div>
          </div>
          <button class="btn btn-primary" onclick="planGenerieren()">Plan generieren 🚀</button>
        </div>
      </div>

      <h3 class="mt-2">Verfügbare Pläne</h3>
      ${STANDARD_PLAENE.map((p, idx) => `
        <div class="card plan-card ${state.aktiverPlan === idx ? "plan-aktiv" : ""}">
          <div class="card-header">
            <span>${p.name}</span>
            ${state.aktiverPlan === idx ? '<span class="badge badge-green">Aktiv</span>' : ""}
          </div>
          <div class="card-body">
            <div class="plan-meta">
              <span>🎯 ${p.ziel}</span>
              <span>📊 ${p.level}</span>
              <span>📅 ${p.tage.filter(t => t.übungen.length > 0).length} Tage/Woche</span>
            </div>
            <div class="wochenplan">
              ${p.tage.map(t => `
                <div class="tag-row ${t.übungen.length === 0 ? "ruhetag" : ""}">
                  <span class="tag-name">${t.tag.slice(0,2)}</span>
                  <span class="tag-typ">${t.typ}</span>
                  ${t.übungen.length > 0 ? `
                    <button class="btn btn-sm btn-outline" onclick="trainingStarten([${t.übungen.join(",")}])">▶ Start</button>
                  ` : '<span class="text-muted">Pause</span>'}
                </div>
              `).join("")}
            </div>
            <div class="btn-row mt-1">
              <button class="btn ${state.aktiverPlan === idx ? "btn-secondary" : "btn-primary"}"
                onclick="planAktivieren(${idx})">
                ${state.aktiverPlan === idx ? "Aktiver Plan ✓" : "Plan aktivieren"}
              </button>
            </div>
          </div>
        </div>
      `).join("")}
    </div>`;
}

function planAktivieren(idx) {
  state.aktiverPlan = idx;
  STORE.set("aktiverPlan", idx);
  renderPlaene();
}

function planGenerieren() {
  const ziel = $("gen-ziel").value;
  const level = $("gen-level").value;
  const tage = $("gen-tage").value;
  alert(`✅ Plan generiert!\n\nZiel: ${ziel}\nLevel: ${level}\nTage: ${tage}\n\nEmpfehlung: ${
    tage.includes("3") ? "Ganzkörper – 3 Tage" :
    tage.includes("4") ? "Oberkörper / Unterkörper – 4 Tage" :
    "Push / Pull / Beine – 6 Tage"
  }\n\nActiviere einen der unten stehenden Pläne, um loszulegen.`);
}

// ── RENDER TRAINING ────────────────────────
function renderTraining() {
  if (!state.aktivesTraining) {
    $("main-content").innerHTML = `
      <div class="no-training">
        <div class="no-training-icon">🏋️</div>
        <h2>Kein aktives Training</h2>
        <p class="text-muted">Starte ein Training über das Dashboard oder einen Trainingsplan.</p>
        <button class="btn btn-primary" onclick="navigate('dashboard')">Zum Dashboard</button>
      </div>`;
    return;
  }

  const t = state.aktivesTraining;
  const fertigSätze = t.übungen.reduce((s, u) => s + u.sätze.filter(s => s.fertig).length, 0);
  const gesamtSätze = t.übungen.reduce((s, u) => s + u.sätze.length, 0);
  const pct = Math.round((fertigSätze / gesamtSätze) * 100);

  $("main-content").innerHTML = `
    <div class="training-page">
      <div class="training-header">
        <h2>Training läuft</h2>
        <button class="btn btn-danger" onclick="beendenBestaetigen()">Beenden</button>
      </div>

      <div class="timer-box card">
        <div class="card-body timer-body">
          <div>
            <div class="timer-label">Pausentimer</div>
            <div id="timer-display" class="timer-display">01:30</div>
          </div>
          <div class="timer-buttons">
            <button class="btn btn-sm btn-outline" onclick="timerStart(60)">60s</button>
            <button class="btn btn-sm btn-outline" onclick="timerStart(90)">90s</button>
            <button class="btn btn-sm btn-outline" onclick="timerStart(120)">2 min</button>
            <button class="btn btn-sm btn-secondary" onclick="stopTimer()">Stop</button>
          </div>
        </div>
        <div class="timer-bar-container"><div id="timer-bar" class="timer-bar" style="width:0%"></div></div>
      </div>

      <div class="fortschritt-bar">
        <div class="fortschritt-fill" style="width:${pct}%"></div>
      </div>
      <p class="text-muted text-center">${fertigSätze} / ${gesamtSätze} Sätze abgeschlossen (${pct}%)</p>

      ${t.übungen.map((ü, üIdx) => `
        <div class="card uebung-block">
          <div class="card-header">
            <span>${ü.name}</span>
            <span class="badge badge-${muskelColor(ü.muskel)}">${ü.muskel}</span>
          </div>
          <div class="card-body">
            <table class="satz-tabelle">
              <thead>
                <tr>
                  <th>Satz</th>
                  <th>Gewicht (kg)</th>
                  <th>Wdh</th>
                  <th>RIR</th>
                  <th>✓</th>
                </tr>
              </thead>
              <tbody>
                ${ü.sätze.map((s, sIdx) => `
                  <tr class="${s.fertig ? "satz-fertig" : ""}">
                    <td><strong>${sIdx + 1}</strong></td>
                    <td><input type="number" class="satz-input" placeholder="0" value="${s.gewicht}"
                      onchange="satzeintragen(${üIdx},${sIdx},'gewicht',this.value)"></td>
                    <td><input type="number" class="satz-input" placeholder="0" value="${s.wdh}"
                      onchange="satzeintragen(${üIdx},${sIdx},'wdh',this.value)"></td>
                    <td><input type="number" class="satz-input" placeholder="${s.rir}" value="${s.rir}"
                      onchange="satzeintragen(${üIdx},${sIdx},'rir',this.value)" min="0" max="5"></td>
                    <td>
                      <button class="btn-check ${s.fertig ? "checked" : ""}"
                        onclick="satzAbhaken(${üIdx},${sIdx})">
                        ${s.fertig ? "✓" : "○"}
                      </button>
                    </td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>
        </div>
      `).join("")}

      <div class="card mt-1">
        <div class="card-header">Notizen</div>
        <div class="card-body">
          <textarea class="form-control" placeholder="Notizen zum Training..." rows="3"
            onchange="state.aktivesTraining.notizen=this.value">${t.notizen}</textarea>
        </div>
      </div>

      <button class="btn btn-primary btn-block mt-1" onclick="beendenBestaetigen()">Training abschließen 🏁</button>
    </div>`;
}

function beendenBestaetigen() {
  if (confirm("Training wirklich beenden und speichern?")) trainingBeenden();
}

// ── RENDER FORTSCHRITT ─────────────────────
function renderFortschritt() {
  const log = state.trainingslog;
  const letzten7 = Array.from({length:7}, (_,i) => {
    const d = new Date(); d.setDate(d.getDate()-i);
    const ds = d.toISOString().slice(0,10);
    const count = log.filter(l => l.datum.startsWith(ds)).length;
    return { tag: d.toLocaleDateString("de-DE",{weekday:"short"}), count };
  }).reverse();

  const prListe = Object.entries(state.pr).sort((a,b)=>b[1]-a[1]).slice(0,10);

  $("main-content").innerHTML = `
    <div class="fortschritt-page">
      <h2>Fortschritt & Statistiken</h2>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-value">${log.length}</div>
          <div class="stat-label">Trainings gesamt</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${log.reduce((s,l)=>s+l.dauer,0)} min</div>
          <div class="stat-label">Gesamtdauer</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${log.length ? Math.round(log.reduce((s,l)=>s+l.dauer,0)/log.length) : 0} min</div>
          <div class="stat-label">Ø Trainingsdauer</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${Object.keys(state.pr).length}</div>
          <div class="stat-label">Persönliche Rekorde</div>
        </div>
      </div>

      <div class="card mt-1">
        <div class="card-header">Trainings letzte 7 Tage</div>
        <div class="card-body">
          <div class="bar-chart">
            ${letzten7.map(d => `
              <div class="bar-col">
                <div class="bar" style="height:${d.count > 0 ? Math.max(20, d.count*60) : 4}px;
                  background:${d.count>0?"var(--primary)":"var(--surface-2)"}">
                  ${d.count > 0 ? `<span class="bar-val">${d.count}</span>` : ""}
                </div>
                <div class="bar-label">${d.tag}</div>
              </div>
            `).join("")}
          </div>
        </div>
      </div>

      ${prListe.length > 0 ? `
      <div class="card mt-1">
        <div class="card-header">🏆 Persönliche Bestleistungen (1RM)</div>
        <div class="card-body">
          <div class="pr-liste">
            ${prListe.map(([name, val], i) => `
              <div class="pr-row">
                <span class="pr-rang">${["🥇","🥈","🥉"][i] || "•"}</span>
                <span class="pr-name">${name}</span>
                <span class="pr-wert">${val.toFixed(1)} kg</span>
              </div>
            `).join("")}
          </div>
        </div>
      </div>` : `<div class="card mt-1 text-center"><div class="card-body">
        <p class="text-muted">Noch keine Bestleistungen gespeichert.<br>Absolviere ein Training, um Rekorde zu setzen!</p>
      </div></div>`}

      ${log.length > 0 ? `
      <div class="card mt-1">
        <div class="card-header">Trainingshistorie</div>
        <div class="card-body">
          ${log.slice(0,10).map(l => `
            <div class="log-row">
              <div>
                <div class="log-datum">${new Date(l.datum).toLocaleDateString("de-DE",{weekday:"long",day:"2-digit",month:"long"})}</div>
                <div class="übungen-mini">
                  ${l.übungen.map(u=>`<span class="chip">${u.name}</span>`).join("")}
                </div>
              </div>
              <div class="log-dauer">${l.dauer} min</div>
            </div>
          `).join("")}
        </div>
      </div>` : ""}
    </div>`;
}

// ── RENDER PROFIL ──────────────────────────
function renderProfil() {
  const gewichtLog = STORE.get("gewicht", []);
  $("main-content").innerHTML = `
    <div class="profil-page">
      <h2>Mein Profil</h2>

      <div class="card">
        <div class="card-header">Körperdaten</div>
        <div class="card-body">
          <div class="form-group">
            <label>Name</label>
            <input type="text" class="form-control" placeholder="Dein Name"
              value="${STORE.get("name","")}"
              onchange="STORE.set('name',this.value)">
          </div>
          <div class="form-group">
            <label>Alter</label>
            <input type="number" class="form-control" placeholder="Jahre"
              value="${STORE.get("alter","")}"
              onchange="STORE.set('alter',this.value)">
          </div>
          <div class="form-group">
            <label>Körpergröße (cm)</label>
            <input type="number" class="form-control" placeholder="cm"
              value="${STORE.get("groesse","")}"
              onchange="STORE.set('groesse',this.value)">
          </div>
          <div class="form-group">
            <label>Aktuelles Gewicht (kg)</label>
            <div class="input-row">
              <input type="number" id="gewicht-input" class="form-control" placeholder="kg">
              <button class="btn btn-primary" onclick="gewichtEintragen()">Eintragen</button>
            </div>
          </div>
          ${gewichtLog.length > 0 ? `
          <div class="gewicht-verlauf">
            ${gewichtLog.slice(-7).map(e=>`
              <div class="gewicht-row">
                <span>${new Date(e.datum).toLocaleDateString("de-DE")}</span>
                <span><strong>${e.kg} kg</strong></span>
              </div>`).join("")}
          </div>` : ""}
        </div>
      </div>

      <div class="card mt-1">
        <div class="card-header">Trainingseinstellungen</div>
        <div class="card-body">
          <div class="form-group">
            <label>Trainingserfahrung</label>
            <select class="form-control" onchange="STORE.set('erfahrung',this.value)">
              <option ${STORE.get("erfahrung")==="Einsteiger"?"selected":""}>Einsteiger</option>
              <option ${STORE.get("erfahrung")==="Mittel"?"selected":""}>Mittel</option>
              <option ${STORE.get("erfahrung")==="Fortgeschritten"?"selected":""}>Fortgeschritten</option>
            </select>
          </div>
          <div class="form-group">
            <label>Verfügbares Equipment</label>
            <div class="equipment-checks">
              ${["Langhantel","Kurzhanteln","Kabelzug","Maschinen","Körpergewicht","Kettlebell"].map(e=>`
                <label class="check-label">
                  <input type="checkbox" ${STORE.get("equipment_"+e,false)?"checked":""}
                    onchange="STORE.set('equipment_${e}',this.checked)"> ${e}
                </label>`).join("")}
            </div>
          </div>
        </div>
      </div>

      <div class="card mt-1 danger-zone">
        <div class="card-header">Daten</div>
        <div class="card-body">
          <button class="btn btn-outline" onclick="datenExportieren()">📤 Daten exportieren (CSV)</button>
          <button class="btn btn-danger mt-1" onclick="if(confirm('Alle Daten löschen?')){localStorage.clear();location.reload()}">🗑️ Alle Daten löschen</button>
        </div>
      </div>
    </div>`;
}

function gewichtEintragen() {
  const kg = parseFloat($("gewicht-input").value);
  if (!kg) return;
  const log = STORE.get("gewicht", []);
  log.push({ datum: new Date().toISOString(), kg });
  STORE.set("gewicht", log);
  renderProfil();
}

function datenExportieren() {
  const log = state.trainingslog;
  if (!log.length) { alert("Keine Daten vorhanden."); return; }
  const zeilen = ["Datum,Dauer (min),Übungen,Sätze"];
  log.forEach(l => {
    zeilen.push(`${new Date(l.datum).toLocaleDateString("de-DE")},${l.dauer},"${l.übungen.map(u=>u.name).join("; ")}",${l.übungen.reduce((s,u)=>s+u.sätze.length,0)}`);
  });
  const blob = new Blob([zeilen.join("\n")], {type:"text/csv;charset=utf-8;"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = "training_export.csv"; a.click();
}

// ── HAUPT-RENDER ───────────────────────────
function render() {
  switch (state.seite) {
    case "dashboard":  renderDashboard();  break;
    case "uebungen":   renderUebungen();   break;
    case "plaene":     renderPlaene();     break;
    case "training":   renderTraining();   break;
    case "fortschritt":renderFortschritt();break;
    case "profil":     renderProfil();     break;
  }
}

// ── INIT ───────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  render();
});
