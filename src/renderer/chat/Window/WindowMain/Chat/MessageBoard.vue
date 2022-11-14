<script setup lang="ts">
import { ModelChat } from "../../../../../model/ModelChat";
import BarTop from "../../../Component/BarTop.vue";
// import { useChatStore } from "../../../store/useChatStore";
import { useMessageStore } from "../../../store/useMessageStore";
import MessageItem from "./MessageItem.vue";
// let chatStore = useChatStore();
let messageStore = useMessageStore();
// let curId = "";
//订阅Store内数据的变化
// chatStore.$subscribe((mutations, state) => {
//   let item = state.data.find((v) => v.isSelected) as ModelChat;
//   if (item.id != curId) {
//     messageStore.initData(item);
//     curId = item.id;
//   }
// });
</script>
<template>
  <div class="MessageBord">
    <BarTop />
    <div class="MessageList">
      <MessageItem :data="item" v-for="item in messageStore.data" :key="item.id" />
    </div>
  </div>
</template>
<style scoped lang="scss">
.MessageBord {
  height: 100%;
  display: flex;
  flex: 1;
  flex-direction: column;
}
</style>
