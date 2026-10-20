"""Guard the BM110 viewer against unsupported assembly claims and stale assets."""
from __future__ import annotations

import json
from pathlib import Path
import unittest
import xml.etree.ElementTree as ET


ROOT = Path(__file__).resolve().parents[1]
MODEL_DIR = ROOT / "assets" / "catalog-v2" / "CP-RAY-BM110"


class BM110ViewerTest(unittest.TestCase):
    def test_catalog_uses_source_based_functional_cutaway(self) -> None:
        page = (ROOT / "status" / "catalog.html").read_text(encoding="utf-8")
        evidence = json.loads(
            (ROOT / "docs" / "catalog-completion" / "internal-assembly-references.json")
            .read_text(encoding="utf-8")
        )
        model = next(row for row in evidence["models"] if row["model"] == "BM110")

        self.assertEqual(model["visualAsset"], "assets/catalog-v2/CP-RAY-BM110/xray-source-v6.svg")
        self.assertFalse(model["visualComplete"])
        self.assertIn("xray-source-v6.svg", page)
        self.assertIn("optical-schematic.svg", page)
        self.assertIn("pointermove", page)
        self.assertIn("pointerdown", page)
        self.assertIn("addEventListener('input'", page)
        self.assertIn("User%20Manual-BM110_3.3KW", page)
        self.assertNotIn("xray-web-v5.jpg", page)

    def test_visuals_are_well_formed_svg_and_disclaim_schematic_placement(self) -> None:
        source = MODEL_DIR / "xray-source-v6.svg"
        schematic = MODEL_DIR / "optical-schematic.svg"
        self.assertTrue(source.is_file())
        self.assertTrue(schematic.is_file())
        source_root = ET.parse(source).getroot()
        ET.parse(schematic)
        self.assertEqual(source_root.tag, "{http://www.w3.org/2000/svg}svg")
        text = " ".join(node.text or "" for node in source_root.iter())
        self.assertTrue(any("FUNCTIONAL CUTAWAY" in (node.text or "") for node in source_root.iter()))
        self.assertTrue(any("NOT TO SCALE" in (node.text or "") for node in source_root.iter()))
        self.assertFalse(any(node.tag.endswith("script") for node in source_root.iter()))
        self.assertIn("211LCG0020", text)
        self.assertIn("211LCG0037", text)


if __name__ == "__main__":
    unittest.main()

