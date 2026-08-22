const path = require('path');

module.exports = function (api) {
    api.cache(true);

    // If running inside the admin directory, resolve plugins/presets relative to admin/node_modules
    const isRunningAdmin = process.cwd().includes('admin') || 
                           __dirname.includes('admin') || 
                           (process.env.INIT_CWD && process.env.INIT_CWD.includes('admin'));

    if (isRunningAdmin) {
        const adminPath = path.resolve(__dirname, 'admin');
        const resolveAdmin = (pkg) => require.resolve(pkg, { paths: [adminPath] });

        return {
            presets: [
                [resolveAdmin("babel-preset-expo"), { jsxImportSource: "nativewind" }],
                resolveAdmin("nativewind/babel"),
            ],
            plugins: [
                resolveAdmin("react-native-reanimated/plugin"),
            ],
        };
    }

    return {
        presets: [
            ["babel-preset-expo", { jsxImportSource: "nativewind", unstable_transformImportMeta: true }],
            "nativewind/babel",
        ],
        plugins: ['react-native-reanimated/plugin'],
    };
};
