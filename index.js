console.log('Началась загрузка...')

const mongoose = require('mongoose')

const fs = require('fs')
const Discord = require('discord.js')
const bot = new Discord.Client({disableEveryone: true});

let cooldown = { active: [] }
let cooldown2 = false;
let config = {}

const SDC = "464272403766444044"
const MON = "315926021457051650"

const yourServer = 'guild-id';  
const chat = 'chat-id';
const staffChat = 'staff-chat';
const owner = 'owner-role';
const skazhi = 'say-role-id';

bot.utils = require('./utils.js')
bot.utils.load(bot)

bot.dbUrl = 'your-db';
bot.commands = {}

let voice = new Set()

mongoose.connect(bot.dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
bot.db = mongoose.connection
bot.db.on('error', e => {
  console.log('База данных не подключена')
})

bot.db.on('open', async () => {
  console.log('База данных подключена')

  bot.colls = {
    config:     require('./models/Config.js'),
    currencies: require('./models/Currencies.js'),
    users:      require('./models/Users.js'),
    shop:       require('./models/Shop.js')
  }

  config = await bot.colls.config.findOne()
  bot.login('your-token')
})

const sendLog = text => {
  if(!bot.owner) return
  bot.owner.send(text)
}

fs.readdirSync('./commands/').forEach(f => {
  f = f.substr(0, f.length - 3)

  try {
    bot.commands[f] = require('./commands/' + f)
    console.log('Команда ' + f + ' загружена')
  } catch(e) {
    console.log('Команда ' + f + ' не загружена')
    console.log(e)
  }
})

bot.once('ready', async () => {
  setInterval(() => {
    const message = bot.channels.get(chat).lastMessage
    if (!message) return;
    //console.log(message.createdAt.getMinutes() + 5 >= new Date().getMinutes(), message.createdAt.getMinutes() + 5)
    if (!message.author.bot && !message.member.roles.find(r => r.id === owner) && message.createdAt.getMinutes() + 5 <= new Date().getMinutes() && new Date().getHours() < 21 && new Date().getHours() > 6) {
      //message.reply('Отправь любое сообщения или я тебя выебу');
    };

    voice.forEach(async u => {
      const reward = await bot.utils.getActiveReward(bot)
      bot.utils.addMoney(u, 0, bot.utils.random(reward[0], reward[1]))
    })
  }, 6e4)

  bot.prefix = config.prefix
  bot.owner = await bot.users.find(u => u.id === config.owner)

	console.log('Бот работает.')
	console.log(`${bot.user.tag}\nСерверов: ${bot.guilds.size}\nДолбоебов: ${bot.users.size}`);
  bot.user.setActivity(`пизде твоей мамки`, {type: 'PLAYING'});
})

const onMsg = async message => {
  const embed = message.embeds[0] || null
  if(message.author.id == SDC && embed && embed.title == 'Сервер Up') {
    let bumped = bot.users.find(u => u.tag == embed.footer.text);
    message.channel.send(`${bumped}, спс за бамп`);
  };

  if (message.author.bot) return;
  if (message.channel.type === 'dm') bot.channels.get(staffChat).send(`${message.author.tag} написал мне в лс: ${message.content}`)
  if (!message.guild) return;

  if(!cooldown.active[message.author.id] || (Date.now() - cooldown.active[message.author.id]) >= 0) {
     const reward = await bot.utils.getActiveReward(bot)
    await bot.utils.addMoney(message.author.id, 1, bot.utils.random(reward[0], reward[1]))

    cooldown.active[message.author.id] = Date.now() + 6e4
  }

  const inviteReg = /discord(\.com\/invite|.\w{2})\/(\w{2,})/i;
  const match = message.content.match(inviteReg);

  randomElement = arr => arr[Math.ceil(Math.random() * arr.length - 1)];

  if (!cooldown2) {
    await bot.user.setActivity(`за ${message.author.username} (${bot.prefix}help)`, {type: 'WATCHING'});
    cooldown2 = true;
    setTimeout(() => cooldown2 = false, 8e3);
  }

  const collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, { time: 2e3 });
  collector.on('collect', () => {
    const collector2 = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, { time: 2e3 });
    collector.stop();
    if (message.channel.name === 'дурка' || message.member.roles.find(r => r.id === protect)) return;
    collector2.on('collect', () => {
        const collector3 = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, { time: 2e3 });
        collector.stop();
        collector3.on('collect', () => {
          collector3.stop();
          const phrases = ['Тебя уебать, пёс?', 'Тебя тапком ебать?', 'Может тебе сука въебать?', 
          'Тебя что, ведром уебать?', 'Тебя с какой уебать?', 'Тебе в "Е", бать?', 'Как уебу сука',
          'Ты ебанулся?', 'Не спамь, уёбок', ''];
          message.reply(randomElement(phrases));
          const collector4 = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, { time: 2e3 });
            collector4.on('collect', () => {
              collector4.stop();
              message.channel.send(`${message.author} Был уёбан с вертухи за флуд. Кто следующий?`);
              setTimeout(() => message.member.removeRole('698840570809942076'), 6e5);
              return message.member.addRole('698840570809942076');
            });
        })
    })
  });

  if (match) {
    let invitesList = await message.guild.fetchInvites();
    if (!invitesList.find(i => i.code === match[2]) && !message.member.roles.find(r => r.id === protect)) {
        message.delete();
        await message.author.send('Ты ебанашка')
        message.channel.send(`${message.author} Был уёбан с вертухи за рекламу. Кто следующий?`);
        return message.member.ban('Пидорас рекламит сервер')
    };
  };

  if (message.content.match(/:flag_nazi:/)) {
      const replies = ['СЛАВА АРИЙСКОЙ РАСЕ', 'ВО ИМЯ АРИЙСКОЙ РАСЫ', 'ГИТЛЕР НАШ ВОЖДЬ', 'ВЛАСТЬ БЕЛЫМ',
      '14/88', 'ЗИГ ХАЙЛЬ', 'ХАЙЛЬ ГИТЛЕР', 'MEIN FUHRER', 'СЛАВА НАШЕМУ ФЮРЕРУ', 'СЛАВА ГИТЛЕРУ',
      'СМЕРТЬ ЕВРЕЯМ', 'ЕВРЕИ - UNTERMENSCH'];
      message.channel.send(randomElement(replies))
  };

  if (!message.content.startsWith(bot.prefix)) return;
  const args = message.content.slice(bot.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  if (command === 'say') bot.channels.get(chat).send(args.join(' ')).catch(err => message.reply('Ты долбоеб чтоле?'));

  if (command === 'срач') {
    message.channel.send('Слоумод ставим? Напишите "да", если вы согласны на слоумод');
    let used = [];
    const collector = new Discord.MessageCollector(message.channel, m => !used.includes(m.author.id) && m.content.toLowerCase() === 'да' && !m.author.bot, { time: 3e4 });
    collector.on('collect', msg => {
      used.push(msg.author.id);
      if (msg.member.roles.find(r => r.name.match(/слоумод/i))) used = [1, 2, 3, 4]
      message.channel.send(`${used.length}/4`);
      if (used.length > 3) {
        collector.stop();
        message.channel.edit({rateLimitPerUser: 15});
        message.channel.send('Слуомод поставлен, сосите хуй)');
        setTimeout(() => message.channel.edit({rateLimitPerUser: 0}), 5e5);
      };
    });
  };

  if (command === 'eval' && message.author.id === config.owner) {
    try {
      message.channel.send(`//Заебумба ✅\n${eval(args.join(' '))}`, {code: 'js', split: '\n'});
    } catch (err) {
      message.channel.send(`//Пизда ❎\n${err}`, {code: 'js'});
    };
  }

  const args2 = message.content
    .substr(bot.prefix.length)
    .split(' ')

  const cmd = args2.shift()

  const command2 = bot.commands[cmd]
  if(!command2) return
  if (message.channel.id === chat) return message.reply('только не чате, уебок')
  command2.run(bot, message, args2)
};

bot.on('message', async m => {
  m.createdAt.getMinutes()
  onMsg(m)
});
bot.on('messageUpdate', async (_m, m) => onMsg(m));

bot.on('voiceStateUpdate', async (o, n) => {
  if(n.channel) voice.add(n.id)
  else voice.delete(n.id)
});

let memberRoles = {};
bot.on('guildMemberRemove', (member) => {
  memberRoles[member.id] = member.roles.map(r => r.id);
});

bot.on('guildMemberAdd', (member) => {
  if (member.guild.id !== cc) return;
  if (!memberRoles[member.id]) {
    member.addRole(owner);
    setTimeout(() => member.removeRole(owner), 6e5);
  } else memberRoles[member.id].forEach(r => {
    if (r !== member.guild.defaultRole.id) member.addRole(r)
  });
});