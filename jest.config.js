const config = {
    snapshotSerializers: [
        "enzyme-to-json/serializer"
    ],
    collectCoverageFrom: [
        "src/**/*.{js,jsx,ts,tsx}",
        "!*.d.ts"
    ],
    coverageReporters: [
        "cobertura"
    ],
    resolver: "jest-pnp-resolver",
    setupFiles: [
        "react-app-polyfill/jsdom",
        "<rootDir>/config/jest/init.ts"
    ],
    testMatch: [
        "<rootDir>/src/**/*.test.ts?(x)"
    ],
    testEnvironment: "jsdom",
    testURL: "http://localhost",
    transform: {
        "^.+\\.(js|jsx|mjs)$": "<rootDir>/node_modules/babel-jest",
        "^.+\\.tsx?$": "<rootDir>/config/jest/typescriptTransform.js",
        "^.+\\.css$": "<rootDir>/config/jest/cssTransform.js",
        "^(?!.*\\.(js|jsx|mjs|css|json)$)": "<rootDir>/config/jest/fileTransform.js"
    },
    transformIgnorePatterns: [
        "[/\\\\]node_modules[/\\\\].+\\.(js|jsx|ts|tsx)$"
    ],
    testPathIgnorePatterns: [
    ],
    testResultsProcessor: "./node_modules/jest-junit-reporter",
    moduleNameMapper: {
        "^react-native$": "react-native-web",
        "^.+\\.(css|scss)$": "identity-obj-proxy"
    },
    moduleFileExtensions: [
        "web.ts",
        "ts",
        "web.tsx",
        "tsx",
        "web.js",
        "js",
        "web.jsx",
        "jsx",
        "json",
        "node",
        "mjs"
    ],
    globals: {
        "ts-jest": {
            "tsConfig": "tsconfig.test.json"
        }
    }
};

module.exports = config;
