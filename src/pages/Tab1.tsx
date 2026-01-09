// src/pages/Tab1.tsx
import { 
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar,
  IonList, IonItem, IonLabel, IonNote, IonIcon, IonLoading, IonRefresher, IonRefresherContent
} from '@ionic/react';
import { logoGithub } from 'ionicons/icons';
import { useEffect, useState } from 'react';
import { githubService } from '../services/github.service';
import './Tab1.css';

const Tab1: React.FC = () => {
  const [repos, setRepos] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

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

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Mis Repositorios</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonLoading isOpen={loading} message="Obteniendo repositorios..." />
        
        {/* Componente para recargar deslizando */}
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>

        <IonList>
          {repos.map((repo) => (
            <IonItem key={repo.id} button detail href={repo.html_url} target="_blank">
              <IonIcon slot="start" icon={logoGithub} />
              <IonLabel>
                <h2>{repo.name}</h2>
                <p>{repo.description || 'Sin descripción'}</p>
                {repo.language && <p style={{ color: 'var(--ion-color-primary)' }}>Lenguaje: {repo.language}</p>}
              </IonLabel>
              <IonNote slot="end" style={{ fontSize: '0.8rem' }}>
                {new Date(repo.updated_at).toLocaleDateString()}
              </IonNote>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Tab1;