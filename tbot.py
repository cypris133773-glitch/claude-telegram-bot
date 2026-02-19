#!/usr/bin/env python3
"""
╔══════════════════════════════════════════════════════════════════════════╗
║          FitBot Pro v2.0 — Dein KI-Fitness-Coach                        ║
║                                                                          ║
║  Vollautomatischer, KI-gesteuerter Trainingsplan-Generator               ║
║  für maximale Kraft (Strength) und Definition (Hypertrophie)             ║
║                                                                          ║
║  Features:                                                               ║
║  ✅ 20 präzise Fragen zur Individualisierung                             ║
║  ✅ Verletzungs- & Gesundheitsanalyse                                    ║
║  ✅ Wochenplan mit Sätzen, Wiederholungen, Pausen                        ║
║  ✅ Progressionsschema & Periodisierung                                  ║
║  ✅ Übungen tauschen mit Alternativen                                    ║
║  ✅ Plan speichern & laden                                               ║
║  ✅ Plan als Bild exportieren (Screenshot)                               ║
╚══════════════════════════════════════════════════════════════════════════╝
"""

import os
import json
import io
import logging
import re
import textwrap
from datetime import datetime

import anthropic
from telegram import (
    Update,
    InlineKeyboardButton,
    InlineKeyboardMarkup,
)
from telegram.ext import (
    ApplicationBuilder,
    CommandHandler,
    MessageHandler,
    CallbackQueryHandler,
    ConversationHandler,
    ContextTypes,
    filters,
)

try:
    from PIL import Image, ImageDraw, ImageFont
    PIL_AVAILABLE = True
except ImportError:
    PIL_AVAILABLE = False

# ─── Logging ────────────────────────────────────────────────────────────────
logging.basicConfig(
    format="%(asctime)s - %(levelname)s - %(message)s", level=logging.INFO
)
logger = logging.getLogger(__name__)

# ─── Config ─────────────────────────────────────────────────────────────────
ANTHROPIC_API_KEY = os.environ.get("ANTHROPIC_API_KEY")
TELEGRAM_TOKEN    = os.environ.get("TELEGRAM_TOKEN")
client            = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)

# ─── Conversation States ─────────────────────────────────────────────────────
(
    Q_NAME, Q_AGE, Q_GENDER, Q_HEIGHT, Q_WEIGHT,
    Q_EXPERIENCE, Q_DAYS, Q_DURATION, Q_GOAL, Q_EQUIPMENT,
    Q_INJURIES, Q_SLEEP, Q_NUTRITION, Q_STRESS,
    Q_BODY_FAT, Q_CARDIO, Q_FAV_MUSCLES, Q_WEAK_POINTS,
    Q_PAST_PROGRAMS, Q_SPLIT_PREF, Q_CONFIRM,
) = range(21)

SWAP_DAY, SWAP_EX, SWAP_PICK = range(21, 24)

# ─── In-Memory Storage ───────────────────────────────────────────────────────
user_profiles  = {}   # uid -> profile dict
user_plans     = {}   # uid -> parsed plan dict
user_plans_raw = {}   # uid -> raw plan text (markdown)
swap_ctx       = {}   # uid -> {day, exercise_name, exercise_index}


# ════════════════════════════════════════════════════════════════════════════
#   WELCOME & START
# ════════════════════════════════════════════════════════════════════════════

WELCOME_TEXT = """🏋️‍♂️ *FitBot Pro v2.0 — Dein KI-Fitness-Coach*

Hey! Ich bin FitBot Pro, ein spezialisierter KI-Fitness-Coach.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*Was ich für dich tue:*

Ich erstelle dir einen *hochindividualisierten Trainingsplan* basierend auf deinen persönlichen Daten, Zielen, Einschränkungen und deiner Erfahrung — kein Einheitsplan aus dem Internet, sondern ein Plan der *wirklich zu dir passt*.

*Ziele die ich abdecke:*
⚡ Maximale Kraft (Compound-basiert, progressive Überlastung)
🔥 Maximale Definition (Hypertrophie + Fettstoffwechsel)
💎 Kraft + Definition kombiniert

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*Was ich alles analysiere (20 Fragen):*

🩺 Verletzungen & körperliche Einschränkungen
📊 Trainingserfahrung & Vorgeschichte
📅 Verfügbare Trainingstage & Sessiondauer
🏋️ Equipment (Gym, Zuhause, Minimal)
🧬 Körperzusammensetzung & Körpertyp
😴 Schlaf & Regenerationsfähigkeit
🥗 Ernährungsqualität & Gewohnheiten
🧠 Stresslevel & mentale Belastung
❤️ Kardiovaskuläre Fitness
💪 Schwachpunkte & lagging Muskelgruppen
🎯 Lieblings-Muskelgruppen & Präferenzen
📈 Bisherige Programme & Erfahrungen

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*Dein Plan enthält:*

✅ Wochenplan mit konkreten Trainingstagen
✅ Jede Übung mit Sätzen, Wiederholungen & Pausenzeit
✅ Ausführungshinweise & Technik-Tipps
✅ Progressionsschema (wie du dich steigern sollst)
✅ Periodisierungsempfehlung
✅ Individualisierte Warm-Up Routine
✅ Recovery & Stretching Tipps

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*Extra Features:*

💾 Plan speichern & jederzeit abrufen
🔄 Einzelne Übungen tauschen (mit Alternativen)
📸 Plan als Bild exportieren
🔁 Plan jederzeit neu erstellen

Ich stelle dir jetzt *20 detaillierte Fragen*. Je ehrlicher du antwortest, desto besser wird dein Plan!

Bereit? Los geht's! 💪
"""


async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    uid = update.effective_user.id
    user_profiles.pop(uid, None)
    context.user_data.clear()

    await update.message.reply_text(WELCOME_TEXT, parse_mode="Markdown")
    await update.message.reply_text(
        "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"
        "📝 *Frage 1 von 20*\n\n"
        "Wie heißt du? _(Vorname reicht)_",
        parse_mode="Markdown",
    )
    return Q_NAME


# ════════════════════════════════════════════════════════════════════════════
#   QUESTION HANDLERS
# ════════════════════════════════════════════════════════════════════════════

async def q_name(update: Update, context: ContextTypes.DEFAULT_TYPE):
    name = update.message.text.strip()
    if not name or len(name) > 50:
        await update.message.reply_text("Bitte gib einen gültigen Namen ein:")
        return Q_NAME
    context.user_data["name"] = name

    await update.message.reply_text(
        f"Sehr gut, *{name}*! 👋\n\n"
        "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"
        "📝 *Frage 2 von 20*\n\n"
        "Wie alt bist du? _(Zahlen eingeben, z.B. 25)_",
        parse_mode="Markdown",
    )
    return Q_AGE


async def q_age(update: Update, context: ContextTypes.DEFAULT_TYPE):
    text = update.message.text.strip()
    try:
        age = int(re.sub(r"[^\d]", "", text))
        if not 13 <= age <= 80:
            raise ValueError
        context.user_data["age"] = age
    except Exception:
        await update.message.reply_text("❌ Bitte gib ein gültiges Alter ein (13–80 Jahre):")
        return Q_AGE

    keyboard = InlineKeyboardMarkup([
        [
            InlineKeyboardButton("👨 Männlich", callback_data="gender_m"),
            InlineKeyboardButton("👩 Weiblich", callback_data="gender_f"),
        ],
        [InlineKeyboardButton("⚧ Divers", callback_data="gender_d")],
    ])
    await update.message.reply_text(
        "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"
        "📝 *Frage 3 von 20*\n\n"
        "Was ist dein biologisches Geschlecht?\n"
        "_(Relevant für Hormone, Kraftwerte & Zielsetzung)_",
        parse_mode="Markdown",
        reply_markup=keyboard,
    )
    return Q_GENDER


