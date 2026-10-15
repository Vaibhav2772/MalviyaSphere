import React from 'react';
import './InterestSection.css';
import { 
  Code2, 
  Music, 
  Gamepad2, 
  Camera, 
  Palette, 
  Trophy, 
  ArrowUpRight
} from 'lucide-react';

// Sample interest categories data
const interestCategories = [
  {
    id: 'technology',
    name: 'Technology',
    icon: Code2,
    colorClass: 'color-blue',
    description:
      'From full-stack development and AI/ML to open source, cloud computing, and app development.',
    niches: ['Web Dev', 'AI & ML', 'Open Source', 'Hackathons'],
    memberCount: '180+ students active',
  },
  {
    id: 'music',
    name: 'Music',
    icon: Music,
    colorClass: 'color-purple',
    description:
      'Jam sessions, acoustic guitarists, vocalists, beatmakers, and collegiate sound production.',
    niches: ['Bands & Jamming', 'Vocals', 'Guitar', 'Audio Production'],
    memberCount: '95+ students active',
  },
  {
    id: 'gaming',
    name: 'Gaming',
    icon: Gamepad2,
    colorClass: 'color-indigo',
    description:
      'Casual campus lobbies, competitive esports squads, game development, and LAN tournaments.',
    niches: ['Valorant', 'BGMI / CoD', 'Chess', 'Game Dev'],
    memberCount: '140+ students active',
  },
  {
    id: 'photography',
    name: 'Photography',
    icon: Camera,
    colorClass: 'color-emerald',
    description:
      'Campus shutterbugs, street photography, cinematography, visual storytelling, and Lightroom editing.',
    niches: ['Portraits', 'Photowalks', 'Cinematography', 'Editing'],
    memberCount: '75+ students active',
  },
  {
    id: 'art-design',
    name: 'Art & Design',
    icon: Palette,
    colorClass: 'color-rose',
    description:
      'UI/UX product designers, 3D artists, graphic illustrators, poster designers, and branding creatives.',
    niches: ['UI/UX Design', 'Figma', '3D / Blender', 'Digital Art'],
    memberCount: '85+ students active',
  },
  {
    id: 'sports',
    name: 'Sports',
    icon: Trophy,
    colorClass: 'color-amber',
    description:
      'Badminton clashes, weekend football tournaments, basketball courts, athletics, and fitness partners.',
    niches: ['Football', 'Badminton', 'Basketball', 'Fitness'],
    memberCount: '110+ students active',
  },
];

function InterestSection() {
  const handleCardClick = (categoryName) => {
    alert(`Exploring community for ${categoryName}! Detailed community pages will launch soon.`);
  };

  return (
    <section className="interests-section" id="interests" aria-labelledby="interests-heading">
      <div className="container">
        {/* Section Header */}
        <div className="interests-header">
          <h2 id="interests-heading" className="interests-title">
            Find your kind of people
          </h2>
          <p className="interests-description">
            Start with what you love. Discover the niche that makes it yours.
          </p>
        </div>

        {/* Responsive Grid of Category Cards */}
        <div className="interests-grid">
          {interestCategories.map((category) => {
            const IconComponent = category.icon;
            return (
              <div
                key={category.id}
                className="interest-card"
                tabIndex={0}
                role="button"
                onClick={() => handleCardClick(category.name)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleCardClick(category.name);
                  }
                }}
                aria-label={`Explore ${category.name} interest community`}
              >
                {/* Card Top Row: Icon & Arrow */}
                <div className="card-top-row">
                  <div className={`card-icon-box ${category.colorClass}`}>
                    <IconComponent size={24} />
                  </div>
                  <div className="card-explore-arrow" aria-hidden="true">
                    <ArrowUpRight size={18} />
                  </div>
                </div>

                {/* Category Title */}
                <h3 className="card-category-name">{category.name}</h3>

                {/* Description */}
                <p className="card-category-desc">{category.description}</p>

                {/* Micro niche tags */}
                <div className="card-niches-row">
                  {category.niches.map((niche, idx) => (
                    <span key={idx} className="niche-tag">
                      {niche}
                    </span>
                  ))}
                </div>

                {/* Card Footer: Student member count */}
                <div className="card-footer">
                  <span className="card-member-count">{category.memberCount}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default InterestSection;
