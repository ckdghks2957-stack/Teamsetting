/**
 * Alice's Team Maker v3.0 - Storybook Edition
 */

document.addEventListener('DOMContentLoaded', () => {
  const membersTextarea = document.getElementById('members');
  const leadersTextarea = document.getElementById('leaders');
  const numTeamsInput = document.getElementById('numTeams');
  const generateButton = document.getElementById('generateTeams');
  const teamResultsDiv = document.getElementById('teamResults');

  const TEAM_THEMES = [
    { 
      name: 'Team Heart', 
      class: 'team-heart', 
      icon: '👑❤️', 
      symbol: '하트 왕국',
      character: 'Queen of Hearts'
    },
    { 
      name: 'Team Spade', 
      class: 'team-spade', 
      icon: '🛡️♠️', 
      symbol: '스페이드 기사단',
      character: 'Chess Knight'
    },
    { 
      name: 'Team Diamond', 
      class: 'team-diamond', 
      icon: '💎♦️', 
      symbol: '다이아 광산',
      character: 'Jewel Miner'
    },
    { 
      name: 'Team Clover', 
      class: 'team-clover', 
      icon: '🍄♣️', 
      symbol: '클로버 숲',
      character: 'Forest Elf'
    }
  ];

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
      colors: ['#d42426', '#d4af37', '#2c3e50', '#27ae60']
    };

    confetti({ ...defaults, particleCount: 40 });
    confetti({ ...defaults, particleCount: 20, flat: true });
  };

  const generateTeams = () => {
    const allMembers = membersTextarea.value.split('\n')
      .map(name => name.trim())
      .filter(name => name !== '');
    
    const allLeaders = leadersTextarea.value.split('\n')
      .map(name => name.trim())
      .filter(name => name !== '');
    
    let numTeams = parseInt(numTeamsInput.value, 10);
    if (isNaN(numTeams) || numTeams < 1) numTeams = 1;
    if (numTeams > 4) numTeams = 4; // Max 4 for card suits

    if (allMembers.length === 0 && allLeaders.length === 0) {
      alert('모험가들의 이름을 적어주세요!');
      return;
    }

    generateButton.disabled = true;
    generateButton.querySelector('.btn-text').textContent = '주문을 외우는 중...';

    setTimeout(() => {
      processGeneration(allMembers, allLeaders, numTeams);
      generateButton.disabled = false;
      generateButton.querySelector('.btn-text').textContent = '운명의 카드 뽑기';
      fireWonderlandConfetti();
    }, 1000);
  };

  const processGeneration = (allMembers, allLeaders, numTeams) => {
    const nonLeaderMembers = allMembers.filter(member => !allLeaders.includes(member));

    const teams = Array.from({ length: numTeams }, (_, i) => ({
      ...TEAM_THEMES[i % TEAM_THEMES.length],
      members: [],
      leaders: []
    }));

    // Distribute Leaders
    const shuffledLeaders = shuffleArray(allLeaders);
    shuffledLeaders.forEach((leader, i) => {
      teams[i % numTeams].leaders.push(leader);
    });

    // Distribute Members
    const shuffledMembers = shuffleArray(nonLeaderMembers);
    let currentTeamIndex = Math.floor(Math.random() * numTeams);
    shuffledMembers.forEach(member => {
      teams[currentTeamIndex % numTeams].members.push(member);
      currentTeamIndex++;
    });

    renderTarotCards(teams);
  };

  const renderTarotCards = (teams) => {
    teamResultsDiv.innerHTML = '';

    teams.forEach((team, index) => {
      const card = document.createElement('div');
      card.className = `tarot-card ${team.class}`;
      card.style.animationDelay = `${index * 0.2}s`;

      card.innerHTML = `
        <div class="card-inner">
          <div class="card-header">
            <h3 class="team-title">${team.name}</h3>
            <p class="team-subtitle">${team.symbol}</p>
          </div>
          <div class="card-illustration">
            ${team.icon}
          </div>
          <div class="member-scroll">
            <ul class="member-list">
              ${team.leaders.map(l => `<li class="tarot-member is-leader">${l}</li>`).join('')}
              ${team.members.map(m => `<li class="tarot-member">${m}</li>`).join('')}
            </ul>
          </div>
        </div>
      `;
      teamResultsDiv.appendChild(card);
    });

    teamResultsDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Initial Data
  if (!membersTextarea.value) {
    membersTextarea.value = `앨리스\n모자장수\n흰 토끼\n체셔 고양이\n도마우스\n3월의 토끼\n애벌레\n하트 여왕\n하트 잭\n그리핀`;
  }
  if (!leadersTextarea.value) {
    leadersTextarea.value = `앨리스\n모자장수\n하트 여왕`;
  }

  generateButton.addEventListener('click', generateTeams);
});