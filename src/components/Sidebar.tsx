import { NavLink } from "react-router-dom";
import styles from "./Sidebar.module.css";

interface Project {
  id: string;
  name: string;
  color: string;
}
interface SidebarProps {
  projects: Project[];
  isOpen: boolean;
  onRenameProject: (project: Project) => void;
  onDeleteProject: (id : string) => void;
}

export default function Sidebar({
  projects,
  isOpen,
  onRenameProject,
  onDeleteProject,
}: SidebarProps) {
  return (
    <aside
      className={`${styles.sidebar} ${isOpen ? styles.open : styles.closed}`}
    >
      <h2 className={styles.title}>Mes Projets</h2>
      <ul className={styles.list}>
        {projects.map((p) => (
          <li key={p.id}>
            <li key={p.id}>
              <NavLink to={`/projects/${p.id}`} className={styles.item}>
                <span className={styles.dot} style={{ background: p.color }} />
                {p.name}
              </NavLink>

              <button
                className={styles.editBtn}
                onClick={() => onRenameProject(p)}
              >
                ✏️
              </button>
               <button
                className={styles.deleteBtn}
                onClick={() => onDeleteProject(p.id)}
              >
                🗑️
              </button>
            </li>
          </li>
        ))}
      </ul>
    </aside>
  );
}
