const NCMB = require('ncmb');
const application_key = 'd288714a5a801f4ccaaac99c87df41d35e38b5804a9ecbcd2026c1901e914fc0';
const client_key = '3395ea58a34af1edb5009c9d15b3379761539ef3c8eb0ee0d797274e122359b8';

const ncmb = new NCMB(application_key, client_key);

var push = new ncmb.Push();
push.set("immediateDeliveryFlag", true)
  .set("title", "新しいフレーズが追加されました。")
  .set("message", 'テスト')
  .set("target",  ["ios"])
  .set("sound", "default")
  .set("contentAvailable", true)
  .send()
    .then(function(push){
        console.log('送信完了');
    })
    .catch(function(err) {
      console.log(err);
    });
