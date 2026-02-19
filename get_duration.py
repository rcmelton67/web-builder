import urllib.request
import re

url = "https://www.youtube.com/watch?v=3rFU5i0P9Y8"
try:
    with urllib.request.urlopen(url) as response:
        html = response.read().decode('utf-8')
        match = re.search(r'itemprop="duration" content="(PT.*?)"', html)
        if match:
            print(f"Duration found: {match.group(1)}")
        else:
            # Fallback search for other duration format
            match2 = re.search(r'"lengthSeconds":"(\d+)"', html)
            if match2:
                seconds = int(match2.group(1))
                minutes = seconds // 60
                rem_seconds = seconds % 60
                print(f"Duration found (calculated): PT{minutes}M{rem_seconds}S")
            else:
                print("Duration not found in HTML")
except Exception as e:
    print(f"Error fetching URL: {e}")
