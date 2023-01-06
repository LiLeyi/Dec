import { MolangVariableMap } from '@minecraft/server';
import Vector3 from "../math/Vector3.js";
import ExGameConfig from './ExGameConfig.js';
import ExGameVector3 from './math/ExGameVector3.js';
import ExCommand from './env/ExCommand.js';
export default class ExDimension {
    spawnParticle(p, v) {
        this._dimension.spawnParticle(p, ExGameVector3.getLocation(v), new MolangVariableMap());
    }
    createExplosion(location, radius, explosionOptions) {
        //console.warn(location, radius, explosionOptions);
        this._dimension.createExplosion(ExGameVector3.getLocation(location), radius, explosionOptions);
    }
    constructor(dimension) {
        this.command = new ExCommand(this);
        this._dimension = dimension;
    }
    getPlayers(entityQueryOptions) {
        return this._dimension.getPlayers(entityQueryOptions);
    }
    getEntities(entityQueryOptions) {
        let entities = this._dimension.getEntities(entityQueryOptions);
        let res = [];
        for (let entity of entities) {
            if (entity.dimension === this._dimension)
                res.push(entity);
        }
        return res;
    }
    getBlock(vec) {
        return this._dimension.getBlock(vec instanceof Vector3 ? ExGameVector3.getBlockLocation(vec) : vec);
    }
    setBlock(vec, blockId, data = 0) {
        if (typeof blockId === "string")
            this.command.run(`setBlock ${vec.x} ${vec.y} ${vec.z} ${blockId} ${data}`);
        //.then((e) => ExGameConfig.console.log(e))
        //.catch((e) => ExGameConfig.console.log(e));
        else {
            let b = this.getBlock(vec);
            b === null || b === void 0 ? void 0 : b.setType(blockId);
            //b?.permutation;
        }
        ;
    }
    setBlockAsync(vec, blockId) {
        this.runCommandAsync(`setBlock ${vec.x} ${vec.y} ${vec.z} ${blockId}`);
    }
    digBlock(vec) {
        try {
            this.command.run(`setBlock ${vec.x} ${vec.y} ${vec.z} air 0 destroy`);
            return true;
        }
        catch (e) {
            return false;
        }
    }
    spawnItem(item, v) {
        try {
            return this._dimension.spawnItem(item, ExGameVector3.getBlockLocation(v));
        }
        catch (error) {
            ExGameConfig.console.warn(error);
            return undefined;
        }
        ;
    }
    spawnEntity(id, v) {
        try {
            return this._dimension.spawnEntity(id, ExGameVector3.getBlockLocation(v));
        }
        catch (error) {
            ExGameConfig.console.warn(error);
            return undefined;
        }
    }
    runCommandAsync(str) {
        return this._dimension.runCommandAsync(str);
    }
    static getInstance(source) {
        let dimension = source;
        if (this.propertyNameCache in dimension) {
            return dimension[this.propertyNameCache];
        }
        return (dimension[this.propertyNameCache] = new ExDimension(dimension));
    }
}
ExDimension.propertyNameCache = "exCache";
//# sourceMappingURL=ExDimension.js.map