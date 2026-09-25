"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const test = require("node:test");
const vm = require("node:vm");

function loadApi() {
    const source = fs.readFileSync(new URL("../Main", `file://${__dirname}/`), "utf8");
    const sandbox = {
        URL,
        console,
        navigator: { language: "en-US" },
        window: { location: { hostname: "example.test" } },
        document: { baseURI: "https://example.test/gallery/" },
        GM_registerMenuCommand() {},
        __RIS_ENABLE_TEST_API__: true,
    };
    sandbox.globalThis = sandbox;
    vm.runInNewContext(source, sandbox, { filename: "Main" });
    return sandbox.__RIS_TEST_API__;
}

const api = loadApi();

test("normalizes absolute and page-relative HTTP image URLs", () => {
    assert.equal(api.normalizeImageUrl(" https://images.example/a b.png "), "https://images.example/a%20b.png");
    assert.equal(api.normalizeImageUrl("../photo.jpg"), "https://example.test/photo.jpg");
});

test("rejects active, local, malformed, and empty URL inputs", () => {
    for (const input of ["javascript:alert(1)", "data:image/png;base64,AA", "file:///tmp/a.png", "http://[", ""]) {
        assert.equal(api.normalizeImageUrl(input), "");
    }
});

test("accepts only non-empty image files within the upload limit", () => {
    assert.equal(api.isValidImageFile({ type: "image/png", size: 1 }), true);
    assert.equal(api.isValidImageFile({ type: "image/jpeg", size: 20 * 1024 * 1024 }), true);
    assert.equal(api.isValidImageFile({ type: "text/html", size: 100 }), false);
    assert.equal(api.isValidImageFile({ type: "image/png", size: 0 }), false);
    assert.equal(api.isValidImageFile({ type: "image/png", size: 20 * 1024 * 1024 + 1 }), false);
    assert.equal(api.isValidImageFile(null), false);
});

test("clamps menu dimensions to minimum and viewport bounds", () => {
    assert.deepEqual(
        { ...api.clampMenuSize(50, 900, 600, 500) },
        { width: 180, height: 500 },
    );
});
