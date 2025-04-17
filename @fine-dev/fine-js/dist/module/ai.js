var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
export default class FineAIClient {
    constructor({ baseUrl, headers, fetch: customFetch }) {
        this.config = {
            baseUrl: baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl,
            fetch(input, init) {
                if (!customFetch)
                    customFetch = fetch.bind(window);
                return customFetch(input, Object.assign(Object.assign({}, init), { headers, credentials: "include" }));
            }
        };
    }
    get threads() {
        return this.config.fetch(`${this.config.baseUrl}/threads`).then((response) => __awaiter(this, void 0, void 0, function* () {
            if (!response.ok)
                throw new Error(`Failed to fetch threads: ${yield response.text()}`);
            else
                return response
                    .json()
                    .then(({ data }) => data.map((t) => new FineAIThread(t.id, this.config, t)));
        }));
    }
    thread(threadId) {
        return new FineAIThread(threadId, this.config);
    }
    message(assistantId, content) {
        return new FineAIMessage(this.config, assistantId, content);
    }
}
class FineAIThread {
    constructor(id, config, threadData) {
        this.id = id;
        this.config = config;
        this.threadData = threadData;
    }
    get data() {
        var _a;
        return ((_a = this.threadData) !== null && _a !== void 0 ? _a : this.makeThreadRequest({ errorText: `Failed to fetch thread ${this.id}` }).then((result) => (this.threadData = result)));
    }
    get messages() {
        return this.makeThreadRequest({
            errorText: `Failed to fetch messages for thread ${this.id}`,
            endpoint: "/messages"
        }).then(({ data }) => data);
    }
    update(metadata) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.makeThreadRequest({
                errorText: `Failed to update thread ${this.id}`,
                method: "POST",
                body: JSON.stringify({ metadata })
            }).then((result) => (this.threadData = result));
        });
    }
    delete() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.makeThreadRequest({
                errorText: `Failed to delete thread ${this.id}`,
                method: "DELETE"
            }).then(() => (this.threadData = undefined));
        });
    }
    message(assistantId, content) {
        return new FineAIMessage(this.config, assistantId, content, this.id);
    }
    makeThreadRequest(_a) {
        var { errorText, endpoint } = _a, options = __rest(_a, ["errorText", "endpoint"]);
        return this.config
            .fetch(`${this.config.baseUrl}/threads/${this.id}${endpoint !== null && endpoint !== void 0 ? endpoint : ""}`, options)
            .then((response) => __awaiter(this, void 0, void 0, function* () {
            if (!response.ok)
                throw new Error(`${errorText}: ${yield response.text()}`);
            else
                return response.json();
        }))
            .catch((error) => {
            console.error(error);
            throw new Error(`${errorText}: ${error}`);
        });
    }
}
class FineAIMessage {
    constructor(config, assistantId, content, threadId) {
        this.config = config;
        this.assistantId = assistantId;
        this.threadId = threadId;
        if (typeof content === "string") {
            this.content = [{ type: "text", text: content }];
        }
        else if (!Array.isArray(content)) {
            this.content = [content];
        }
        else {
            this.content = content.map((c) => (typeof c === "string" ? { type: "text", text: c } : c));
        }
    }
    setMetadata(metadata) {
        this.metadata = metadata;
        return this;
    }
    send() {
        return this.config
            .fetch(`${this.config.baseUrl}/run`, {
            method: "POST",
            body: this.prepareBody(false)
        })
            .then((response) => __awaiter(this, void 0, void 0, function* () {
            if (!response.ok)
                throw new Error(`Failed to send message: ${yield response.text()}`);
            else
                return response.json();
        }));
    }
    stream(callback) {
        return __awaiter(this, void 0, void 0, function* () {
            let runId = "";
            try {
                const response = yield this.config.fetch(`${this.config.baseUrl}/run`, {
                    method: "POST",
                    body: this.prepareBody(true)
                });
                const reader = response.body.getReader();
                this.readStream(reader, (event) => {
                    if ("runId" in event)
                        runId = event.runId;
                    callback(event);
                });
                return reader;
            }
            catch (error) {
                callback({
                    type: "runError",
                    runId,
                    error: error instanceof Error ? error.message : typeof error === "string" ? error : JSON.stringify(error)
                });
                throw new Error(`Failed to send message stream: ${error}`);
            }
        });
    }
    prepareBody(stream) {
        return JSON.stringify({
            assistantId: this.assistantId,
            messages: [{ role: "user", content: this.content }],
            threadId: this.threadId,
            metadata: this.metadata,
            stream
        });
    }
    readStream(reader, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            const decoder = new TextDecoder("utf-8");
            let bufferedChunks = "";
            while (true) {
                const { value, done } = yield reader.read();
                if (done)
                    break;
                const str = decoder.decode(value);
                bufferedChunks += str;
                if (!bufferedChunks)
                    continue;
                const events = bufferedChunks.split("\n\n");
                for (let i = 0; i < events.length; i++) {
                    const event = events[i];
                    if (!event.trim())
                        continue;
                    const data = event.slice("data: ".length);
                    try {
                        const result = JSON.parse(data);
                        bufferedChunks = "";
                        callback(result);
                    }
                    catch (error) {
                        // Failed to parse JSON. This is probably an incomplete chunk, so we buffer it and wait for the next chunk
                        bufferedChunks = events.slice(i).join("\n\n");
                        continue;
                    }
                }
            }
        });
    }
}
//# sourceMappingURL=ai.js.map