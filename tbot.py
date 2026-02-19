import os
import logging
import anthropic
from telegram import Update
from telegram.ext import ApplicationBuilder, MessageHandler, filters, ContextTypes

logging.basicConfig(level=logging.INFO)

ANTHROPIC_API_KEY = os.environ.get("ANTHROPIC_API_KEY")
TELEGRAM_TOKEN = os.environ.get("TELEGRAM_TOKEN")

client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)

async def handle_message(update: Update, context: ContextTypes.DEFAULT_TYPE):
    try:
        user_message = update.message.text
        logging.info(f"Received: {user_message}")
        response = client.messages.create(
            model="claude-haiku-4-5-20251001",
            max_tokens=1000,
            messages=[{"role": "user", "content": user_message}]
        )
        await update.message.reply_text(response.content[0].text)
    except Exception as e:
        logging.error(f"Error: {e}")
        await update.message.reply_text(f"Fehler: {e}")

app = ApplicationBuilder().token(TELEGRAM_TOKEN).build()
app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_message))
logging.info("Bot starting...")
app.run_polling()
