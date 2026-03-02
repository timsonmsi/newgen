import { Girl } from '@/types';

export const girls: Girl[] = [
  {
    id: 'alyok',
    name: 'Alyok',
    title: 'The Scuf Queen\'s Court',
    color: '#ff6b9d',
    glowClass: 'glow-alyok',
    position: { top: '20%', left: '15%' },
    description: 'Glamorous stage lights meet nostalgic Boomer aesthetic',
  },
  {
    id: 'sabinina',
    name: 'Sabinina',
    title: 'The AI Zen Garden',
    color: '#00d9ff',
    glowClass: 'glow-sabinina',
    position: { top: '25%', left: '50%' },
    description: 'Minimalist calm meets cyberpunk energy',
  },
  {
    id: 'nazken',
    name: 'Nazken',
    title: 'The Director\'s Cut',
    color: '#ffd700',
    glowClass: 'glow-nazken',
    position: { top: '20%', left: '85%' },
    description: 'From shy intern to fierce media lead',
  },
  {
    id: 'molya',
    name: 'Molya',
    title: 'The REPO Trainee Stage',
    color: '#a855f7',
    glowClass: 'glow-molya',
    position: { top: '45%', left: '25%' },
    description: 'K-pop elegance meets gaming inventory',
  },
  {
    id: 'zhansiko',
    name: 'Zhansiko',
    title: 'The Red Bull Pitstop',
    color: '#dc2626',
    glowClass: 'glow-zhansiko',
    position: { top: '45%', left: '75%' },
    description: 'F1 adrenaline fades into cozy late-night chat',
  },
  {
    id: 'oliyash',
    name: 'Oliyash',
    title: 'The FYP of Dreams',
    color: '#f472b6',
    glowClass: 'glow-oliyash',
    position: { top: '70%', left: '35%' },
    description: 'Dreamy cinematic TikTok-style journey',
  },
  {
    id: 'ardashon',
    name: 'Ardashon',
    title: 'The Soulmate Frequency',
    color: '#f59e0b',
    glowClass: 'glow-ardashon',
    position: { top: '70%', left: '65%' },
    description: 'Warm nostalgic retro Kazakh vibes',
  },
];

export const getGirlById = (id: string): Girl | undefined => {
  return girls.find((girl) => girl.id === id);
};
