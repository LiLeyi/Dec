import MathUtil from "../../../modules/exmc/utils/math/MathUtil.js";
import ExSystem from "../../../modules/exmc/utils/ExSystem.js";
import VarOnChangeListener from "../../../modules/exmc/utils/VarOnChangeListener.js";
import { Talent } from "../cache/TalentData.js";
import GameController from "./GameController.js";
import { MinecraftEffectTypes } from '../../../modules/vanilla-data/lib/index.js';
import ExGame from '../../../modules/exmc/server/ExGame.js';
import { zeroIfNaN } from '../../../modules/exmc/utils/tool.js';
export default class PomMagicSystem extends GameController {
    constructor() {
        super(...arguments);
        this.additionHealthShow = false;
        this.healthShow = true;
        this.additionHealth = 40;
        this.addGameHealth = 0;
        this._gameHealth = 30;
        this.isDied = false;
        this.isProtected = false;
        this.gameMaxHealth = 30;
        this.scoresManager = this.exPlayer.getScoresManager();
        this.wbflLooper = ExSystem.tickTask(() => {
            if (this.scoresManager.getScore("wbfl") < this.wbflMax)
                this.scoresManager.addScore("wbfl", 2);
        }).delay(5 * 20);
        this.wbflDefaultMax = 120;
        this.wbflMax = this.wbflDefaultMax;
        this.experienceAddLooper = ExSystem.tickTask(() => {
            this.data.gameExperience += 1;
        }).delay(12 * 20);
        this.armorCoolingLooper = ExSystem.tickTask(() => {
            if (this.scoresManager.getScore("wbkjlq") > 0)
                this.scoresManager.removeScore("wbkjlq", 1);
        }).delay(1 * 20);
        this._anotherShow = [];
        this._mapShow = new Map();
        this.healthSaver = ExSystem.tickTask(() => {
            this.player.setDynamicProperty('health', this.gameHealth);
            this.player.setDynamicProperty('damageAbsorbed', this.damageAbsorbed);
            this.player.setDynamicProperty('magicReduce', this.magicReduce);
        }).delay(20 * 5);
        this.dataCache = {
            wbfl: 200,
            wbwqlq: 0,
            wbkjlqcg: 0
        };
        this.dataCacheRefreshDelay = 0;
        this.actionbarShow = ExSystem.tickTask(() => {
            var _a, _b;
            const oldData = this.lastFromData;
            this.dataCacheRefreshDelay += 1;
            if (this.dataCacheRefreshDelay >= this.globalSettings.uiDataUpdateDelay) {
                this.dataCacheRefreshDelay = 0;
                this.dataCache.wbfl = this.scoresManager.getScore("wbfl");
                this.dataCache.wbwqlq = this.scoresManager.getScore("wbwqlq");
                this.dataCache.wbkjlqcg = this.scoresManager.getScore("wbkjlqcg");
            }
            let grade = this.getNumberFont(MathUtil.clamp(this.data.gameGrade, 0, 99));
            if (grade.length === 1)
                grade = PomMagicSystem.numberFont[0] + grade;
            let fromData = [
                this.gameHealth,
                [this.gameHealth / this.gameMaxHealth, ((_b = (_a = oldData === null || oldData === void 0 ? void 0 : oldData[1]) === null || _a === void 0 ? void 0 : _a[0]) !== null && _b !== void 0 ? _b : 0) > this.gameHealth / this.gameMaxHealth],
                [this.dataCache.wbfl / this.wbflMax],
                this.dataCache.wbfl,
                [this.dataCache.wbwqlq / 20],
                [this.dataCache.wbkjlqcg / 20],
                [this.damageAbsorbed / this.gameMaxHealth + this.magicReduce / this.gameMaxHealth],
                this.data.gameGrade,
                [this.data.gameExperience / (this.getGradeNeedExperience(1 + this.data.gameGrade) - this.getGradeNeedExperience(this.data.gameGrade))],
                [(grade), grade.length * 3],
                [this.magicReduce / this.gameMaxHealth],
                [this.data.uiCustomSetting.topLeftMessageBarLayer1 / 100],
                [this.data.uiCustomSetting.topLeftMessageBarLayer2 / 100],
                [this.data.uiCustomSetting.topLeftMessageBarLayer3 / 100],
                [this.data.uiCustomSetting.topLeftMessageBarLayer4 / 100],
                [this.data.uiCustomSetting.topLeftMessageBarLayer5 / 100],
                [this.data.uiCustomSetting.topLeftMessageBarStyle],
                [this.data.uiCustomSetting.accuracyCustom / 100],
                [this.gameHealth / this.gameMaxHealth > 0.3 ? 1 : 0]
            ];
            this.lastFromData = fromData;
            let arr1 = fromData.map((e, index) => {
                let v;
                if (typeof e === "number") {
                    let fix = Math.round(e) + "";
                    v = ("_" + Math.min(8, fix.length) + fix.substring(Math.max(fix.length - 8, 0)));
                }
                else if (e instanceof Array) {
                    if (e.length === 1 || (e.length === 2 && typeof e[1] === "boolean")) {
                        let ne = MathUtil.clamp(Math.round(100 * e[0]), 0, 100);
                        let old;
                        if (e.length === 2 && e[1]) {
                            old = ne;
                        }
                        else if (oldData) {
                            let n = oldData[index];
                            old = MathUtil.clamp(Math.round(100 * (n[0])), 0, 100);
                        }
                        else {
                            old = 0;
                        }
                        v = "_6" + "0".repeat(Math.max(0, (3 - ne.toString().length))) + ne +
                            "0".repeat(Math.max(0, (3 - old.toString().length))) + old;
                    }
                    else if (e.length === 2 && typeof e[1] === "number" && typeof e[0] === "string") {
                        v = "_" + e[1] + e[0];
                        v += "x".repeat(8 - e[1]);
                        return v;
                    }
                    else {
                        v = "";
                    }
                }
                else {
                    v = "";
                }
                return v + "x".repeat(Math.max(0, 10 - v.length));
            });
            let arr2 = [];
            for (let i = 0; i < 50; i++) {
                arr2.push("");
            }
            arr2 = arr2.concat(Array.from(this._mapShow.values()).map(e => e.join('\n§r')));
            this.exPlayer.titleActionBar(arr1.join("\n") + "定位".repeat(6) + arr2.join("\n§r"));
        }).delay(8);
        this.damageAbsorbed = 0;
        this.magicReduce = 0;
        this.hurtState = false;
        this.hurtMaxNum = 0;
    }
    get gameHealth() {
        return this._gameHealth;
    }
    set gameHealth(n) {
        n = MathUtil.clamp(n, -1, this.gameMaxHealth);
        this._gameHealth = n;
        this.client.talentSystem.calculateHealth = n;
    }
    registActionbarPass(name) {
        this._mapShow.set(name, []);
        return this.getActionbarByPass(name);
    }
    getActionbarSize() {
        return this._mapShow.size;
    }
    getActionbarByPass(name) {
        return this._mapShow.get(name);
    }
    setActionbarByPass(name, msg) {
        this._mapShow.set(name, msg);
    }
    deleteActionbarPass(name) {
        this._mapShow.delete(name);
    }
    getNumberFont(num) {
        let s = "";
        for (let i of num.toString()) {
            s += PomMagicSystem.numberFont[parseInt(i)];
        }
        return s;
    }
    onJoin() {
        var _a, _b, _c;
        const health = this.exPlayer.getComponent("minecraft:health");
        let hurtTimeId = 0;
        let healthListener = new VarOnChangeListener((n, l) => {
            healthListener.value = 25000;
            health.setCurrentValue(25000);
            let change = n - (l !== null && l !== void 0 ? l : 0);
            if (change < 0 && this.hurtState) {
                if (this.hurtMaxNum <= change)
                    return; //build-in method
                ExGame.clearRun(hurtTimeId);
                hurtTimeId = ExGame.runTimeout(() => {
                    this.hurtState = false;
                    this.hurtMaxNum = 0;
                }, 1);
                change -= this.hurtMaxNum;
                this.hurtMaxNum = -(n - (l !== null && l !== void 0 ? l : 0));
            }
            if (!this.hurtState && change < 0) {
                hurtTimeId = ExGame.runTimeout(() => {
                    this.hurtState = false;
                    this.hurtMaxNum = 0;
                }, 1);
                this.hurtState = true;
                this.hurtMaxNum = change;
            }
            if (!this.isProtected) {
                if (n === 1) {
                    //不死图腾
                    this.gameHealth = 1;
                    this.isProtected = true;
                    this.setTimeout(() => {
                        this.isProtected = false;
                    }, 1500);
                }
                else {
                    this.gameHealth = Math.min(this.gameHealth + change, this.gameMaxHealth);
                }
            }
            if (this.addGameHealth) {
                this.gameHealth += this.addGameHealth;
                this.addGameHealth = 0;
            }
        }, health.currentValue);
        // this.getEvents().exEvents.tick.subscribe(e => {
        //     healthListener.upDate(health!.currentValue);
        // });
        this.getEvents().exEvents.afterEntityHealthChanged.subscribe(e => {
            healthListener.upDate(e.newValue);
        });
        this.healthSaver.start();
        let n;
        this.getEvents().exEvents.afterPlayerSpawn.subscribe(e => {
            var _a;
            this.exPlayer.triggerEvent("hp:50000");
            //设置默认游戏血量
            //绕开常规逻辑设置血量
            this.isDied = false;
            this.isProtected = true;
            this.setTimeout(() => {
                this.isProtected = false;
            }, 3000);
            this.gameHealth = this.gameMaxHealth;
            healthListener.value = 25000;
            health.setCurrentValue(25000);
            if (e.initialSpawn) {
                this.gameHealth = MathUtil.clamp((_a = this.player.getDynamicProperty("health")) !== null && _a !== void 0 ? _a : this.gameMaxHealth, 1, this.gameMaxHealth);
            }
            else {
                this.gameHealth = this.gameMaxHealth;
            }
        });
        this.magicReduce = (_a = this.player.getDynamicProperty("magicReduce")) !== null && _a !== void 0 ? _a : 0;
        this.damageAbsorbed = (_b = this.player.getDynamicProperty("damageAbsorbed")) !== null && _b !== void 0 ? _b : 0;
        this.gameHealth = MathUtil.clamp((_c = this.player.getDynamicProperty("health")) !== null && _c !== void 0 ? _c : this.gameMaxHealth, 1, this.gameMaxHealth);
        this.actionbarShow.delay(this.globalSettings.uiUpdateDelay);
        this.getEvents().exEvents.afterEffectAdd.subscribe(e => {
            if (e.effect.typeId === MinecraftEffectTypes.Absorption) {
                this.setDamageAbsorbed(e.effect.amplifier * 4);
                this.player.removeEffect(MinecraftEffectTypes.Absorption);
            }
        });
        this.getEvents().exEvents.onLongTick.subscribe(e => {
            if (e.currentTick % 4 !== 0)
                return;
            let eff;
            if ((eff = this.player.getEffect(MinecraftEffectTypes.Absorption)) !== undefined) {
                this.setDamageAbsorbed((eff.amplifier + 1) * 4);
                this.player.removeEffect(MinecraftEffectTypes.Absorption);
            }
            if ((eff = this.player.getEffect(MinecraftEffectTypes.HealthBoost)) !== undefined) {
                this.setMagicAbsorbed((eff.amplifier + 1) * 4);
                this.player.removeEffect(MinecraftEffectTypes.HealthBoost);
            }
        });
    }
    setDamageAbsorbed(num) {
        if (num > this.damageAbsorbed) {
            this.damageAbsorbed = num;
        }
    }
    tryReduceDamageAbsorbed(num) {
        if (num > this.damageAbsorbed) {
            let res = num - this.damageAbsorbed;
            this.damageAbsorbed = 0;
            return res;
        }
        else {
            this.damageAbsorbed -= num;
            return 0;
        }
    }
    setMagicAbsorbed(num) {
        if (num > this.magicReduce) {
            this.magicReduce = num;
        }
    }
    tryReduceMagicAbsorbed(num) {
        if (num > this.magicReduce) {
            let res = num - this.magicReduce;
            this.magicReduce = 0;
            return res;
        }
        else {
            this.magicReduce -= num;
            return 0;
        }
    }
    onLoad() {
        if (!this.data.gameExperience)
            this.data.gameExperience = 0;
        this.data.gameGrade = this.exPlayer.getScoresManager().getScore("wbdj");
        this.wbflLooper.start();
        this.armorCoolingLooper.start();
        this.actionbarShow.start();
        this.experienceAddLooper.start();
    }
    onLeave() {
        this.wbflLooper.stop();
        this.armorCoolingLooper.stop();
        this.actionbarShow.stop();
        this.healthSaver.stop();
        this.experienceAddLooper.stop();
    }
    upDateGrade() {
        this.exPlayer.getScoresManager().setScore("wbdj", this.data.gameGrade);
    }
    checkUpgrade() {
        this.data.gameGrade = this.exPlayer.getScoresManager().getScore("wbdj");
        const ex = this.getGradeNeedExperience(1 + this.data.gameGrade) - this.getGradeNeedExperience(this.data.gameGrade);
        if (this.data.gameExperience > ex) {
            this.data.gameExperience -= ex;
            this.data.gameGrade += 1;
            this.upDateGrade();
        }
        this.client.talentSystem.updateTalentRes();
    }
    getGradeNeedExperience(g) {
        return (150 * Math.pow((g - 1), 2) + 1050 * (g - 1) + 900);
    }
    getExperienceCanUpGradeTo() {
        let gradeBass = this.getGradeNeedExperience(this.data.gameGrade) + this.data.gameExperience;
        let res = Math.floor(((-1050 + Math.sqrt(1050 * 1050 - 4 * (900 - gradeBass) * 150)) / (300)) + 1);
        return zeroIfNaN(res);
    }
    upDateByTalent(talentRes) {
        var _a, _b, _c, _d, _e;
        let scores = this.exPlayer.getScoresManager();
        scores.setScore("wbwqlqjs", Math.round((this.client.getDifficulty().coolingFactor) * (100 + ((_a = talentRes.get(Talent.CHARGING)) !== null && _a !== void 0 ? _a : 0))));
        this.gameMaxHealth = Math.round(this.client.getDifficulty().healthAddionion + (30 + ((_b = talentRes.get(Talent.VIENTIANE)) !== null && _b !== void 0 ? _b : 0)));
        this.wbflMax = this.wbflDefaultMax + ((_c = talentRes.get(Talent.SOURCE)) !== null && _c !== void 0 ? _c : 0);
        this.armorCoolingLooper.stop();
        this.experienceAddLooper.stop();
        this.experienceAddLooper.delay((12 * 20) / this.client.getDifficulty().LevelFactor);
        this.wbflLooper.stop();
        this.wbflLooper.delay((1 / this.client.getDifficulty().wbflAddFactor) *
            (5 * 20 / ((1 + ((_d = talentRes.get(Talent.CONVERGE)) !== null && _d !== void 0 ? _d : 0) / 100) * (1 + this.data.gameGrade * 1 / 100))));
        this.armorCoolingLooper.delay((1 / this.client.getDifficulty().coolingFactor) *
            (1 / (1 / (1 * 20) * (1 + ((_e = talentRes.get(Talent.RELOAD)) !== null && _e !== void 0 ? _e : 0) / 100))));
        this.wbflLooper.start();
        this.armorCoolingLooper.start();
        this.experienceAddLooper.start();
    }
}
PomMagicSystem.weaponCoolingChar = "";
PomMagicSystem.armorCoolingChar = "";
PomMagicSystem.wbflChar = "";
PomMagicSystem.AdditionHPChar = "";
PomMagicSystem.numberFont = "";
//# sourceMappingURL=PomMagicSystem.js.map