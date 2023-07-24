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

from playwright.sync_api import Page

from conftest import ImageCompareFunction


def test_data_editor_supports_various_configurations(
    app: Page, assert_snapshot: ImageCompareFunction
):
    """Test that st.data_editor supports various configuration options."""
    # Create locators for all elements with stDataFrame class
    st_dataframe_elements = app.locator(".stDataFrame").all()
    assert len(st_dataframe_elements) == 23, "Unexpected number of data_editor elements"

    for i, element in enumerate(st_dataframe_elements):
        # Expect the screenshot "to be" the same as the previously stored screenshot.
        assert_snapshot(
            element.screenshot(),
            name=f"data_editor-config-{i}",
        )