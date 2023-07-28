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

from typing import TYPE_CHECKING, Optional, cast

from streamlit.errors import StreamlitAPIException
from streamlit.proto.Toast_pb2 import Toast as ToastProto
from streamlit.runtime.metrics_util import gather_metrics
from streamlit.string_util import clean_text, validate_emoji
from streamlit.type_util import SupportsStr

if TYPE_CHECKING:
    from streamlit.delta_generator import DeltaGenerator


def validate_text(toast_text: SupportsStr) -> SupportsStr:
    if str(toast_text) == "":
        raise StreamlitAPIException(
            f"Toast body cannot be blank - please provide a message."
        )
    else:
        return toast_text


class ToastMixin:
    def toast(
        self,
        body: SupportsStr,
        *,  # keyword-only args:
        icon: Optional[str] = None,
        cache: Optional[bool] = False,
        duration: Optional[int] = 4,
        show_elapsed: Optional[bool] = False,
    ) -> "DeltaGenerator":
        """Display a short message, known as a notification "toast".
        The toast appears in the app's bottom-right corner and disappears after four seconds.

        Parameters
        ----------
        body : str
            The string to display as Github-flavored Markdown. Syntax
            information can be found at: https://github.github.com/gfm.

            This also supports:

            * Emoji shortcodes, such as ``:+1:``  and ``:sunglasses:``.
              For a list of all supported codes,
              see https://share.streamlit.io/streamlit/emoji-shortcodes.

            * LaTeX expressions, by wrapping them in "$" or "$$" (the "$$"
              must be on their own lines). Supported LaTeX functions are listed
              at https://katex.org/docs/supported.html.

            * Colored text, using the syntax ``:color[text to be colored]``,
              where ``color`` needs to be replaced with any of the following
              supported colors: blue, green, orange, red, violet.
        icon : str or None
            An optional, keyword-only argument that specifies an emoji to use as
            the icon for the toast. Shortcodes are not allowed, please use a
            single character instead. E.g. "🚨", "🔥", "🤖", etc.
            Defaults to None, which means no icon is displayed.

        Example
        -------
        >>> import streamlit as st
        >>>
        >>> st.toast('Your edited image was saved!', icon='😍')
        """
        return Toast(body, icon, cache, duration, show_elapsed, self.dg)

    @property
    def dg(self) -> "DeltaGenerator":
        """Get our DeltaGenerator."""
        return cast("DeltaGenerator", self)


class Toast:
    def __init__(
        self,
        body,
        icon=None,
        cache=False,
        duration=4,
        show_elapsed=False,
        delta_generator=None,
    ):
        self.toast_proto = ToastProto()
        self.toast_proto.body = clean_text(validate_text(body))
        self.toast_proto.icon = validate_emoji(icon)
        self.toast_proto.cache = cache
        self.toast_proto.duration = duration * 1000  # convert to milliseconds
        self.toast_proto.show_elapsed = show_elapsed
        self.delta_reference = delta_generator._enqueue("toast", self.toast_proto)

    def __enter__(self):
        if self.toast_proto.icon == "":
            icon = None
        else:
            icon = self.toast_proto.icon
        return self.delta_reference.toast(
            self.toast_proto.body,
            icon=icon,
            cache=True,
            duration=self.toast_proto.duration,
            show_elapsed=self.toast_proto.show_elapsed,
        )

    def __exit__(self, *args, **kwargs):
        self.delta_reference.empty()

    def update(self, body, icon, cache=False, duration=4, show_elapsed=False):
        cache = self.toast_proto.cache or cache
        self.delta_reference.toast(
            body, icon=icon, cache=cache, duration=duration, show_elapsed=show_elapsed
        )

    def clear(self):
        self.delta_reference.empty()
