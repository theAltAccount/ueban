exports.description = 'Показывает, какие есть валюты'
exports.run = async (bot, m, args) => {
  result = 'Все валюты бота:'

  const currs = await bot.utils.getCurrencies()
  for(let i in currs) {
    const curr = currs[i]
    result += '\n  ' + i + ': ' + curr.name + ' ( ' + curr.value + ' )'
  }

  m.channel.send(result)
}