// import { useAuth } from "../features/auth/AuthContext";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../store";
import { logout } from "../features/auth/authSlice";
import api from "../api/axios";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import MainContent from "../components/MainContent";
import styles from "./Dashboard.module.css";
import ProjectForm from "../components/ProjectForm";
import { useEffect, useState } from "react";
import axios from "axios";
import HeaderMUI from "../components/HeaderMUI";
import HeaderBS from "../components/HeaderBS";
import { useCallback } from 'react';
import { memo } from 'react';
import useProjects from '../hooks/useProjects';
interface Project {
  id: string;
  name: string;
  color: string;
}
interface Column {
  id: string;
  title: string;
  tasks: string[];
}

export default function Dashboard() {
  // const { state: authState, dispatch } = useAuth();
  const dispatch = useDispatch();



  const authState = useSelector((state: RootState) => state.auth);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [columns, setColumns] = useState<Column[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const dangerousName = '<img src=x onerror=alert("HACK")>';
  const MemoizedSidebar = memo(Sidebar);
  const handleRename = useCallback((project: Project) => {
    renameProject(project);
  }, []);
  
  // GET — charger les données au montage
  useEffect(() => {
    async function fetchData() {
      try {
        const [projRes, colRes] = await Promise.all([
          api.get("/projects"),
          api.get("/columns"),
        ]);
        setProjects(projRes.data);
        setColumns(colRes.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // POST — ajouter un projet
  async function addProject(name: string, color: string) {
    setSaving(true);
    setError(null);
    try {
      const { data } = await api.post("/projects", { name, color });
      setProjects((prev) => [...prev, data]);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message ||
          `Erreur lors d'ajout ${err.response?.status}`,
        );
      } else {
        setError("Erreur inconnue");
      }
    } finally {
      setSaving(false);
    }
  }

  // PUT — renommer un projet
  async function renameProject(project: Project) {
    const newName = prompt(`Nouveau nom de ${project.name}`, project.name);
    if (newName?.trim() === "") {
      alert("Le nom ne peut pas être vide");
      return;
    }

    if (newName === project.name) {
      alert("Le nouveau nom doit être différent de l'ancien");
      return;
    }
    setSaving(true);
    setError(null);
    const updatedProject = { ...project, name: newName || project.name };
    try {
      await api.put(`/projects/${project.id}`, updatedProject);
      setProjects((prev) =>
        prev.map((p) => (p.id === project.id ? updatedProject : p)),
      );
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message ||
          `Erreur lors de renommage ${err.response?.status}`,
        );
      } else {
        setError("Erreur inconnue");
      }
    } finally {
      setSaving(false);
    }
  }

  // DELETE — supprimer un projet
  async function deleteProject(id: string) {
    const validation = window.confirm(
      "Êtes-vous sûr de vouloir supprimer ce projet ?",
    );
    if (!validation) return;
    try {
      await api.delete(`/projects/${id}`);
      setProjects((prev) => prev.filter((p) => p.id !== id));
      alert("Projet supprimé avec succès");
    } catch (e) {
      console.error(e);
      alert("Erreur lors de la suppression du projet");
    }
  }

  if (loading) return <div className={styles.loading}>Chargement...</div>;

  return (
    <div className={styles.layout}>
      {/* <Header
        title="TaskFlow"
        onMenuClick={() => setSidebarOpen((p) => !p)}
        userName={authState.user?.name}
        onLogout={() => dispatch({ type: "LOGOUT" })}
      /> */}
      {/* <HeaderMUI
        title="TaskFlow"
        onMenuClick={() => setSidebarOpen((p) => !p)}
        userName={authState.user?.name}
        onLogout={() => dispatch({ type: "LOGOUT" })}
      /> */}
      <HeaderBS
        title="TaskFlow"
        onMenuClick={() => setSidebarOpen((p) => !p)}
        userName={authState.user?.name}
        onLogout={() => dispatch(logout())}
      // dispatch({ type: "LOGOUT" })}
      />
      <div className={styles.body}>
        {/* <Sidebar
          projects={projects}
          isOpen={sidebarOpen}
          onRenameProject={renameProject}
          onDeleteProject={deleteProject}
        /> */}
        <MemoizedSidebar
          projects={projects}
          isOpen={sidebarOpen}
          onRenameProject={renameProject}
          onDeleteProject={deleteProject}
        />

        <p>{dangerousName}</p>
        {/* <div dangerouslySetInnerHTML={{ __html: dangerousName }} /> */}
        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.content}>
          <div className={styles.toolbar}>
            {!showForm ? (
              <button
                className={styles.addBtn}
                onClick={() => setShowForm(true)}
                disabled={saving}
              >
                + Nouveau projet
              </button>
            ) : (
              <ProjectForm
                submitLabel="Créer"
                onSubmit={(name, color) => {
                  addProject(name, color);
                  setShowForm(false);
                }}
                onCancel={() => setShowForm(false)}
              />
            )}
          </div>
          <MainContent columns={columns} />
        </div>
      </div>
    </div>
  );
}
