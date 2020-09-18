const HtmlWebpackPlugin = require('html-webpack-plugin');
// 有时我们会指定打包文件中带有 hash，那么每次生成的 js 文件名会有所不同，不能让我们每次都人工去修改 html，
// 我们可以使用 html-webpack-plugin 插件来帮助我们完成这些事情。
// 有时候，我们的脚手架不仅仅给自己使用，也许还提供给其它业务使用，html 文件的可配置性可能很重要，比如：你公司有专门的部门提供M页的公共头部/公共尾部，埋点jssdk以及分享的jssdk等等，但是不是每个业务都需要这些内容。
// 一个功能可能对应多个 js 或者是 css 文件，如果每次都是业务自行修改 public/index.html 文件，也挺麻烦的。首先他们得搞清楚每个功能需要引入的文件，然后才能对 index.html 进行修改。
// 此时我们可以增加一个配置文件，业务通过设置 true 或 false 来选出自己需要的功能，我们再根据配置文件的内容，为每个业务生成相应的 html 文件，岂不是美美的。

const { CleanWebpackPlugin } = require('clean-webpack-plugin');
    // 每次 clean-webpack-plugin 都会帮我们先清空一波 dist 目录的插件
const CopyWebpackPlugin = require('copy-webpack-plugin');
    // 静态资源拷贝插件
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// 抽离CSS，即将CSS文件单独打包的插件，这可能是因为打包成一个JS文件太大，影响加载速度，也有可能是为了缓存
const OptimizeCssPlugin = require('optimize-css-assets-webpack-plugin');
// 使用 mini-css-extract-plugin，CSS 文件默认不会被压缩，如果想要压缩，需要配置 optimization插件

// import() 语法，
// 按需加载
// 需要 @babel/plugin-syntax-dynamic-import 的插件支持，
// 但是因为当前 @babel/preset-env 预设中已经包含了 @babel/plugin-syntax-dynamic-import，因此我们不需要再单独安装和配置。

const webpack = require('webpack');
const path = require('path');
const isDev = process.env.NODE_ENV === 'development';
const config = require('./public/config')[isDev ? 'dev' : 'build'];

