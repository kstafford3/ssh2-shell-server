const ssh2Utils = require('ssh2').utils;

const RAW_PUBLIC_KEY = 'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQCnGv1S0T53Ghw6sWUomFVgRKaPAkFeCFjdCN8PdA9HZ3VhfkIhbFS+FeP13mbAYLsOzR1cs0f3SU+IdbJ2M8gSYUx/6bnrR69K+iX7QBl9MZZ9Ei8q8UNo5h8Gsqx8ukljCEx+VFo/phhHZcTD/3CBT+EZvVR/QszySdqo61+zYBeNUf13w2piPRXT4hnTx8UKORtfOGYuFTB+IaQQue0V76o3RKX5M+q4TDg3IP2IdYEzk7x6/9tcGm1giyMBUm+iUjLYfIxCIam9Ec+XxDD3pCkpaAXyrlapAu5hktJFrEpz9+yCqHi20AH4jo6JU0xO1h/4Cxf+NEzjp2AUvmE/'

function loadPublicKey() {
  const parsedKey = ssh2Utils.parseKey(RAW_PUBLIC_KEY);
  const publicKey = ssh2Utils.genPublicKey(parsedKey);
  return publicKey;
}

module.exports = loadPublicKey;
