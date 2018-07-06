require('es6-promise').polyfill()
require('isomorphic-fetch')

function getAssets(symbols) {
  return fetch('//api.coinmarketcap.com/v2/listings/')
    .then(resp => resp.json())
    .then(json => {
      return Object.values(json.data).reduce( (acc, asset) => {
        if (symbols.find(symbol => symbol === asset.symbol)) acc.push(asset)
        return acc
      }, [])
    })
 }


function getPrices(assets) {
  const promises = assets.map(asset => {
    return fetch(`//api.coinmarketcap.com/v2/ticker/${asset.id}`)
      .then(resp => resp.json())
  })

  return Promise.all(promises)
}

const symbols = ['BTC', 'BCH', 'ETH', 'XMR', 'EOS']

getAssets(symbols)
  .then(assets => {
    return getPrices(assets)
      .then(prices => console.log(prices))
  })
  