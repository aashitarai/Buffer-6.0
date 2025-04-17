var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export default class D1RestClient {
    constructor({ baseUrl, headers = {}, fetch: customFetch }) {
        this.baseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
        this.headers = headers;
        this.fetch = customFetch !== null && customFetch !== void 0 ? customFetch : fetch.bind(window);
    }
    table(tableName) {
        const url = new URL(`${this.baseUrl}/tables/${tableName}`);
        return new D1QueryBuilder(url, { headers: this.headers, fetch: this.fetch });
    }
}
class D1QueryBuilder {
    constructor(url, { headers = {}, fetch }) {
        this.url = url;
        this.headers = headers;
        this.fetch = fetch;
    }
    select(query = "*") {
        this.url.searchParams.set("select", query);
        return new D1FilterBuilder({
            url: this.url,
            headers: this.headers,
            fetch: this.fetch,
            method: "GET"
        });
    }
    insert(values) {
        return new D1FilterBuilder({
            url: this.url,
            headers: this.headers,
            fetch: this.fetch,
            method: "POST",
            body: values
        });
    }
    update(values) {
        return new D1FilterBuilder({
            url: this.url,
            headers: this.headers,
            fetch: this.fetch,
            method: "PATCH",
            body: { data: values }
        });
    }
    delete() {
        return new D1FilterBuilder({
            url: this.url,
            headers: this.headers,
            fetch: this.fetch,
            method: "DELETE"
        });
    }
}
class D1FilterBuilder {
    constructor({ url, headers, fetch, method, body }) {
        this.url = new URL(url.toString());
        this.headers = Object.assign({}, headers);
        if (method !== "GET") {
            if (this.headers instanceof Headers)
                this.headers.set("Content-Type", "application/json");
            else if (Array.isArray(this.headers))
                this.headers.push(["Content-Type", "application/json"]);
            else
                this.headers["Content-Type"] = "application/json";
        }
        this.fetch = fetch;
        this.method = method;
        this.body = body;
    }
    eq(column, value) {
        this.url.searchParams.append(column, `eq.${value}`);
        return this;
    }
    neq(column, value) {
        this.url.searchParams.append(column, `neq.${value}`);
        return this;
    }
    gt(column, value) {
        this.url.searchParams.append(column, `gt.${value}`);
        return this;
    }
    lt(column, value) {
        this.url.searchParams.append(column, `lt.${value}`);
        return this;
    }
    like(column, pattern) {
        this.url.searchParams.append(column, `like.${pattern}`);
        return this;
    }
    in(column, values) {
        this.url.searchParams.append(column, `in.(${values.join(",")})`);
        return this;
    }
    order(column, { ascending = true } = {}) {
        this.url.searchParams.append("order", `${column}.${ascending ? "asc" : "desc"}`);
        return this;
    }
    limit(count) {
        this.url.searchParams.append("limit", count.toString());
        return this;
    }
    offset(count) {
        this.url.searchParams.append("offset", count.toString());
        return this;
    }
    select(query = "*") {
        this.url.searchParams.set("select", query);
        return this;
    }
    then(resolve, reject) {
        return this.fetch(this.url.toString(), {
            method: this.method,
            headers: this.headers,
            credentials: "include",
            body: this.body ? JSON.stringify(this.body) : undefined
        })
            .then((res) => __awaiter(this, void 0, void 0, function* () {
            if (!res.ok)
                throw new Error(yield res.text());
            else if (res.status === 204)
                return [];
            return res.json();
        }))
            .then(resolve, reject);
    }
}
//# sourceMappingURL=d1.js.map