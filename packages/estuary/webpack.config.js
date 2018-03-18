module.exports = {
    entry: "./dev/demo.ts",
    output: {
        path: __dirname,
        filename: "bundle.js"
    },
    resolve: {
        extensions: [".ts", ".js"]
    },
    module: {
        loaders: [{ test: /\.ts$/, loader: "ts-loader" }]
    },
    node: {
        process: false,
        setImmediate: false
    }
};
