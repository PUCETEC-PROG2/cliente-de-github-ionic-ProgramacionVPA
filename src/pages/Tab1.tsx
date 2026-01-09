// src/pages/Tab1.tsx
import { 
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar,
  IonList, IonItem, IonLabel, IonNote, IonIcon, IonLoading, 
  IonRefresher, IonRefresherContent, 
  IonButton, IonButtons, IonToast, useIonAlert // Importamos componentes para alertas y botones
} from '@ionic/react';
import { logoGithub, trashOutline, createOutline } from 'ionicons/icons'; // Importamos iconos de basura y lápiz
import { useEffect, useState } from 'react';
import { githubService } from '../services/github.service';
import './Tab1.css';

const Tab1: React.FC = () => {
  const [repos, setRepos] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Estado para mensajes de feedback visual
  const [message, setMessage] = useState<string | null>(null);
  
  // Hook para mostrar alertas nativas
  const [presentAlert] = useIonAlert();

  useEffect(() => {
    fetchRepos();
  }, []);

  const fetchRepos = async () => {
    try {
      const data = await githubService.getRepos();
      setRepos(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Función para recargar deslizando hacia abajo
  const handleRefresh = async (event: any) => {
    await fetchRepos();
    event.detail.complete();
  };

  // Función para eliminar un repositorio (DELETE)
  const handleDelete = (repo: any) => {
    presentAlert({
      header: '¿Eliminar Repositorio?',
      message: `Se eliminará permanentemente "${repo.name}"`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: async () => {
            try {
              setLoading(true);
              await githubService.deleteRepo(repo.owner.login, repo.name);
              setMessage('Repositorio eliminado correctamente');
              fetchRepos();
            } catch (error) {
              setMessage('Error al eliminar el repositorio');
            } finally {
              setLoading(false);
            }
          },
        },
      ],
    });
  };

  // Función para actualizar la descripción (PATCH)
  const handleUpdate = (repo: any) => {
    presentAlert({
      header: 'Actualizar Descripción',
      inputs: [
        {
          name: 'description',
          type: 'textarea',
          placeholder: 'Nueva descripción...',
          value: repo.description
        }
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Guardar',
          handler: async (data) => {
            try {
              setLoading(true);
              await githubService.updateRepo(repo.owner.login, repo.name, data.description);
              setMessage('Descripción actualizada correctamente');
              fetchRepos();
            } catch (error) {
              setMessage('Error al actualizar');
            } finally {
              setLoading(false);
            }
          },
        },
      ],
    });
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Mis Repositorios</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonLoading isOpen={loading} message="Procesando..." />
        
        {/* Componente para recargar deslizando */}
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>

        <IonList>
          {repos.map((repo) => (
            <IonItem key={repo.id}>
              <IonIcon slot="start" icon={logoGithub} />
              <IonLabel>
                <h2>{repo.name}</h2>
                <p>{repo.description || 'Sin descripción'}</p>
                {repo.language && <p style={{ color: 'var(--ion-color-primary)' }}>Lenguaje: {repo.language}</p>}
              </IonLabel>
              <IonNote slot="end" style={{ fontSize: '0.8rem' }}>
                {new Date(repo.updated_at).toLocaleDateString()}
              </IonNote>

              {/* Componente de botones para Editar y Eliminar */}
              <IonButtons slot="end">
                <IonButton color="primary" onClick={() => handleUpdate(repo)}>
                  <IonIcon slot="icon-only" icon={createOutline} />
                </IonButton>
                <IonButton color="danger" onClick={() => handleDelete(repo)}>
                  <IonIcon slot="icon-only" icon={trashOutline} />
                </IonButton>
              </IonButtons>

            </IonItem>
          ))}
        </IonList>

        {/* Componente para feedback visual (Toast) */}
        <IonToast 
          isOpen={!!message} 
          message={message || ''} 
          duration={2000} 
          onDidDismiss={() => setMessage(null)} 
        />

      </IonContent>
    </IonPage>
  );
};

export default Tab1;