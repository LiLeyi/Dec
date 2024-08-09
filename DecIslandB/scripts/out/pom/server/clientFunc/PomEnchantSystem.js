import { EnchantmentTypes, ItemStack, ItemTypes } from "@minecraft/server";
import Vector3 from "../../../modules/exmc/utils/math/Vector3.js";
import "../../../modules/exmc/server/block/ExBlock.js";
import ExColorLoreUtil from "../../../modules/exmc/server/item/ExColorLoreUtil.js";
import "../../../modules/exmc/server/item/ExItem.js";
import GameController from "./GameController.js";
import { MinecraftBlockTypes } from "../../../modules/vanilla-data/lib/index.js";
import { MinecraftItemTypes } from "../../../modules/vanilla-data/lib/index.js";
import MathUtil from "../../../modules/exmc/utils/math/MathUtil.js";
import Random from "../../../modules/exmc/utils/Random.js";
export default class PomEnChantSystem extends GameController {
    onJoin() {
        this.getEvents().exEvents.afterItemOnHandChange.subscribe((e) => {
            const bag = this.exPlayer.getBag();
            if (e.afterItem) {
                let lore = new ExColorLoreUtil(e.afterItem);
                if (lore.search("enchants") !== undefined) {
                    let item = e.afterItem;
                    if (item !== undefined) {
                        lore = new ExColorLoreUtil(item);
                        if (item.hasComponentById("minecraft:enchantable")) {
                            const comp = item.getComponentById("minecraft:enchantable");
                            for (let i of lore.entries("enchants")) {
                                if (comp.canAddEnchantment({ "level": parseInt(i[1]), "type": EnchantmentTypes.get(i[0]) })) {
                                    comp.addEnchantment({ "level": parseInt(i[1]), "type": EnchantmentTypes.get(i[0]) });
                                }
                            }
                        }
                        lore.delete("enchants");
                        return e.afterItem;
                    }
                }
            }
        });
        //附魔
        this.getEvents().exEvents.beforeOncePlayerInteractWithBlock.subscribe((e) => {
            var _a;
            const pos = new Vector3(e.block);
            const block = this.getExDimension().getBlock(pos);
            if (!block || block.typeId === MinecraftBlockTypes.Air)
                return;
            //ExGameConfig.console.log(block.typeId,e.item.typeId);
            if (block.typeId === "wb:block_translate") {
                e.cancel = true;
                let bag = this.exPlayer.getBag();
                let item = e.itemStack;
                if (item) {
                    if (item.typeId === "wb:book_cache") {
                        PomEnChantSystem.blockTranslateData.set(new Vector3(block).toString(), item);
                        this.setTimeout(() => {
                            block.transTo("wb:block_translate_book");
                            bag.clearItem(bag.getSelectedSlot(), 1);
                        }, 0);
                    }
                }
            }
            else if (block.typeId === "wb:block_translate_book") {
                e.cancel = true;
                let bag = this.exPlayer.getBag();
                const armor_pitch = [bag.equipmentOnHead, bag.equipmentOnChest, bag.equipmentOnLegs, bag.equipmentOnFeet];
                const item = e.itemStack;
                const saveItem = PomEnChantSystem.blockTranslateData.get(new Vector3(block).toString());
                if (!saveItem) {
                    this.setTimeout(() => {
                        block.transTo("wb:block_translate");
                    }, 0);
                    return;
                }
                if (saveItem) {
                    if (item && item.amount === 1) {
                        PomEnChantSystem.blockTranslateData.delete(new Vector3(block).toString());
                        this.setTimeout(() => {
                            let exHandItem = item;
                            let exSaveItem = saveItem;
                            let d = exSaveItem.getComponentById("minecraft:durability").damage;
                            let exNewItem = new ItemStack(d >= 4 ? MinecraftItemTypes.EnchantedBook : ItemTypes.get("wb:book_cache"));
                            if (exNewItem.hasComponentById("minecraft:durability")) {
                                (exNewItem.getComponentById("minecraft:durability")).damage = d + 1;
                            }
                            // hand -> new
                            // save -> hand
                            let handlore = new ExColorLoreUtil(exHandItem);
                            let lore = new ExColorLoreUtil(exNewItem);
                            let savelore = new ExColorLoreUtil(saveItem);
                            for (let i of handlore.entries("enchants")) {
                                lore.setValueUseMap("enchants", i[0], i[1]);
                            }
                            handlore.delete("enchants");
                            if (exHandItem.hasComponentById("minecraft:enchantable")) {
                                for (let i of exHandItem.getComponentById("minecraft:enchantable").getEnchantments()) {
                                    lore.setValueUseMap("enchants", typeof (i.type) === "string" ? i.type : i.type.id, i.level + "");
                                }
                                exHandItem.getComponentById("minecraft:enchantable").removeAllEnchantments();
                            }
                            for (let i of savelore.entries("enchants")) {
                                handlore.setValueUseMap("enchants", i[0], i[1]);
                            }
                            savelore.delete("enchants");
                            // if (exSaveItem.hasComponentById("minecraft:enchantable") && exNewItem.hasComponentById("minecraft:enchantable")) {
                            //     for (let i of exSaveItem.getComponentById("minecraft:enchantable")!.enchantments) {
                            //         if (exNewItem.getComponentById("minecraft:enchantable")!.enchantments.canAddEnchantment(i)) {
                            //             exNewItem.getComponentById("minecraft:enchantable")!.enchantments.addEnchantment(i);
                            //         }
                            //     }
                            //     exSaveItem.getComponentById("minecraft:enchantable")!.removeAllEnchantments();
                            // }
                            if (exSaveItem.getComponentById("minecraft:enchantable")) {
                                for (let i of exSaveItem.getComponentById("minecraft:enchantable").getEnchantments()) {
                                    handlore.setValueUseMap("enchants", typeof (i.type) === "string" ? i.type : i.type.id, i.level + "");
                                }
                                exSaveItem.getComponentById("minecraft:enchantable").removeAllEnchantments();
                            }
                            block.transTo("wb:block_translate");
                            bag.setItem(this.exPlayer.selectedSlotIndex, item);
                            this.getDimension().spawnItem(exNewItem, pos.add(0, 1, 0));
                            [bag.equipmentOnHead, bag.equipmentOnChest, bag.equipmentOnLegs, bag.equipmentOnFeet] = armor_pitch;
                        }, 0);
                    }
                }
            }
            else if (e.block.typeId === "wb:waste_recovery") {
                const item = e.itemStack;
                let items = [
                    ["wb:button_block"],
                    ["wb:conveyor_belt"],
                    ["wb:electric_light"],
                    ["wb:lamp_senior"],
                    ["wb:planks_oakx"],
                    ["wb:quartz_blockx"],
                    ["wb:quartz_blue"]
                ];
                if (item) {
                    if ((_a = this.client.talentSystem.itemOnHandComp) === null || _a === void 0 ? void 0 : _a.getComponent("equipment_type")) {
                        this.client.sayTo("§b物品过于贵重");
                    }
                    else {
                        this.setTimeout(() => {
                            var _a, _b;
                            let m = new Map();
                            for (let i = (_a = (item.amount)) !== null && _a !== void 0 ? _a : 0; i > 0; i--) {
                                if (MathUtil.randomInteger(1, 8) === 1) {
                                    let str = Random.choice(items)[0];
                                    m.set(str, ((_b = m.get(str)) !== null && _b !== void 0 ? _b : 0) + 1);
                                }
                            }
                            for (let [k, v] of m.entries()) {
                                this.getDimension().spawnItem(new ItemStack(ItemTypes.get(k), v), pos.cpy().add(0, 1, 0));
                            }
                            this.exPlayer.getBag().itemOnMainHand = undefined;
                        }, 0);
                    }
                }
                else {
                    this.client.sayTo("§b回收废物过大，处理失败");
                }
                e.cancel = true;
            }
        });
    }
    onLoad() {
    }
    onLeave() {
    }
}
PomEnChantSystem.blockTranslateData = new Map();
//# sourceMappingURL=PomEnchantSystem.js.map