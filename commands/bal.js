exports.description = 'Показывает ваш профиль'
exports.run = async (bot, m, args) => {
  let id

  if(m.mentions.users.first()) id = m.mentions.users.first().id
  else if(args.length == 1 && Number(args[0]) != NaN) id = args[0]
  if(!id) id = m.author.id

  const user = await bot.utils.getUser(id)

  result = 'Валюты:'
  for(let i in user.money) {
    const currency = await bot.utils.getCurrency(i)
    result += '\n  ' + currency.value + ': ' + user.money[i]
  }

  m.channel.send(result)
}