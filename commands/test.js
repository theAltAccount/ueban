exports.description = 'Вам не надо это знать.'
exports.run = (bot, m, args) => {
  if(m.author.id != bot.owner.id) return m.reply('А хрен там')
  m.reply('Повинуюсь, хозяин!')
}