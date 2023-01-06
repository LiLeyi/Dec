import ExGameConfig from "../ExGameConfig.js";
export default class LoreUtil {
    append(str) {
        let i = this.getLore();
        i.push(str);
        this.setLore(i);
    }
    insert(index, str) {
        let i = this.getLore();
        i.splice(index, 0, str);
        this.setLore(i);
    }
    getLore() {
        return this.item.getLore();
    }
    setLore(lore) {
        this.item.setLore(lore);
    }
    constructor(item) {
        this.item = item;
        this.defFlag = LoreUtil.LoreFlag.DEFAULT;
    }
    setFlag(flag) {
        this.defFlag = flag;
    }
    search(key) {
        let lore = this.getLore();
        for (let i = 0; i < lore.length; i++) {
            if (lore[i].startsWith(key + " : ")) {
                return new Piece(this.item, i);
            }
        }
        return null;
    }
    get() {
        let index = 0;
        if (arguments.length < 1) {
            throw new Error("Illegal parameter");
        }
        let flag = arguments[index];
        if (typeof (flag) !== "number") {
            flag = this.defFlag;
        }
        else {
            index++;
        }
        if (flag == LoreUtil.LoreFlag.DEFAULT) {
            if (arguments.length > index + 1)
                ExGameConfig.console.warn("Exceeded parameter length. Maybe you didn't mean that?");
            return this.getValueUseDefault(arguments[index]);
        }
        else if (flag == LoreUtil.LoreFlag.TAG) {
            if (arguments.length > index + 1)
                ExGameConfig.console.warn("Exceeded parameter length. Maybe you didn't mean that?");
            return this.hasTag(arguments[index]);
        }
        else if (flag == LoreUtil.LoreFlag.REPEAT) {
            if (arguments.length > index + 1)
                ExGameConfig.console.warn("Exceeded parameter length. Maybe you didn't mean that?");
            return this.getValueUseRepeat(arguments[index]);
        }
        else if (flag == LoreUtil.LoreFlag.MAP) {
            if (arguments.length > index + 2)
                ExGameConfig.console.warn("Exceeded parameter length. Maybe you didn't mean that?");
            return this.getValueUseMap(arguments[index], arguments[index + 1]);
        }
    }
    getValueUseDefault(key) {
        let piece = this.search(key);
        if (piece == null)
            return null;
        // key : value
        return piece.get().substring(key.length + 3);
    }
    hasTag(key) {
        if (key == null)
            throw new Error("Key cannot be empty");
        let lore = this.getLore();
        for (let i in lore) {
            if (lore[i] == key)
                return true;
        }
        return false;
    }
    getValueUseRepeat(key) {
        let value = this.getValueUseDefault(key);
        if (value == null)
            return 0;
        return value.length;
    }
    getValueUseMap(key, use) {
        let tab = "  ";
        let piece = this.search(key);
        if (piece == null)
            return null;
        while (piece.hasNext()) {
            piece.next();
            if (piece.get().startsWith(tab)) {
                if (piece.get().startsWith(tab + use + " : ")) {
                    return piece.get().substring(tab.length + 3 + use.length);
                }
            }
            else {
                break;
            }
        }
        return null;
    }
    set() {
        let index = 0;
        if (arguments.length < 1) {
            throw new Error("Illegal parameter");
        }
        let flag = arguments[index];
        if (typeof (flag) !== "number") {
            flag = this.defFlag;
        }
        else {
            index++;
        }
        if (flag == LoreUtil.LoreFlag.DEFAULT) {
            if (arguments.length > index + 2)
                ExGameConfig.console.warn("Exceeded parameter length. Maybe you didn't mean that?");
            return this.setValueUseDefault(arguments[index], arguments[index + 1]);
        }
        else if (flag == LoreUtil.LoreFlag.TAG) {
            if (arguments.length > index + 1)
                ExGameConfig.console.warn("Exceeded parameter length. Maybe you didn't mean that?");
            return this.setTag(arguments[index]);
        }
        else if (flag == LoreUtil.LoreFlag.REPEAT) {
            if (arguments.length > index + 3)
                ExGameConfig.console.warn("Exceeded parameter length. Maybe you didn't mean that?");
            return this.setValueUseRepeat(arguments[index], arguments[index + 1], arguments[index + 2]);
        }
        else if (flag == LoreUtil.LoreFlag.MAP) {
            if (arguments.length > index + 3)
                ExGameConfig.console.warn("Exceeded parameter length. Maybe you didn't mean that?");
            return this.setValueUseMap(arguments[index], arguments[index + 1], arguments[index + 2]);
        }
    }
    setValueUseDefault(key, value) {
        let piece = this.search(key);
        if (piece == null) {
            this.append(key + " : " + value);
            return;
        }
        // key : value
        piece.revise(key + " : " + value).set();
    }
    setTag(key) {
        if (key == null)
            throw new Error("Key cannot be empty");
        if (this.hasTag(key))
            return;
        this.append(key);
    }
    setValueUseRepeat(key, value, num) {
        if (value == null || num == null)
            throw new Error("Empty parameter");
        this.setValueUseDefault(key, new Array(num).fill(value).join(""));
    }
    *entries(key) {
        if (key) {
            let tab = "  ";
            let piece = this.search(key);
            if (piece == null) {
                return;
            }
            while (piece.hasNext()) {
                piece.next();
                if (piece.get().startsWith(tab)) {
                    yield [...piece.get().trim().split(" : ")];
                }
                else {
                    break;
                }
            }
            return;
        }
        else {
            for (let i of this.getLore()) {
                yield [...i.trim().split(" : ")];
            }
            return;
        }
    }
    setValueUseMap(key, use, value) {
        let tab = "  ";
        let piece = this.search(key);
        if (piece == null) {
            this.append(key + " : ");
            this.append(tab + use + " : " + value);
            return;
        }
        while (piece.hasNext()) {
            piece.next();
            if (piece.get().startsWith(tab)) {
                if (piece.get().startsWith(tab + use + " : ")) {
                    piece.revise(tab + use + " : " + value).set();
                    return;
                }
            }
            else {
                break;
            }
        }
        piece = this.search(key);
        if (piece == null) {
            ExGameConfig.console.error("Could not find " + key + " : " + value + " in lore");
            return;
        }
        this.insert(piece.index + 1, tab + use + " : " + value);
    }
    delete(key) {
        let tab = "  ";
        let piece = this.search(key);
        if (piece == null) {
            return;
        }
        let l = 1;
        let i = piece.index;
        while (piece.hasNext()) {
            piece.next();
            if (piece.get().startsWith(tab)) {
                l++;
            }
            else {
                break;
            }
        }
        let res = this.getLore();
        res.splice(i, l);
        this.setLore(res);
    }
}
LoreUtil.LoreFlag = {
    DEFAULT: 0,
    TAG: 1,
    REPEAT: 2,
    MAP: 3
};
export class Piece {
    constructor(item, index) {
        this.item = item;
        this.lore = item.getLore();
        this.index = index;
    }
    set() {
        this.item.setLore(this.lore);
    }
    revise(str) {
        this.lore[this.index] = str;
        return this;
    }
    get() {
        return this.lore[this.index];
    }
    hasNext() {
        return this.index + 1 < this.lore.length;
    }
    next() {
        this.index++;
    }
}
//# sourceMappingURL=ExLoreUtil.js.map