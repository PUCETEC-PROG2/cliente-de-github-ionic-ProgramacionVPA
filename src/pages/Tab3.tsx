// src/pages/Tab3.tsx
import { 
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar, 
  IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent,
  IonAvatar, IonItem, IonLabel, IonLoading, IonToast, IonBadge
} from '@ionic/react';
import { useEffect, useState } from 'react';
import { githubService } from '../services/github.service'; // Importamos el servicio
import './Tab3.css';

const Tab3: React.FC = () => {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Hook para cargar datos al iniciar
  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      setLoading(true);
      const data = await githubService.getUser();
      setUserData(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Mi Perfil GitHub</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        
        <IonLoading isOpen={loading} message="Cargando perfil..." />

        {userData && (
          <IonCard>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
              <IonAvatar style={{ width: '120px', height: '120px', border: '4px solid var(--ion-color-primary)' }}>
                <img src={userData.avatar_url} alt="Avatar" />
              </IonAvatar>
            </div>
            <IonCardHeader>
              <IonCardTitle className="ion-text-center">{userData.name}</IonCardTitle>
              <IonCardSubtitle className="ion-text-center">@{userData.login}</IonCardSubtitle>
            </IonCardHeader>
            <IonCardContent>
              <p style={{ textAlign: 'center', marginBottom: '15px' }}>{userData.bio}</p>
              
              <IonItem lines="full">
                <IonLabel>Repositorios Públicos</IonLabel>
                <IonBadge slot="end">{userData.public_repos}</IonBadge>
              </IonItem>
              <IonItem lines="full">
                <IonLabel>Seguidores</IonLabel>
                <IonBadge slot="end" color="secondary">{userData.followers}</IonBadge>
              </IonItem>
               <IonItem lines="none">
                <IonLabel>Siguiendo</IonLabel>
                <IonBadge slot="end" color="tertiary">{userData.following}</IonBadge>
              </IonItem>
            </IonCardContent>
          </IonCard>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Tab3;