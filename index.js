"use strict";

const { canonicalize, sign } = require('simple-hmac-auth');
const url = require('url');
const qs = require("qs");

module.exports.templateTags = [
    {
        name: "hmac",
        displayName: "HMAC",
        description: "Apply HMAC to a value",
        args: [
            {
                displayName: "Algorithm",
                type: "enum",
                options: [
                    { displayName: "MD5", value: "md5" },
                    { displayName: "SHA1", value: "sha1" },
                    { displayName: "SHA256", value: "sha256" },
                    { displayName: "SHA512", value: "sha512" },
                ],
            },
            {
                displayName: "Digest Encoding",
                description: "The encoding of the output",
                type: "enum",
                options: [
                    { displayName: "Hexadecimal", value: "hex" },
                    { displayName: "Latin", value: "latin1" },
                    { displayName: "Base64", value: "base64" },
                ],
            },
            {
                displayName: "Key",
                type: "string",
                placeholder: "HMAC Secret Key",
            },
            {
                displayName: "Identifier",
                type: "string",
                placeholder: "HMAC Prefix",
            }
        ],
        async run(
            context,
            algorithm,
            encoding,
            key = "",
            identifier = "",
        ) {
            const { meta } = context;
            if (
                encoding !== "hex" &&
                encoding !== "latin1" &&
                encoding !== "base64"
            ) {
                throw new Error(
                    `Invalid encoding ${encoding}. Choices are hex, latin1, base64`
                );
            }
            const request = await context.util.models.request.getById(
                meta.requestId
            );
            const renderedUrl = await context.util.render(request.url);
            const requestURL = url.parse(renderedUrl);
            const data = request.body.text;
            if (request.body.mimeType === 'multipart/form-data') {
                context.app.alert('Whoops: it\'s not you, it\'s me', 'HMAC-signing does not support multipart requests for now');
                return;
            }

            // Only sign these headers
            const headerWhitelist = [
                'authorization',
                'date',
                'content-length',
                'content-type'
            ];
            const renderedHeaders = {};
            const headersEnabled = request.headers.filter((header) => !header.disabled)

            for (const header of headersEnabled) {
                const headerName = (await context.util.render(header.name)).toLowerCase();
                if (!headerWhitelist.includes(headerName)) {
                    continue;
                }
                renderedHeaders[headerName] = await context.util.render(header.value);
            }

            if (!renderedHeaders['content-length']) {
                const contentLength = data ? data.length : 0;
                if (contentLength > 0) {
                    renderedHeaders['content-length'] = contentLength;
                }
            }

            let queryString = '';

            if (request.parameters && request.parameters.length > 0) {
                const enabledParams = request.parameters.filter((param) => !param.disabled)
                const valuesRendered = await Promise.all(
                    enabledParams.map((param) => context.util.render(param.value))
                );
                const paramsRendered = {};
                enabledParams.forEach((param, index) => {
                    paramsRendered[param.name] = valuesRendered[index];
                })
                queryString = qs.stringify(paramsRendered, { encode: true });

            }

            const canonical = canonicalize(request.method, requestURL.pathname, queryString, renderedHeaders, data);
            const signature = sign(canonical, key, algorithm);

            return `${identifier} ${algorithm} ${signature}`;
        },
    },
];