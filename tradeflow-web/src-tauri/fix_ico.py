import struct

ico_path = r"D:\Joel\trading-web\tradeflow-web\src-tauri\icons\icon.ico"

# 32x32 icon, 32 bits per pixel (BGRA)
width = 32
height = 32

# Build XOR mask (pixel data)
# We'll make a solid indigo block (TradeFlow color: #6366f1 -> BGRA: f1 66 63 ff)
pixel_data = bytearray()
for _ in range(width * height):
    pixel_data.extend([0xf1, 0x66, 0x63, 0xff])

# Build AND mask (transparency - 0 means opaque)
# 32x32 bits = 1024 bits = 128 bytes
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
# Size is bih + pixel_data + and_mask
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

print(f"✅ Created a legacy-compatible 32x32 BMP-encoded ICO at {ico_path}")
