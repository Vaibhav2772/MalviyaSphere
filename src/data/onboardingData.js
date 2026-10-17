import {
  Code2,
  Music,
  Gamepad2,
  Camera,
  Palette,
  Trophy
} from 'lucide-react';

// Academic degree programmes & branches at MMMUT
export const ACADEMIC_PROGRAMMES = [
  { id: 'undergraduate', label: 'Undergraduate' },
  { id: 'postgraduate', label: 'Postgraduate' },
  { id: 'doctoral', label: 'Doctoral' },
];

export const BRANCHES_BY_PROGRAMME = {
  undergraduate: [
    'Computer Science and Engineering',
    'Information Technology',
    'Electronics and Communication Engineering',
    'Civil Engineering',
    'Electrical Engineering',
    'Mechanical Engineering',
    'ECE with Internet of Things',
    'Chemical Engineering',
    'BBA',
    'B.Pharma',
  ],
  postgraduate: [
    'M.Tech',
    'MBA',
    'MCA',
    'M.Sc',
    'M.Pharm',
  ],
  doctoral: [
    'Ph.D',
  ],
};

export const ACADEMIC_YEARS = [
  'First Year',
  'Second Year',
  'Third Year',
  'Fourth Year',
  'Other',
];

// Step 2: 6 Primary Interest Categories
export const INTEREST_CATEGORIES = [
  {
    id: 'technology',
    name: 'Technology',
    icon: Code2,
    colorClass: 'color-blue',
    description: 'Web & app development, AI/ML, competitive programming, and cybersecurity.',
  },
  {
    id: 'music',
    name: 'Music',
    icon: Music,
    colorClass: 'color-purple',
    description: 'Singing, acoustic jam sessions, sound production, songwriting, and instruments.',
  },
  {
    id: 'gaming',
    name: 'Gaming',
    icon: Gamepad2,
    colorClass: 'color-indigo',
    description: 'PC & mobile gaming, campus esports squads, and game development engines.',
  },
  {
    id: 'photography',
    name: 'Photography',
    icon: Camera,
    colorClass: 'color-emerald',
    description: 'Portrait, street, and nature photography, visual storytelling, and photo editing.',
  },
  {
    id: 'sports',
    name: 'Sports',
    icon: Trophy,
    colorClass: 'color-amber',
    description: 'Cricket, football, badminton, basketball, athletics, and collegiate fitness.',
  },
  {
    id: 'art-design',
    name: 'Art & Design',
    icon: Palette,
    colorClass: 'color-rose',
    description: 'Digital art, illustration, UI/UX design, graphic design, animation, and video editing.',
  },
];