module.exports = {
    mode: isDev ? 'development' : 'production',
    // mode 配置项，告知 webpack 使用相应模式的内置优化。
    // mode 配置项，支持以下两个配置:
    // development：将 process.env.NODE_ENV 的值设置为 development，启用 NamedChunksPlugin 和 NamedModulesPlugin
    // production：将 process.env.NODE_ENV 的值设置为 production，启用 FlagDependencyUsagePlugin, FlagIncludedChunksPlugin, ModuleConcatenationPlugin, NoEmitOnErrorsPlugin, OccurrenceOrderPlugin, SideEffectsFlagPlugin 和 UglifyJsPlugin
    
    
    entry: {
        index: './src/index.js',
        login: './src/login.js'
    },
    // entry 的值可以是一个字符串，一个数组或是一个对象。
    // 字符串的情况无需多说，就是以对应的文件为入口。
    // 为数组时，表示有“多个主入口”，想要多个依赖文件一起注入时
    
    
    output: {
        path: path.resolve(__dirname, 'dist'), //必须是绝对路径
        filename: 'bundle.[hash:6].js',
        publicPath: '/' //通常是CDN地址
    },
    // 例如，你最终编译出来的代码部署在 CDN 上，资源的地址为: 'https://AAA/BBB/YourProject/XXX'，那么可以将生产的 publicPath 配置为: //AAA/BBB/。
// 编译时，可以不配置，或者配置为 /。可以在我们之前提及的 config.js 中指定 publicPath（config.js 中区分了 dev 和 public）， 当然还可以区分不同的环境指定配置文件来设置，或者是根据 isDev 字段来设置。
    

    module: {
        // loader 让 webpack 能够去处理那些非 JavaScript 文件（webpack 自身只理解 JavaScript），用于对源代码进行转换
        rules: [
            {
                test: /\.jsx?$/, //匹配规则，针对符合规则的文件进行处理。
                use: {
                    loader: 'babel-loader', 
                    options: {      //这里，我们可以在 .babelrc 中编写 babel 的配置，也可以在 webpack.config.js 中进行配置。
                        presets: ["@babel/preset-env"],
                        plugins: [
                            [
                                "@babel/plugin-transform-runtime",
                                {
                                    "corejs": 3
                                }
                            ]
                        ]
                    }
                },
                exclude: /node_modules/ //排除 node_modules 目录
            },
            // 讲js转译为低版本
            {
                test: /.html$/,
                use: 'html-withimg-loader'
            },
            // 处理在html中引入的本地图片
            
            // use 字段有几种写法
            // 可以是一个字符串，例如上面的 use: 'html-withimg-loader'
            // use 字段可以是一个数组，例如处理CSS文件时，use: ['style-loader', 'css-loader']
            // use 数组的每一项既可以是字符串也可以是一个对象，当我们需要在webpack 的配置文件中对 loader 进行配置，就需要将其编写为一个对象，
            // 并且在此对象的 options 字段中进行配置。
            // loader 的执行顺序是从右向左执行的，也就是后面的 loader 先执行，下面 loader 的执行顺序为: less-loader ---> postcss-loader ---> css-loader ---> style-loader
            // 当然，loader 其实还有一个参数，可以修改优先级，enforce 参数，其值可以为: pre(优先执行) 或 post (滞后执行)。
            {
                test: /\.(le|c)ss$/,
                use: [
                    // 'style-loader', 
                    MiniCssExtractPlugin.loader, //替换之前的 style-loader
                    'css-loader', {
                    loader: 'postcss-loader',
                    options: {
                        plugins: function () {
                            return [
                                require('autoprefixer')()
                            ]
                        }
                    }
                }, 'less-loader'],
                exclude: /node_modules/
            },
             // style-loader 动态创建 style 标签，将 css 插入到 head 中.
             // css-loader 负责处理 @import 等语句。
             // postcss-loader 和 autoprefixer，自动生成浏览器兼容性前缀 
             // less-loader 负责处理编译 .less 文件,将其转为 css
            {
                test: /\.(png|jpg|gif|jpeg|webp|svg|eot|ttf|woff|woff2)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10240, //10K
                            esModule: false,
                            outpath:'assets'
                        }
                    }
                ],
                exclude: /node_modules/
            },
            // 我们可以使用 url-loader 或者 file-loader 来处理本地的资源文件。
            // url-loader 和 file-loader 的功能类似，
            // 但是 url-loader 可以指定在文件大小小于指定的限制时，返回 DataURL，
            // 因此，个人会优先选择使用 url-loader
            // 当本地资源较多时，我们有时会希望它们能打包在一个文件夹下，这也很简单，我们只需要在 url-loader 的 options 中指定 outpath，如: outputPath: 'assets'
            // 此处设置 limit 的值大小为 10240，即资源大小小于 10K 时，将资源转换为 base64，超过 10K，将图片拷贝到 dist 目录。
            // esModule 设置为 false，否则，<img src={require('XXX.jpg')} /> 会出现 <img src=[Module Object] />
            // 将资源转换为 base64 可以减少网络请求次数，但是 base64 数据较大，如果太多的资源是 base64，会导致加载变慢，
            // 因此设置 limit 值时，需要二者兼顾。

           
        ]
    },
    devtool: isDev ? 'cheap-module-eval-source-map' : 'source-map',
    // devtool 中的一些设置，可以帮助我们将编译后的代码映射回原始源代码。不同的值会明显影响到构建和重新构建的速度。
    // 能够定位到源码的行即可，因此，综合构建速度，在开发模式下，设置 devtool 的值是 cheap-module-eval-source-map。
    // 生产环境可以使用 none 或者是 source-map，使用 source-map 最终会单独打包出一个 .map 文件，我们可以根据报错信息和此 map 文件，进行错误解析，定位到源代码。
    // source-map 和 hidden-source-map 都会打包生成单独的 .map 文件，区别在于，source-map 会在打包出的js文件中增加一个引用注释，以便开发工具知道在哪里可以找到它。hidden-source-map 则不会在打包的js中增加引用注释。
    // 但是我们一般不会直接将 .map 文件部署到CDN，因为会直接映射到源码，更希望将.map 文件传到错误解析系统，然后根据上报的错误信息，直接解析到出错的源码位置。


    plugins: [
        //数组 放着所有的webpack插件
        new HtmlWebpackPlugin({
            template: './public/index.html',
            filename: 'index.html', //打包后的文件名
            config: config.template,  //读取config配置文件生成不同的文件
            // hash: true //是否加上hash，默认是 false
            chunks: ['index'] //配置此参数仅会将数组中指定的js引入到html文件中，此外，如果你需要引入多个JS文件，仅有少数不想引入，还可以指定 excludeChunks 参数，它接受一个数组。
        }),
        new HtmlWebpackPlugin({
            template: './public/login.html',
            filename: 'login.html', //打包后的文件名
            chunks: ['login']
        }),
        // 多页面应用打包
        // 如果需要配置多个 HtmlWebpackPlugin，
        // 那么 filename 字段不可缺省，否则默认生成的都是 index.html，
        // 如果你希望 html 的文件名中也带有 hash，那么直接修改 fliename 字段即可，例如: filename: 'login.[hash:6].html'。

        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns:['**/*', '!dll', '!dll/**'] //不删除dll目录下的文件
        }),
        new CopyWebpackPlugin({
            patterns: [
                { 
                    from: 'public/js/*.js',   //将 public/js 目录拷贝至 dist/js 目录
                    to: path.resolve(__dirname, 'dist', 'js'),
                    flatten: true, //设置为 true，那么它只会拷贝文件，而不会把文件夹路径都拷贝上，
                    // ignore: ['other.js'] 忽略掉 js 目录下的 other.js 文件
                }
            ],
        }),
        new MiniCssExtractPlugin({
            filename: 'css/[name].css'
            //个人习惯将css文件放在单独目录下
            //publicPath:'../'   //如果你的output的publicPath配置的是 './' 这种相对路径，那么如果将css文件放在单独目录下，记得在这里指定一下publicPath 
        }),
        new OptimizeCssPlugin(),    //压缩css插件
        
        new webpack.HotModuleReplacementPlugin(), //热更新插件

        new webpack.DefinePlugin({              //定义环境变量插件      \
            DEV: JSON.stringify('dev'), //字符串
            //index.js
               // if(DEV === 'dev') {
                //     //开发环境
                // }else {
                //     //生产环境
                // }
            FLAG: 'true' //FLAG 是个布尔类型
        })
     
    ],

    devServer: {
        // port: '8888', //默认是8080
        // quiet: false, //默认不启用
        // inline: true, //默认开启 inline 模式，如果设置为false,开启 iframe 模式
        // stats: "errors-only", //终端仅打印 error
        // overlay: false, //默认不启用
        // clientLogLevel: "silent", //日志等级
        // compress: true //是否启用 gzip 压缩
        hot:true //热更新
    },
    // 启用 quiet 后，除了初始启动信息之外的任何内容都不会被打印到控制台。这也意味着来自 webpack 的错误或警告在控制台不可见 ,不建议开启
    // stats: "errors-only" ，终端中仅打印出 error，注意当启用了 quiet 或者是 noInfo 时，此属性不起作用。
    // 启用 overlay 后，当编译出错时，会在浏览器窗口全屏输出错误，默认是关闭的。
    resolve: {
        modules: ['./src/components', 'node_modules'], //从左到右依次查找
        // resolve 配置 webpack 如何寻找模块所对应的文件。
        // webpack 内置 JavaScript 模块化语法解析功能，默认会采用模块化标准里约定好的规则去寻找，但你可以根据自己的需要修改默认的规则。
        extensions: ['web.js', '.js'] //当然，你还可以配置 .json, .css        
// extensions适配多端的项目中，可能会出现 .web.js, .wx.js，例如在转web的项目中，我们希望首先找 .web.js，如果没有，再找 .js。我们可以这样配置
    }
}

