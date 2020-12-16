exports.description = 'Добавление предмета'
exports.run = async (bot, m, args) => {
  if(!m.member || !m.member.permissions.has('ADMINISTRATOR')) return m.reply('Ясно, накрутчик')

  let name, description, role
  let cost

  let coll  = { ended: true }
  let coll2 = { ended: true }
  let coll3 = { ended: true }
  let coll4 = { ended: true }
  let coll5 = { ended: true }

  const stopAll = (log) => {
    if(!coll.ended)  coll.stop()
    if(!coll2.ended) coll2.stop()
    if(!coll3.ended) coll3.stop()
    if(!coll5.ended) coll4.stop()
    if(log) m.reply('Операция отменена.')
  }

  const filter1 = sm => sm.author.id == m.author.id && sm.content != 'cancel' && sm.content.length < 64
  const filter2 = sm => sm.author.id == m.author.id && sm.content != 'cancel' && sm.content.length < 512
  const filter3 = sm => sm.author.id == m.author.id && sm.content != 'cancel'
  const filter4 = sm => sm.author.id == m.author.id && sm.content != 'cancel' && ( sm.mentions.roles.first() ||
                  m.guild.roles.fetch(sm.content) || m.content == 'none' )
  const filter5 = sm => sm.author.id == m.author.id && sm.content == 'cancel'

  const mkColl = (filter, time) => { return m.channel.createMessageCollector(filter, { time: time ? time : 3e5 }) }

  coll5 = mkColl(filter5, 120000)
  coll5.on('collect', () => { stopAll(true) })

  m.reply('Напишите название.\nВ любое время можете написать cancel для отмены.')
  coll = mkColl(filter1)
    coll.on('collect', m1 => {

    name = m1.content

    m.reply('Напишите описание.')
    coll.stop()
    coll2 = mkColl(filter2)
    coll2.on('collect', m2 => {
      description = m2.content

      m.reply('Перечислите валюты через запятую.\n Пример: 0, 111')
      coll2.stop()
      coll3 = mkColl(filter3)
      coll3.on('collect', async m3 => {
        let error

        const total = (await bot.utils.getCurrencies()).length
        cost = m3.content.split(/\s*[,;]\s*/)
        cost.map(i => {
          const t = Number(i)
          if(isNaN(t)) error = true
          return t
        })

        if(error) return m.reply('Все цены должны быть числом')

        const currs = await bot.utils.getCurrencies()
        if(cost.length > currs.length) return m.reply('В боте всего валют: ' + currs.length)
        if(cost.length < currs.length) {
          const tmp = new Array(currs.length - cost.length).fill(0)
          cost = cost.concat(tmp)
        }

        m.reply('Укажите роль за покупку. (@роль / id роли / none)')
        coll3.stop()
        coll4 = mkColl(filter4)
        coll4.on('collect', async m4 => {
          const mention = m4.mentions.roles.first()
          role = mention ? mention : await m.guild.roles.fetch(m4.content)
          if(!role) role = { name: 'не выбрана' }

          stopAll()

          let result = `Имя: ${name}\nОписание: ${description}\nЦена:`
          for(let i in cost) {
            const curr = await bot.utils.getCurrency(i)
            result += '\n  ' + curr.value + ': ' + cost[i]
          }
          result += '\nРоль за покупку: ' + role.name

          await bot.utils.createItem(name, description, cost, role.id, m.author.id)
          m.reply(result)
        })
      })
    })
  })
}