// Step 3: Multi-Level Hierarchical Nested Interests Tree
// Hierarchy: Root (Interest) -> Category/Domain -> Sub-category/Type -> Leaf Option
export const NESTED_INTERESTS_TREE = {
  technology: {
    id: 'technology',
    label: 'Technology',
    children: [
      {
        id: 'web-development',
        label: 'Web Development',
        children: [
          {
            id: 'frontend-development',
            label: 'Frontend Development',
            children: [
              { id: 'react-js', label: 'React.js' },
              { id: 'next-js', label: 'Next.js' },
              { id: 'vue-js', label: 'Vue.js' },
              { id: 'modern-javascript', label: 'HTML5/CSS3 & Modern JS' },
            ],
          },
          {
            id: 'backend-development',
            label: 'Backend Development',
            children: [
              { id: 'node-express', label: 'Node.js & Express' },
              { id: 'python-django-fastapi', label: 'Python (Django / FastAPI)' },
              { id: 'java-springboot', label: 'Java (Spring Boot)' },
              { id: 'golang', label: 'Go (Golang)' },
            ],
          },
        ],
      },
      {
        id: 'ai-data-science',
        label: 'Artificial Intelligence & Data',
        children: [
          {
            id: 'machine-learning',
            label: 'Machine Learning',
            children: [
              { id: 'scikit-learn-ml', label: 'Applied ML (Scikit-Learn)' },
              { id: 'data-science-analytics', label: 'Data Science & Analytics' },
            ],
          },
          {
            id: 'deep-learning-nlp',
            label: 'Deep Learning & GenAI',
            children: [
              { id: 'pytorch-tensorflow', label: 'PyTorch / TensorFlow' },
              { id: 'computer-vision', label: 'Computer Vision (OpenCV)' },
              { id: 'generative-ai-llms', label: 'Generative AI & LLMs' },
            ],
          },
        ],
      },
      {
        id: 'app-development',
        label: 'App Development',
        children: [
          {
            id: 'cross-platform-apps',
            label: 'Cross-Platform Frameworks',
            children: [
              { id: 'flutter-dart', label: 'Flutter & Dart' },
              { id: 'react-native', label: 'React Native' },
            ],
          },
          {
            id: 'native-mobile-apps',
            label: 'Native Platforms',
            children: [
              { id: 'android-kotlin', label: 'Android (Kotlin)' },
              { id: 'ios-swift', label: 'iOS (Swift)' },
            ],
          },
        ],
      },
      {
        id: 'competitive-programming',
        label: 'Competitive Programming & DSA',
        children: [
          {
            id: 'dsa-problem-solving',
            label: 'Problem Solving & Platforms',
            children: [
              { id: 'cpp-stl-algorithms', label: 'C++ STL & Algorithms' },
              { id: 'dynamic-programming', label: 'Dynamic Programming & Graphs' },
              { id: 'competitive-platforms', label: 'Codeforces & LeetCode' },
            ],
          },
        ],
      },
      {
        id: 'cybersecurity-cloud',
        label: 'Cybersecurity & Cloud',
        children: [
          {
            id: 'cybersecurity',
            label: 'Cybersecurity',
            children: [
              { id: 'ethical-hacking', label: 'Ethical Hacking & Web Security' },
              { id: 'network-defense', label: 'Network Defense & Cryptography' },
            ],
          },
          {
            id: 'cloud-devops',
            label: 'Cloud & DevOps',
            children: [
              { id: 'docker-kubernetes', label: 'Docker & Kubernetes' },
              { id: 'aws-gcp', label: 'AWS / Google Cloud' },
            ],
          },
        ],
      },
    ],
  },
  gaming: {
    id: 'gaming',
    label: 'Gaming',
    children: [
      {
        id: 'pc-gaming',
        label: 'PC Gaming',
        children: [
          {
            id: 'tactical-shooters',
            label: 'Tactical Shooters',
            children: [
              { id: 'valorant', label: 'Valorant' },
              { id: 'cs2', label: 'Counter-Strike 2 (CS2)' },
              { id: 'rainbow-six', label: 'Rainbow Six Siege' },
            ],
          },
          {
            id: 'battle-royale-pc',
            label: 'Battle Royale & Survival',
            children: [
              { id: 'apex-legends', label: 'Apex Legends' },
              { id: 'pubg-pc', label: 'PUBG: Battlegrounds' },
              { id: 'fortnite', label: 'Fortnite' },
            ],
          },
          {
            id: 'moba-strategy',
            label: 'MOBA & Strategy',
            children: [
              { id: 'dota2', label: 'Dota 2' },
              { id: 'league-of-legends', label: 'League of Legends' },
              { id: 'online-chess', label: 'Online Chess' },
            ],
          },
          {
            id: 'rpg-open-world',
            label: 'RPG & Open World',
            children: [
              { id: 'gta-v', label: 'GTA V / Online' },
              { id: 'genshin-impact', label: 'Genshin Impact' },
              { id: 'minecraft', label: 'Minecraft' },
            ],
          },
        ],
      },
      {
        id: 'mobile-gaming',
        label: 'Mobile Gaming',
        children: [
          {
            id: 'mobile-battle-royale',
            label: 'Battle Royale',
            children: [
              { id: 'bgmi', label: 'BGMI' },
              { id: 'free-fire', label: 'Free Fire Max' },
            ],
          },
          {
            id: 'mobile-action',
            label: 'Action & FPS',
            children: [
              { id: 'codm', label: 'Call of Duty: Mobile' },
              { id: 'brawl-stars', label: 'Brawl Stars' },
            ],
          },
        ],
      },
      {
        id: 'game-development',
        label: 'Game Development',
        children: [
          {
            id: 'game-engines',
            label: 'Game Engines',
            children: [
              { id: 'unity', label: 'Unity (C#)' },
              { id: 'unreal-engine', label: 'Unreal Engine 5' },
              { id: 'godot', label: 'Godot Engine' },
            ],
          },
          {
            id: 'game-art',
            label: 'Game Art & Design',
            children: [
              { id: 'blender-3d-game-art', label: '3D Game Art (Blender)' },
              { id: 'pixel-art', label: '2D Pixel Art & Sprites' },
            ],
          },
        ],
      },
      {
        id: 'esports',
        label: 'Esports & Tournaments',
        children: [
          {
            id: 'competitive-circuit',
            label: 'Competitive Play',
            children: [
              { id: 'campus-lan', label: 'Campus LAN Tournaments' },
              { id: 'inter-college-esports', label: 'Inter-College Leagues' },
            ],
          },
        ],
      },
    ],
  },
  music: {
    id: 'music',
    label: 'Music',
    children: [
      {
        id: 'singing-vocals',
        label: 'Singing & Vocals',
        children: [
          {
            id: 'vocal-genres',
            label: 'Vocal Styles',
            children: [
              { id: 'indian-classical-vocals', label: 'Indian Classical / Semi-Classical' },
              { id: 'western-pop-rock-vocals', label: 'Western Pop, Rock & Indie' },
              { id: 'bollywood-acoustic-vocals', label: 'Bollywood & Acoustic Covers' },
              { id: 'rap-hiphop-beatbox', label: 'Rap & Beatboxing' },
            ],
          },
        ],
      },
      {
        id: 'instrumental-music',
        label: 'Instrumental Music',
        children: [
          {
            id: 'string-instruments',
            label: 'String Instruments',
            children: [
              { id: 'acoustic-guitar', label: 'Acoustic Guitar' },
              { id: 'electric-bass-guitar', label: 'Electric / Bass Guitar' },
              { id: 'ukulele-violin', label: 'Ukulele / Violin' },
            ],
          },
          {
            id: 'keyboard-percussion',
            label: 'Keyboards & Percussion',
            children: [
              { id: 'piano-synthesizer', label: 'Piano / Synthesizer' },
              { id: 'drums-cajon', label: 'Drums / Cajon' },
              { id: 'tabla-dholak', label: 'Tabla / Indian Percussion' },
            ],
          },
        ],
      },
      {
        id: 'music-production',
        label: 'Music Production & Engineering',
        children: [
          {
            id: 'daws-and-beats',
            label: 'Audio Production',
            children: [
              { id: 'fl-studio-ableton', label: 'FL Studio / Ableton Live' },
              { id: 'beatmaking-lofi', label: 'Beatmaking & Lo-Fi' },
              { id: 'mixing-mastering', label: 'Mixing & Mastering' },
            ],
          },
        ],
      },
      {
        id: 'songwriting-composition',
        label: 'Songwriting & Composition',
        children: [
          {
            id: 'lyricism-melody',
            label: 'Creation',
            children: [
              { id: 'lyrics-writing', label: 'Lyrics Writing & Poetry' },
              { id: 'melody-chord-composition', label: 'Melody & Band Arrangement' },
            ],
          },
        ],
      },
    ],
  },
  photography: {
    id: 'photography',
    label: 'Photography',
    children: [
      {
        id: 'photography-genres',
        label: 'Photography Genres',
        children: [
          {
            id: 'portrait-fashion',
            label: 'Portraits & People',
            children: [
              { id: 'portrait-photography', label: 'Outdoor Portraiture' },
              { id: 'studio-lighting-portraits', label: 'Studio & Flash Portraits' },
            ],
          },
          {
            id: 'street-documentary',
            label: 'Street & Documentary',
            children: [
              { id: 'street-photography', label: 'Candid Street Photography' },
              { id: 'campus-photojournalism', label: 'Campus Life & Events' },
            ],
          },
          {
            id: 'nature-travel',
            label: 'Nature & Landscapes',
            children: [
              { id: 'nature-landscape-photo', label: 'Landscape & Travel Photography' },
              { id: 'astrophotography', label: 'Night & Astrophotography' },
            ],
          },
        ],
      },
      {
        id: 'cinematography-video',
        label: 'Cinematography & Video',
        children: [
          {
            id: 'filmmaking-formats',
            label: 'Video Formats',
            children: [
              { id: 'short-films-cinematography', label: 'Short Films & Storytelling' },
              { id: 'reels-event-aftermovies', label: 'Reels & Event Aftermovies' },
            ],
          },
        ],
      },
      {
        id: 'photo-editing',
        label: 'Editing & Post-Processing',
        children: [
          {
            id: 'editing-software',
            label: 'Color & Retouching',
            children: [
              { id: 'lightroom-color-grading', label: 'Adobe Lightroom (Color Grading)' },
              { id: 'photoshop-retouching', label: 'Photoshop Retouching' },
            ],
          },
        ],
      },
    ],
  },
  sports: {
    id: 'sports',
    label: 'Sports',
    children: [
      {
        id: 'team-field-sports',
        label: 'Field & Team Sports',
        children: [
          {
            id: 'cricket',
            label: 'Cricket',
            children: [
              { id: 'cricket-batting', label: 'Batting Specialist' },
              { id: 'cricket-bowling', label: 'Fast / Spin Bowling' },
              { id: 'cricket-allrounder', label: 'All-Rounder / Wicketkeeping' },
            ],
          },
          {
            id: 'football',
            label: 'Football',
            children: [
              { id: 'football-attacker', label: 'Forward / Winger' },
              { id: 'football-midfield', label: 'Midfield Playmaker' },
              { id: 'football-defense-gk', label: 'Defender / Goalkeeper' },
            ],
          },
          {
            id: 'basketball-volleyball',
            label: 'Court Sports',
            children: [
              { id: 'basketball', label: 'Basketball' },
              { id: 'volleyball', label: 'Volleyball' },
            ],
          },
        ],
      },
      {
        id: 'racket-sports',
        label: 'Racket & Indoor Sports',
        children: [
          {
            id: 'badminton',
            label: 'Badminton',
            children: [
              { id: 'badminton-singles', label: 'Badminton Singles' },
              { id: 'badminton-doubles', label: 'Badminton Doubles' },
            ],
          },
          {
            id: 'table-tennis',
            label: 'Table Tennis & Tennis',
            children: [
              { id: 'table-tennis-singles', label: 'Table Tennis' },
              { id: 'lawn-tennis', label: 'Lawn Tennis' },
            ],
          },
        ],
      },
      {
        id: 'fitness-athletics',
        label: 'Fitness & Conditioning',
        children: [
          {
            id: 'strength-training',
            label: 'Gym & Calisthenics',
            children: [
              { id: 'gym-weight-training', label: 'Weight Training & Powerlifting' },
              { id: 'calisthenics-bodyweight', label: 'Calisthenics & Bodyweight' },
            ],
          },
          {
            id: 'athletics-running',
            label: 'Athletics & Running',
            children: [
              { id: 'marathon-running', label: 'Running & Marathon' },
              { id: 'yoga-mobility', label: 'Yoga & Functional Mobility' },
            ],
          },
        ],
      },
    ],
  },
  'art-design': {
    id: 'art-design',
    label: 'Art & Design',
    children: [
      {
        id: 'ui-ux-design',
        label: 'UI/UX & Product Design',
        children: [
          {
            id: 'product-design',
            label: 'Digital Product Design',
            children: [
              { id: 'figma-prototyping', label: 'Figma Prototyping & Wireframing' },
              { id: 'design-systems', label: 'Design Systems & Component Libraries' },
              { id: 'user-research', label: 'User Research & Interface Usability' },
            ],
          },
        ],
      },
      {
        id: 'digital-art-illustration',
        label: 'Digital Art & Illustration',
        children: [
          {
            id: 'art-styles',
            label: 'Illustration Disciplines',
            children: [
              { id: 'character-anime-art', label: 'Character Design & Anime Art' },
              { id: 'concept-art', label: 'Concept Art & Environment Design' },
              { id: 'vector-illustrations', label: 'Vector Art & Icons (Illustrator)' },
            ],
          },
        ],
      },
      {
        id: 'graphic-branding',
        label: 'Graphic Design & Branding',
        children: [
          {
            id: 'branding-assets',
            label: 'Brand & Visual Design',
            children: [
              { id: 'poster-merch-design', label: 'Poster, Banner & Merch Design' },
              { id: 'brand-identity-logos', label: 'Logo & Brand Identity Design' },
              { id: 'fest-event-graphics', label: 'College Fest & Event Creatives' },
            ],
          },
        ],
      },
      {
        id: '3d-motion-video',
        label: '3D, Motion & Video',
        children: [
          {
            id: 'motion-3d',
            label: 'Animation & 3D',
            children: [
              { id: 'blender-3d-modelling', label: '3D Modelling & Sculpting (Blender)' },
              { id: 'motion-graphics-after-effects', label: 'Motion Graphics (After Effects)' },
              { id: 'video-editing-premiere-davinci', label: 'Video Editing (Premiere / DaVinci)' },
            ],
          },
        ],
      },
    ],
  },
};

