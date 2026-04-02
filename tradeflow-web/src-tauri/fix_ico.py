import struct

ico_path = r"D:\Joel\trading-web\tradeflow-web\src-tauri\icons\icon.ico"
width = 32
height = 32

# Build XOR mask (pixel data)
# Indigo: #6366f1 (BGRA: f1 66 63 ff)
# White: #ffffff (BGRA: ff ff ff ff)
indigo = [0xf1, 0x66, 0x63, 0xff]
white = [0xff, 0xff, 0xff, 0xff]

pixel_data = bytearray()
for y in range(height):
    for x in range(width):
        # Draw a simple white "T" shape
        is_t = (y >= 6 and y <= 10 and x >= 8 and x <= 24) or \
               (x >= 14 and x <= 18 and y >= 11 and y <= 26)
        
        if is_t:
            pixel_data.extend(white)
        else:
            pixel_data.extend(indigo)

# Build AND mask (transparency - 0 means opaque)
and_mask = bytearray([0x00] * 128)

# BITMAPINFOHEADER (40 bytes)
# Note: Height is 2 * height for icons (XOR + AND masks)
bih = struct.pack(
    "<IiiHHIIiiII",
    40,        # biSize
    width,     # biWidth
    height * 2,# biHeight
    1,         # biPlanes
    32,        # biBitCount
    0,         # biCompression (BI_RGB)
    len(pixel_data) + len(and_mask), # biSizeImage
    0, 0, 0, 0 # biXPelsPerMeter, biYPelsPerMeter, biClrUsed, biClrImportant
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

print(f"✅ Created a stylized 'T' icon at {ico_path}")
