#!/usr/bin/env python3
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile
import zipfile

src = Path(__file__).resolve().parents[1]
out = src.parent / "uxcraft-deployment.zip"
if out.exists():
    out.unlink()
exclude_dirs = {".git", "graphify-out", "__pycache__", "node_modules", "coverage", ".nyc_output"}
exclude_suffixes = {".pyc", ".tgz"}
exclude_names = {"npm-debug.log"}

with zipfile.ZipFile(out, "w", zipfile.ZIP_DEFLATED) as z:
    for path in src.rglob("*"):
        rel = path.relative_to(src)
        if set(rel.parts) & exclude_dirs:
            continue
        if path.suffix in exclude_suffixes:
            continue
        if path.name in exclude_names or path.name.startswith("npm-debug.log"):
            continue
        if path.is_file():
            z.write(path, Path("uxcraft") / rel)

print(out)
with tempfile.TemporaryDirectory() as td:
    with zipfile.ZipFile(out) as z:
        z.extractall(td)
    pkg = Path(td) / "uxcraft"
    res = subprocess.run(
        [sys.executable, "scripts/validate_skill.py", "--release"],
        cwd=pkg,
        text=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
    )
    print(res.stdout)
    raise SystemExit(res.returncode)
