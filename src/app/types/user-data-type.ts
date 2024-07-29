import { TagType } from './tag-type';

export type UserDataType = {
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl: string | null;
  projects: Project[];
} | null;

export type Project = {
  id: string;
  title: string;
  description: string;
  url: string | null;
  thumbnailUrl: string | null;
  createdAt: string;
  author?: UserDataType;
  tags: TagType[];
};
