import UUID from "../../../../modules/exmc/utils/UUID.js";
import { GameMode } from '@minecraft/server';
import { ignorn } from "../../../../modules/exmc/server/ExErrorQueue.js";
import VarOnChangeListener from '../../../../modules/exmc/utils/VarOnChangeListener.js';
import { MinecraftEffectTypes } from "../../../../modules/vanilla-data/lib/index.js";
export default class PomBossBarrier {
    particle(arg0) {
        this.dim.spawnParticle(arg0, this.center);
    }
    static find(startPos) {
        for (let [k, v] of this.map) {
            if (v.area.contains(startPos)) {
                return v;
            }
        }
    }
    setBoss(e) {
        this.boss = e;
    }
    static isInBarrier(e) {
        return PomBossBarrier.find(e.location) !== undefined;
    }
    constructor(server, dim, area, boss) {
        this.deathTimes = 0;
        this.fogListener = new VarOnChangeListener((n, l) => {
            this.clearFog();
            this.fog = n;
        }, "");
        this.players = new Map();
        this.area = area;
        this.center = area.center();
        this.id = UUID.randomUUID();
        PomBossBarrier.map.set(this.id, this);
        this.dim = dim;
        for (let e of dim.getPlayers()) {
            if (area.contains(e.location)) {
                this.players.set(e, true);
                let c = server.findClientByPlayer(e);
                if (c) {
                    c.ruinsSystem.barrier = this;
                }
            }
        }
        this.tickEvent = this.update.bind(this);
        this.server = server;
        this.manager = server.getEvents();
        this.manager.register("onLongTick", this.tickEvent);
        this.boss = boss;
    }
    dispose() {
        PomBossBarrier.map.delete(this.id);
        this.manager.cancel("onLongTick", this.tickEvent);
        for (let c of this.clientsByPlayer()) {
            c.ruinsSystem.causeDamageShow = false;
            c.ruinsSystem.barrier = undefined;
        }
        for (let c of this.server.getExPlayers()) {
            if (c.entity.getDynamicProperty('InBoundary') === this.id) {
                c.entity.setDynamicProperty('InBoundary', undefined);
                c.gameModeCode = c.getScoresManager().getScore("pre_gamemode");
            }
        }
    }
    *clientsByPlayer() {
        for (let e of this.players) {
            let c = this.server.findClientByPlayer(e[0]);
            if (c) {
                yield c;
            }
        }
    }
    *getPlayers() {
        for (let e of this.players) {
            if (e[0].isValid())
                yield e[0];
        }
    }
    notifyDeathAdd() {
        this.deathTimes += 1;
        for (let c of this.clientsByPlayer()) {
            c.ruinsSystem.deathTimes = this.deathTimes;
        }
        if (this.deathTimes >= 3) {
            this.boss.onFail();
        }
    }
    update() {
        this.dim.spawnParticle("wb:boss_barrier", this.center);
        for (let e of this.server.getExPlayers()) {
            if (!e.entity.location)
                continue;
            if (this.players.has(e.entity)) {
                if (!this.area.contains(e.entity.location)) {
                    if (this.players.get(e.entity)) {
                        // notUtillTask(this.server,() => ExPlayer.getInstance(e).getHealth()>0,()=>{
                        this.server.setTimeout(() => {
                            if (this.dim.dimension !== e.dimension) {
                                e.addEffect(MinecraftEffectTypes.Resistance, 15 * 20, 10, false);
                                e.addEffect(MinecraftEffectTypes.Weakness, 15 * 20, 10, false);
                            }
                            else {
                                e.addEffect(MinecraftEffectTypes.Resistance, 5 * 20, 10, false);
                                e.addEffect(MinecraftEffectTypes.Weakness, 5 * 20, 10, false);
                            }
                            e.setPosition(this.area.center(), this.dim.dimension);
                        }, 2000);
                        // });
                        this.players.set(e.entity, false);
                    }
                }
                else {
                    this.players.set(e.entity, true);
                }
            }
            else {
                if (this.area.contains(e.entity.location)) {
                    if (!e.entity.getDynamicProperty('InBoundary')) {
                        e.entity.setDynamicProperty('InBoundary', this.id);
                        e.getScoresManager().setScore("pre_gamemode", e.gameModeCode);
                        e.gamemode = GameMode.spectator;
                    }
                }
                else {
                    if (e.entity.getDynamicProperty('InBoundary') === this.id) {
                        e.entity.setDynamicProperty('InBoundary', undefined);
                        e.gameModeCode = e.getScoresManager().getScore("pre_gamemode");
                    }
                }
            }
        }
        if (ignorn(() => this.boss.entity.location) && !this.area.contains(this.boss.entity.location)) {
            this.boss.exEntity.setPosition(this.area.center());
        }
        if (this.fog)
            this.dim.command.run(`fog @a[x=${this.center.x},y=${this.center.y},z=${this.center.z},r=128] push ${this.fog} "ruin_fog"`);
    }
    stop() {
        this.clearFog();
        this.dispose();
    }
    clearFog() {
        this.dim.command.run(`fog @a[x=${this.center.x},y=${this.center.y},z=${this.center.z},r=128] remove "ruin_fog"`);
    }
    changeFog(name) {
        this.fogListener.upDate(name);
    }
}
PomBossBarrier.map = new Map();
//# sourceMappingURL=PomBossBarrier.js.map