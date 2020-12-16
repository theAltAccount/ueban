let bot

const load = b => { bot = b }

const addCurrency = async (value, name) => {
  await (new bot.colls.currencies({
    value, name
  })).save()

  await bot.colls.users.updateMany({}, { $push: { money: 0 } })
  await bot.colls.shop.updateMany({}, { $push: { cost: 0 } })
}

const addMoney = async (id, currency, amount) => {
  await getUser(id)
  await bot.colls.users.updateOne({ id }, { $inc: { [`money.${currency}`]: amount } })
}

const createItem = async (name, description, cost, gives, owner) => {
  await (new bot.colls.shop({
    name, description, cost, gives, owner
  })).save()
}

const createUser = async id => {
  money = []

  const query = await bot.colls.currencies.find()

  for(let i in query) {
    money[i] = 0
  }

  await (new bot.colls.users({
    id, money
  })).save()
}

const getActiveReward = async () => {
  return (await bot.colls.config.findOne({}, 'activereward')).activereward
}

const getCurrency = async id => {
  const currs = await getCurrencies()
  let result

  const n = Number(id)
  if(!isNaN(n) && n < currs.length) {
    result = currs[n]
    result.n = n
  } else return

  if(!result) {
    for(let i in currs) {
      const c = currs[i]
      if([c.name, c.value].includes(id)) {
        c.n = i
        result = c

        break
      }
    }
  }

  return result
}

const getCurrencies = async () => {
  const result = []

  const currs = await bot.colls.currencies.find({})
  for(let curr of currs) {
    result.push(curr)
  }

  return result
}

const getItem = async (name) => {
  return await bot.colls.shop.findOne({ name: { $regex: '.*' + name + '.*'} })
}

const getItems = async () => {
  return await bot.colls.shop.find({})
}

const getUser = async id => {
  let user = await bot.colls.users.findOne({ id })
  if(user == null) {
    await createUser(id)
    user = await getUser(id)
  }

  return user
}

const random = (min, max) => {
  return Math.floor( Math.random() * (max - min + 1) ) + min
}

const removeCurrency = async id => {
  await bot.colls.users.updateMany({}, { $pull: { money: { $position: id } } })
  await bot.colls.shop.updateMany({}, { $pull: { cost: { $position: id } } })
}

module.exports = { load, addCurrency, addMoney, createItem, createUser, getActiveReward, getCurrency, getCurrencies, getItem, getItems, getUser, random }