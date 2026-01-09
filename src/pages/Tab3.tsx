// src/pages/Tab3.tsx
import { 
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar, 
  IonCard, IonCardContent, IonAvatar, IonChip, IonLabel, 
  IonIcon, IonLoading, IonToast
} from '@ionic/react';
import { locationOutline, globeOutline, peopleOutline, gitNetworkOutline, folderOpenOutline } from 'ionicons/icons';
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
        <IonToolbar color="tertiary">
          <IonTitle>Mi Perfil</IonTitle>
        </IonToolbar>
      </IonHeader>
      
      {/* Clase para fondo oscuro */}
      <IonContent fullscreen className="profile-content">
        
        <IonLoading isOpen={loading} message="Cargando perfil..." />

        {userData && (
          <>
            {/* Cabecera del perfil */}
            <div className="profile-header">
              <div className="avatar-container">
                <IonAvatar className="custom-avatar">
                  <img src={userData.avatar_url} alt="Avatar" />
                </IonAvatar>
              </div>
              <h2 className="user-name">{userData.name}</h2>
              <p className="user-handle">@{userData.login}</p>
              
              {/* Chips de info extra */}
              <div className="info-chips">
                {userData.location && (
                  <IonChip className="dark-chip">
                    <IonIcon icon={locationOutline} color="secondary" />
                    <IonLabel>{userData.location}</IonLabel>
                  </IonChip>
                )}
                {userData.blog && (
                  <IonChip className="dark-chip">
                    <IonIcon icon={globeOutline} color="secondary" />
                    <IonLabel>Website</IonLabel>
                  </IonChip>
                )}
              </div>
            </div>

            {/* Estadísticas en tarjeta */}
            <IonCard className="stats-card">
              <IonCardContent className="stats-grid">
                
                <div className="stat-item">
                  <IonIcon icon={folderOpenOutline} className="stat-icon" />
                  <h3>{userData.public_repos}</h3>
                  <p>Repos</p>
                </div>

                <div className="stat-item">
                  <IonIcon icon={peopleOutline} className="stat-icon" />
                  <h3>{userData.followers}</h3>
                  <p>Seguidores</p>
                </div>

                <div className="stat-item">
                  <IonIcon icon={gitNetworkOutline} className="stat-icon" />
                  <h3>{userData.following}</h3>
                  <p>Siguiendo</p>
                </div>

              </IonCardContent>
            </IonCard>

            {/* Bio del usuario */}
            {userData.bio && (
              <IonCard className="bio-card">
                <IonCardContent>
                  <p className="bio-text">"{userData.bio}"</p>
                </IonCardContent>
              </IonCard>
            )}
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Tab3;