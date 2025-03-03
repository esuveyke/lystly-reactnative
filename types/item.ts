export interface User {
  id: string;
  name: string;
}

export interface BaseItem {
  id: string;
  type: 'link' | 'note';
  title: string;
  createdAt: string;
  isSaved: boolean;
  isShared: boolean;
  sharedWithMe?: boolean;
  sharedBy?: User;
  sharedAt?: string;
}

export interface LinkItem extends BaseItem {
  type: 'link';
  url: string;
  imageUrl?: string;
}

export interface NoteItem extends BaseItem {
  type: 'note';
  content: string;
}

export type Item = LinkItem | NoteItem;