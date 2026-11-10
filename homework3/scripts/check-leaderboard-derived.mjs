import assert from 'node:assert/strict';

console.log('--- TEST: PVS Leaderboard Pure Derived State & Filtering ---');

const mockTeams = [
  { rank: 1, teamId: 'ces', teamName: 'Cerberus Esports', tag: 'CES', totalPoints: 152, killPoints: 84, wwcdCount: 5 },
  { rank: 2, teamId: 'te', teamName: 'The Expendables', tag: 'TE', totalPoints: 137, killPoints: 78, wwcdCount: 4 },
  { rank: 3, teamId: 'ge', teamName: 'Genius Esports', tag: 'GE', totalPoints: 100, killPoints: 56, wwcdCount: 2 },
  { rank: 4, teamId: 'agg', teamName: 'All Gamers Global', tag: 'AGG', totalPoints: 85, killPoints: 49, wwcdCount: 1 },
];

function processLeaderboard(teams, query, sortField, direction) {
  const normalized = query.trim().toLowerCase();
  const filtered = teams.filter(
    t => t.teamName.toLowerCase().includes(normalized) || t.tag.toLowerCase().includes(normalized)
  );

  return [...filtered].sort((a, b) => {
    const comp = a[sortField] - b[sortField];
    return direction === 'desc' ? -comp : comp;
  });
}

// 1. Kiểm tra sắp xếp mặc định: Tổng điểm giảm dần
const defaultList = processLeaderboard(mockTeams, '', 'totalPoints', 'desc');
assert.equal(defaultList[0].tag, 'CES');
assert.equal(defaultList[1].tag, 'TE');
console.log('✓ Default ranking by Total Points (desc) verified.');

// 2. Kiểm tra sắp xếp theo Kill Points tăng dần
const ascKillList = processLeaderboard(mockTeams, '', 'killPoints', 'asc');
assert.equal(ascKillList[0].tag, 'AGG'); // AGG có 49 kill thấp nhất
assert.equal(ascKillList[ascKillList.length - 1].tag, 'CES'); // CES có 84 kill cao nhất
console.log('✓ Inverted sorting by Kill Points (asc) verified.');

// 3. Kiểm tra tìm kiếm theo Tag ("TE")
const searchTe = processLeaderboard(mockTeams, 'TE', 'totalPoints', 'desc');
assert.equal(searchTe.length, 1);
assert.equal(searchTe[0].teamName, 'The Expendables');
console.log('✓ Exact Tag search filter verified.');

// 4. Kiểm tra tìm kiếm không phân biệt hoa thường ("cerberus")
const searchCase = processLeaderboard(mockTeams, 'cerberus', 'totalPoints', 'desc');
assert.equal(searchCase.length, 1);
assert.equal(searchCase[0].tag, 'CES');
console.log('✓ Case-insensitive search filter verified.');

console.log('\nAll PVS Leaderboard Pure Derived State tests passed successfully!');