module.exports = {
  configureWebpack: {
    devtool: "source-map",
  },
  css: {
    loaderOptions: {
      sass: {
        additionalData: '@import "@/styles/base.scss";',
      },
    },
  },
  devServer: {
    // should not be used in production
    proxy: {
      "^/api": {
        target: "http://host.docker.internal:8000",
        changeOrigin: true,
      },
      "^/delete-logs": {
        pathRewrite: {
          "^/delete-logs": "/logs-*", // rewrite path because /logs hat route on vue-router
        },
        target: "http://host.docker.internal:9200",
        changeOrigin: true,
      },
    },
  },
};
