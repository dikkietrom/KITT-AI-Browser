import sys
import zlib
import gzip
import io
import brotli

def decompress_gzip(data):
    with gzip.open(io.BytesIO(data), 'rb') as f:
        return f.read()

def decompress_deflate(data):
    return zlib.decompress(data)

def decompress_brotli(data):
    return brotli.decompress(data)

input_file = sys.argv[1]
output_file = sys.argv[2]

with open(input_file, 'rb') as f_in:
    compressed_data = f_in.read()

try:
    decompressed_data = decompress_gzip(compressed_data)
    print("Decompressed using gzip.")
except Exception as e:
    print("Failed to decompress using gzip:", e)
    try:
        decompressed_data = decompress_deflate(compressed_data)
        print("Decompressed using deflate.")
    except Exception as e:
        print("Failed to decompress using deflate:", e)
        try:
            decompressed_data = decompress_brotli(compressed_data)
            print("Decompressed using Brotli.")
        except Exception as e:
            print("Failed to decompress using Brotli:", e)
            sys.exit(1)

with open(output_file, 'wb') as f_out:
    f_out.write(decompressed_data)
