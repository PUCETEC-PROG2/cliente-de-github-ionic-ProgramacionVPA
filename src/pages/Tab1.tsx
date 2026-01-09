// src/pages/Tab1.tsx
import { 
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar,
  IonCard, IonButton, IonIcon, IonLoading, 
  IonRefresher, IonRefresherContent, 
  IonToast, useIonAlert, IonBadge
} from '@ionic/react';
import { logoGithub, trashOutline, createOutline, codeSlashOutline, timeOutline } from 'ionicons/icons';
import { useEffect, useState } from 'react';
import { githubService } from '../services/github.service';
import './Tab1.css';

const Tab1: React.FC = () => {
  const [repos, setRepos] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Estado para mensajes
  const [message, setMessage] = useState<string | null>(null);
  
  // Alertas nativas
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

  // Función para eliminar repositorio (DELETE)
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
              // Borramos en GitHub
              await githubService.deleteRepo(repo.owner.login, repo.name);
              
              // Actualizamos la lista localmente (filtro por ID)
              setRepos(prevRepos => prevRepos.filter(item => item.id !== repo.id));
              setMessage('Repositorio eliminado correctamente');
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

  // Función para actualizar descripción (PATCH)
  const handleUpdate = (repo: any) => {
    presentAlert({
      header: 'Actualizar Descripción',
      inputs: [{ 
        name: 'description', 
        type: 'textarea', 
        placeholder: 'Nueva descripción...', 
        value: repo.description 
      }],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Guardar',
          handler: async (data) => {
            try {
              setLoading(true);
              // Actualizamos en GitHub
              await githubService.updateRepo(repo.owner.login, repo.name, data.description);

              // Actualizamos la lista localmente (busco por ID y edito)
              setRepos(prevRepos => prevRepos.map(item => {
                if (item.id === repo.id) return { ...item, description: data.description };
                return item;
              }));
              setMessage('Descripción actualizada correctamente');
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
        <IonToolbar color="primary">
          <IonTitle>Mis Proyectos</IonTitle>
        </IonToolbar>
      </IonHeader>
      
      <IonContent className="ion-padding-vertical">
        <IonLoading isOpen={loading} message="Cargando proyectos..." />
        
        {/* Componente para recargar deslizando */}
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>

        {/* Lista de repositorios en tarjetas */}
        {repos.map((repo) => (
          <IonCard key={repo.id} className="repo-card">
            
            {/* Encabezado de la tarjeta */}
            <div className="repo-header">
              <h2 className="repo-title">
                <IonIcon icon={logoGithub} />
                {repo.name}
              </h2>
            </div>

            {/* Detalles del proyecto */}
            <div className="repo-body">
              <p className="repo-desc">
                {repo.description || 'Sin descripción disponible'}
              </p>
              
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '10px' }}>
                {/* Badge del lenguaje si existe */}
                {repo.language && (
                  <IonBadge color="light">
                    <IonIcon icon={codeSlashOutline} style={{ marginRight: '5px', verticalAlign: 'middle' }} />
                    {repo.language}
                  </IonBadge>
                )}
                
                {/* Fecha de actualización */}
                <span style={{ fontSize: '0.8rem', color: '#888', display: 'flex', alignItems: 'center' }}>
                  <IonIcon icon={timeOutline} style={{ marginRight: '4px' }} />
                  {new Date(repo.updated_at).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Botones de acción (Editar y Eliminar) */}
            <div className="repo-actions">
              <IonButton fill="clear" size="small" onClick={() => handleUpdate(repo)}>
                <IonIcon slot="start" icon={createOutline} />
                Editar
              </IonButton>
              <IonButton fill="clear" color="danger" size="small" onClick={() => handleDelete(repo)}>
                <IonIcon slot="start" icon={trashOutline} />
                Eliminar
              </IonButton>
            </div>

          </IonCard>
        ))}

        {/* Mensaje flotante de confirmación */}
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