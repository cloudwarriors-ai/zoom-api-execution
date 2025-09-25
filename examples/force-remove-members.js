require('dotenv').config();
const ZoomAPIClient = require('../zoom-api-client');

async function forceRemoveMembers() {
  console.log('Force removing all known members from call queue: Opencode-Tyler\n');

  const client = new ZoomAPIClient();
  const queueId = 'ESvaVhtHTHGcjZKrA6OyuQ';

  // Known member IDs from the detailed queue check
  const knownMemberIds = [
    'Mb4vcQ4YQUaQKJjoY4vntQ', // Chad Simon
    'wc7WZVkGRMGcNWOYTksTvQ', // John Rudolph
    'qHmFkCXTQhyblmrJQN2TlA', // Nick Gianoli
    'MCzsBUKYQle4uyqBHCew3Q', // Trent Charlton
    'skWIRH4OSxCzCHxgvKeBCA', // Jason McDonald
    'WFA9hJgeTKSxy1uajljOFg', // Todd Weber
    'K6-Nh3RyTkGvdDqsQD7nrA', // Kirk Millisor
    'qMLIJ05DQR2bkudJP76pvQ', // Scott Millisor
    'T5tlAPh8SrmWiN0BqbI-TA', // Jeff Searcy
    'q_jTVxkiQjKHbw5PoQi8ag', // Mo Waddell
    'JxdfLTukQWif8TT4RzIW4w', // Wesley Stevens
    'j8UOGi_1QIKNVQ_N0-zOPg', // Doug Ruby
    'bYvS-yJ9RWawv24wBtB3dA', // Jason Stables
    'hrbPd4EJR4iLtd3GFkpoGQ', // Jonathan Rosario
    'hi5QR8y3QlyA5W7inr1_Gw', // Kindra DeJongh
    'HkYhqBc-T0qwWjJspgTAhw', // Brian Hussey
    'GKcsIzYWR9yLZNYnv18WsQ', // Daniel Motschenbacher
    'dHTl-H8fQDawlcdVtsxwyA', // Bill Sugg
    '8HMhEOOwSFGDEKQLhA2qBA', // Gregory Kiger
    'ajWT5wF_RE2B1HDdzA36XQ', // Rebecca Cichy
    'COISwAPgQZ-EhyOGCmV5Bw', // Chris Nebel
    'vBCwaIlxSQWTWXCaatO6-g'  // Tyler Pratt
  ];

  console.log(`Attempting to remove ${knownMemberIds.length} members...`);
  console.log();

  let removedCount = 0;
  let failedCount = 0;

  // Remove each member
  for (let i = 0; i < knownMemberIds.length; i++) {
    const memberId = knownMemberIds[i];
    console.log(`Removing member ${i + 1}/${knownMemberIds.length} (ID: ${memberId})...`);

    try {
      await client.makeRequest('DELETE', `/phone/call_queues/${queueId}/members/${memberId}`);
      console.log(`✅ Successfully removed member ${memberId}`);
      removedCount++;
    } catch (error) {
      console.log(`❌ Failed to remove member ${memberId}:`, error.message);
      failedCount++;

      if (error.response) {
        console.log(`   Status: ${error.response.status}`);
        if (error.response.data?.message) {
          console.log(`   Message: ${error.response.data.message}`);
        }
      }
    }

    // Small delay between removals
    if (i < knownMemberIds.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 300));
    }
  }

  console.log();
  console.log('Removal Summary:');
  console.log(`✅ Successfully removed: ${removedCount} members`);
  console.log(`❌ Failed to remove: ${failedCount} members`);
  console.log();

  // Final verification
  console.log('Final verification...');
  await new Promise(resolve => setTimeout(resolve, 2000));

  const finalDetails = await client.getCallQueue(queueId);
  const remainingMembers = finalDetails.users || [];

  console.log(`Remaining members in queue: ${remainingMembers.length}`);

  if (remainingMembers.length === 0) {
    console.log('\n🎉 SUCCESS: All members have been removed from the call queue!');
    console.log('📞 Call queue "Opencode-Tyler" is now empty');
  } else {
    console.log('\n⚠️  Some members may still remain:');
    remainingMembers.forEach((member, index) => {
      console.log(`  ${index + 1}. ${member.name} (ID: ${member.id})`);
    });
  }
}

forceRemoveMembers();