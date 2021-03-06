// server.js

// 必要なパッケージの読み込み
var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');

// DBへの接続
var mongoose   = require('mongoose');
mongoose.connect('mongodb://localhost/beaconDrink');

// モデルの宣言
var User       = require('./app/models/user');
var Order      = require('./app/models/order');

// POSTでdataを受け取るための記述
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// 3000番を指定
var port = process.env.PORT || 3000;

// expressでAPIサーバを使うための準備
var router = express.Router();

router.use(function(req, res, next) {
    console.log('Some request is recived.');
    next();
});

// 正しく実行出来るか左記にアクセスしてテストする (GET http://localhost:3000/api)
router.get('/', function(req, res) {
    res.json({ message: 'Successfully Posted a test message.' });
});


// /users というルートを作成する．
// ----------------------------------------------------
router.route('/users')

// ユーザの作成 (POST http://localhost:3000/api/users)
    .post(function(req, res) {

        // 新しいユーザのモデルを作成する．
        var user = new User();

        // ユーザの各カラムの情報を取得する．
        user.person_id = req.body.person_id;
        user.gender = req.body.gender;
        user.age = req.body.age;

        // ユーザ情報をセーブする．
        user.save(function(err) {
            if (err)
                res.send(err);
            res.json({ message: 'User created!' });
        });
    })

// 全てのユーザ一覧を取得 (GET http://localhost:3000/api/users)
    .get(function(req, res) {
        User.find(function(err, users) {
            if (err)
                res.send(err);
            res.json(users);
        });
    });

// /users/:user_id というルートを作成する．
// ----------------------------------------------------
router.route('/users/:user_id')

// 1人のユーザの情報を取得 (GET http://localhost:3000/api/users/:user_id)
    .get(function(req, res) {
        //user_idが一致するデータを探す．
        User.findById(req.params.user_id, function(err, user) {
            if (err)
                res.send(err);
            res.json(user);
        });
    })
// 1人のユーザの情報を更新 (PUT http://localhost:3000/api/users/:user_id)
    .put(function(req, res) {
        User.findById(req.params.user_id, function(err, user) {
            if (err)
                res.send(err);
            // ユーザの各カラムの情報を更新する．
            user.person_id = req.body.person_id;
            user.gender = req.body.gender;
            user.age = req.body.age;

            user.save(function(err) {
                if (err)
                    res.send(err);
                res.json({ message: 'User updated!' });
            });
        });
    })

// 1人のユーザの情報を削除 (DELETE http://localhost:3000/api/users/:user_id)
    .delete(function(req, res) {
        User.remove({
            _id: req.params.user_id
        }, function(err, user) {
            if (err)
                res.send(err);
            res.json({ message: 'Successfully deleted' });
        });
    });


// /orders というルートを作成する．
// ----------------------------------------------------
router.route('/orders')

// orderの作成 (POST http://localhost:3000/api/orders)
    .post(function(req, res) {

        // 新しいorderのモデルを作成する．
        var order = new Order();

        // 各カラムの情報を取得する．
        order.user_id = req.body.user_id;
        order.drink = req.body.drink;
        order.method = req.body.method;

        // order情報をセーブする．
        order.save(function(err) {
            if (err)
                res.send(err);
            res.json({ message: 'Order created!' });
            socketioServer.sockets.emit("drink_button", order.drink);
            console.log("emit drink_button: " + order.drink);
        });
    })

// 全てのorder一覧を取得 (GET http://localhost:8080/api/orders)
    .get(function(req, res) {
        Order.find(function(err, orders) {
            if (err)
                res.send(err);
            res.json(orders);
        });
    });

// ルーティング登録
app.use('/api', router);

//サーバ起動
var server = app.listen(port);
console.log('listen on port ' + port);

var socketio = require( 'socket.io' );
var socketioServer = socketio.listen( server );
socketioServer.sockets.on( 'connection', function(socket) {
  console.log('some websocket client is connected to node express websocket server');
});
