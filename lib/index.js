const MTProto = require('@mtproto/core');
const path = require('path')
let {api_id, api_hash, BOT_TOKEN} = process.env
api_id = Number(api_id)
const mtproto = new MTProto({
  api_id,
  api_hash,
  storageOptions: {
    path: path.resolve(process.cwd(), './data/datasetbot.json'),
  },
});
const {Telegram} = require('./telegram')

class mtproto_api{
  constructor(){
    this.mtproto = mtproto
  }
  async call(method, params={}, opts={}){
    try{
      return await this.mtproto.call(method, params, opts)
    }catch(e){
      let {error_code, error_message} = e
      if(error_code == 303){
        const [type, dcIdAsString] = error_message.split('_MIGRATE_');

        const dcId = Number(dcIdAsString);

        // If auth.sendCode call on incorrect DC need change default DC, because
        // call auth.signIn on incorrect DC return PHONE_CODE_EXPIRED error
        if (type === 'PHONE') {
          await this.mtproto.setDefaultDc(dcId);
        } else {
          Object.assign(opts, { dcId });
        }
        return await this.mtproto.call(method, params, opts);
      }
      console.log(e.message)
      return Promise.reject(e)
    }
  }
  async getMe(){
    var me = await this.call('users.getFullUser', {
      id: {
        _: 'inputUserSelf',
      },
    });
    return me
  }
  async authBot(){
  return await this.call('auth.importBotAuthorization', {
      api_id,
      api_hash,
      bot_auth_token : BOT_TOKEN
    })
  }

  async searchUsername(username){
    return await this.call('contacts.resolveUsername', {
      username : String(username)
    })
  }
}

module.exports = {mtproto_api, mtproto, Telegram}
