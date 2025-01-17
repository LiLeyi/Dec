import { MinecraftEntityTypes, MinecraftItemTypes } from "../../../../modules/vanilla-data/lib/index.js";
export default function taskDaily_a(client, lang) {
    return {
        "name": "每日任务-普通级",
        "tasks": [
            {
                "name": "粮食提交 I",
                "conditions": [
                    {
                        "name": "小麦",
                        "typeId": MinecraftItemTypes.Wheat,
                        "count": 6,
                        "type": "item"
                    },
                    {
                        "name": "胡萝卜",
                        "typeId": MinecraftItemTypes.Carrot,
                        "count": 6,
                        "type": "item"
                    }
                ],
                "rewards": [
                    {
                        "name": "模组经验",
                        "count": 500,
                        "unit": "点",
                        "type": "integral"
                    }
                ]
            },
            {
                "name": "粮食提交 II",
                "conditions": [
                    {
                        "name": "马铃薯",
                        "typeId": MinecraftItemTypes.Potato,
                        "count": 6,
                        "type": "item"
                    },
                    {
                        "name": "胡萝卜",
                        "typeId": MinecraftItemTypes.Carrot,
                        "count": 6,
                        "type": "item"
                    }
                ],
                "rewards": [
                    {
                        "name": "模组经验",
                        "count": 500,
                        "unit": "点",
                        "type": "integral"
                    }
                ]
            },
            {
                "name": "水果提交 I",
                "conditions": [
                    {
                        "name": "西瓜",
                        "typeId": MinecraftItemTypes.MelonBlock,
                        "count": 12,
                        "type": "item"
                    }
                ],
                "rewards": [
                    {
                        "name": "模组经验",
                        "count": 500,
                        "unit": "点",
                        "type": "integral"
                    }
                ]
            },
            {
                "name": "水果提交 II",
                "conditions": [
                    {
                        "name": "熟鸡肉",
                        "typeId": MinecraftItemTypes.Pumpkin,
                        "count": 6,
                        "type": "item"
                    }
                ],
                "rewards": [
                    {
                        "name": "模组经验",
                        "count": 500,
                        "unit": "点",
                        "type": "integral"
                    }
                ]
            },
            {
                "name": "清理怪物 I",
                "conditions": [
                    {
                        "name": "僵尸",
                        "typeId": "minecraft:zombie",
                        "count": 8,
                        "type": "kill"
                    },
                    {
                        "name": "苦力怕",
                        "typeId": "minecraft:creeper",
                        "count": 2,
                        "type": "kill"
                    }
                ],
                "rewards": [
                    {
                        "name": "模组经验",
                        "count": 500,
                        "unit": "点",
                        "type": "integral"
                    }
                ]
            },
            {
                "name": "清理怪物 II",
                "conditions": [
                    {
                        "name": "烈焰人",
                        "typeId": MinecraftEntityTypes.Blaze,
                        "count": 8,
                        "type": "kill"
                    }
                ],
                "rewards": [
                    {
                        "name": "模组经验",
                        "count": 500,
                        "unit": "点",
                        "type": "integral"
                    }
                ]
            },
            {
                "name": "狩猎愉快",
                "conditions": [
                    {
                        "name": "猪",
                        "typeId": "minecraft:pig",
                        "count": 3,
                        "type": "kill"
                    },
                    {
                        "name": "牛",
                        "typeId": "minecraft:cow",
                        "count": 3,
                        "type": "kill"
                    },
                    {
                        "name": "羊",
                        "typeId": "minecraft:sheep",
                        "count": 3,
                        "type": "kill"
                    }
                ],
                "rewards": [
                    {
                        "name": "模组经验",
                        "count": 500,
                        "unit": "点",
                        "type": "integral"
                    }
                ]
            },
            {
                "name": "砍树",
                "conditions": [
                    {
                        "name": "木头",
                        "typeId": "log",
                        "count": 16,
                        "type": "break"
                    }
                ],
                "rewards": [
                    {
                        "name": "模组经验",
                        "count": 500,
                        "unit": "点",
                        "type": "integral"
                    }
                ]
            },
            {
                "name": "挖矿",
                "conditions": [
                    {
                        "name": "石头",
                        "typeId": MinecraftItemTypes.Stone,
                        "count": 32,
                        "type": "break"
                    }
                ],
                "rewards": [
                    {
                        "name": "模组经验",
                        "count": 500,
                        "unit": "点",
                        "type": "integral"
                    }
                ]
            },
            {
                "name": "采苹果",
                "conditions": [
                    {
                        "name": "苹果",
                        "typeId": MinecraftItemTypes.Apple,
                        "count": 3,
                        "aux": 0,
                        "type": "item"
                    }
                ],
                "rewards": [
                    {
                        "name": "模组经验",
                        "count": 500,
                        "unit": "点",
                        "type": "integral"
                    }
                ]
            },
            {
                "name": "采毒马铃薯",
                "conditions": [
                    {
                        "name": "毒马铃薯",
                        "typeId": MinecraftItemTypes.PoisonousPotato,
                        "count": 2,
                        "aux": 0,
                        "type": "item"
                    }
                ],
                "rewards": [
                    {
                        "name": "模组经验",
                        "count": 500,
                        "unit": "点",
                        "type": "integral"
                    }
                ]
            },
            {
                "name": "改善伙食",
                "conditions": [
                    {
                        "name": "兔肉煲",
                        "typeId": MinecraftItemTypes.RabbitStew,
                        "count": 3,
                        "type": "item"
                    }
                ],
                "rewards": [
                    {
                        "name": "模组经验",
                        "count": 500,
                        "unit": "点",
                        "type": "integral"
                    }
                ]
            },
            {
                "name": "腐肉回收",
                "conditions": [
                    {
                        "name": "腐肉",
                        "typeId": MinecraftItemTypes.RottenFlesh,
                        "count": 32,
                        "type": "item"
                    }
                ],
                "rewards": [
                    {
                        "name": "模组经验",
                        "count": 500,
                        "unit": "点",
                        "type": "integral"
                    }
                ]
            },
            {
                "name": "好吃的南瓜派",
                "conditions": [
                    {
                        "name": "南瓜派",
                        "typeId": MinecraftItemTypes.PumpkinPie,
                        "count": 4,
                        "type": "item"
                    }
                ],
                "rewards": [
                    {
                        "name": "模组经验",
                        "count": 500,
                        "unit": "点",
                        "type": "integral"
                    }
                ]
            },
            {
                "name": "你对附魔一无所知",
                "conditions": [
                    {
                        "name": "转移附魔书",
                        "typeId": "wb:book_cache",
                        "count": 1,
                        "type": "item"
                    }
                ],
                "rewards": [
                    {
                        "name": "模组经验",
                        "count": 500,
                        "unit": "点",
                        "type": "integral"
                    }
                ]
            },
            {
                "name": "来点灵魂",
                "conditions": [
                    {
                        "name": "灵魂",
                        "typeId": "dec:soul",
                        "count": 2,
                        "type": "item"
                    }
                ],
                "rewards": [
                    {
                        "name": "模组经验",
                        "count": 500,
                        "unit": "点",
                        "type": "integral"
                    }
                ]
            }
        ]
    };
}
//# sourceMappingURL=daily_a.js.map