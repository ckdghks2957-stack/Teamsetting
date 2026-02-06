document.addEventListener('DOMContentLoaded', () => {
  const membersTextarea = document.getElementById('members');
  const leadersTextarea = document.getElementById('leaders');
  const numTeamsInput = document.getElementById('numTeams');
  const generateButton = document.getElementById('generateTeams');
  const teamResultsDiv = document.getElementById('teamResults');

  // Utility function to shuffle an array
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  generateButton.addEventListener('click', generateTeams);

  function generateTeams() {
    const allMembers = membersTextarea.value.split('\n').map(name => name.trim()).filter(name => name !== '');
    const allLeaders = leadersTextarea.value.split('\n').map(name => name.trim()).filter(name => name !== '');
    const numTeams = parseInt(numTeamsInput.value, 10);

    // Basic validation
    if (isNaN(numTeams) || numTeams < 1) {
      alert('Please enter a valid number of teams (at least 1).');
      return;
    }

    if (allMembers.length === 0 && allLeaders.length === 0) {
      alert('Please enter some team members or leaders.');
      return;
    }

    // Filter out leaders from the general members list
    const nonLeaderMembers = allMembers.filter(member => !allLeaders.includes(member));

    // Initialize teams
    const teams = Array.from({ length: numTeams }, () => ({
      name: '', // Will be set later if needed
      members: []
    }));

    // Assign leaders first
    let currentTeamIndex = 0;
    for (const leader of allLeaders) {
      if (currentTeamIndex < numTeams) {
        teams[currentTeamIndex].members.push(leader + ' (Leader)');
        currentTeamIndex++;
      } else {
        // If more leaders than teams, assign remaining leaders to existing teams
        // or handle as an error/warning depending on desired behavior
        // For now, let's just add them to teams cyclically
        teams[currentTeamIndex % numTeams].members.push(leader + ' (Leader)');
        currentTeamIndex++;
      }
    }

    // Shuffle non-leader members
    const shuffledNonLeaderMembers = shuffleArray(nonLeaderMembers);

    // Distribute remaining members
    for (let i = 0; i < shuffledNonLeaderMembers.length; i++) {
      const member = shuffledNonLeaderMembers[i];
      teams[(currentTeamIndex + i) % numTeams].members.push(member);
    }

    // Display results
    displayTeams(teams);
  }

  function displayTeams(teams) {
    teamResultsDiv.innerHTML = ''; // Clear previous results

    if (teams.length === 0) {
      teamResultsDiv.innerHTML = '<p>No teams generated.</p>';
      return;
    }

    const heading = document.createElement('h2');
    heading.textContent = 'Generated Teams';
    teamResultsDiv.appendChild(heading);

    teams.forEach((team, index) => {
      const teamDiv = document.createElement('div');
      teamDiv.classList.add('team');

      const teamName = document.createElement('h3');
      teamName.textContent = `Team ${index + 1}`;
      teamDiv.appendChild(teamName);

      const memberList = document.createElement('ul');
      if (team.members.length === 0) {
        const noMembersItem = document.createElement('li');
        noMembersItem.textContent = 'No members in this team.';
        memberList.appendChild(noMembersItem);
      } else {
        team.members.forEach(member => {
          const listItem = document.createElement('li');
          listItem.textContent = member;
          memberList.appendChild(listItem);
        });
      }
      teamDiv.appendChild(memberList);
      teamResultsDiv.appendChild(teamDiv);
    });
  }

  // Initial population for demonstration
  membersTextarea.value = `Alice
Bob
Charlie
David
Eve
Frank
Grace
Heidi
Ivan
Judy
Kevin
Liam`;

  leadersTextarea.value = `Alice
Bob`;

  generateTeams(); // Generate teams on initial load
});
