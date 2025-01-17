var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { receiveMessage } from "../../modules/exmc/server/ExGame.js";
import ExGameClient from "../../modules/exmc/server/ExGameClient.js";
import ExPlayer from "../../modules/exmc/server/entity/ExPlayer.js";
import { Objective } from "../../modules/exmc/server/entity/ExScoresManager.js";
import { eventDecoratorFactory } from "../../modules/exmc/server/events/eventDecoratorFactory.js";
import ExSystem from "../../modules/exmc/utils/ExSystem.js";
import Random from "../../modules/exmc/utils/Random.js";
import GlobalSettings from "./cache/GlobalSettings.js";
import PomClientData from "./cache/PomClientData.js";
import POMLICENSE from "./data/POMLICENSE.js";
import lang from "./data/lang.js";
import PomDimRuinsSystem from "./clientFunc/PomDimRuinsSystem.js";
import PomEnchantSystem from "./clientFunc/PomEnchantSystem.js";
import PomInteractSystem from "./clientFunc/PomInteractSystem.js";
import PomMagicSystem from "./clientFunc/PomMagicSystem.js";
import PomTalentSystem from "./clientFunc/PomTalentSystem.js";
import PomTaskSystem from "./clientFunc/PomTaskSystem.js";
import SimpleItemUseFunc from "./clientFunc/SimpleItemUseFunc.js";
import WarningAlertUI from "./ui/WarningAlertUI.js";
import ExPropCache from "../../modules/exmc/server/storage/cache/ExPropCache.js";
import { ArmorData } from "../../dec/server/items/ArmorData.js";
import { pomDifficultyMap } from "./data/GameDifficulty.js";
import TalentData from "./cache/TalentData.js";
import PomTerritorySystem from "./clientFunc/PomTerritorySystem.js";
export default class PomClient extends ExGameClient {
    // net;
    constructor(server, id, player) {
        super(server, id, player);
        this.gameControllers = [];
        this.enchantSystem = new PomEnchantSystem(this);
        this.talentSystem = new PomTalentSystem(this);
        this.magicSystem = new PomMagicSystem(this);
        this.itemUseFunc = new SimpleItemUseFunc(this);
        this.ruinsSystem = new PomDimRuinsSystem(this);
        this.taskSystem = new PomTaskSystem(this);
        this.interactSystem = new PomInteractSystem(this);
        this.territorySystem = new PomTerritorySystem(this);
        this.globalSettings = new GlobalSettings(new Objective("wpsetting"));
        this.cache = new ExPropCache(this.getDynamicPropertyManager());
        this.looper = ExSystem.tickTask(() => {
            this.cache.save();
        });
        this.looper.delay(10 * 20);
        this.looper.start();
        this.data = this.cache.get(new PomClientData());
        if (!this.globalSettings.ownerExists) {
            player.addTag("owner");
            this.globalSettings.ownerExists = true;
        }
        this.addCtrller(this.enchantSystem);
        this.addCtrller(this.magicSystem);
        this.addCtrller(this.talentSystem);
        this.addCtrller(this.itemUseFunc);
        this.addCtrller(this.ruinsSystem);
        this.addCtrller(this.taskSystem);
        this.addCtrller(this.interactSystem);
        this.addCtrller(this.territorySystem);
        if (!this.data.pointRecord) {
            this.data.pointRecord = {
                deathPoint: [],
                point: []
            };
        }
        if (!this.data.talent)
            this.data.talent = new TalentData();
        if (!this.data.tasks) {
            this.data.tasks = {
                daily: {
                    complete: [[], [], [], []],
                    all: [[], [], [], []],
                    date: "1970-2-31",
                    cache: {}
                },
                progress: {
                    complete: [],
                    data: {}
                }
            };
        }
        if (!this.data.socialList) {
            this.data.socialList = {
                refuseList: [],
                acceptList: []
            };
        }
        if (!this.data.territory) {
            this.data.territory = {
                data: []
            };
        }
        if (!this.data.redemptionCode) {
            this.data.redemptionCode = {};
        }
        if (!this.data.uiCustomSetting || !this.data.uiCustomSetting.accuracyCustom) {
            this.data.uiCustomSetting = {
                topLeftMessageBarStyle: 0,
                topLeftMessageBarLayer1: 100,
                topLeftMessageBarLayer2: 100,
                topLeftMessageBarLayer3: 100,
                topLeftMessageBarLayer4: 100,
                topLeftMessageBarLayer5: 100,
                accuracyCustom: 60
            };
        }
        if (!this.data.gamePreferrence) {
            this.data.gamePreferrence = {
                chainMining: true
            };
        }
        this.gameControllers.forEach(controller => {
            eventDecoratorFactory(this.getEvents(), controller);
            controller.onJoin();
        });
        // this.net = new NeuralNetwork<{a:number,b:number},{c:number}>();
    }
    onJoin() {
        this.setInterworkingPool({
            setSkyBox: () => __awaiter(this, void 0, void 0, function* () {
                // process in client
            })
        });
    }
    addCtrller(system) {
        this.gameControllers.push(system);
    }
    getLang() {
        var _a;
        return lang[(_a = this.data.lang) !== null && _a !== void 0 ? _a : "en"];
    }
    onLoad() {
        let scores = ExPlayer.getInstance(this.player).getScoresManager();
        this.gameId = scores.getScore("wbldid");
        if (this.gameId === 0) {
            this.gameId = Math.floor(Math.random() * Random.MAX_VALUE);
            scores.setScore("wbldid", this.gameId);
        }
        if (this.data.socialList.acceptList.filter(e => e[0] === this.gameId).length === 0) {
            this.data.socialList.acceptList.push([this.gameId, this.playerName]);
        }
        this.territorySystem.updateGlobalList();
        this.gameControllers.forEach(controller => controller.onLoad());
        if (!this.data.lang) {
            this.exPlayer.runCommandAsync("mojang nmsl").catch((e) => {
                if (ExSystem.hasChineseCharacter(JSON.stringify(e))) {
                    this.data.lang = "zh";
                }
                else {
                    this.data.lang = "en";
                }
            });
        }
        if (!this.data.licenseRead) {
            this.licenseLooper = ExSystem.tickTask(() => {
                var _a;
                new WarningAlertUI(this, POMLICENSE, [["同意并继续", (c, ui) => {
                            var _a;
                            this.data.licenseRead = true;
                            (_a = this.licenseLooper) === null || _a === void 0 ? void 0 : _a.stop();
                        }]]).showPage();
                if (this.data.licenseRead)
                    (_a = this.licenseLooper) === null || _a === void 0 ? void 0 : _a.stop();
            }).delay(2 * 20);
            this.licenseLooper.start();
        }
        if (this.player.hasTag("wbmsyh")) {
            this.player.nameTag = "§a" + this.player.nameTag;
        }
        else {
            this.player.nameTag = "§c" + this.player.nameTag;
        }
        this.exPlayer.command.run([
            "execute as @s[tag=!wbyzc] at @s run scoreboard players set @s wbdj 0",
            "execute as @s[tag=!wbyzc] at @s run give @s wb:power 1 0 {\"minecraft:keep_on_death\":{}}",
            "execute as @s[tag=!wbyzc] at @s run scoreboard players set @s wbcsjs -1",
            //wbldid
            "execute as @s[tag=!wbyzc] at @s run scoreboard players set @s wbldpd 0",
            "execute as @s[tag=!wbyzc] at @s run scoreboard players set @s wbldcg 0",
            "execute as @s[tag=!wbyzc] at @s run scoreboard players set @s wbfl 200",
            "execute as @s[tag=!wbyzc] at @s run scoreboard players set @s wbwqlq 0",
            "execute as @s[tag=!wbyzc] at @s run scoreboard players set @s wbkjlqcg 0",
            "execute as @s[tag=!wbyzc] at @s run scoreboard players set @s wbwqlqjs 100",
            "tag @s[scores={wbdj=-100..}] add wbyzc",
        ]);
    }
    onLeave() {
        var _a;
        this.gameControllers.forEach(controller => controller.onLeave());
        this.looper.stop();
        (_a = this.licenseLooper) === null || _a === void 0 ? void 0 : _a.stop();
        super.onLeave();
    }
    getPlayersAndIds() {
        let arr = [];
        for (let i of this.getServer().getClients()) {
            arr.push([i.player, i.gameId]);
        }
        return arr;
    }
    sayTo(str, p = this.player) {
        p.sendMessage({ "rawtext": [{ "text": str }] });
        // p.runCommandAsync(`tellraw @s {"rawtext": [{"text": "${str}"}]}`);
    }
    getServer() {
        return super.getServer();
    }
    getGlobalData() {
        return this.getServer().data;
    }
    getDifficulty() {
        return (pomDifficultyMap).get(this.globalSettings.gameDifficulty + "");
    }
    taskUI(page, subpage) {
        this.taskSystem.show(page, subpage);
    }
    progressTaskFinish(name, damage) {
        this.taskSystem.progressTaskFinish(name, damage);
    }
    chooseArmor(a) {
        this.talentSystem.chooseArmor(a);
    }
}
__decorate([
    receiveMessage("taskUi"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], PomClient.prototype, "taskUI", null);
__decorate([
    receiveMessage("progressTaskFinish"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", void 0)
], PomClient.prototype, "progressTaskFinish", null);
__decorate([
    receiveMessage("chooseArmor"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ArmorData]),
    __metadata("design:returntype", void 0)
], PomClient.prototype, "chooseArmor", null);
//# sourceMappingURL=PomClient.js.map