async def q_gender(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()
    data = query.data
    mapping = {"gender_m": "Männlich", "gender_f": "Weiblich", "gender_d": "Divers"}
    context.user_data["gender"] = mapping.get(data, "Nicht angegeben")

    await query.edit_message_text(
        f"✅ Geschlecht: *{context.user_data['gender']}*\n\n"
        "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"
        "📝 *Frage 4 von 20*\n\n"
        "Wie groß bist du? _(in cm, z.B. 180)_",
        parse_mode="Markdown",
    )
    return Q_HEIGHT


async def q_height(update: Update, context: ContextTypes.DEFAULT_TYPE):
    text = update.message.text.strip()
    try:
        h = int(re.sub(r"[^\d]", "", text))
        if not 130 <= h <= 230:
            raise ValueError
        context.user_data["height"] = h
    except Exception:
        await update.message.reply_text("❌ Bitte gib eine gültige Körpergröße ein (130–230 cm):")
        return Q_HEIGHT

    await update.message.reply_text(
        "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"
        "📝 *Frage 5 von 20*\n\n"
        "Wie viel wiegst du aktuell? _(in kg, z.B. 80)_",
        parse_mode="Markdown",
    )
    return Q_WEIGHT


async def q_weight(update: Update, context: ContextTypes.DEFAULT_TYPE):
    text = update.message.text.strip()
    try:
        w = float(re.sub(r"[^\d.]", "", text))
        if not 30 <= w <= 250:
            raise ValueError
        context.user_data["weight"] = w
    except Exception:
        await update.message.reply_text("❌ Bitte gib ein gültiges Gewicht ein (30–250 kg):")
        return Q_WEIGHT

    keyboard = InlineKeyboardMarkup([
        [InlineKeyboardButton("🌱 Anfänger (0–1 Jahr)", callback_data="exp_beginner")],
        [InlineKeyboardButton("📈 Fortgeschrittener (1–3 Jahre)", callback_data="exp_intermediate")],
        [InlineKeyboardButton("💪 Erfahren (3–6 Jahre)", callback_data="exp_advanced")],
        [InlineKeyboardButton("🏆 Sehr erfahren (6+ Jahre)", callback_data="exp_expert")],
    ])
    await update.message.reply_text(
        "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"
        "📝 *Frage 6 von 20*\n\n"
        "Wie lange trainierst du schon ernsthaft mit Gewichten?\n"
        "_(Wähle ehrlich — das beeinflusst dein Volumen & deine Intensität)_",
        parse_mode="Markdown",
        reply_markup=keyboard,
    )
    return Q_EXPERIENCE


async def q_experience(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()
    mapping = {
        "exp_beginner": "Anfänger (0–1 Jahr)",
        "exp_intermediate": "Fortgeschrittener (1–3 Jahre)",
        "exp_advanced": "Erfahren (3–6 Jahre)",
        "exp_expert": "Sehr erfahren (6+ Jahre)",
    }
    context.user_data["experience"] = mapping.get(query.data, "Unbekannt")

    keyboard = InlineKeyboardMarkup([
        [
            InlineKeyboardButton("2 Tage", callback_data="days_2"),
            InlineKeyboardButton("3 Tage", callback_data="days_3"),
            InlineKeyboardButton("4 Tage", callback_data="days_4"),
        ],
        [
            InlineKeyboardButton("5 Tage", callback_data="days_5"),
            InlineKeyboardButton("6 Tage", callback_data="days_6"),
        ],
    ])
    await query.edit_message_text(
        f"✅ Erfahrung: *{context.user_data['experience']}*\n\n"
        "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"
        "📝 *Frage 7 von 20*\n\n"
        "Wie viele Tage pro Woche kannst du trainieren?\n"
        "_(Realistisch planen — besser weniger, dafür konsistent!)_",
        parse_mode="Markdown",
        reply_markup=keyboard,
    )
    return Q_DAYS


async def q_days(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()
    days = int(query.data.split("_")[1])
    context.user_data["training_days"] = days

    await query.edit_message_text(
        f"✅ Trainingstage: *{days} Tage/Woche*\n\n"
        "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"
        "📝 *Frage 8 von 20*\n\n"
        "Wie viel Zeit hast du pro Trainingseinheit?\n"
        "_(In Minuten, z.B. 60 oder 90 — ohne Umziehen/Dusche)_",
        parse_mode="Markdown",
    )
    return Q_DURATION


async def q_duration(update: Update, context: ContextTypes.DEFAULT_TYPE):
    text = update.message.text.strip()
    try:
        mins = int(re.sub(r"[^\d]", "", text))
        if not 20 <= mins <= 240:
            raise ValueError
        context.user_data["session_duration"] = mins
    except Exception:
        await update.message.reply_text("❌ Bitte gib eine gültige Dauer ein (20–240 Minuten):")
        return Q_DURATION

    keyboard = InlineKeyboardMarkup([
        [InlineKeyboardButton("⚡ Maximale Kraft (Powerlifting-Fokus)", callback_data="goal_strength")],
        [InlineKeyboardButton("🔥 Maximale Definition (Hypertrophie + Fett weg)", callback_data="goal_definition")],
        [InlineKeyboardButton("💎 Kraft & Definition (beides)", callback_data="goal_both")],
    ])
    await update.message.reply_text(
        "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"
        "📝 *Frage 9 von 20*\n\n"
        "Was ist dein primäres Ziel?\n\n"
        "*Kraft:* Schwerer werden, mehr heben, raw strength\n"
        "*Definition:* Muskeln aufbauen & Fett verbrennen, ästhetisch\n"
        "*Beides:* Balance zwischen Kraft und Optik",
        parse_mode="Markdown",
        reply_markup=keyboard,
    )
    return Q_GOAL


async def q_goal(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()
    mapping = {
        "goal_strength": "Maximale Kraft",
        "goal_definition": "Definition & Hypertrophie",
        "goal_both": "Kraft & Definition",
    }
    context.user_data["goal"] = mapping.get(query.data, "Unbekannt")

    keyboard = InlineKeyboardMarkup([
        [InlineKeyboardButton("🏋️ Vollständiges Gym (alle Geräte)", callback_data="equip_gym")],
        [InlineKeyboardButton("🏠 Zuhause (Kurzhanteln + Stange)", callback_data="equip_home_weights")],
        [InlineKeyboardButton("🪑 Zuhause (nur Körpergewicht)", callback_data="equip_bodyweight")],
        [InlineKeyboardButton("🎽 Minimalist (Kurzhanteln + Bands)", callback_data="equip_minimal")],
    ])
    await query.edit_message_text(
        f"✅ Ziel: *{context.user_data['goal']}*\n\n"
        "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"
        "📝 *Frage 10 von 20*\n\n"
        "Welches Equipment steht dir zur Verfügung?",
        parse_mode="Markdown",
        reply_markup=keyboard,
    )
    return Q_EQUIPMENT


async def q_equipment(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()
    mapping = {
        "equip_gym": "Vollständiges Gym",
        "equip_home_weights": "Zuhause (Hanteln + Stange)",
        "equip_bodyweight": "Nur Körpergewicht",
        "equip_minimal": "Minimalist Setup",
    }
    context.user_data["equipment"] = mapping.get(query.data, "Gym")

    await query.edit_message_text(
        f"✅ Equipment: *{context.user_data['equipment']}*\n\n"
        "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"
        "📝 *Frage 11 von 20* ⚠️ WICHTIG!\n\n"
        "Hast du Verletzungen, Schmerzen oder körperliche Einschränkungen?\n\n"
        "Sei *sehr konkret* — z.B.:\n"
        "• _'Knie-OP vor 2 Jahren, kein tiefes Kniebeugen'_\n"
        "• _'Schulter-Impingement links'_\n"
        "• _'Bandscheibenvorfall L4/L5'_\n"
        "• _'Keine Verletzungen'_\n\n"
        "Das ist entscheidend für deinen Plan — ich lasse problematische Übungen weg!",
        parse_mode="Markdown",
    )
    return Q_INJURIES


async def q_injuries(update: Update, context: ContextTypes.DEFAULT_TYPE):
    injuries = update.message.text.strip()
    context.user_data["injuries"] = injuries if injuries else "Keine"

    await update.message.reply_text(
        "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"
        "📝 *Frage 12 von 20*\n\n"
        "Wie viele Stunden schläfst du durchschnittlich pro Nacht?\n"
        "_(Schlaf ist der wichtigste Faktor für Regeneration & Muskelaufbau!)_\n\n"
        "_z.B. 7 oder 6.5_",
        parse_mode="Markdown",
    )
    return Q_SLEEP


async def q_sleep(update: Update, context: ContextTypes.DEFAULT_TYPE):
    text = update.message.text.strip()
    try:
        h = float(re.sub(r"[^\d.]", "", text))
        if not 2 <= h <= 14:
            raise ValueError
        context.user_data["sleep_hours"] = h
    except Exception:
        await update.message.reply_text("❌ Bitte gib eine gültige Stundenanzahl ein (z.B. 7 oder 6.5):")
        return Q_SLEEP

    keyboard = InlineKeyboardMarkup([
        [InlineKeyboardButton("🍔 Schlecht (Fast Food, wenig Protein)", callback_data="nut_1")],
        [InlineKeyboardButton("😐 Mittelmäßig (unregelmäßig, aber okay)", callback_data="nut_2")],
        [InlineKeyboardButton("👍 Gut (bewusst, ausreichend Protein)", callback_data="nut_3")],
        [InlineKeyboardButton("💪 Sehr gut (trackere Kalorien, Makros)", callback_data="nut_4")],
    ])
    await update.message.reply_text(
        "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"
        "📝 *Frage 13 von 20*\n\n"
        "Wie würdest du deine Ernährung beschreiben?\n"
        "_(Ernährung macht 60-70% des Erfolgs aus)_",
        parse_mode="Markdown",
        reply_markup=keyboard,
    )
    return Q_NUTRITION


async def q_nutrition(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()
    mapping = {
        "nut_1": "Schlecht",
        "nut_2": "Mittelmäßig",
        "nut_3": "Gut",
        "nut_4": "Sehr gut (tracke Makros)",
    }
    context.user_data["nutrition"] = mapping.get(query.data, "Mittelmäßig")

    keyboard = InlineKeyboardMarkup([
        [InlineKeyboardButton("😌 Gering (entspanntes Leben)", callback_data="stress_low")],
        [InlineKeyboardButton("😐 Mittel (normaler Alltag)", callback_data="stress_mid")],
        [InlineKeyboardButton("😰 Hoch (Job/Familie/viel Druck)", callback_data="stress_high")],
        [InlineKeyboardButton("🤯 Sehr hoch (chronisch gestresst)", callback_data="stress_very_high")],
    ])
    await query.edit_message_text(
        f"✅ Ernährung: *{context.user_data['nutrition']}*\n\n"
        "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"
        "📝 *Frage 14 von 20*\n\n"
        "Wie hoch ist dein allgemeiner Stresslevel?\n"
        "_(Stress = Kortisol = schlechte Regeneration — sehr relevant für Volumen!)_",
        parse_mode="Markdown",
        reply_markup=keyboard,
    )
    return Q_STRESS


async def q_stress(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()
    mapping = {
        "stress_low": "Gering",
        "stress_mid": "Mittel",
        "stress_high": "Hoch",
        "stress_very_high": "Sehr hoch",
    }
    context.user_data["stress"] = mapping.get(query.data, "Mittel")

    await query.edit_message_text(
        f"✅ Stresslevel: *{context.user_data['stress']}*\n\n"
        "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"
        "📝 *Frage 15 von 20*\n\n"
        "Wie würdest du deine aktuelle Körperzusammensetzung beschreiben?\n\n"
        "_Beispiele:_\n"
        "• _'Schlank, wenig Muskeln'_\n"
        "• _'Normal, etwas Bauchfett'_\n"
        "• _'Muskulös, aber mit Fettschicht'_\n"
        "• _'Übergewichtig, 90+ kg'_\n"
        "• _'Skinny Fat (dünn aber kein Muskel)'_\n\n"
        "_Ca. Körperfettanteil falls bekannt (z.B. 18%)_",
        parse_mode="Markdown",
    )
    return Q_BODY_FAT


async def q_body_fat(update: Update, context: ContextTypes.DEFAULT_TYPE):
    context.user_data["body_composition"] = update.message.text.strip()

    keyboard = InlineKeyboardMarkup([
        [InlineKeyboardButton("😮‍💨 Schlecht (außer Puste bei Treppen)", callback_data="cardio_poor")],
        [InlineKeyboardButton("🚶 Okay (30 min spazieren kein Problem)", callback_data="cardio_average")],
        [InlineKeyboardButton("🏃 Gut (30 min Joggen möglich)", callback_data="cardio_good")],
        [InlineKeyboardButton("🚴 Sehr gut (Ausdauersportler)", callback_data="cardio_excellent")],
    ])
    await update.message.reply_text(
        "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"
        "📝 *Frage 16 von 20*\n\n"
        "Wie ist deine kardiovaskuläre Fitness?\n"
        "_(Relevant für Pausenzeiten & ob Cardio in den Plan kommt)_",
        parse_mode="Markdown",
        reply_markup=keyboard,
    )
    return Q_CARDIO


async def q_cardio(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()
    mapping = {
        "cardio_poor": "Schlecht",
        "cardio_average": "Durchschnittlich",
        "cardio_good": "Gut",
        "cardio_excellent": "Sehr gut",
    }
    context.user_data["cardio"] = mapping.get(query.data, "Durchschnittlich")

    await query.edit_message_text(
        f"✅ Kardio: *{context.user_data['cardio']}*\n\n"
        "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"
        "📝 *Frage 17 von 20*\n\n"
        "Welche Muskelgruppen trainierst du am liebsten?\n\n"
        "_Schreib einfach auf was dir Spaß macht, z.B.:_\n"
        "• _'Brust und Arme'_\n"
        "• _'Rücken und Schultern'_\n"
        "• _'Beine, ich liebe Kniebeugen'_\n"
        "• _'Keine Präferenz'_",
        parse_mode="Markdown",
    )
    return Q_FAV_MUSCLES


async def q_fav_muscles(update: Update, context: ContextTypes.DEFAULT_TYPE):
    context.user_data["fav_muscles"] = update.message.text.strip()

    await update.message.reply_text(
        "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"
        "📝 *Frage 18 von 20*\n\n"
        "Welche Muskeln sind deine *Schwachpunkte* — also wo du im Vergleich am schwächsten oder kleinsten bist?\n\n"
        "_Beispiele:_\n"
        "• _'Schultern sind zu schmal'_\n"
        "• _'Waden wachsen nicht'_\n"
        "• _'Bizeps vs Trizeps sehr unausgewogen'_\n"
        "• _'Beine vernachlässigt'_\n"
        "• _'Weiß nicht / keine'_",
        parse_mode="Markdown",
    )
    return Q_WEAK_POINTS


async def q_weak_points(update: Update, context: ContextTypes.DEFAULT_TYPE):
    context.user_data["weak_points"] = update.message.text.strip()

    await update.message.reply_text(
        "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"
        "📝 *Frage 19 von 20*\n\n"
        "Welche Trainingsprogramme hast du bisher gemacht?\n\n"
        "_Beispiele:_\n"
        "• _'StrongLifts 5x5, GZCLP, PPL Reddit'_\n"
        "• _'Nur YouTube-Videos zusammengestellt'_\n"
        "• _'Bro-Split vom Gym-Freund'_\n"
        "• _'Noch nie wirklich strukturiert trainiert'_\n"
        "• _'Jim Wendler 5/3/1, Starting Strength'_",
        parse_mode="Markdown",
    )
    return Q_PAST_PROGRAMS


async def q_past_programs(update: Update, context: ContextTypes.DEFAULT_TYPE):
    context.user_data["past_programs"] = update.message.text.strip()

    keyboard = InlineKeyboardMarkup([
        [InlineKeyboardButton("🔄 Push/Pull/Legs (PPL) — 6 Tage", callback_data="split_ppl")],
        [InlineKeyboardButton("🔼🔽 Upper/Lower Split — 4 Tage", callback_data="split_ul")],
        [InlineKeyboardButton("💪 Fullbody — 3x die Woche", callback_data="split_fullbody")],
        [InlineKeyboardButton("🎯 Bro-Split (1 Muskel/Tag)", callback_data="split_bro")],
        [InlineKeyboardButton("🤖 Lass die KI entscheiden!", callback_data="split_ai")],
    ])
    await update.message.reply_text(
        "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"
        "📝 *Frage 20 von 20* — Letzte Frage!\n\n"
        "Hast du eine Präferenz für eine Trainingsaufteilung (Split)?\n\n"
        "*PPL:* Push/Pull/Legs — klassisch, effektiv\n"
        "*Upper/Lower:* 2x Oberkörper, 2x Beine\n"
        "*Fullbody:* Alle Muskeln 3x pro Woche\n"
        "*Bro-Split:* Ein Muskel pro Tag, max. Fokus\n"
        "*KI-Entscheidung:* Ich wähle optimal für dich!",
        parse_mode="Markdown",
        reply_markup=keyboard,
    )
    return Q_SPLIT_PREF


async def q_split_pref(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()
    mapping = {
        "split_ppl": "Push/Pull/Legs",
        "split_ul": "Upper/Lower",
        "split_fullbody": "Fullbody",
        "split_bro": "Bro-Split",
        "split_ai": "KI wählt optimal",
    }
    context.user_data["split_pref"] = mapping.get(query.data, "KI wählt optimal")

    # Build summary
    d = context.user_data
    summary = (
        f"🎉 *Alle Fragen beantwortet, {d.get('name')}!*\n\n"
        "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"
        "📊 *Dein Profil:*\n\n"
        f"👤 Name: *{d.get('name')}* | Alter: *{d.get('age')}* | {d.get('gender')}\n"
        f"📏 Größe: *{d.get('height')} cm* | Gewicht: *{d.get('weight')} kg*\n"
        f"🏋️ Erfahrung: *{d.get('experience')}*\n"
        f"📅 Tage/Woche: *{d.get('training_days')}* | Dauer: *{d.get('session_duration')} Min*\n"
        f"🎯 Ziel: *{d.get('goal')}*\n"
        f"🔧 Equipment: *{d.get('equipment')}*\n"
        f"🩺 Verletzungen: *{d.get('injuries')}*\n"
        f"😴 Schlaf: *{d.get('sleep_hours')} h* | Stress: *{d.get('stress')}*\n"
        f"🥗 Ernährung: *{d.get('nutrition')}* | Kardio: *{d.get('cardio')}*\n"
        f"💪 Körper: *{d.get('body_composition')}*\n"
        f"❤️ Lieblings-Muskeln: *{d.get('fav_muscles')}*\n"
        f"⚠️ Schwachpunkte: *{d.get('weak_points')}*\n"
        f"📈 Bisherige Programme: *{d.get('past_programs')}*\n"
        f"🔀 Split-Präferenz: *{d.get('split_pref')}*\n"
        "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n"
        "Soll ich jetzt deinen *individuellen Trainingsplan* erstellen? 🚀"
    )

    keyboard = InlineKeyboardMarkup([
        [InlineKeyboardButton("🚀 Ja! Plan erstellen!", callback_data="generate_plan")],
        [InlineKeyboardButton("🔄 Von vorne anfangen", callback_data="restart")],
    ])
    await query.edit_message_text(summary, parse_mode="Markdown", reply_markup=keyboard)
    return Q_CONFIRM


# ════════════════════════════════════════════════════════════════════════════
#   PLAN GENERATION
# ════════════════════════════════════════════════════════════════════════════

async def generate_plan(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()

    if query.data == "restart":
        uid = update.effective_user.id
        user_profiles.pop(uid, None)
        context.user_data.clear()
        await query.edit_message_text(
            "🔄 Gut, fangen wir von vorne an!\n\nTippe /start um neu zu beginnen."
        )
        return ConversationHandler.END

    uid = update.effective_user.id
    d = context.user_data.copy()
    user_profiles[uid] = d

    await query.edit_message_text(
        "⚙️ *Erstelle deinen persönlichen Trainingsplan...*\n\n"
        "Ich analysiere jetzt alle deine Daten und erstelle einen maßgeschneiderten Plan.\n\n"
        "Das dauert etwa 15-30 Sekunden — lass mich arbeiten! 💪",
        parse_mode="Markdown",
    )

    system_prompt = """Du bist ein Elite-Personaltrainer und Kraftcoach mit 20 Jahren Erfahrung.
Du erstellst hochindividualisierte, präzise Trainingspläne basierend auf wissenschaftlichen Prinzipien
(aber erklärt in Alltagssprache). Keine generischen Pläne — alles 100% auf den User zugeschnitten.

WICHTIG: Erstelle den Plan als valides JSON in folgendem Format:
{
  "plan_name": "Name des Plans",
  "trainee_name": "Name",
  "goal": "Ziel",
  "split_type": "Art des Splits",
  "duration_weeks": 12,
  "coaching_notes": "Persönliche Anmerkungen vom Coach",
  "injury_considerations": "Verletzungshinweise",
  "progression_scheme": "Wie der User sich steigern soll",
  "nutrition_tips": "Ernährungstipps passend zum Ziel",
  "recovery_tips": "Regenerationstipps",
  "weekly_schedule": {
    "Montag": {
      "focus": "Fokus des Tages",
      "warmup": "Aufwärmroutine",
      "exercises": [
        {
          "name": "Übungsname",
          "sets": 4,
          "reps": "8-10",
          "rest_seconds": 90,
          "rpe_or_weight": "75% 1RM oder 8/10 RPE",
          "execution_tip": "Kurzer Technik-Tipp",
          "muscle_groups": ["Brust", "Trizeps"]
        }
      ],
      "cooldown": "Cooldown-Empfehlung",
      "session_duration_min": 60
    },
    "Ruhetag": {
      "focus": "Aktive Erholung",
      "exercises": []
    }
  }
}

Regeln:
1. Berücksichtige ALLE Verletzungen — keine Übungen die Verletzungen verschlimmern könnten
2. Passe Volumen an Erfahrung, Stress und Schlaf an
3. Anfänger: weniger Volumen, mehr Technik-Fokus
4. Erfahrene: höheres Volumen, Intensitätstechniken möglich
5. Bei Definition: Supersätze und weniger Pause einbauen
6. Bei Kraft: schwere Compound-Übungen, lange Pausen
7. Schwachpunkte extra betonen
8. Lieblings-Übungen/Muskeln prominent einbauen
9. Equipment strikt einhalten
10. Alle 7 Wochentage abdecken (Trainings- und Ruhetage)
11. Antworte NUR mit dem JSON-Objekt, KEIN Text davor oder danach"""

    user_prompt = f"""Erstelle einen Trainingsplan für:
- Name: {d.get('name')}
- Alter: {d.get('age')} Jahre, {d.get('gender')}
- Größe: {d.get('height')} cm, Gewicht: {d.get('weight')} kg
- Trainingserfahrung: {d.get('experience')}
- Verfügbare Tage: {d.get('training_days')} Tage/Woche
- Sessiondauer: {d.get('session_duration')} Minuten
- Primäres Ziel: {d.get('goal')}
- Equipment: {d.get('equipment')}
- Verletzungen/Einschränkungen: {d.get('injuries')}
- Schlaf: {d.get('sleep_hours')} Stunden/Nacht
- Ernährungsqualität: {d.get('nutrition')}
- Stresslevel: {d.get('stress')}
- Körperzusammensetzung: {d.get('body_composition')}
- Kardiovaskuläre Fitness: {d.get('cardio')}
- Lieblings-Muskelgruppen: {d.get('fav_muscles')}
- Schwachpunkte: {d.get('weak_points')}
- Bisherige Programme: {d.get('past_programs')}
- Split-Präferenz: {d.get('split_pref')}

Erstelle einen detaillierten, individualisierten 12-Wochen-Plan."""

    try:
        response = client.messages.create(
            model="claude-opus-4-5",
            max_tokens=4000,
            system=system_prompt,
            messages=[{"role": "user", "content": user_prompt}],
        )
        raw = response.content[0].text.strip()

        # Parse JSON
        json_match = re.search(r"\{[\s\S]*\}", raw)
        if json_match:
            plan = json.loads(json_match.group())
        else:
            plan = json.loads(raw)

        user_plans[uid] = plan
        user_plans_raw[uid] = raw

        await send_plan(query.message, uid, plan)

    except Exception as e:
        logger.error(f"Plan generation error: {e}")
        await query.message.reply_text(
            f"❌ Fehler beim Erstellen des Plans: {e}\n\nBitte versuche /start nochmal."
        )

    return ConversationHandler.END


def format_plan_text(plan: dict) -> str:
    """Format the plan as readable Telegram message."""
    lines = []
    name = plan.get("trainee_name", "")
    lines.append(f"🏆 *TRAININGSPLAN FÜR {name.upper()}*")
    lines.append(f"🎯 Ziel: *{plan.get('goal', '')}*")
    lines.append(f"🔀 Split: *{plan.get('split_type', '')}*")
    lines.append(f"📅 Laufzeit: *{plan.get('duration_weeks', 12)} Wochen*")
    lines.append("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")

    if plan.get("injury_considerations"):
        lines.append(f"⚠️ *Verletzungshinweise:*\n_{plan['injury_considerations']}_")
        lines.append("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")

    schedule = plan.get("weekly_schedule", {})
    day_order = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"]

    for day in day_order:
        if day not in schedule:
            continue
        info = schedule[day]
        exercises = info.get("exercises", [])
        focus = info.get("focus", "")

        if not exercises:
            lines.append(f"\n🛌 *{day.upper()}* — {focus}")
            if info.get("cooldown"):
                lines.append(f"   _{info['cooldown']}_")
            continue

        lines.append(f"\n💪 *{day.upper()}* — {focus}")
        lines.append(f"⏱ Dauer: ca. {info.get('session_duration_min', '?')} Min")
        if info.get("warmup"):
            lines.append(f"🔥 Warm-Up: _{info['warmup']}_")
        lines.append("")

        for i, ex in enumerate(exercises, 1):
            lines.append(
                f"*{i}. {ex.get('name', '?')}*\n"
                f"   📊 {ex.get('sets', '?')} Sätze × {ex.get('reps', '?')} Wdh\n"
                f"   ⏸ Pause: {ex.get('rest_seconds', '?')}s\n"
                f"   🎚 Intensität: {ex.get('rpe_or_weight', '?')}\n"
                f"   💡 _{ex.get('execution_tip', '')}_"
            )

        if info.get("cooldown"):
            lines.append(f"\n🧘 Cool-Down: _{info['cooldown']}_")

    lines.append("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    if plan.get("progression_scheme"):
        lines.append(f"📈 *Progression:*\n_{plan['progression_scheme']}_")
    if plan.get("nutrition_tips"):
        lines.append(f"\n🥗 *Ernährungstipps:*\n_{plan['nutrition_tips']}_")
    if plan.get("recovery_tips"):
        lines.append(f"\n😴 *Recovery:*\n_{plan['recovery_tips']}_")
    if plan.get("coaching_notes"):
        lines.append(f"\n🎓 *Coach-Notizen:*\n_{plan['coaching_notes']}_")

    return "\n".join(lines)


async def send_plan(message, uid: int, plan: dict):
    """Send the formatted plan with action buttons."""
    text = format_plan_text(plan)

    # Split into chunks if too long
    MAX_LEN = 4000
    chunks = []
    while len(text) > MAX_LEN:
        split_at = text.rfind("\n", 0, MAX_LEN)
        if split_at == -1:
            split_at = MAX_LEN
        chunks.append(text[:split_at])
        text = text[split_at:]
    chunks.append(text)

    for i, chunk in enumerate(chunks):
        await message.reply_text(chunk, parse_mode="Markdown")

    # Action buttons
    keyboard = InlineKeyboardMarkup([
        [
            InlineKeyboardButton("💾 Plan speichern", callback_data="save_plan"),
            InlineKeyboardButton("📸 Als Bild exportieren", callback_data="screenshot_plan"),
        ],
        [
            InlineKeyboardButton("🔄 Übung tauschen", callback_data="swap_exercise"),
            InlineKeyboardButton("🔁 Neuen Plan erstellen", callback_data="new_plan"),
        ],
        [InlineKeyboardButton("📋 Plan anzeigen", callback_data="show_plan")],
    ])
    await message.reply_text(
        "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"
        "✅ *Dein Plan ist fertig!* Was möchtest du tun?",
        parse_mode="Markdown",
        reply_markup=keyboard,
    )


# ════════════════════════════════════════════════════════════════════════════
#   CALLBACK HANDLERS (outside conversation)
# ════════════════════════════════════════════════════════════════════════════

async def button_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()
    uid = update.effective_user.id
    data = query.data

    if data == "save_plan":
        if uid not in user_plans:
            await query.message.reply_text("❌ Kein Plan vorhanden. Bitte erstelle zuerst einen Plan mit /start.")
            return
        plan = user_plans[uid]
        name = plan.get("trainee_name", "Unbekannt")
        await query.message.reply_text(
            f"💾 *Plan gespeichert!*\n\n"
            f"Der Plan von *{name}* ist gespeichert.\n"
            f"Du kannst ihn jederzeit mit /meinplan abrufen.\n\n"
            f"Plan: *{plan.get('plan_name', 'Trainingsplan')}*\n"
            f"Gespeichert am: *{datetime.now().strftime('%d.%m.%Y %H:%M')}*",
            parse_mode="Markdown",
        )

    elif data == "show_plan":
        if uid not in user_plans:
            await query.message.reply_text("❌ Kein Plan gefunden. Nutze /start um einen zu erstellen.")
            return
        await send_plan(query.message, uid, user_plans[uid])

    elif data == "screenshot_plan":
        if uid not in user_plans:
            await query.message.reply_text("❌ Kein Plan vorhanden.")
            return
        await query.message.reply_text("📸 Erstelle Plan-Bild...")
        await send_plan_image(query.message, uid)

    elif data == "swap_exercise":
        if uid not in user_plans:
            await query.message.reply_text("❌ Kein Plan vorhanden.")
            return
        await show_swap_day_selection(query.message, uid)

    elif data == "new_plan":
        await query.message.reply_text(
            "🔁 Tippe /start um einen neuen Plan zu erstellen!\n"
            "Dein alter Plan bleibt mit /meinplan abrufbar.",
        )

    elif data.startswith("swap_day_"):
        day = data.replace("swap_day_", "").replace("_", " ")
        await show_swap_exercise_selection(query.message, uid, day)

    elif data.startswith("swap_ex_"):
        parts = data.split("|")
        day  = parts[1].replace("_", " ") if len(parts) > 1 else ""
        idx  = int(parts[2]) if len(parts) > 2 else 0
        await generate_swap_alternatives(query.message, uid, day, idx)

    elif data.startswith("pick_swap_"):
        parts = data.split("|")
        day     = parts[1].replace("_", " ") if len(parts) > 1 else ""
        idx     = int(parts[2]) if len(parts) > 2 else 0
        new_ex  = parts[3] if len(parts) > 3 else ""
        await apply_exercise_swap(query.message, uid, day, idx, new_ex)


# ════════════════════════════════════════════════════════════════════════════
#   EXERCISE SWAP
# ════════════════════════════════════════════════════════════════════════════

async def show_swap_day_selection(message, uid: int):
    plan = user_plans.get(uid, {})
    schedule = plan.get("weekly_schedule", {})

    day_order = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"]
    buttons = []
    for day in day_order:
        if day in schedule and schedule[day].get("exercises"):
            cb = f"swap_day_{day.replace(' ', '_')}"
            buttons.append([InlineKeyboardButton(f"💪 {day}", callback_data=cb)])

    if not buttons:
        await message.reply_text("Keine Übungen zum Tauschen gefunden.")
        return

    await message.reply_text(
        "🔄 *Übung tauschen*\n\nAn welchem Tag willst du eine Übung tauschen?",
        parse_mode="Markdown",
        reply_markup=InlineKeyboardMarkup(buttons),
    )


async def show_swap_exercise_selection(message, uid: int, day: str):
    plan = user_plans.get(uid, {})
    exercises = plan.get("weekly_schedule", {}).get(day, {}).get("exercises", [])

    if not exercises:
        await message.reply_text(f"Keine Übungen für {day} gefunden.")
        return

    buttons = []
    for i, ex in enumerate(exercises):
        cb = f"swap_ex_|{day.replace(' ', '_')}|{i}"
        buttons.append([InlineKeyboardButton(f"🔄 {ex.get('name', '?')}", callback_data=cb)])

    buttons.append([InlineKeyboardButton("↩️ Zurück", callback_data="swap_exercise")])

    await message.reply_text(
        f"💪 *{day}* — Welche Übung tauschen?",
        parse_mode="Markdown",
        reply_markup=InlineKeyboardMarkup(buttons),
    )


async def generate_swap_alternatives(message, uid: int, day: str, ex_idx: int):
    plan = user_plans.get(uid, {})
    exercises = plan.get("weekly_schedule", {}).get(day, {}).get("exercises", [])

    if ex_idx >= len(exercises):
        await message.reply_text("Übung nicht gefunden.")
        return

    original = exercises[ex_idx]
    profile = user_profiles.get(uid, {})

    await message.reply_text(
        f"🔄 Suche Alternativen für *{original.get('name')}*...",
        parse_mode="Markdown",
    )

    prompt = f"""Der User möchte die Übung "{original.get('name')}" ersetzen.
Ziel: {plan.get('goal')}
Equipment: {profile.get('equipment', 'Gym')}
Verletzungen: {profile.get('injuries', 'Keine')}
Muskelgruppen: {original.get('muscle_groups', [])}
Erfahrung: {profile.get('experience', 'Unbekannt')}

Schlage GENAU 4 alternative Übungen vor.
Format: JSON array mit Objekten:
[
  {{"name": "Übungsname", "reason": "Warum gute Alternative", "sets": 4, "reps": "8-10", "rest_seconds": 90, "tip": "Technik-Tipp"}}
]
NUR das JSON Array, kein anderer Text."""

    try:
        resp = client.messages.create(
            model="claude-haiku-4-5",
            max_tokens=800,
            messages=[{"role": "user", "content": prompt}],
        )
        raw = resp.content[0].text.strip()
        arr_match = re.search(r"\[[\s\S]*\]", raw)
        alternatives = json.loads(arr_match.group() if arr_match else raw)

        swap_ctx[uid] = {"day": day, "ex_idx": ex_idx, "original": original.get("name")}

        text = (
            f"🔄 *Alternativen für: {original.get('name')}*\n"
            f"_(Tag: {day})_\n\n"
            "Wähle eine Alternative:\n\n"
        )
        buttons = []
        for i, alt in enumerate(alternatives[:4]):
            text += f"*{i+1}. {alt.get('name')}*\n"
            text += f"   ✅ _{alt.get('reason', '')}_\n"
            text += f"   📊 {alt.get('sets')}×{alt.get('reps')} | ⏸{alt.get('rest_seconds')}s\n"
            text += f"   💡 _{alt.get('tip', '')}_\n\n"

            alt_name_safe = alt.get("name", "").replace("|", "-").replace(" ", "+")
            cb = f"pick_swap_|{day.replace(' ', '_')}|{ex_idx}|{alt_name_safe}"
            buttons.append([InlineKeyboardButton(f"✅ {alt.get('name')}", callback_data=cb)])

        buttons.append([InlineKeyboardButton("❌ Abbrechen", callback_data="show_plan")])

        await message.reply_text(text, parse_mode="Markdown", reply_markup=InlineKeyboardMarkup(buttons))

    except Exception as e:
        logger.error(f"Swap alternatives error: {e}")
        await message.reply_text(f"❌ Fehler: {e}")


async def apply_exercise_swap(message, uid: int, day: str, ex_idx: int, new_name_encoded: str):
    plan = user_plans.get(uid, {})
    exercises = plan.get("weekly_schedule", {}).get(day, {}).get("exercises", [])

    new_name = new_name_encoded.replace("+", " ")

    if ex_idx >= len(exercises):
        await message.reply_text("Übung nicht gefunden.")
        return

    old_name = exercises[ex_idx].get("name", "?")

    # Update the plan
    exercises[ex_idx]["name"] = new_name
    user_plans[uid] = plan

    await message.reply_text(
        f"✅ *Übung getauscht!*\n\n"
        f"❌ Alt: ~~{old_name}~~\n"
        f"✅ Neu: *{new_name}*\n\n"
        f"Tag: *{day}*\n\n"
        "Der Plan wurde aktualisiert!",
        parse_mode="Markdown",
        reply_markup=InlineKeyboardMarkup([
            [
                InlineKeyboardButton("📋 Plan anzeigen", callback_data="show_plan"),
                InlineKeyboardButton("🔄 Weitere Übung tauschen", callback_data="swap_exercise"),
            ],
            [InlineKeyboardButton("📸 Als Bild exportieren", callback_data="screenshot_plan")],
        ]),
    )


# ════════════════════════════════════════════════════════════════════════════
#   IMAGE / SCREENSHOT GENERATION
# ════════════════════════════════════════════════════════════════════════════

def create_plan_image(plan: dict) -> bytes:
    """Create a professional-looking training plan image."""
    if not PIL_AVAILABLE:
        return None

    # Colors
    BG        = (15, 15, 20)
    PANEL     = (25, 27, 35)
    ACCENT    = (255, 165, 0)
    ACCENT2   = (0, 200, 150)
    WHITE     = (255, 255, 255)
    GRAY      = (160, 160, 175)
    LIGHT_BG  = (35, 38, 50)
    RED_LIGHT = (255, 80, 80)

    schedule = plan.get("weekly_schedule", {})
    day_order = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"]

    WIDTH    = 1200
    PADDING  = 40
    COL_W    = (WIDTH - PADDING * 3) // 2

    # Calculate height
    HEADER_H  = 200
    CARD_BASE = 180
    EX_H      = 120
    SECTION_H = 300

    total_exercises = sum(
        len(schedule.get(d, {}).get("exercises", [])) for d in day_order
    )
    active_days = sum(
        1 for d in day_order if schedule.get(d, {}).get("exercises")
    )

    HEIGHT = HEADER_H + active_days * CARD_BASE + total_exercises * EX_H + SECTION_H + 200

    img  = Image.new("RGB", (WIDTH, HEIGHT), BG)
    draw = ImageDraw.Draw(img)

    # Try to load fonts
    try:
        font_title  = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 36)
        font_h1     = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 28)
        font_h2     = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 22)
        font_body   = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 18)
        font_small  = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 15)
        font_bold   = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 18)
    except Exception:
        font_title = font_h1 = font_h2 = font_body = font_small = font_bold = ImageFont.load_default()

    y = PADDING

    # ── HEADER ──────────────────────────────────────────────────────
    # Gradient bar
    for i in range(8):
        alpha = int(255 * (i / 8))
        draw.rectangle([0, y + i * 2, WIDTH, y + i * 2 + 2], fill=(255, 140, 0))

    y += 20
    draw.rectangle([PADDING, y, WIDTH - PADDING, y + 140], fill=PANEL)
    draw.rectangle([PADDING, y, PADDING + 6, y + 140], fill=ACCENT)

    # Title
    title = f"🏋️  TRAININGSPLAN — {plan.get('trainee_name', '').upper()}"
    draw.text((PADDING + 24, y + 20), title, fill=ACCENT, font=font_title)
    draw.text((PADDING + 24, y + 65), f"Ziel: {plan.get('goal', '')}", fill=WHITE, font=font_h2)
    draw.text((PADDING + 24, y + 98),
              f"Split: {plan.get('split_type', '')}  |  Laufzeit: {plan.get('duration_weeks', 12)} Wochen  |  Erstellt: {datetime.now().strftime('%d.%m.%Y')}",
              fill=GRAY, font=font_body)

    y += 160

    # ── INJURY NOTE ────────────────────────────────────────────────
    injury = plan.get("injury_considerations", "")
    if injury:
        draw.rectangle([PADDING, y, WIDTH - PADDING, y + 60], fill=(60, 20, 20))
        draw.rectangle([PADDING, y, PADDING + 5, y + 60], fill=RED_LIGHT)
        draw.text((PADDING + 16, y + 8),  "⚠  VERLETZUNGSHINWEISE", fill=RED_LIGHT, font=font_bold)
        # Wrap injury text
        wrapped = textwrap.fill(injury, width=100)[:100]
        draw.text((PADDING + 16, y + 32), wrapped, fill=WHITE, font=font_small)
        y += 75

    # ── TRAINING DAYS ─────────────────────────────────────────────
    for day in day_order:
        if day not in schedule:
            continue
        info = schedule[day]
        exercises = info.get("exercises", [])

        # Rest day
        if not exercises:
            draw.rectangle([PADDING, y, WIDTH - PADDING, y + 55], fill=LIGHT_BG)
            draw.text((PADDING + 20, y + 18), f"😴  {day.upper()}  —  {info.get('focus', 'Ruhetag')}", fill=GRAY, font=font_body)
            y += 65
            continue

        # Training day card
        card_h = CARD_BASE + len(exercises) * EX_H
        draw.rectangle([PADDING, y, WIDTH - PADDING, y + card_h], fill=PANEL)
        draw.rectangle([PADDING, y, PADDING + 5, y + card_h], fill=ACCENT2)

        # Day header
        draw.text((PADDING + 20, y + 15),
                  f"💪  {day.upper()}", fill=ACCENT2, font=font_h1)
        focus_text = f"{info.get('focus', '')}  •  ⏱ {info.get('session_duration_min', '?')} Min"
        draw.text((PADDING + 20, y + 52), focus_text, fill=WHITE, font=font_body)

        warmup = info.get("warmup", "")
        if warmup:
            wrapped_wu = textwrap.fill(f"🔥 Warm-Up: {warmup}", width=110)
            draw.text((PADDING + 20, y + 78), wrapped_wu[:100], fill=GRAY, font=font_small)

        # Separator
        draw.line([PADDING + 15, y + 105, WIDTH - PADDING - 15, y + 105], fill=ACCENT, width=1)
        ey = y + 115

        for ex in exercises:
            # Exercise row
            draw.rectangle([PADDING + 15, ey, WIDTH - PADDING - 15, ey + EX_H - 8], fill=LIGHT_BG)
            ex_name = ex.get("name", "?")
            draw.text((PADDING + 30, ey + 10), ex_name, fill=WHITE, font=font_bold)

            # Stats row
            stats = (
                f"📊 {ex.get('sets', '?')} Sätze  ×  {ex.get('reps', '?')} Wdh    "
                f"⏸ Pause: {ex.get('rest_seconds', '?')}s    "
                f"🎚 {ex.get('rpe_or_weight', '')}"
            )
            draw.text((PADDING + 30, ey + 38), stats, fill=ACCENT, font=font_small)

            # Tip
            tip = ex.get("execution_tip", "")
            if tip:
                tip_wrapped = textwrap.fill(f"💡 {tip}", width=115)[:130]
                draw.text((PADDING + 30, ey + 62), tip_wrapped, fill=GRAY, font=font_small)

            # Muscles
            muscles = "  ".join(ex.get("muscle_groups", []))
            if muscles:
                draw.text((PADDING + 30, ey + 90), f"🎯 {muscles}", fill=ACCENT2, font=font_small)

            ey += EX_H

        y += card_h + 16

    # ── BOTTOM SECTIONS ────────────────────────────────────────────
    sections = [
        ("📈  PROGRESSION", plan.get("progression_scheme", "")),
        ("🥗  ERNÄHRUNGSTIPPS", plan.get("nutrition_tips", "")),
        ("😴  RECOVERY", plan.get("recovery_tips", "")),
        ("🎓  COACH-NOTIZEN", plan.get("coaching_notes", "")),
    ]

    for sec_title, sec_text in sections:
        if not sec_text:
            continue
        wrapped = textwrap.fill(sec_text, width=120)
        lines   = wrapped.split("\n")
        sec_h   = 50 + len(lines) * 24
        draw.rectangle([PADDING, y, WIDTH - PADDING, y + sec_h], fill=PANEL)
        draw.rectangle([PADDING, y, PADDING + 5, y + sec_h], fill=ACCENT)
        draw.text((PADDING + 20, y + 14), sec_title, fill=ACCENT, font=font_h2)
        for j, line in enumerate(lines):
            draw.text((PADDING + 20, y + 46 + j * 24), line, fill=WHITE, font=font_body)
        y += sec_h + 16

    # Footer
    footer = "FitBot Pro v2.0  —  Erstellt mit KI-Analyse  |  Kein generischer Plan — 100% individuell"
    draw.text((PADDING, y + 10), footer, fill=GRAY, font=font_small)

    buf = io.BytesIO()
    img.save(buf, format="PNG", optimize=True)
    buf.seek(0)
    return buf.read()


async def send_plan_image(message, uid: int):
    plan = user_plans.get(uid)
    if not plan:
        await message.reply_text("❌ Kein Plan gefunden.")
        return

    if not PIL_AVAILABLE:
        await message.reply_text(
            "⚠️ Bild-Export nicht verfügbar (Pillow nicht installiert).\n"
            "Der Plan wird als Text angezeigt:"
        )
        await send_plan(message, uid, plan)
        return

    try:
        image_bytes = create_plan_image(plan)
        if image_bytes:
            bio = io.BytesIO(image_bytes)
            bio.name = f"trainingsplan_{plan.get('trainee_name', 'plan')}.png"
            await message.reply_photo(
                photo=bio,
                caption=(
                    f"📸 *Trainingsplan — {plan.get('trainee_name', '')}*\n"
                    f"🎯 {plan.get('goal', '')}  |  {plan.get('split_type', '')}\n\n"
                    "Gespeichert! Du kannst das Bild jetzt downloaden. 💪"
                ),
                parse_mode="Markdown",
            )
        else:
            await message.reply_text("❌ Bild-Erstellung fehlgeschlagen.")
    except Exception as e:
        logger.error(f"Image error: {e}")
        await message.reply_text(f"❌ Fehler beim Erstellen des Bildes: {e}")


# ════════════════════════════════════════════════════════════════════════════
#   UTILITY COMMANDS
# ════════════════════════════════════════════════════════════════════════════

async def cmd_myplan(update: Update, context: ContextTypes.DEFAULT_TYPE):
    uid = update.effective_user.id
    if uid not in user_plans:
        await update.message.reply_text(
            "❌ Du hast noch keinen gespeicherten Plan.\n"
            "Erstelle einen mit /start!"
        )
        return

    plan = user_plans[uid]
    keyboard = InlineKeyboardMarkup([
        [
            InlineKeyboardButton("📋 Plan anzeigen", callback_data="show_plan"),
            InlineKeyboardButton("📸 Als Bild", callback_data="screenshot_plan"),
        ],
        [
            InlineKeyboardButton("🔄 Übung tauschen", callback_data="swap_exercise"),
            InlineKeyboardButton("🔁 Neuer Plan", callback_data="new_plan"),
        ],
    ])
    await update.message.reply_text(
        f"💾 *Dein gespeicherter Plan:*\n\n"
        f"📋 *{plan.get('plan_name', 'Trainingsplan')}*\n"
        f"🎯 Ziel: *{plan.get('goal', '')}*\n"
        f"🔀 Split: *{plan.get('split_type', '')}*\n"
        f"📅 Laufzeit: *{plan.get('duration_weeks', 12)} Wochen*\n\n"
        "Was möchtest du tun?",
        parse_mode="Markdown",
        reply_markup=keyboard,
    )


async def cmd_help(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text(
        "🏋️ *FitBot Pro v2.0 — Hilfe*\n\n"
        "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"
        "*Befehle:*\n\n"
        "🚀 /start — Neuen Plan erstellen (20 Fragen)\n"
        "📋 /meinplan — Gespeicherten Plan anzeigen\n"
        "❓ /hilfe — Diese Hilfe anzeigen\n"
        "🚫 /abbruch — Aktuellen Vorgang abbrechen\n\n"
        "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"
        "*Features:*\n\n"
        "💾 Plan speichern & jederzeit abrufen\n"
        "🔄 Einzelne Übungen tauschen mit Alternativen\n"
        "📸 Plan als Bild exportieren (Screenshot)\n"
        "🎯 100% individuell — basierend auf deinen Daten\n"
        "⚠️ Verletzungen werden berücksichtigt\n\n"
        "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"
        "*Über FitBot Pro:*\n\n"
        "Dieser Bot nutzt Claude AI (Anthropic) um basierend auf "
        "deinen persönlichen Daten einen hochindividualisierten "
        "Trainingsplan zu erstellen. Keine generischen Pläne — "
        "alles ist auf dich zugeschnitten.\n\n"
        "⚠️ _Disclaimer: Bei Verletzungen immer einen Arzt konsultieren._",
        parse_mode="Markdown",
    )


async def cmd_cancel(update: Update, context: ContextTypes.DEFAULT_TYPE):
    context.user_data.clear()
    await update.message.reply_text(
        "🚫 Abgebrochen. Tippe /start um neu zu beginnen."
    )
    return ConversationHandler.END


# ════════════════════════════════════════════════════════════════════════════
#   MAIN
# ════════════════════════════════════════════════════════════════════════════

def main():
    app = ApplicationBuilder().token(TELEGRAM_TOKEN).build()

    # Conversation handler for questionnaire + plan generation
    conv_handler = ConversationHandler(
        entry_points=[CommandHandler("start", start)],
        states={
            Q_NAME:        [MessageHandler(filters.TEXT & ~filters.COMMAND, q_name)],
            Q_AGE:         [MessageHandler(filters.TEXT & ~filters.COMMAND, q_age)],
            Q_GENDER:      [CallbackQueryHandler(q_gender, pattern="^gender_")],
            Q_HEIGHT:      [MessageHandler(filters.TEXT & ~filters.COMMAND, q_height)],
            Q_WEIGHT:      [MessageHandler(filters.TEXT & ~filters.COMMAND, q_weight)],
            Q_EXPERIENCE:  [CallbackQueryHandler(q_experience, pattern="^exp_")],
            Q_DAYS:        [CallbackQueryHandler(q_days, pattern="^days_")],
            Q_DURATION:    [MessageHandler(filters.TEXT & ~filters.COMMAND, q_duration)],
            Q_GOAL:        [CallbackQueryHandler(q_goal, pattern="^goal_")],
            Q_EQUIPMENT:   [CallbackQueryHandler(q_equipment, pattern="^equip_")],
            Q_INJURIES:    [MessageHandler(filters.TEXT & ~filters.COMMAND, q_injuries)],
            Q_SLEEP:       [MessageHandler(filters.TEXT & ~filters.COMMAND, q_sleep)],
            Q_NUTRITION:   [CallbackQueryHandler(q_nutrition, pattern="^nut_")],
            Q_STRESS:      [CallbackQueryHandler(q_stress, pattern="^stress_")],
            Q_BODY_FAT:    [MessageHandler(filters.TEXT & ~filters.COMMAND, q_body_fat)],
            Q_CARDIO:      [CallbackQueryHandler(q_cardio, pattern="^cardio_")],
            Q_FAV_MUSCLES: [MessageHandler(filters.TEXT & ~filters.COMMAND, q_fav_muscles)],
            Q_WEAK_POINTS: [MessageHandler(filters.TEXT & ~filters.COMMAND, q_weak_points)],
            Q_PAST_PROGRAMS:[MessageHandler(filters.TEXT & ~filters.COMMAND, q_past_programs)],
            Q_SPLIT_PREF:  [CallbackQueryHandler(q_split_pref, pattern="^split_")],
            Q_CONFIRM:     [CallbackQueryHandler(generate_plan, pattern="^(generate_plan|restart)$")],
        },
        fallbacks=[CommandHandler("abbruch", cmd_cancel), CommandHandler("cancel", cmd_cancel)],
        allow_reentry=True,
    )

    app.add_handler(conv_handler)
    app.add_handler(CommandHandler("meinplan", cmd_myplan))
    app.add_handler(CommandHandler("hilfe",    cmd_help))
    app.add_handler(CommandHandler("help",     cmd_help))
    app.add_handler(CallbackQueryHandler(button_handler))

    logger.info("FitBot Pro v2.0 gestartet...")
    app.run_polling()


if __name__ == "__main__":
    main()
