const {mtproto_api, mtproto, Telegram} = require('./lib')
const api = new mtproto_api()
const proto = api.mtproto
process.on('unhandledRejection', console.error);
const tg = new Telegram(api)

mtproto.updates.on('updateShortChatMessage', console.log)
mtproto.updates.on('updates', async(updateInfo) => {
  var update = updateInfo.updates[0]
  var user = updateInfo.users
  var message = update.message
  var peer = Object.keys(message['peer_id'])
  var chat = {
    id : message['peer_id'][peer[peer.length - 1]],
    type : message['peer_id']['_'],
    init : peer[1]
  }
  if(updateInfo.chats.length){
    var chann = updateInfo.chats[0]
    chat = {
      id : chann.id,
      type : "peerC"+chann['_'].slice(1),
      hash : chann.access_hash ? chann.access_hash : 0,
      init : chann['_']+"_id",
    }
  }
  await tg.sendMessage(chat, JSON.stringify(message, null, 2))
});
(async ()=>{
  var js = await api.searchUsername('adzkyy')
  console.log(JSON.stringify(js))
  await api.getMe()
})()
