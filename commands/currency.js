exports.use = 'currency currency_name'
exports.description = 'Добавить валюту'

exports.run = async (bot, m, args) => {
  if(!m.member || !m.member.permissions.has('ADMINISTRATOR')) return m.reply('Ясно, накрутчик')

  use = bot.prefix + 'currency ' + exports.use

  if(args.length < 2 || args.length > 2) return m.reply(use)

  const value = args[0]
  const name = args[1]

  await bot.utils.addCurrency(value, name)
  m.reply('Валюта добавлена.')
}