// Flattened leaf labels for backward-compatibility with simpler niche lookups
export const NICHES_BY_CATEGORY = Object.keys(NESTED_INTERESTS_TREE).reduce((acc, catKey) => {
  const getLeaves = (node) => {
    if (!node.children || node.children.length === 0) return [node.label];
    return node.children.flatMap(getLeaves);
  };
  acc[catKey] = getLeaves(NESTED_INTERESTS_TREE[catKey]);
  return acc;
}, {});

// Step 4: Skill Levels
export const SKILL_LEVELS = [
  {
    id: 'beginner',
    label: 'Beginner',
    tagline: 'Curious & starting out',
    description: 'Exploring the fundamentals and looking to learn the basics.',
  },
  {
    id: 'learner',
    label: 'Learner',
    tagline: 'Grasping key concepts',
    description: 'Practicing tutorials and building small initial experiments.',
  },
  {
    id: 'intermediate',
    label: 'Intermediate',
    tagline: 'Comfortable builder',
    description: 'Able to build and collaborate on working practical projects.',
  },
  {
    id: 'advanced',
    label: 'Advanced',
    tagline: 'In-depth competency',
    description: 'Skilled with complex workflows, optimization, and problem solving.',
  },
  {
    id: 'experienced',
    label: 'Experienced',
    tagline: 'Deep hands-on background',
    description: 'Extensive project track record, ready to guide or mentor peers.',
  },
];

