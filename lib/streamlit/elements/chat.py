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
from typing import TYPE_CHECKING, Tuple, cast

from streamlit.proto.Block_pb2 import Block as BlockProto
from streamlit.runtime.metrics_util import gather_metrics

if TYPE_CHECKING:
    from streamlit.delta_generator import DeltaGenerator


@dataclass
class ChatHandler:
    parent_dg: "DeltaGenerator"
    last_speaker = None


class ChatChildrenDeltaGenerator:
    def __init__(self, chat_handler, name, system_label):
        self.chat_handler = chat_handler
        self.chat_bubble = None
        self.name = name
        self.system_label = system_label

    def __getattr__(self, name):
        if self.chat_handler.last_speaker != self:
            block_proto = BlockProto()
            block_proto.chat_bubble.label = self.name
            block_proto.chat_bubble.system_label = self.system_label
            self.chat_bubble = self.chat_handler.parent_dg._block(block_proto)
            self.chat_handler.last_speaker = self

        return getattr(self.chat_bubble, name)


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