// 区分不同的环境
// 目前为止我们 webpack 的配置，都定义在了 webpack.config.js 中，对于需要区分是开发环境还是生产环境的情况，
// 我们根据 process.env.NODE_ENV 去进行了区分配置，但是配置文件中如果有多处需要区分环境的配置，这种显然不是一个好办法。
// 更好的做法是创建多个配置文件，如: webpack.base.js、webpack.dev.js、webpack.prod.js。
// 然后修改我们的 package.json，指定对应的 config 文件

// webpack.base.js 定义公共的配置
// webpack.dev.js：定义开发环境的配置
// webpack.prod.js：定义生产环境的配置

// webpack-merge 专为 webpack 设计，提供了一个 merge 函数，用于连接数组，合并对象。
// const merge = require('webpack-merge');
// merge({
//     devtool: 'cheap-module-eval-source-map',
//     module: {
//         rules: [
//             {a: 1}
//         ]
//     },
//     plugins: [1,2,3]
// }, {
//     devtool: 'none',
//     mode: "production",
//     module: {
//         rules: [
//             {a: 2},
//             {b: 1}
//         ]
//     },
//     plugins: [4,5,6],
// });
// //合并后的结果为
// {
//     devtool: 'none',
//     mode: "production",
//     module: {
//         rules: [
//             {a: 1},
//             {a: 2},
//             {b: 1}
//         ]
//     },
//     plugins: [1,2,3,4,5,6]
// }
