interface ImageType {
  uri: string;
}

interface CategoryType {
  name: string;
}

interface ExpertType {
  firstName: string;
  lastName: string;
  title: string;
  company: string;
}

export interface PodcastType {
  name: string;
  image: ImageType;
  categories: CategoryType[];
  experts: ExpertType[];
}

export interface ContentCardsData {
  contentCards: {
    edges: PodcastType[];
  };
}

export interface ContentCardsVars {
  limit: number;
  keywords: string;
  types: string[];
}
