exports.use = 'currency amount @user'
exports.description = 'Добавить деньги'

const invalid_curr = '\nТакой валюты нету, проверьте командой currencies'
const invalid_user = '\nВы не можете передавать деньги себе или боту'

exports.run = async (bot, m, args) => {
  if(!m.member || !m.member.permissions.has('ADMINISTRATOR')) return m.reply('Ясно, накрутчик')

  const author = m.mentions.users.first() ? m.mentions.users.first() : m.author
  const user = await bot.utils.getUser(author.id)

  if(author.bot) return m.reply(use + invalid_user)

  const curr = await bot.utils.getCurrency(args[0])
  if(!curr) return m.reply(use + invalid_curr)

  const amount = Number(args[1])
  if(amount == NaN) return m.reply(use)

  bot.utils.addMoney(author.id, curr.n, amount)
  m.reply('Деньги добавлены.')
}