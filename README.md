# myWebpack
#
# Установка: 
# 1) git clone https://github.com/YaroslavKuzyk/myWebpack.git
# 2) npm install
#
#
# Запуск проекта:
# 1) В режиме разработки - npm run start
# 2) Компиляция в режиме разработки - npm run dev
# 3) Компиляция в продакшн режиме - npm run build
#
#
# Создание *.html файла:
# 1) Создать сам файл Name.html
# 2) В файле index.js -  import  '../Name.html';
# 3) В файле webpack.config.js в функции plugins вставить ->
#         new HTMLWebpackPlugin({
#             template: path.resolve(__dirname, 'src/Name.html'),
#             filename: "Name.html",
#             minify: {
#                 collapseWhitespace: isProd
#             }
#         }),
