import { ModelChat } from "../../../model/ModelChat";
import { ModelMessage } from "../../../model/ModelMessage";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useMessageStore = defineStore("message", () => {
    // TODO::了解声明写法
    let data = ref<ModelMessage[]>([]);
    let msg1 = `醉里挑灯看剑，梦回吹角连营。八百里分麾下灸，五十弦翻塞外声。沙场秋点兵。马作的卢飞快，弓如霹雳弦惊。了却君王天下事，嬴得生前身后名。可怜白发生`;
    let msg2 = `怒发冲冠，凭栏处，潇潇雨歇。抬望眼，仰天长啸，壮怀激烈。 三十功名尘与土，八千里路云和月。莫等闲，白了少年头，空悲切！ 靖康耻，犹未雪；臣子恨，何时灭?驾长车，踏破贺兰山缺！ 壮志饥餐胡虏肉，笑谈渴饮匈奴血。待从头，收拾旧山河，朝天阙！`;
    let initData = (chat: ModelChat) => {
        let result = [];
        for (let index = 0; index < 10; index++) {
            let modal = new ModelMessage();
            modal.createTime = Date.now();
            modal.isInMsg = index % 2 === 0;
            modal.messageContent = modal.isInMsg ? msg1 : msg2;
            modal.fromName = modal.isInMsg ? chat.fromName : "我";
            modal.avatar = chat.avatar;
            modal.chatId = chat.id;
            result.push(modal);
        }
        data.value = result;
    }

    return { data, initData }
});