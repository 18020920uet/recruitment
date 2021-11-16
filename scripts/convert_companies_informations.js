const fs = require('fs')

data.map((v) => {
  const { a1, a2, a3, socialNetworks, ...x } = v;
  return {
    socialNetworks: JSON.parse(socialNetworks),
    addresses: a1.concat('|', a2, '|', a3),
    ...x
  }
});
