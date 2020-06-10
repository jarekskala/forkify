const path = require('path');                                                     // nacteni nodeJS knihovny
const HtmlWebpackPlugin = require('html-webpack-plugin');                         // načtení nainstalovaného pluginu.





  module.exports = {                                                              // node js syntax.Xportujeme aby si to webpack mohl uchopit a přečíst.
      entry: ['babel-polyfill','./src/js/index.js'],                                               // entry point => zde začne webpack svuj bandle. Zde se koukne jako první a zde si přečte všechny dependencies, which will bundle together.
      output:  {                                                                  // output => řekne webpacku kde má uložit bundled files
        path: path.resolve(__dirname, 'dist'),                                 // __dirname je current absoulte path, kterou potrebujeme vygenerovat. Jakmile se vygeneruje absolutní cesta pro projektor, tak v druhem argumentu pripojuejem zbytek cesty... tim padem vznikne kompletni absolutni cesta. Ve vysledku neco jako C>users>skala>desktop>projektor>dist>js>bundle.js
        filename: 'js/bundle.js'                                                     // jméno souboru, které vygenerujeme. bundle.js je takový standart name.
      },
      devServer: {
        contentBase: './dist',                                                   // Co má servírovat.
        port: 1515 
      },
      plugins: [                                                                // array .
        new HtmlWebpackPlugin({
          filename: 'index.html',                                               // only the name, which automatickly include this filie in to the dist. No ne tak uplně automaticky, máme to nadefinováno výše v output.path, která se evidentně dědí.
          template: './src/index.html'                                          // vzorová šablona která se vezme a zkopiruje
        })
      ],
      module: {
        rules: [
          {
            test: /\.js$/,                                                      // projde všechny soubory v adresáaří s koncovkou .js
            exclude: /node_modules/,                                            // kromě teda node_modules
            use: {
              loader:'babel-loader'                                             // na tyto soubory zavolá babel-loader, potom se koukne do .babelrc
            }
          }
        ]
      }
  };
