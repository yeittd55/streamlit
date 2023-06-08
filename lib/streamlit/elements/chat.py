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

from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, Tuple, cast

from streamlit.errors import StreamlitAPIException
from streamlit.proto.Block_pb2 import Block as BlockProto
from streamlit.runtime.metrics_util import gather_metrics
from streamlit.runtime.scriptrunner import get_script_run_ctx

if TYPE_CHECKING:
    from streamlit.delta_generator import DeltaGenerator


@dataclass
class ChatHandler:
    parent_dg: "DeltaGenerator"
    last_speaker: Optional["ChatChildrenDeltaGenerator"] = None


class ChatChildrenDeltaGenerator:
    def __init__(self, chat_handler, name, system_label):
        self._chat_handler = chat_handler
        self._chat_bubble = None
        self._name = name
        self._system_label = system_label

    def _update_chat_bubble_if_needed(self):
        if self._chat_handler.last_speaker != self:
            block_proto = BlockProto()
            block_proto.chat_bubble.label = self._name
            block_proto.chat_bubble.system_label = self._system_label
            self._chat_bubble = self._chat_handler.parent_dg._block(block_proto)
            self._chat_handler.last_speaker = self

    def __getattr__(self, name):
        self._update_chat_bubble_if_needed()

        return getattr(self.chat_bubble, name)

    def __enter__(self):
        ctx = get_script_run_ctx()
        if ctx:
            for dg in ctx.dg_stack:
                if dg._block_type == "chat_bubble":
                    raise StreamlitAPIException(
                        "Chat bubble cannot be nested in another chat bubble"
                    )

        self._update_chat_bubble_if_needed()

        return self._chat_bubble.__enter__()

    def __exit__(self, exc_type, exc_val, exc_tb):
        return self._chat_bubble.__exit__(exc_type, exc_val, exc_tb)


class ChatMixin:
    @gather_metrics("chat")
    def chat(
        self, names=["🐿️", "🤖"]
    ) -> Tuple[ChatChildrenDeltaGenerator, ChatChildrenDeltaGenerator]:
        block_proto = BlockProto()
        block_proto.chat.SetInParent()
        chat_layout = self.dg._block(block_proto)
        chat_handler = ChatHandler(chat_layout)

        return (
            ChatChildrenDeltaGenerator(chat_handler, names[0], "user"),
            ChatChildrenDeltaGenerator(chat_handler, names[1], "assistant"),
        )

    @property
    def dg(self) -> "DeltaGenerator":
        """Get our DeltaGenerator."""
        return cast("DeltaGenerator", self)
