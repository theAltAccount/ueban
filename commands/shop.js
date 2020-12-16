exports.description = 'Магазин'
exports.run = async (bot, m, args) => {
  let result = 'Пятерочка:\n'
  const items = await bot.utils.getItems()

  for(let i of items) {
    result += `\n**${i.name} - `
    for(let i2 in i.cost) {
      const curr = await bot.utils.getCurrency(i2)
      result += `${curr.value}: \`${i.cost[i2]}\``

      if(i.cost.length - 1 != i2) result += ', '
    }
    result += `**\n${i.description}\n`
  }

  m.channel.send(result, {split: '\n'});
}