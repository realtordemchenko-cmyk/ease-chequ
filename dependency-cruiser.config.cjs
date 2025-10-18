// dependency-cruiser.config.cjs
// Canonical configuration for dependency-cruiser v17.1.0

const path = require("path");

/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
    options: {
        includeOnly: ["apps/web"],
        tsConfig: {
            fileName: path.join(__dirname, "apps", "web", "tsconfig.json"),
        },
        doNotFollow: {
            path: "node_modules",
        },
    },

    forbidden: [
        {
            name: "no-circular",
            severity: "error",
            comment: "Disallow circular dependencies",
            from: {},
            to: { circular: true },
        },
        {
            name: "no-orphans",
            severity: "warn",
            comment: "Disallow orphan modules (except Next.js pages/layouts)",
            from: {
                pathNot: [
                    "apps/web/app/.*page\\.tsx$",
                    "apps/web/app/.*layout\\.tsx$",
                ],
            },
            to: { orphan: true },
        },
        {
            name: "no-unresolved",
            severity: "error",
            comment: "Disallow unresolved imports",
            from: {},
            to: { couldNotResolve: true },
        },
        {
            name: "store-must-use-alias",
            severity: "error",
            comment: "AdminStore must be imported only via @ alias",
            from: { path: "^apps/web" },
            to: {
                path: "apps/web/context/AdminStore\\.tsx$",
                pathNot: "^@", // forbid relative imports
            },
        },
        {
            name: "types-must-use-alias",
            severity: "error",
            comment: "Types must be imported only via @ alias",
            from: { path: "^apps/web" },
            to: {
                path: "apps/web/types/.*\\.(ts|tsx)$",
                pathNot: "^@", // forbid relative imports
            },
        },
        {
            name: "components-must-use-alias",
            severity: "error",
            comment: "Shared components must be imported only via @ alias",
            from: { path: "^apps/web/app/admin" },
            to: {
                path: "apps/web/components/.*\\.(ts|tsx)$",
                pathNot: "^@", // forbid relative imports
            },
        },
    ],
};