import ExGameServer from "../modules/exmc/server/ExGameServer.js";
import CustomClient from "./CustomClient.js";
export default class CustomServer extends ExGameServer {
    constructor(config) {
        super(config);
    }
    newClient(id, player) {
        return new CustomClient(this, id, player);
    }
}
//# sourceMappingURL=CustomServer.js.map