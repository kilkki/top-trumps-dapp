module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*", // Match any network id
      //gas: 4700000, 
    },
    ropsten: {
      network_id: 2,
      host: "127.0.0.1",
      port: 8545,
      gas: 2900000,
      from: "957c454cf12869274a71df9783d746cb28344342"
    }
  }
};
