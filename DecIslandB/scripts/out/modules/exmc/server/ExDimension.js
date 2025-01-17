import { MolangVariableMap, BlockTypes } from '@minecraft/server';
import ExGameConfig from './ExGameConfig.js';
import ExCommand from './env/ExCommand.js';
import { ignorn } from './ExErrorQueue.js';
export default class ExDimension {
    spawnParticle(p, v, varMap = new MolangVariableMap()) {
        try {
            (this._dimension.spawnParticle(p, v, varMap));
            return true;
        }
        catch (e) {
            return false;
        }
    }
    createExplosion(location, radius, explosionOptions) {
        this._dimension.createExplosion(location, radius, explosionOptions);
    }
    get dimension() {
        return this._dimension;
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
            if (entity && entity.dimension == this._dimension)
                res.push(entity);
        }
        return res;
    }
    getBlock(vec) {
        return ignorn(() => this._dimension.getBlock(vec));
    }
    // fillBlocks(start: IVector3, end: IVector3, blockId: string | BlockType, option?: BlockFillOptions) {
    //     // console.warn("fillBlocks", start, end, blockId);
    //     if (typeof blockId === "string") blockId = <BlockType>BlockTypes.get(blockId);
    //     this.dimension.fillBlocks(start, end, blockId, option);
    //     //b?.permutation;
    // }
    setBlock(vec, blockId) {
        if (typeof blockId === "string")
            blockId = BlockTypes.get(blockId);
        let b = this.dimension.setBlockType(vec, blockId);
    }
    setBlockAsync(vec, blockId) {
        this.runCommandAsync(`setBlock ${vec.x} ${vec.y} ${vec.z} ${blockId}`);
    }
    digBlock(vec) {
        try {
            this.command.run(`setBlock ${vec.x} ${vec.y} ${vec.z} air [] destroy`);
            return true;
        }
        catch (e) {
            return false;
        }
    }
    spawnItem(item, v) {
        try {
            return this._dimension.spawnItem(item, v);
        }
        catch (error) {
            ExGameConfig.console.warn(error);
            return undefined;
        }
        ;
    }
    spawnEntity(id, v, options) {
        try {
            return this._dimension.spawnEntity(id, v, options);
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