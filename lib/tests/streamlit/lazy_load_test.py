# Copyright (c) Streamlit Inc. (2018-2022) Snowflake Inc. (2022)
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

import subprocess
import sys
import unittest

MODULES = [
    "altair",
    "numpy",
    "pandas",
    "pyarrow",
    "requests",
    "plotly",
    "plotly.io",
    "plotly.graph_objects",
]


class ConfigOptionTest(unittest.TestCase):
    def test_no_unwanted_imports(self):
        assertions = "\n".join(
            [
                f"assert '{module}' not in sys.modules, '{module} was imported but should not be!'"
                for module in MODULES
            ]
        )
        code = f"""
import sys
import streamlit

{assertions}
"""

        result = subprocess.run(
            [sys.executable, "-c", code],
            capture_output=True,
            text=True,
        )

        self.assertEqual(result.returncode, 0, result.stderr)
