/**
 * Team Maker v2.0
 * Modern, Fun, and Immersive Team Formation
 */

document.addEventListener('DOMContentLoaded', () => {
  const membersTextarea = document.getElementById('members');
  const leadersTextarea = document.getElementById('leaders');
  const numTeamsInput = document.getElementById('numTeams');
  const generateButton = document.getElementById('generateTeams');
  const teamResultsDiv = document.getElementById('teamResults');

  // Utility: Shuffle array using Fisher-Yates algorithm
  function shuffleArray(array) {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  const generateTeams = () => {
    const allMembers = membersTextarea.value.split('\n')
      .map(name => name.trim())
      .filter(name => name !== '');
    
    const allLeaders = leadersTextarea.value.split('\n')
      .map(name => name.trim())
      .filter(name => name !== '');
    
    const numTeams = parseInt(numTeamsInput.value, 10);

    // Validation with a bit of personality
    if (isNaN(numTeams) || numTeams < 1) {
      alert('최소 1개 이상의 팀을 만들어야 합니다! 😊');
      return;
    }

    if (allMembers.length === 0 && allLeaders.length === 0) {
      alert('함께할 멤버들의 이름을 입력해주세요! 👥');
      return;
    }

    // Add generating animation class to button
    generateButton.classList.add('loading');
    generateButton.disabled = true;
    const originalBtnText = generateButton.innerHTML;
    generateButton.innerHTML = '<span>팀 편성 중...</span> <span class="spinner">🌀</span>';

    // Simulate "thinking" for a more immersive feel
    setTimeout(() => {
      processGeneration(allMembers, allLeaders, numTeams);
      generateButton.classList.remove('loading');
      generateButton.disabled = false;
      generateButton.innerHTML = originalBtnText;
      
      // Smooth scroll to results
      teamResultsDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 600);
  };

  const processGeneration = (allMembers, allLeaders, numTeams) => {
    // Filter out leaders from the general members list to avoid duplicates
    const nonLeaderMembers = allMembers.filter(member => !allLeaders.includes(member));

    // Initialize teams
    const teams = Array.from({ length: numTeams }, (_, i) => ({
      id: i + 1,
      members: [],
      leaders: []
    }));

    // Assign leaders first (distribute as evenly as possible)
    let leaderIndex = 0;
    const shuffledLeaders = shuffleArray(allLeaders);
    shuffledLeaders.forEach(leader => {
      teams[leaderIndex % numTeams].leaders.push(leader);
      leaderIndex++;
    });

    // Shuffle non-leader members
    const shuffledMembers = shuffleArray(nonLeaderMembers);

    // Distribute remaining members starting from teams that might have fewer leaders
    // To keep it simple but fair, we'll just continue from where leader assignment left off
    // or start fresh for a more "random" feel. Let's start fresh with a random offset.
    let currentTeamIndex = Math.floor(Math.random() * numTeams);
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
      teamCard.style.animationDelay = `${index * 0.1}s`;

      const totalCount = team.leaders.length + team.members.length;

      teamCard.innerHTML = `
        <h3>
          <span>제 ${team.id}팀</span>
          <span class="team-count">${totalCount}명</span>
        </h3>
        <ul class="member-list">
          ${team.leaders.map(leader => `
            <li class="member-item is-leader">
              <span class="name">${leader}</span>
            </li>
          `).join('')}
          ${team.members.map(member => `
            <li class="member-item">
              <span class="name">${member}</span>
            </li>
          `).join('')}
          ${totalCount === 0 ? '<li class="member-item">멤버가 없습니다.</li>' : ''}
        </ul>
      `;
      teamResultsDiv.appendChild(teamCard);
    });
  };

  // Initial Korean Dummy Data
  membersTextarea.value = `강호동
유재석
신동엽
이경규
김구라
박명수
정준하
하하
노홍철
정형돈
양세형
조세호`;

  leadersTextarea.value = `유재석
강호동`;

  generateButton.addEventListener('click', generateTeams);
});