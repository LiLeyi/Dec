import { EntityDamageCause, ItemStack, ItemTypes, MinecraftDimensionTypes, BiomeTypes } from '@minecraft/server';
import { ModalFormData } from "@minecraft/server-ui";
import Vector3 from '../../../modules/exmc/utils/math/Vector3.js';
import ExDimension from '../../../modules/exmc/server/ExDimension.js';
import ExErrorQueue from '../../../modules/exmc/server/ExErrorQueue.js';
import menuFunctionUI from "../data/menuFunctionUI.js";
import MenuUIAlert from "../ui/MenuUIAlert.js";
import GameController from "./GameController.js";
import RuinsLoaction from './ruins/RuinsLoaction.js';
import { MinecraftEffectTypes } from '../../../modules/vanilla-data/lib/index.js';
import { MinecraftBiomeTypes } from '../../../modules/vanilla-data/lib/index.js';
import ExEntity from '../../../modules/exmc/server/entity/ExEntity';
import ExSystem from '../../../modules/exmc/utils/ExSystem.js';
import { falseIfError } from '../../../modules/exmc/utils/tool.js';
export default class SimpleItemUseFunc extends GameController {
    onJoin() {
        //连锁挖矿
        this.getEvents().exEvents.afterPlayerBreakBlock.subscribe(e => {
            var _a;
            const itemId = (_a = this.exPlayer.getBag().itemOnMainHand) === null || _a === void 0 ? void 0 : _a.typeId;
            if ((e.dimension === this.getDimension(MinecraftDimensionTypes.theEnd) && RuinsLoaction.isInProtectArea(e.block)) || this.exPlayer.getScoresManager().getScore("i_inviolable") > 1)
                return;
            if (!this.globalSettings.chainMining)
                return;
            if (itemId === "wb:axex_equipment_a") {
                if (e.brokenBlockPermutation.hasTag("log")) {
                    this.chainDigging(new Vector3(e.block), e.brokenBlockPermutation.type.id, 16);
                }
            }
            else if (itemId === "dec:everlasting_winter_pickaxe_axe" && this.player.isSneaking) {
                if (this.data.gamePreferrence.chainMining) {
                    if (this.exPlayer.getScoresManager().getScore("wbfl") >= 7) {
                        this.chainDigging(new Vector3(e.block), e.brokenBlockPermutation.type.id, 3);
                        this.exPlayer.getScoresManager().removeScore("wbfl", 7);
                    }
                }
            }
            else if (itemId === "wb:pickaxex_equipment_a" && this.player.isSneaking) {
                if (this.data.gamePreferrence.chainMining) {
                    if (this.exPlayer.getScoresManager().getScore("wbfl") >= 20) {
                        this.chainDigging(new Vector3(e.block), e.brokenBlockPermutation.type.id, 5);
                        this.exPlayer.getScoresManager().removeScore("wbfl", 20);
                    }
                }
            }
        });
        this.getEvents().exEvents.beforeItemUseOn.subscribe(e => {
            var _a, _b;
            if (e.itemStack.typeId === "wb:technology_world_explorer") {
                this.sayTo((_b = (_a = e.block) === null || _a === void 0 ? void 0 : _a.typeId) !== null && _b !== void 0 ? _b : "");
            }
        });
        this.getEvents().exEvents.beforeItemUse.subscribe((e) => {
            const item = e.itemStack;
            if (item.typeId == "wb:power") {
                if (!this.data.lang) {
                    this.setTimeout(() => {
                        new ModalFormData()
                            .title("Choose a language")
                            .dropdown("Language List", ["English", "简体中文"], 0)
                            .show(this.player).then((e) => {
                            if (!e.canceled) {
                                this.data.lang = (e.formValues && e.formValues[0] == 0) ? "en" : "zh";
                            }
                        })
                            .catch((e) => {
                            ExErrorQueue.throwError(e);
                        });
                    }, 0);
                }
                else {
                    new MenuUIAlert(this.client, menuFunctionUI(this.getLang())).showPage("main", "notice");
                }
            }
            else if (item.typeId === "wb:jet_pack") {
                //jet pack
                this.setTimeout(() => {
                    this.exPlayer.addEffect(MinecraftEffectTypes.Levitation, 2, 100, false);
                    this.exPlayer.addEffect(MinecraftEffectTypes.SlowFalling, 10, 3, false);
                    this.exPlayer.dimension.spawnEntity("wb:ball_jet_pack", this.exPlayer.position.sub(this.exPlayer.viewDirection.scl(2)));
                }, 0);
            }
            else if (e.itemStack.typeId === "wb:technology_world_explorer") {
                e.cancel = true;
                const itemDim = e.source.dimension;
                this.setTimeout(() => {
                    var _a;
                    let boss = [
                        ["entity.dec:leaves_golem.name", MinecraftBiomeTypes.Forest],
                        ["entity.dec:king_of_pillager.name", MinecraftBiomeTypes.Plains],
                        ["entity.dec:abyssal_controller.name", MinecraftBiomeTypes.Ocean],
                        ["entity.dec:predators.name", MinecraftBiomeTypes.Mesa],
                        ["entity.dec:enchant_illager.name", MinecraftBiomeTypes.Jungle],
                        ["entity.dec:everlasting_winter_ghast.name", MinecraftBiomeTypes.IcePlains],
                        ["entity.dec:escaped_soul.name", MinecraftBiomeTypes.SoulsandValley],
                        ["entity.dec:host_of_deep.name", MinecraftBiomeTypes.CrimsonForest],
                        ["entity.dec:ash_knight.name", MinecraftBiomeTypes.BasaltDeltas]
                    ];
                    const lore = item.getColorLoreUtil();
                    if (lore.search("target") && item.typeId === ((_a = this.exPlayer.getBag().itemOnMainHand) === null || _a === void 0 ? void 0 : _a.typeId)) {
                        let bossName = Number(lore.getValueUseDefault("target"));
                        let boimes = BiomeTypes.get(boss[bossName][1]);
                        const pos = this.getDimension().findClosestBiome(e.source.location, boimes, {
                            "boundingSize": new Vector3(4000, 128, 4000)
                        });
                        if (pos && !this.worldExploreTimer) {
                            let pPos = new Vector3(this.player.location);
                            this.exPlayer.getBag().itemOnMainHand = undefined;
                            let ball = ExEntity.getInstance(itemDim.spawnEntity("wb:technology_world_explorer", pPos, {
                                "initialPersistence": true
                            }));
                            const dic = new Vector3(pos).sub(pPos).normalize().scl(1 / 10);
                            this.worldExploreTimer = ExSystem.tickTask(() => {
                                if (falseIfError(() => ball.entity.isValid())) {
                                    pPos.add(dic);
                                    ball.setPosition(pPos.cpy().add(0, 1.5, 0));
                                    if (pPos.distance(pos) < 2048) {
                                        itemDim.spawnParticle("dec:magic_increase_particle", pPos);
                                    }
                                }
                            }).delay(1);
                            this.worldExploreTimer.start();
                            this.setTimeout(() => {
                                var _a;
                                (_a = this.worldExploreTimer) === null || _a === void 0 ? void 0 : _a.stop();
                                this.worldExploreTimer = undefined;
                                itemDim.spawnItem(item, pPos);
                                ball.entity.remove();
                            }, 5000);
                        }
                    }
                    else {
                        new ModalFormData()
                            .title("选择目标boss")
                            .dropdown("选择列表", boss.map(e => e[0]), 0)
                            .show(this.player).then((e) => {
                            var _a, _b, _c;
                            if (!e.canceled && e.formValues) {
                                // let boimes = BiomeTypes.get(boss[e.formValues[0] as number ?? 0][1])!;
                                let bossName = boss[(_a = e.formValues[0]) !== null && _a !== void 0 ? _a : 0][0];
                                lore.setValueUseDefault("target", (_b = e.formValues[0]) !== null && _b !== void 0 ? _b : 0);
                                if (((_c = this.exPlayer.getBag().itemOnMainHand) === null || _c === void 0 ? void 0 : _c.typeId) === item.typeId)
                                    this.exPlayer.getBag().itemOnMainHand = item;
                            }
                        })
                            .catch((e) => {
                            ExErrorQueue.throwError(e);
                        });
                    }
                }, 0);
            }
        });
        /*this.getEvents().exEvents.afterItemStartUse.subscribe((e) => {
            const item = e.itemStack;
            let time = e.useDuration;
            if (item.typeId === "wb:jet_pack") {
                // jet pack
                this.setTimeout(() => {
                    this.exPlayer.addEffect(MinecraftEffectTypes.Levitation, 2, time, false);
                    this.exPlayer.addEffect(MinecraftEffectTypes.SlowFalling, 10, 3, false);
                    this.exPlayer.command.run("/say " + time);
                }, 0);
            }
        }
        );*/
        this.getEvents().exEvents.afterItemReleaseUse.subscribe((e) => {
            var _a;
            const tmpV = new Vector3();
            const item = e.itemStack;
            const time = Math.round(e.useDuration / 20 * 100) / 100;
            if ((item === null || item === void 0 ? void 0 : item.typeId) === "epic:sunlight_sword") {
                //日光长剑 蓄能打击
                let use_time = (20 - time > 2.5) ? 2.5 : 20 - time;
                const sharpness = ((_a = item === null || item === void 0 ? void 0 : item.getComponentById("minecraft:enchantable").getEnchantment("sharpness")) === null || _a === void 0 ? void 0 : _a.level) || 0;
                const base_atk = 8 + sharpness * 1.25;
                let multipler = (use_time > 0.5) ? 2 * use_time : 1;
                let dam = Math.round(multipler * (base_atk + 10));
                this.setTimeout(() => {
                    this.exPlayer.addTag("skill_user");
                    // this.exPlayer.command.run("/say " + use_time);
                    for (let e of this.getExDimension().getEntities({
                        "maxDistance": 5,
                        "excludeTags": ["skill_user", "wbmsyh"],
                        "excludeFamilies": [],
                        "excludeTypes": ["item"],
                        "location": this.player.location
                    })) {
                        try {
                            e.applyDamage(dam, {
                                "cause": EntityDamageCause.magic,
                                "damagingEntity": this.player
                            });
                            let direction = tmpV.set(e.location).sub(this.player.location).normalize();
                            e.applyKnockback(direction.x, direction.z, 1.2, 0.5);
                            if (use_time > 2) {
                                e.addEffect(MinecraftEffectTypes.Slowness, 3 * 20, {
                                    "amplifier": 255,
                                    "showParticles": true
                                });
                                e.addEffect(MinecraftEffectTypes.Weakness, 3 * 20, {
                                    "amplifier": 255,
                                    "showParticles": true
                                });
                            }
                        }
                        catch (e) { }
                    }
                    if (use_time > 0.5) {
                        this.exPlayer.command.run("/function EPIC/weapon/sunlight_sword");
                        this.player.startItemCooldown("sword", 2 * 20);
                    }
                    this.exPlayer.removeTag("skill_user");
                }, 100);
            }
        });
        this.getEvents().exEvents.afterPlayerHitEntity.subscribe(e => {
        });
        this.getEvents().exEvents.beforeItemUse.subscribe(e => {
            var _a;
            const item = e.itemStack;
            const wbfl = this.exPlayer.getScoresManager().getScore("wbfl");
            if (item.typeId === "epic:echoing_scream_saber" && wbfl >= 25) {
                const cd = this.player.getItemCooldown(e.itemStack.getComponent('minecraft:cooldown').cooldownCategory);
                if (cd == 0) {
                    //尖啸回响
                    const tmpV = new Vector3();
                    const sharpness = ((_a = item === null || item === void 0 ? void 0 : item.getComponentById("minecraft:enchantable").getEnchantment("sharpness")) === null || _a === void 0 ? void 0 : _a.level) || 0;
                    //const strength = (this.exPlayer.entity.getEffect("strength")?.amplifier || -1) + 1;
                    //const weakness = (this.exPlayer.entity.getEffect("weakness")?.amplifier || -1) + 1;
                    const base_atk = 7 + sharpness * 1.25;
                    //let eff_atk = base_atk*(1.25^strength)/(1.25^weakness)
                    let dam = 2.4 * Math.round(base_atk) + 15;
                    this.setTimeout(() => {
                        this.exPlayer.addTag("skill_user");
                        this.exPlayer.command.run("/function EPIC/weapon/echoing_scream_saber");
                    }, 0);
                    this.setTimeout(() => {
                        for (let e of this.getExDimension().getEntities({
                            "maxDistance": 5,
                            "excludeTags": ["skill_user", "wbmsyh"],
                            "excludeFamilies": [],
                            "excludeTypes": ["item"],
                            "location": this.player.location
                        })) {
                            try {
                                let i = Number(e.getDynamicProperty('echo_record')) || 0;
                                if (i <= 4) {
                                    e.setDynamicProperty('echo_record', (i = i + 1));
                                }
                                // e.runCommand("/say " + i)
                                e.applyDamage(dam, {
                                    "cause": EntityDamageCause.magic,
                                    "damagingEntity": this.player
                                });
                                let direction = tmpV.set(e.location).sub(this.player.location).normalize();
                                e.applyKnockback(direction.x, direction.z, 1.5, 0.7);
                            }
                            catch (e) { }
                        }
                        this.exPlayer.removeTag("skill_user");
                        this.exPlayer.getScoresManager().removeScore("wbfl", 25);
                    }, 150);
                }
            }
        });
    }
    chainDigging(v, idType, times, posData) {
        var _a;
        let o = posData === undefined;
        if (!posData) {
            posData = new Set();
        }
        if (times > 0) {
            times--;
        }
        else {
            return;
        }
        const pos = v.floor().toString();
        if (posData.has(pos))
            return;
        posData.add(pos);
        const dim = ExDimension.getInstance(this.getDimension());
        const id = (_a = dim.getBlock(v)) === null || _a === void 0 ? void 0 : _a.typeId;
        if (id === idType || o) {
            dim.digBlock(v);
            this.chainDigging(v.add(0, 1, 0), idType, times, posData);
            this.chainDigging(v.sub(0, 1, 0).add(0, -1, 0), idType, times, posData);
            this.chainDigging(v.sub(0, -1, 0).add(0, 0, 1), idType, times, posData);
            this.chainDigging(v.sub(0, 0, 1).add(0, 0, -1), idType, times, posData);
            this.chainDigging(v.sub(0, 0, -1).add(1, 0, 0), idType, times, posData);
            this.chainDigging(v.sub(1, 0, 0).add(-1, 0, 0), idType, times, posData);
            v.sub(-1, 0, 0);
            this.chainDigging(v.add(1, 1, 0), idType, times, posData);
            this.chainDigging(v.sub(1, 1, 0).add(1, -1, 0), idType, times, posData);
            this.chainDigging(v.sub(1, -1, 0).add(1, 0, 1), idType, times, posData);
            this.chainDigging(v.sub(1, 0, 1).add(1, 0, -1), idType, times, posData);
            this.chainDigging(v.sub(1, 0, -1).add(-1, -1, 0), idType, times, posData);
            this.chainDigging(v.sub(-1, -1, 0).add(-1, 1, 0), idType, times, posData);
            this.chainDigging(v.sub(-1, 1, 0).add(-1, 0, 1), idType, times, posData);
            this.chainDigging(v.sub(-1, 0, 1).add(-1, 0, -1), idType, times, posData);
            v.sub(-1, 0, -1);
        }
    }
    onLoad() {
        this.initialMagicPickaxe();
    }
    onLeave() {
        var _a;
        (_a = this.worldExploreTimer) === null || _a === void 0 ? void 0 : _a.stop();
    }
    initialMagicPickaxe() {
        if (this.globalSettings.initialMagicPickaxe) {
            if (!this.data.initialMagicPickaxe) {
                this.exPlayer.getBag().addItem(new ItemStack(ItemTypes.get("wb:pickaxex_equipment_a")));
                this.data.initialMagicPickaxe = true;
            }
        }
    }
}
//# sourceMappingURL=SimpleItemUseFunc.js.map