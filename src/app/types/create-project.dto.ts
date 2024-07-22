import { TagType } from './tag-type';

export type CreateProjectDTO = {
  title: string;
  url: string;
  description: string;
  tags: string[];
};
