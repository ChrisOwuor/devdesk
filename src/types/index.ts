export interface Task {
  id: string;
  title: string;
  status: "Backlog" | "Todo" | "In Progress" | "Review" | "Done";
  priority: "Low" | "Medium" | "High";
  dueDate: string;
  assignee: string;
}

export interface List {
  id: string;
  name: string;
  tasks: Task[];
}

export interface Folder {
  id: string;
  name: string;
  lists: List[];
  isExpanded?: boolean;
}

export interface Space {
  id: string;
  name: string;
  initial: string;
  colorClass: string; // Tailwind bg- color
  textClass: string; // Tailwind text- color
  folders: Folder[];
  isExpanded?: boolean;
}

export interface Deployment {
  id: string;
  version: string;
  author: string;
  status: "Success" | "Processing" | "Failed";
  environment: string;
  timestamp: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
}

export interface ProjectDoc {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
}

export interface ProjectFile {
  id: string;
  name: string;
  size: string;
  type: string;
  uploadDate: string;
}

export type Theme = "dark" | "light";

export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

export type NavigationWorkspace = {
  id: string;
  name: string;
  slug: string;

  spaces: {
    id: string;
    name: string;

    folders: {
      id: string;
      name: string;

      pages: {
        id: string;
        name: string;
      }[];
    }[];
  }[];
};