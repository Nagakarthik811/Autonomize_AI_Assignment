// Frontend Code: React Application
import React, { useState, useEffect } from 'react';
import './App.css'; // Importing CSS styles

// API utility to cache data
const cache = {};
const fetchData = async (url) => {
  if (cache[url]) return cache[url];
  const response = await fetch(url);
  const data = await response.json();
  cache[url] = data;
  return data;
};

// Components
const App = () => {
  const [username, setUsername] = useState('');
  const [userInfo, setUserInfo] = useState(null);
  const [repos, setRepos] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [view, setView] = useState('search');
  const [sortField, setSortField] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('asc');
  const [followerSortField, setFollowerSortField] = useState('login');
  const [followerSortOrder, setFollowerSortOrder] = useState('asc');

  const handleSearch = async () => {
    const userData = await fetchData(`https://api.github.com/users/${username}`);
    const repoData = await fetchData(userData.repos_url);
    const followerData = await fetchData(userData.followers_url);
    const followingData = await fetchData(userData.following_url.replace('{/other_user}', ''));

    setUserInfo(userData);
    setRepos(repoData);
    setFollowers(followerData);
    setFollowing(followingData);
    setView('repos');
  };

  const sortedRepos = () => {
    return [...repos].sort((a, b) => {
      if (sortOrder === 'asc') {
        return a[sortField] > b[sortField] ? 1 : -1;
      }
      return a[sortField] < b[sortField] ? 1 : -1;
    });
  };

  const sortedFollowers = (list) => {
    return [...list].sort((a, b) => {
      if (followerSortOrder === 'asc') {
        return a[followerSortField] > b[followerSortField] ? 1 : -1;
      }
      return a[followerSortField] < b[followerSortField] ? 1 : -1;
    });
  };

  return (
    <div className="app-container">
      {view === 'search' && (
        <div className="search-container fade-in">
          <h1 className="title">GitHub User Search</h1>
          <input
            type="text"
            className="input-box"
            placeholder="Enter GitHub username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button className="button" onClick={handleSearch}>Search</button>
        </div>
      )}

      {view === 'repos' && userInfo && (
        <div className="repos-container fade-in">
          <button className="button" onClick={() => setView('search')}>Back to Search</button>
          <div className="user-header">
            <img src={userInfo.avatar_url} alt="Avatar" className="avatar" />
            <div className="user-info">
              <h2>{userInfo.name} ({userInfo.login})</h2>
              <p className="bio">{userInfo.bio}</p>
              <p>Followers: {userInfo.followers} | Following: {userInfo.following}</p>
              <button className="button" onClick={() => setView('followers')}>View Followers</button>
              <button className="button" onClick={() => setView('following')}>View Following</button>
            </div>
          </div>
          <h3 className="sub-title">Repositories</h3>
          <div className="sort-controls">
            <label>
              Sort By:
              <select value={sortField} onChange={(e) => setSortField(e.target.value)}>
                <option value="created_at">Created At</option>
                <option value="updated_at">Updated At</option>
                <option value="stargazers_count">Stars</option>
                <option value="forks">Forks</option>
              </select>
            </label>
            <label>
              Order:
              <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </label>
          </div>
          <ul className="list">
            {sortedRepos().map((repo) => (
              <li key={repo.id} className="list-item">
                <a className="link" href={repo.html_url} target="_blank" rel="noopener noreferrer">
                  {repo.name}
                </a> - Stars: {repo.stargazers_count}, Forks: {repo.forks}
              </li>
            ))}
          </ul>
        </div>
      )}

      {view === 'followers' && (
        <div className="followers-container fade-in">
          <button className="button" onClick={() => setView('repos')}>Back to Repositories</button>
          <h3 className="sub-title">Followers</h3>
          <div className="sort-controls">
            <label>
              Sort By:
              <select value={followerSortField} onChange={(e) => setFollowerSortField(e.target.value)}>
                <option value="login">Login</option>
              </select>
            </label>
            <label>
              Order:
              <select value={followerSortOrder} onChange={(e) => setFollowerSortOrder(e.target.value)}>
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </label>
          </div>
          <ul className="list">
            {sortedFollowers(followers).map((follower) => (
              <li key={follower.id} className="list-item">
                <a
                  className="link"
                  href="#"
                  onClick={async () => {
                    setUsername(follower.login);
                    await handleSearch();
                  }}
                >
                  {follower.login}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {view === 'following' && (
        <div className="following-container fade-in">
          <button className="button" onClick={() => setView('repos')}>Back to Repositories</button>
          <h3 className="sub-title">Following</h3>
          <div className="sort-controls">
            <label>
              Sort By:
              <select value={followerSortField} onChange={(e) => setFollowerSortField(e.target.value)}>
                <option value="login">Login</option>
              </select>
            </label>
            <label>
              Order:
              <select value={followerSortOrder} onChange={(e) => setFollowerSortOrder(e.target.value)}>
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </label>
          </div>
          <ul className="list">
            {sortedFollowers(following).map((followed) => (
              <li key={followed.id} className="list-item">
                <a
                  className="link"
                  href="#"
                  onClick={async () => {
                    setUsername(followed.login);
                    await handleSearch();
                  }}
                >
                  {followed.login}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default App;