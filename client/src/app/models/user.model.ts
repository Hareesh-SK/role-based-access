export interface User {
  _id: string | null;     
  userId: string;
  name: string;
  email: string;
  role: 'Admin' | 'General User';
  isNew?: boolean;        
  markedForDelete?: boolean;
}
