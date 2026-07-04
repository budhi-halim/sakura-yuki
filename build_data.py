from pathlib import Path
import json
import re

ROOT = Path(__file__).parent
DATA_DIR = ROOT / "data"
OUTPUT = ROOT / "data.json"


def natural_key(path: Path):
    """
    Sort:
        data_1.json
        data_2.json
        data_10.json
        data_932520.json
    """
    m = re.search(r"(\d+)", path.stem)
    return int(m.group(1)) if m else float("inf")


all_themes = []

files = sorted(DATA_DIR.glob("data_*.json"), key=natural_key)

if not files:
    raise FileNotFoundError("No data_*.json files found inside ./data")

for file in files:
    print(f"Reading {file.name}")

    with file.open("r", encoding="utf-8") as f:
        data = json.load(f)

    if not isinstance(data, list):
        raise TypeError(
            f"{file.name} must contain a JSON array as the root object."
        )

    all_themes.extend(data)

with OUTPUT.open("w", encoding="utf-8") as f:
    json.dump(
        all_themes,
        f,
        ensure_ascii=False,
        indent=2
    )

print()
print(f"Done! Generated {OUTPUT.name}")
print(f"Total themes: {len(all_themes)}")