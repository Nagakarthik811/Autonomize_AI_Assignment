// Backend Code: Node.js API with Express
const express = require('express');
const axios = require('axios');
const { Sequelize, DataTypes } = require('sequelize');

// Initialize database
const sequelize = new Sequelize('sqlite::memory:');
const User = sequelize.define('User', {
  username: { type: DataTypes.STRING, unique: true },
  details: { type: DataTypes.JSON },
});

// Sync database
sequelize.sync();

const app = express();
app.use(express.json());

// API endpoints
app.get('/user/:username', async (req, res) => {
  const { username } = req.params;
  let user = await User.findOne({ where: { username } });

  if (!user) {
    const response = await axios.get(`https://api.github.com/users/${username}`);
    user = await User.create({ username, details: response.data });
  }

  res.json(user.details);
});

const findMutualFollowers = async (username, followers) => {
    const mutuals = [];
    for (const follower of followers) {
      const otherUser = await User.findOne({ where: { username: follower.login } });
      if (otherUser && otherUser.details.followers.includes(username)) {
        mutuals.push(follower.login);
      }
    }
    return mutuals;
  };

app.delete('/user/:username', async (req, res) => {
  const { username } = req.params;
  await User.destroy({ where: { username } });
  res.json({ message: 'User deleted' });
});

app.listen(3002, () => console.log('Server running on port 3000'));
