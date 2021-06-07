function uniq(min, max) {  
  return Math.floor(
    Math.random() * (max - min) + min
  )
}
class Telegram{
  constructor(mtproto){
    this.client = mtproto
  }
  async sendMessage(chat, pesan, extra={}){
    var type = 'P'+chat.type.slice(1)
    var chats = {
      '_' : 'input'+type,
      'chat_id' : chat.id
    }
    chats[chat.init] = chat.id
    if(chat.hash){
      chats.access_hash = chat.hash
    }
    var data = {
     peer :chats,
     clear_draft : true,
     message : pesan,
     random_id : BigInt(String(uniq(1, 10000))),
     ...extra 
    }
    return await this.client.call('messages.sendMessage', data)
  }
}

module.exports = {Telegram}
