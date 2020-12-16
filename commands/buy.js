exports.use = 'item_name'
exports.description = 'Покупка предметов.'

const no_money = '\nУ вас недостаточно денег.'
const no_item  = '\nТакого предмета не существует.'

exports.run = async (bot, m, args) => {
  use = bot.prefix + 'buy ' + exports.use

  const itemN = args.join(' ')
  if(!itemN) return m.reply('Укажите предмет.')

  const item = await bot.utils.getItem(itemN)
  if(!item) return m.reply(use + no_item)

  const user = await bot.utils.getUser(m.author.id)
  for(let i in user.money) {
    if(item.cost[i] > user.money[i]) return m.reply(use + no_money)
  }

  for(let price in item.cost) {
    bot.utils.addMoney(m.author.id, price, -item.cost[price])
  }

  console.log(item, item.gives)

  m.member.addRole(item.gives)

  m.reply('Спасибо за покупку!')
}