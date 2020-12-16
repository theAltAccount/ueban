exports.description = 'Помощь с небес'
exports.run = (bot, m, args) => {
  let result = 'Список команд:\n\n'

  for(let command in bot.commands) {
    let use = bot.commands[command].use
    use = use ? ' ' + use : ''

    result += `${command}${use}\n    ${bot.commands[command].description}\n`
  }

  m.author.send(result + '\n\nЕсть еще команды, их можно юзать в чате: -say, -срач')
  m.react('👌')
}