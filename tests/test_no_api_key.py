"""Regression check: a missing image API key must preserve catalog visuals safely."""
from __future__ import annotations

import hashlib
import json
import os
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest


ROOT = Path(__file__).resolve().parents[1]


class MissingApiKeyBuildTest(unittest.TestCase):
    def test_generate_images_falls_back_without_touching_public_catalog(self) -> None:
        public_catalog = ROOT / "catalog.html"
        before = hashlib.sha256(public_catalog.read_bytes()).hexdigest()

        with tempfile.TemporaryDirectory(prefix="sahand-no-api-key-") as temporary:
            temp = Path(temporary)
            output = temp / "output_catalog"
            data_file = temp / "products_data.json"
            xray_dir = temp / "generated_xray"
            log_file = temp / "error_log.txt"
            env = os.environ.copy()
            env.pop("OPENAI_API_KEY", None)
            env["PYTHON_DOTENV_DISABLED"] = "1"
            env["ERROR_LOG_PATH"] = str(log_file)

            result = subprocess.run(
                [
                    sys.executable, "main.py", "build",
                    "--catalog-draft", "docs/catalog-completion/catalog-draft.json",
                    "--max-products", "1", "--generate-images", "--no-server",
                    "--output-dir", str(output),
                    "--catalog-file", str(output / "catalog.html"),
                    "--data-file", str(data_file),
                    "--xray-dir", str(xray_dir),
                ],
                cwd=ROOT,
                env=env,
                capture_output=True,
                text=True,
                encoding="utf-8",
                errors="replace",
                timeout=120,
                check=False,
            )

            self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
            self.assertIn("OPENAI_API_KEY is missing", result.stderr)
            self.assertTrue(data_file.is_file())
            self.assertTrue((output / "catalog.html").is_file())
            self.assertEqual(len(list(output.glob("*.png"))), 1)
            self.assertFalse(xray_dir.exists(), "No X-ray should be fabricated when the key is absent")
            record = json.loads(data_file.read_text(encoding="utf-8"))["records"][0]
            self.assertEqual(record["catalog_visual_type"], "catalog_visual")
            self.assertTrue(log_file.is_file())

        after = hashlib.sha256(public_catalog.read_bytes()).hexdigest()
        self.assertEqual(before, after, "An isolated build must not overwrite public catalog.html")


if __name__ == "__main__":
    unittest.main()
