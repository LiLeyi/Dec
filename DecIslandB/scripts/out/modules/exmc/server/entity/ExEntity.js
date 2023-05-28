var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { EntityHealthComponent, EntityVariantComponent, EntityMarkVariantComponent, EntityIsBabyComponent, EntityIsChargedComponent, EntityDamageCause, EquipmentSlot } from '@minecraft/server';
import ExScoresManager from './ExScoresManager.js';
import Vector3 from '../../math/Vector3.js';
import ExEntityBag from './ExEntityBag.js';
import ExCommand from '../env/ExCommand.js';
import ExDimension from '../ExDimension.js';
export default class ExEntity {
    damage(d, source) {
        this.entity.applyDamage(d, source);
    }
    causeDamageTo(e, d) {
        if (e instanceof ExEntity)
            e = e.entity;
        e.applyDamage(d, {
            "cause": EntityDamageCause.entityAttack,
            "damagingEntity": this.entity
        });
    }
    getPreRemoveHealth() {
        return this._damage;
    }
    removeHealth(timeout, damage) {
        if (this._damage === undefined) {
            this._damage = damage;
            timeout.setTimeout(() => {
                var _a;
                let health = this.getHealthComponent();
                if (health.current > 0.5)
                    health.setCurrent(Math.max(0.5, health.current - ((_a = this._damage) !== null && _a !== void 0 ? _a : 0)));
                this._damage = undefined;
            }, 0);
        }
        else {
            this._damage += damage;
        }
    }
    addHealth(timeout, n) {
        this.removeHealth(timeout, -n);
    }
    get nameTag() {
        return this._entity.nameTag;
    }
    set nameTag(value) {
        this._entity.nameTag = value;
    }
    get entity() {
        return this._entity;
    }
    set entity(value) {
        this._entity = value;
    }
    constructor(entity) {
        this.command = new ExCommand(this);
        this._entity = entity;
        if (ExEntity.propertyNameCache in entity) {
            throw new Error("Already have a instance in entity.please use ExEntity.getInstance to get it.");
        }
        else {
            Reflect.set(entity, ExEntity.propertyNameCache, this);
        }
    }
    static getInstance(source) {
        let entity = source;
        if (this.propertyNameCache in entity) {
            return Reflect.get(entity, this.propertyNameCache);
        }
        return (new ExEntity(entity));
    }
    getDimension() {
        return this._entity.dimension;
    }
    getExDimension() {
        return ExDimension.getInstance(this.getDimension());
    }
    addTag(str) {
        this._entity.addTag(str);
        return str;
    }
    getTags() {
        return this._entity.getTags();
    }
    hasTag(str) {
        return this._entity.hasTag(str);
    }
    removeTag(str) {
        this._entity.removeTag(str);
        return str;
    }
    runCommandAsync(str) {
        return this._entity.runCommandAsync(str);
    }
    detectArmor(head, chest, legs, boots) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            const bag = this.getBag();
            return ((_a = bag.getEquipment(EquipmentSlot.head)) === null || _a === void 0 ? void 0 : _a.typeId) == head &&
                ((_b = bag.getEquipment(EquipmentSlot.chest)) === null || _b === void 0 ? void 0 : _b.typeId) == chest &&
                ((_c = bag.getEquipment(EquipmentSlot.legs)) === null || _c === void 0 ? void 0 : _c.typeId) == legs &&
                ((_d = bag.getEquipment(EquipmentSlot.feet)) === null || _d === void 0 ? void 0 : _d.typeId) == boots;
        });
    }
    getScoresManager() {
        return new ExScoresManager(this._entity);
    }
    triggerEvent(name) {
        this._entity.triggerEvent(name);
    }
    getPosition() {
        return new Vector3(this.entity.location);
    }
    getRotation() {
        return this.entity.getRotation();
    }
    setPosition(position, dimension = this.entity.dimension) {
        let rot = this.getRotation();
        this.entity.teleport(position, dimension, rot.x, rot.y);
    }
    setDimension(dimension) {
        this.setPosition(this.getPosition(), dimension);
    }
    getViewDirection() {
        return new Vector3(this.entity.getViewDirection());
    }
    hasComponent(name) {
        return this._entity.hasComponent(name);
    }
    getComponent(name) {
        return this._entity.getComponent(name);
    }
    hasHealthComponent() {
        return this.hasComponent(EntityHealthComponent.componentId);
    }
    getHealthComponent() {
        return this.getComponent(EntityHealthComponent.componentId);
    }
    getHealth() {
        return this.getHealthComponent().current;
    }
    getMaxHealth() {
        return this.getHealthComponent().value;
    }
    getBag() {
        return new ExEntityBag(this);
    }
    hasVariantComponent() {
        return this.hasComponent(EntityVariantComponent.componentId);
    }
    getVariantComponent() {
        return this.getComponent(EntityVariantComponent.componentId);
    }
    getVariant() {
        var _a, _b;
        return (_b = (_a = this.getVariantComponent()) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : 0;
    }
    hasMarkVariantComponent() {
        return this.hasComponent(EntityMarkVariantComponent.componentId);
    }
    getMarkVariantComponent() {
        return this.getComponent(EntityMarkVariantComponent.componentId);
    }
    getMarkVariant() {
        var _a, _b;
        return (_b = (_a = this.getMarkVariantComponent()) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : 0;
    }
    hasIsBabyComponent() {
        return this.hasComponent(EntityIsBabyComponent.componentId);
    }
    hasIsChargedComponent() {
        return this.hasComponent(EntityIsChargedComponent.componentId);
    }
}
ExEntity.propertyNameCache = "exCache";
//# sourceMappingURL=ExEntity.js.map