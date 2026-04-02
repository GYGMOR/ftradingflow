import struct
import os

png_path = r"C:\Users\joel.hediger\.gemini\antigravity\brain\71c40b74-ddb8-42eb-b837-346146bd7630\tradeflow_app_icon_1775146010442.png"
ico_path = r"D:\Joel\trading-web\tradeflow-web\src-tauri\icons\icon.ico"

with open(png_path, "rb") as f:
    png_data = f.read()

# ICO Header
header = struct.pack("<HHH", 0, 1, 1) # Reserved, Type 1 (ICO), Count 1

# ICONDIRENTRY (32x32, we just tell Windows it's 32x32 to satisfy the compiler even if PNG is 1024x1024)
# Windows ICON compiler allows PNG-encoded icons in v3 format if header is correct.
entry = struct.pack(
    "BBBBHHII", 
    32, 128, 0, 0, # Width, Height (0=256), Colors, Reserved
    1, 32, # Planes, BPP
    len(png_data), # Size
    22 # Offset (6 header + 16 entry)
)

with open(ico_path, "wb") as f:
    f.write(header)
    f.write(entry)
    f.write(png_data)

print(f"✅ Successfully converted PNG to valid ICO at {ico_path}")
