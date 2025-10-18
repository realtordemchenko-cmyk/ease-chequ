/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  options: {
    includeOnly: ["^apps/web"],

    tsConfig: {
      fileName: "tsconfig.app.json"
    },

    doNotFollow: {
      path: ["node_modules"]
    },

    // Игнорируем артефакты сборки
    exclude: {
      path: [
        "^apps/web/.next",
        "^apps/web/dist",
        "^apps/web/build"
      ]
    },

    tsPreCompilationDeps: true,
    combinedDependencies: true,
    skipAnalysisNotInRules: true
  },

  forbidden: [
    {
      name: "store-must-use-alias",
      severity: "error",
      comment: "AdminStore must be imported only via @ alias",
      from: { path: "^apps/web" },
      to: {
        path: "apps/web/context/AdminStore\\.tsx$",
        via: { pathNot: "^@" }
      }
    },
    {
      name: "types-must-use-alias",
      severity: "error",
      comment: "Types must be imported only via @ alias",
      from: { path: "^apps/web" },
      to: {
        path: "apps/web/types/.*\\.(ts|tsx)$",
        via: { pathNot: "^@" }
      }
    },
    {
      name: "components-must-use-alias",
      severity: "error",
      comment: "Shared components must be imported only via @ alias",
      from: { path: "^apps/web/app/admin" },
      to: {
        path: "apps/web/components/.*\\.(ts|tsx)$",
        via: { pathNot: "^@" }
      }
    },
    {
      name: "no-circular",
      severity: "error",
      comment: "Disallow circular dependencies",
      from: {},
      to: { circular: true }
    },
    {
      name: "no-orphans",
      severity: "warn",
      comment: "Disallow orphan modules (except Next.js pages/layouts)",
      from: {
        orphan: true,
        pathNot: [
          "apps/web/app/.*page\\.tsx$",
          "apps/web/app/.*layout\\.tsx$",
          "(^|/)[.][^/]+[.](?:js|cjs|mjs|ts|cts|mts|json)$",
          "[.]d[.]ts$",
          "(^|/)tsconfig[.]json$",
          "(^|/)(?:babel|webpack)[.]config[.](?:js|cjs|mjs|ts|cts|mts|json)$"
        ]
      },
      to: {}
    },
    {
      name: "no-unresolved",
      severity: "error",
      comment: "Disallow unresolved imports",
      from: {},
      to: { couldNotResolve: true }
    }
  ]
};