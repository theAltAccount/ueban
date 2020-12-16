exports.use = 'currency_id amount @user'
exports.description = 'Передача денег'

const no_money =     '\nУ вас недостаточно денег.'
const invalid_curr = '\nТакой валюты нету, проверьте командой currencies'
const invalid_user = '\nВы не можете передавать деньги себе или боту'

exports.run = async (bot, m, args) => {
  use = bot.prefix + 'pay ' + exports.use

  const user = await bot.utils.getUser(m.author.id)

  if(!args[0] || !args[1] || !args[2]) return m.reply(use)

  if(m.mentions.users.size < 1) return m.reply(use)
  if(m.mentions.users.size > 1) return m.reply(use)
  if(/<@!?\d+>/.test(args[0]))  return m.reply(use)

  if(m.mentions.users.first().id == m.author.id) return m.reply(use + invalid_user)
  if(m.mentions.users.first().bot)               return m.reply(use + invalid_user)

  const to = m.mentions.users.first()

  const curr = await bot.utils.getCurrency(args[0])
  if(!curr) return m.reply(use + invalid_curr)

  const amount = Number(args[1])
  if (isNaN(amount) || amount < 1) return m.reply(use);
  console.log(amount > user.money[curr.n], user.money[curr.n], user.money, amount, curr, curr.n);
  if (amount > user.money[curr.n]) return await m.reply(use + no_money);

  bot.utils.addMoney(to.id, curr.n, amount)
  bot.utils.addMoney(m.author.id, curr.n, -amount)

  m.reply('Перевод совершён.')
}