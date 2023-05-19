/**
 * Copyright (c) Streamlit Inc. (2018-2022) Snowflake Inc. (2022)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const fs = require("fs")
const path = require("path")
const appDirectory = fs.realpathSync(process.cwd())
const resolveFromApp = relativePath => path.resolve(appDirectory, relativePath)
const libSrc = resolveFromApp("../lib/src")
const babelPreset = resolveFromApp("../lib/scripts/babel-preset-dev-env.js")
console.log(libSrc)
module.exports = {
  appPath: resolveFromApp(".."),
  devServer: {
    static: {
      watch: {
        ignored: [/node_modules/, "*.test.{ts,tsx}", /cypress/],
      },
    },
  },
  jest: {
    configure: jestConfig => {
      jestConfig.setupFiles = ["jest-canvas-mock"]

      // There is an issue with glide data grid in combination with jest.
      // The commonJS distribution is apparently not used by jest causing an error.
      // This can be fixed by adding it to transformIgnorePatterns
      jestConfig.transformIgnorePatterns = [
        "/node_modules/(?!glideapps)/.+\\.js$",
      ]
      if ("GITHUB_ACTION" in process.env) {
        jestConfig.reporters = ["default", "jest-github-actions-reporter"]
      }
      return jestConfig
    },
  },
  babel: {
    plugins: ["@emotion"],
    loaderOptions: {
      cacheDirectory: true,
    },
  },
  webpack: {
    configure: webpackConfig => {
      // const index = webpackConfig.module.rules.indexOf({
      //   test: /\.(js|mjs|jsx|ts|tsx)$/,
      //   include: [
      //     resolveFromApp('src')
      //   ],
      // })
      // console.log(index)
      console.log(webpackConfig.module.rules[1].oneOf)

      // "main:src lives in lib/package.json and this tells webpack to hot reload @streamlit/lib"
      webpackConfig.resolve.mainFields = [
        "main:src",
        "module",
        "main",
        "browser",
      ]
      // Webpack 5 requires polyfills. We don't need them, so resolve to an empty module
      webpackConfig.resolve.fallback ||= {}
      webpackConfig.resolve.fallback.tty = false
      webpackConfig.resolve.fallback.os = false

      // Apache Arrow uses .mjs
      webpackConfig.module.rules.push({
        include: /node_modules/,
        test: /\.mjs$/,
        type: "javascript/auto",
      })
      webpackConfig.module.rules[1].oneOf[3].include = [
        resolveFromApp("src"),
        resolveFromApp(libSrc),
      ]
      webpackConfig.module.rules[1].oneOf[3].options.presets = [babelPreset]
      // find terser plugin
      const minimizerPlugins = webpackConfig.optimization.minimizer
      const terserPluginIndex = minimizerPlugins.findIndex(
        item => item.constructor.name === "TerserPlugin"
      )

      if (process.env.BUILD_AS_FAST_AS_POSSIBLE) {
        // remove terser
        minimizerPlugins.splice(terserPluginIndex, 1)

        // skip type checking and linting
        const pluginsToRemove = [
          "ForkTsCheckerWebpackPlugin",
          "ESLintWebpackPlugin",
        ]
        webpackConfig.plugins = webpackConfig.plugins.filter(
          plugin => !pluginsToRemove.includes(plugin.constructor.name)
        )

        // turn off sourcemaps
        webpackConfig.devtool = "eval"
      } else {
        // TODO: Trace/Test this for update to GITHUB_ACTION instead
        const parallel = process.env.CIRCLECI ? false : true
        minimizerPlugins[terserPluginIndex].options.parallel = parallel
      }
      console.log(webpackConfig)
      console.log("-----------")
      console.log(webpackConfig.module.rules[1].oneOf[3])
      return webpackConfig
    },
  },
}
