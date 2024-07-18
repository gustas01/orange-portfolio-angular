export type UserDataType = {
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl: string | null;
  projects: Projects[];
} | null;

export type Projects = {
  id: string;
  title: string;
  description: string;
  url: string | null;
  thumbnailUrl: null;
  createdAt: string;
  tags: [
    {
      id: number;
      tagName: string;
    }
  ];
};
