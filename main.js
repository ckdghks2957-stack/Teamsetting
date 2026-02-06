/**
 * Wonderland Team Maker v3.1
 * Refined Interaction & Custom Member Management
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const memberNameInput = document.getElementById('memberNameInput');
  const addMemberBtn = document.getElementById('addMemberBtn');
  const memberTagContainer = document.getElementById('memberTagContainer');
  const totalCountSpan = document.getElementById('totalMemberCount');
  const numTeamsInput = document.getElementById('numTeams');
  const generateButton = document.getElementById('generateTeams');
  const teamResultsDiv = document.getElementById('teamResults');

  // State
  let members = []; // { id, name, isLeader }

  // TEAM THEMES
  const TEAM_THEMES = [
    { name: 'Team Heart', class: 'team-heart', icon: '👑', symbol: '하트 왕국' },
    { name: 'Team Spade', class: 'team-spade', icon: '🛡️', symbol: '스페이드 기사단' },
    { name: 'Team Diamond', class: 'team-diamond', icon: '💎', symbol: '다이아 광산' },
    { name: 'Team Clover', class: 'team-clover', icon: '🍄', symbol: '클로버 숲' }
  ];

  // Helper Functions
  const updateMemberUI = () => {
    memberTagContainer.innerHTML = '';
    
    if (members.length === 0) {
      memberTagContainer.innerHTML = '<div class="empty-list-msg">추가된 모험가가 없습니다.</div>';
    } else {
      members.forEach(member => {
        const tag = document.createElement('div');
        tag.className = `member-tag ${member.isLeader ? 'is-leader' : ''}`;
        tag.innerHTML = `
          ${member.isLeader ? '<span class="leader-indicator">👑</span>' : ''}
          <span class="name">${member.name}</span>
          <span class="remove-btn" data-id="${member.id}">&times;</span>
        `;
        
        // Toggle Leader Status on tag click (except remove button)
        tag.addEventListener('click', (e) => {
          if (e.target.classList.contains('remove-btn')) return;
          toggleLeader(member.id);
        });

        // Remove Member
        tag.querySelector('.remove-btn').addEventListener('click', () => {
          removeMember(member.id);
        });

        memberTagContainer.appendChild(tag);
      });
    }
    
    totalCountSpan.textContent = members.length;
  };

  const addMember = () => {
    const name = memberNameInput.value.trim();
    if (!name) return;
    
    if (members.some(m => m.name === name)) {
      alert('이미 등록된 이름입니다.');
      return;
    }

    const newMember = {
      id: Date.now() + Math.random(),
      name: name,
      isLeader: false
    };

    members.push(newMember);
    memberNameInput.value = '';
    memberNameInput.focus();
    updateMemberUI();
  };

  const removeMember = (id) => {
    members = members.filter(m => m.id !== id);
    updateMemberUI();
  };

  const toggleLeader = (id) => {
    members = members.map(m => {
      if (m.id === id) {
        return { ...m, isLeader: !m.isLeader };
      }
      return m;
    });
    updateMemberUI();
  };

  function shuffleArray(array) {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  const fireWonderlandConfetti = () => {
    const scalar = 2;
    const heart = confetti.shapeFromText({ text: '❤️', scalar });
    const diamond = confetti.shapeFromText({ text: '♦️', scalar });
    const spade = confetti.shapeFromText({ text: '♠️', scalar });
    const clover = confetti.shapeFromText({ text: '♣️', scalar });

    const defaults = {
      spread: 360,
      ticks: 60,
      gravity: 0.5,
      decay: 0.94,
      startVelocity: 30,
      shapes: [heart, diamond, spade, clover],
      colors: ['#c0392b', '#b8860b', '#2c3e50', '#1e8449']
    };

    confetti({ ...defaults, particleCount: 40 });
  };

  const generateTeams = () => {
    if (members.length === 0) {
      alert('모험가들을 추가해주세요!');
      return;
    }

    const numTeams = parseInt(numTeamsInput.value, 10);
    const leaders = members.filter(m => m.isLeader);
    const nonLeaders = members.filter(m => !m.isLeader);

    if (leaders.length > numTeams) {
      alert(`왕국의 수(${numTeams})보다 왕국의 주인(${leaders.length})이 더 많습니다. 왕국의 수를 늘리거나 주인을 줄여주세요.`);
      return;
    }

    generateButton.disabled = true;
    const originalBtnText = generateButton.querySelector('.btn-text').textContent;
    generateButton.querySelector('.btn-text').textContent = '운명을 정하는 중...';

    setTimeout(() => {
      const teams = Array.from({ length: numTeams }, (_, i) => ({
        ...TEAM_THEMES[i % TEAM_THEMES.length],
        members: [],
        leaders: []
      }));

      // Distribute Leaders
      const shuffledLeaders = shuffleArray(leaders);
      shuffledLeaders.forEach((leader, i) => {
        teams[i % numTeams].leaders.push(leader.name);
      });

      // Distribute Non-Leaders
      const shuffledNonLeaders = shuffleArray(nonLeaders);
      let currentTeamIndex = Math.floor(Math.random() * numTeams);
      shuffledNonLeaders.forEach(member => {
        teams[currentTeamIndex % numTeams].members.push(member.name);
        currentTeamIndex++;
      });

      renderResults(teams);
      generateButton.disabled = false;
      generateButton.querySelector('.btn-text').textContent = originalBtnText;
      fireWonderlandConfetti();
    }, 800);
  };

  const renderResults = (teams) => {
    teamResultsDiv.innerHTML = '';

    teams.forEach((team, index) => {
      const card = document.createElement('div');
      card.className = `tarot-card ${team.class}`;
      card.style.animationDelay = `${index * 0.15}s`;

      card.innerHTML = `
        <div class="card-inner">
          <div class="card-header">
            <h3 class="team-title">${team.name}</h3>
            <p class="team-subtitle">${team.symbol}</p>
          </div>
          <div class="card-illustration">
            ${team.icon}
          </div>
          <ul class="member-list">
            ${team.leaders.map(l => `<li class="tarot-member is-leader">👑 ${l}</li>`).join('')}
            ${team.members.map(m => `<li class="tarot-member">${m}</li>`).join('')}
            ${(team.leaders.length + team.members.length === 0) ? '<li class="tarot-member">공허한 왕국</li>' : ''}
          </ul>
        </div>
      `;
      teamResultsDiv.appendChild(card);
    });

    teamResultsDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Event Listeners
  addMemberBtn.addEventListener('click', addMember);
  memberNameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addMember();
  });
  generateButton.addEventListener('click', generateTeams);

  // Initial UI
  updateMemberUI();
});
