/**
 * Team Maker v2.0 - Neon Edition
 * Core Logic + Visual Effects
 */

document.addEventListener('DOMContentLoaded', () => {
  const membersTextarea = document.getElementById('members');
  const leadersTextarea = document.getElementById('leaders');
  const numTeamsInput = document.getElementById('numTeams');
  const generateButton = document.getElementById('generateTeams');
  const teamResultsDiv = document.getElementById('teamResults');

  // Shuffle Array (Fisher-Yates)
  function shuffleArray(array) {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  // Trigger Confetti
  const fireConfetti = () => {
    const duration = 3000;
    const end = Date.now() + duration;

    (function frame() {
      // launch a few confetti from the left edge
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#00f3ff', '#ff00ff', '#bc13fe']
      });
      // and launch a few from the right edge
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#00f3ff', '#ff00ff', '#bc13fe']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  };

  const generateTeams = () => {
    const allMembers = membersTextarea.value.split('\n')
      .map(name => name.trim())
      .filter(name => name !== '');
    
    const allLeaders = leadersTextarea.value.split('\n')
      .map(name => name.trim())
      .filter(name => name !== '');
    
    const numTeams = parseInt(numTeamsInput.value, 10);

    if (isNaN(numTeams) || numTeams < 1) {
      alert('최소 1개 이상의 팀을 만들어야 합니다!');
      return;
    }

    if (allMembers.length === 0 && allLeaders.length === 0) {
      alert('참가자 목록을 입력해주세요.');
      return;
    }

    // Interaction Feedback
    const btnContent = generateButton.querySelector('.btn-content');
    const originalText = btnContent.textContent;
    btnContent.textContent = 'GENERATING...';
    generateButton.disabled = true;

    // Simulate Processing Delay for effect
    setTimeout(() => {
      processGeneration(allMembers, allLeaders, numTeams);
      
      btnContent.textContent = originalText;
      generateButton.disabled = false;
      
      // Scroll and Celebrate
      teamResultsDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
      fireConfetti();
    }, 800);
  };

  const processGeneration = (allMembers, allLeaders, numTeams) => {
    const nonLeaderMembers = allMembers.filter(member => !allLeaders.includes(member));

    const teams = Array.from({ length: numTeams }, (_, i) => ({
      id: i + 1,
      members: [],
      leaders: []
    }));

    // Assign Leaders
    let leaderIndex = 0;
    const shuffledLeaders = shuffleArray(allLeaders);
    shuffledLeaders.forEach(leader => {
      teams[leaderIndex % numTeams].leaders.push(leader);
      leaderIndex++;
    });

    // Assign Members
    const shuffledMembers = shuffleArray(nonLeaderMembers);
    let currentTeamIndex = Math.floor(Math.random() * numTeams); // Random start
    shuffledMembers.forEach(member => {
      teams[currentTeamIndex % numTeams].members.push(member);
      currentTeamIndex++;
    });

    renderResults(teams);
  };

  const renderResults = (teams) => {
    teamResultsDiv.innerHTML = '';

    if (teams.length === 0) {
      teamResultsDiv.innerHTML = '<div class="empty-state">결과가 없습니다.</div>';
      return;
    }

    teams.forEach((team, index) => {
      const teamCard = document.createElement('div');
      teamCard.className = 'team-card';
      teamCard.style.animationDelay = `${index * 0.15}s`; // Staggered animation

      const totalCount = team.leaders.length + team.members.length;

      teamCard.innerHTML = `
        <div class="card-header">
          <h3>TEAM 0${team.id}</h3>
          <span class="count-badge">${totalCount}명</span>
        </div>
        <ul class="member-list">
          ${team.leaders.map(leader => `
            <li class="member-item is-leader">
              <span class="leader-icon">👑</span>
              <span class="name">${leader}</span>
            </li>
          `).join('')}
          ${team.members.map(member => `
            <li class="member-item">
              <span class="name">${member}</span>
            </li>
          `).join('')}
        </ul>
      `;
      teamResultsDiv.appendChild(teamCard);
    });
  };

  // Default Data
  if (!membersTextarea.value) {
    membersTextarea.value = `강호동\n유재석\n신동엽\n이경규\n김구라\n박명수\n정준하\n하하\n노홍철\n정형돈\n양세형\n조세호`;
  }
  if (!leadersTextarea.value) {
    leadersTextarea.value = `유재석\n강호동`;
  }

  generateButton.addEventListener('click', generateTeams);
});
