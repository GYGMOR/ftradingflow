import struct

ico_path = r"D:\Joel\trading-web\tradeflow-web\src-tauri\icons\icon.ico"
width = 64 # Use 64x64 for better sharpness than 32x32
height = 64

# Build XOR mask (pixel data)
# Indigo: #6366f1 (BGRA: f1 66 63 ff)
# White: #ffffff (BGRA: ff ff ff ff)
indigo = [0xf1, 0x66, 0x63, 0xff]
white = [0xff, 0xff, 0xff, 0xff]

pixel_data = bytearray()
for y in range(height):
    for x in range(width):
        # Draw a stylized "TF" shape
        # Vertical bar of T
        is_t_v = (x >= 12 and x <= 20 and y >= 14 and y <= 50)
        # Horizontal bar of T
        is_t_h = (y >= 14 and y <= 22 and x >= 12 and x <= 44)
        # Vertical bar of F (shares the horizontal of T if needed, but let's make it separate)
        is_f_h2 = (y >= 30 and y <= 36 and x >= 12 and x <= 34)
        
        if is_t_v or is_t_h or is_f_h2:
            pixel_data.extend(white)
        else:
            pixel_data.extend(indigo)

# Build AND mask (transparency - 0 means opaque)
and_mask = bytearray([0x00] * ((width * height) // 8))

# BITMAPINFOHEADER (40 bytes)
bih = struct.pack(
    "<IiiHHIIiiII",
    40, width, height * 2, 1, 32, 0,
    len(pixel_data) + len(and_mask), 
    0, 0, 0, 0
)

# ICONDIR (6 bytes)
icondir = struct.pack("<HHH", 0, 1, 1)

# ICONDIRENTRY (16 bytes)
image_size = len(bih) + len(pixel_data) + len(and_mask)
iconentry = struct.pack(
    "BBBBHHII",
    width, height, 0, 0,
    1, 32,
    image_size,
    22 # Offset (6 + 16)
)

with open(ico_path, "wb") as f:
    f.write(icondir)
    f.write(iconentry)
    f.write(bih)
    f.write(pixel_data)
    f.write(and_mask)

print(f"✅ Created a high-res stylized 'TF' icon at {ico_path}")