// Core General Campus Community Goals
export const BASE_CAMPUS_GOALS = [
  { id: 'goal-general-learn', label: 'Learn new skills & explore fresh hobbies', category: 'general' },
  { id: 'goal-general-friends', label: 'Make friends & socialize with like-minded peers', category: 'general' },
  { id: 'goal-general-mentor', label: 'Mentor juniors or seek guidance from seniors', category: 'general' },
  { id: 'goal-general-share', label: 'Share knowledge, study notes & campus opportunities', category: 'general' },
  { id: 'goal-general-clubs', label: 'Join student societies, campus clubs & fest teams', category: 'general' },
];

// Dynamic Goal Generator based on selected interests & nested leaf paths
export function getPersonalizedGoals(selectedInterests = [], selectedPaths = []) {
  const goals = [];

  // Group selected leaf labels by root category
  const leavesByCategory = {};
  selectedPaths.forEach((pathObj) => {
    const root = pathObj.rootId;
    if (!leavesByCategory[root]) leavesByCategory[root] = [];
    if (pathObj.leafLabel && !leavesByCategory[root].includes(pathObj.leafLabel)) {
      leavesByCategory[root].push(pathObj.leafLabel);
    }
  });

  // 1. Gaming Personalized Goals
  if (selectedInterests.includes('gaming')) {
    const gamingLeaves = leavesByCategory['gaming'] || [];
    const topLeaves = gamingLeaves.slice(0, 2).join(' & ');
    goals.push({
      id: 'goal-gaming-squad',
      label: topLeaves
        ? `Find competitive gaming squad & teammates for ${topLeaves}`
        : 'Find active gaming teammates & campus squad members',
      category: 'gaming',
      isPersonalized: true,
    });
    goals.push({
      id: 'goal-gaming-tournaments',
      label: 'Compete together in campus LANs & inter-college esports tournaments',
      category: 'gaming',
      isPersonalized: true,
    });
    if (gamingLeaves.some(l => l.toLowerCase().includes('unity') || l.toLowerCase().includes('engine') || l.toLowerCase().includes('art'))) {
      goals.push({
        id: 'goal-gamedev-collab',
        label: 'Collaborate with programmers & 3D artists to build indie game projects',
        category: 'gaming',
        isPersonalized: true,
      });
    }
  }

  // 2. Music Personalized Goals
  if (selectedInterests.includes('music')) {
    const musicLeaves = leavesByCategory['music'] || [];
    const topMusic = musicLeaves.slice(0, 2).join(' & ');
    goals.push({
      id: 'goal-music-band',
      label: topMusic
        ? `Form or join a campus acoustic band / jamming group (${topMusic})`
        : 'Form or join a campus band / acoustic jam group',
      category: 'music',
      isPersonalized: true,
    });
    goals.push({
      id: 'goal-music-recording',
      label: 'Collaborate with vocalists, instrumentalists & audio producers on original tracks',
      category: 'music',
      isPersonalized: true,
    });
  }

  // 3. Technology Personalized Goals
  if (selectedInterests.includes('technology')) {
    const techLeaves = leavesByCategory['technology'] || [];
    const topTech = techLeaves.slice(0, 2).join(' & ');
    goals.push({
      id: 'goal-tech-hackathons',
      label: topTech
        ? `Team up for hackathons & build full-stack projects using ${topTech}`
        : 'Team up for hackathons & build collaborative technical projects',
      category: 'technology',
      isPersonalized: true,
    });
    goals.push({
      id: 'goal-tech-study-pairs',
      label: 'Find coding buddies for pair programming, open-source & DSA practice',
      category: 'technology',
      isPersonalized: true,
    });
  }

  // 4. Photography Personalized Goals
  if (selectedInterests.includes('photography')) {
    goals.push({
      id: 'goal-photo-photowalks',
      label: 'Join weekend campus photowalks & visual storytelling photomeets',
      category: 'photography',
      isPersonalized: true,
    });
    goals.push({
      id: 'goal-photo-shoot-partners',
      label: 'Partner with creators, models & video editors for event & campus coverage',
      category: 'photography',
      isPersonalized: true,
    });
  }

  // 5. Sports Personalized Goals
  if (selectedInterests.includes('sports')) {
    const sportsLeaves = leavesByCategory['sports'] || [];
    const topSports = sportsLeaves.slice(0, 2).join(' & ');
    goals.push({
      id: 'goal-sports-teammates',
      label: topSports
        ? `Find practice partners & match teammates for ${topSports}`
        : 'Find sports teammates & practice partners for regular matches',
      category: 'sports',
      isPersonalized: true,
    });
    goals.push({
      id: 'goal-sports-tournaments',
      label: 'Organize friendly hostel clashes & represent teams in campus sports fests',
      category: 'sports',
      isPersonalized: true,
    });
  }

  // 6. Art & Design Personalized Goals
  if (selectedInterests.includes('art-design')) {
    goals.push({
      id: 'goal-art-dev-collab',
      label: 'Partner with student developers & builders on UI/UX, product design & logos',
      category: 'art-design',
      isPersonalized: true,
    });
    goals.push({
      id: 'goal-art-creative-showcase',
      label: 'Exchange illustration critiques, 3D render feedback & campus design projects',
      category: 'art-design',
      isPersonalized: true,
    });
  }

  // Always include foundational campus goals
  goals.push(...BASE_CAMPUS_GOALS);

  return goals;
}

// Fallback list of goals
export const ONBOARDING_GOALS = BASE_CAMPUS_GOALS;

// Step 5: Collaboration Preferences - Suitable for all domains (tech, sports, gaming, arts, music)
export const COLLABORATION_PREFERENCES = [
  { id: 'casual-meetups', label: 'Casual weekend meetups & practice sessions' },
  { id: 'project-teams', label: 'Project teams & competitive hackathon squads' },
  { id: '1-on-1-sparring', label: '1-on-1 peer learning & sparring partners' },
  { id: 'jam-sessions', label: 'Jam sessions & creative collaborative workshops' },
  { id: 'study-circles', label: 'Campus study circles & exam prep groups' },
  { id: 'online-lobbies', label: 'Online voice-chat lobbies & Discord coordination' },
];

// Step 5: Availability Options
export const AVAILABILITY_OPTIONS = [
  { id: 'weekdays', label: 'Weekdays' },
  { id: 'weekends', label: 'Weekends' },
  { id: 'flexible', label: 'Flexible' },
];
