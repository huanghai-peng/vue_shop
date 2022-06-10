module.exports = {
    configureWebpack: {
        resolve: {
            alias: {
                // 脚手架3中起别名可以用@代替src
                'assets': '@/assets',
                'components': '@/components',
                'views': '@/views',
                'network': '@/network',
                'plugins': '@/plugins',
            }
        }
    },
    /* css: {
        loaderOptions: {
            sass: {
                prependData: `@import "./src/assets/css/theme.scss";`, // scss 的目录文件
            },
        },
    } */
}