module.exports = {
  module: {
    rules:
      {
        test: /\.scss$/,
        use: [
          'vue-style-loader',
          'css-loader',
          'sass-loader'
        ]

      },
    options: {
      loaders: {
        scss: 'vue-style-loader!css-loader!sass-loader', // <style lang="scss">
        sass: 'vue-style-loader!css-loader!sass-loader?indentedSyntax' // <style lang="sass">
      }
    },
  },
  css: {
    loaderOptions: {
      sass: {
        data: `@import "@/styles/_variables.scss";`
      }
    }
  }
};
