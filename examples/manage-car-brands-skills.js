require('dotenv').config();
const ZoomAPIClient = require('../zoom-api-client');

async function manageCarBrandsSkills() {
  console.log('Managing Car Brands Skills in Zoom Contact Center\n');

  const client = new ZoomAPIClient();

  try {
    // Step 1: Create skill category "Car Brands"
    console.log('1. Creating skill category "Car Brands"...');
    const categoryData = {
      skill_category_name: 'Car Brands',
      skill_type: 'text' // Since we want text-based skills
    };

    let category;
    try {
      category = await client.createSkillCategory(categoryData);
      console.log(`✅ Created skill category: ${JSON.stringify(category)}`);
    } catch (error) {
      if (error.response?.data?.code === 1403) {
        // Category already exists, find it
        console.log('Category "Car Brands" already exists, finding it...');
        const categories = await client.getSkillCategories();
        category = categories.skill_categories?.find(cat => cat.skill_category_name === 'Car Brands');
        if (category) {
          console.log(`✅ Found existing category: ${category.skill_category_name} (ID: ${category.id})`);
        } else {
          throw new Error('Could not find existing category');
        }
      } else {
        throw error;
      }
    }

    // Step 2: Create skills
    const skillNames = ['toyota', 'lexus', 'ford', 'chevy', 'dodge'];
    const createdSkills = [];

    console.log('\n2. Creating skills...');
    for (const skillName of skillNames) {
      console.log(`Creating skill: ${skillName}`);

      const skillData = {
        skill_name: skillName,
        skill_category_id: category.skill_category_id
      };

      try {
        const skill = await client.createSkill(skillData);
        console.log(`✅ Created skill: ${JSON.stringify(skill)}`);
        createdSkills.push(skill);
      } catch (error) {
        if (error.response?.data?.code === 1402) {
          // Skill already exists, find it
          console.log(`Skill "${skillName}" already exists, finding it...`);
          const skills = await client.getSkills();
          const existingSkill = skills.skills?.find(s => s.skill_name === skillName && s.skill_category_id === category.skill_category_id);
          if (existingSkill) {
            console.log(`✅ Found existing skill: ${existingSkill.skill_name} (ID: ${existingSkill.skill_id})`);
            createdSkills.push(existingSkill);
          } else {
            console.log(`❌ Could not find existing skill "${skillName}"`);
          }
        } else {
          console.log(`❌ Failed to create skill "${skillName}":`, error.message);
        }
      }
    }

    // Step 2.5: Create agent routing profile for Car Brands skills
    console.log('\n2.5. Creating agent routing profile for Car Brands skills...');
    const profileData = {
      name: 'Car Brands Profile',
      skills: createdSkills.map(skill => ({
        skill_id: skill.skill_id,
        proficiency_level: 1
      }))
    };

    let profile;
    try {
      profile = await client.createAgentRoutingProfile(profileData);
      console.log(`✅ Created agent routing profile: ${profile.name} (ID: ${profile.agent_routing_profile_id})`);
    } catch (error) {
      console.log(`❌ Failed to create routing profile:`, error.message);
      // Continue without profile
    }

    // Step 3: Find agents
    console.log('\n3. Finding agents...');
    const users = await client.getContactCenterUsers({ page_size: 100 });

    const agentNames = ['tyler pratt', 'john rudolph'];
    const foundAgents = [];

    for (const agentName of agentNames) {
      const agent = users.users.find(u => u.display_name.toLowerCase() === agentName.toLowerCase());
      if (agent) {
        console.log(`✅ Found agent: ${agent.display_name} (ID: ${agent.user_id})`);
        foundAgents.push(agent);
      } else {
        console.log(`❌ Agent "${agentName}" not found`);
      }
    }

    if (foundAgents.length === 0) {
      console.log('❌ No agents found, cannot assign skills');
      return;
    }

    // Step 4: Assign skills to agents
    console.log('\n4. Assigning skills to agents...');
    for (const agent of foundAgents) {
      console.log(`Assigning skills to ${agent.display_name}...`);

      for (const skill of createdSkills) {
        try {
          await client.assignSkillToUser(agent.user_id, skill.skill_id);
          console.log(`✅ Assigned skill "${skill.skill_name}" to ${agent.display_name}`);
        } catch (error) {
          if (error.response?.status === 409) {
            console.log(`ℹ️ Skill "${skill.skill_name}" already assigned to ${agent.display_name}`);
          } else {
            console.log(`❌ Failed to assign skill "${skill.skill_name}" to ${agent.display_name}:`, error.message);
          }
        }
      }
    }

    // Step 5: Verify assignments
    console.log('\n5. Verifying skill assignments...');
    for (const agent of foundAgents) {
      try {
        const userSkills = await client.getUserSkills(agent.user_id);
        console.log(`User skills response for ${agent.display_name}:`, JSON.stringify(userSkills, null, 2));
        const carBrandSkills = userSkills.skills?.filter(skill =>
          createdSkills.some(cs => cs.skill_id === skill.skill_id)
        ) || [];

        console.log(`${agent.display_name} has ${carBrandSkills.length} Car Brands skills assigned:`);
        carBrandSkills.forEach(skill => {
          console.log(`  - ${skill.skill_name}`);
        });
      } catch (error) {
        console.log(`❌ Failed to verify skills for ${agent.display_name}:`, error.message);
      }
    }

    console.log('\n🎉 SUCCESS: Car Brands skills management completed!');
    console.log(`📁 Category: ${category.name}`);
    console.log(`🛠️ Skills Created: ${createdSkills.length}`);
    console.log(`👥 Agents Updated: ${foundAgents.length}`);

  } catch (error) {
    console.error('❌ Failed to manage Car Brands skills:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

manageCarBrandsSkills();