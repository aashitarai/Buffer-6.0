import FineAIClient from "./ai";
import D1RestClient from "./d1";
import { createAuthClient } from "better-auth/react";
export class FineClient extends D1RestClient {
    constructor(config) {
        const d1RestUrl = typeof config === "string" ? config + "/db" : config.restUrl;
        super({ baseUrl: d1RestUrl });
        const authUrl = typeof config === "string" ? config + "/auth" : config.authUrl;
        this.auth = createAuthClient({ baseURL: authUrl });
        const aiUrl = typeof config === "string" ? config + "/ai" : config.aiUrl;
        this.ai = new FineAIClient({ baseUrl: aiUrl });
    }
}
//# sourceMappingURL=index.js.map