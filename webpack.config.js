/* -- charset:utf-8 --
 * @Author:  wysiwyg826
 * @Email:   wysiwyg826@gmail.com
 * @Date:    2016-10-08 11:45:51
 * @Project: webpack-vue2.0
 * @File:    webpack.config.js
 * @Last modified by:   wysiwyg826
 * @Last Modified time: 2016-10-08 14:57:08
 */
var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var OpenBrowserPlugin = require('open-browser-webpack-plugin');
var autoprefixer = require('autoprefixer');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var ENV = process.env.npm_lifecycle_event;

var dev = ENV === "dev"
var publish = ENV === "publish-mac" || ENV === "publish-win"

var port = 8080;

var projectRoot = path.resolve(__dirname);
var appPath = path.resolve(__dirname, './app/');
var tmplPath = path.resolve(__dirname, './app/tmpl');
module.exports = function() {
    var config = {};
    if (dev) {
        config.devtool = "cheap-source-map";
    } else if (publish) {
        config.devtool = "source-map";
    }

    //入口文件配置
    config.entry = {
        index: path.resolve(appPath, 'index.js'),
        //page2: ['./page2.js', './page3.js'] //支持数组形式，将加载数组中的所有模块，但以最后一个模块作为输出
    };

    //输出文件配置
    config.output = {
        path: path.resolve(appPath, 'dist'), //本地输出位置
        //publicPath:"http://www.yoursite.com", //资源文件访问的绝对地址
        filename: "[name].bundle.js"
            // index.bundle.js 和入口配置文件关联
            // page2.bundle.js
    };

    //加载器配置
    config.module = {
        loaders: [{
            test: /\.vue$/,
            loader: 'vue'
        }, {
            test: /\.js$/,
            loader: 'babel',
            include: projectRoot,
            exclude: /node_modules/
        }, {
            test: /\.json$/,
            loader: 'json'
        }, {
            test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
            loader: 'url',
            query: {
                limit: 10000
            }
        }, {
            test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
            loader: 'url',
            query: {
                limit: 10000
            }
        }, {
            test: /\.js$/,
            loader: 'babel',
            include: projectRoot,
            exclude: /node_modules/
        }]
    };


    config.vue = {
        loaders: {
            css: 'vue-style-loader!css-loader',
            scss: 'vue-style-loader!css-loader!sass-loader'
        },
        postcss: [
            require('autoprefixer')({
                browsers: ['last 2 versions']
            })
        ]
    };


    //插件项
    config.plugins = [
        //把index,page2里面的require相同的包打包
        new webpack.optimize.CommonsChunkPlugin({
            name: 'common',
            chunks: ['index', 'page2']
        }),
        //输出一个独立的css文件
        new ExtractTextPlugin("[name].css"),
        new HtmlWebpackPlugin({
            title: 'vue2.0-demo', //设置title的名字
            filename: 'index.html', //设置这个html的文件名 
            template: path.resolve(tmplPath, 'template.ejs'), //要使用的模块的路径  
            inject: 'body', //把模板注入到哪个标签后 'body'
            // favicon: './images/favico.ico', // 图标，
            chunks: ['common', 'index'], //限定引入文件
            minify: false, //生成的html文件压缩
            hash: true, //是否hash
            cache: false, //是否缓存
            showErrors: false //显示错误
        }),
        new OpenBrowserPlugin({ url: 'http://localhost:' + port })
    ];

    if (publish) {
        config.plugins.push(new webpack.NoErrorsPlugin()); //不显示错误
        config.plugins.push(new webpack.optimize.DedupePlugin()); //查找相等或近似的模块，避免在最终生成的文件中出现重复的模块
        config.plugins.push(new webpack.optimize.UglifyJsPlugin()); //丑化js 混淆代码而用
    }

    //其他解决方案配置
    config.resolve = {
        //确定资源目录，加快编译速度
        root: path.resolve('node_modules'),
        //自动扩展文件后缀，在使用require时省略后缀名
        extensions: ['', '.js', '.json', '.jsx', '.vue'],
        //模块定义别名，方便后续直接引用别名，无需多写长长的地址
        // alias: {
        //   log: './w.js'
        // }
        alias: {
          vue: path.join(__dirname, '/node_modules/vue/dist/vue')
        }
    };

    //服务器及代理配置
    // config.devServer = {
    //   hot: true,
    //   inline: true,
    //   proxy: {
    //     '/api/*': {
    //       target: 'http://api.example.com', // target host
    //       changeOrigin: true, // needed for virtual hosted sites
    //       ws: true, // proxy websockets
    //       router: {
    //         // when request.headers.host == localhost:3000',
    //         // override target 'http://api.example.com' to 'http://localhost:8000'
    //         'localhost:3000': http: //api.example.com'
    //       }
    //     }
    //   }
    // };

    return config;
}();
