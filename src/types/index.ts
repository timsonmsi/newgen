export interface Girl {
  id: string;
  name: string;
  title: string;
  color: string;
  glowClass: string;
  position: {
    top: string;
    left: string;
  };
  description: string;
}

export interface StarProps {
  girl: Girl;
  onSelect: (girl: Girl) => void;
  isZooming: boolean;
}

export interface UniversePageProps {
  girl: Girl;
  onBack: () => void;
}
