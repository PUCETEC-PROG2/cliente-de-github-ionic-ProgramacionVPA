import { 
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar,
  IonItem, IonLabel, IonInput, IonTextarea, IonButton, 
  IonIcon, IonToggle, IonLoading, IonToast, IonCard, IonCardContent
} from '@ionic/react';
import { addCircleOutline, terminalOutline } from 'ionicons/icons';
import { useState } from 'react';
import { useHistory } from 'react-router-dom'; 
import { githubService } from '../services/github.service';
import './Tab2.css'; 

const Tab2: React.FC = () => {
  const history = useHistory();
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [isPrivate, setIsPrivate] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleCreateRepo = async () => {
    if (!name.trim()) {
      setMessage('El nombre es obligatorio');
      return;
    }
    try {
      setLoading(true);
      await githubService.createRepo(name, description, isPrivate);
      setMessage('¡Proyecto creado!');
      setName('');
      setDescription('');
      setTimeout(() => {
        history.push('/proyectos');
        window.location.href = '/proyectos'; 
      }, 1000);
    } catch (error) {
      setMessage('Error: Nombre duplicado o fallo de conexión.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="tertiary">
          <IonTitle>Nuevo Proyecto</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="dark-content">
        
        <div className="header-icon-container">
          <IonIcon icon={terminalOutline} className="neon-icon" />
          <h2 className="neon-text">Inicializar Repo</h2>
        </div>

        <IonCard className="dark-card">
          <IonCardContent>
            {/* Input Nombre */}
            <div className="custom-input-group">
              <label>Nombre del Repositorio</label>
              <div className="input-wrapper">
                <IonInput 
                  placeholder="ej: sistema-ventas-2026"
                  value={name}
                  onIonInput={(e: any) => setName(e.target.value)}
                  className="custom-input"
                ></IonInput>
              </div>
            </div>

            {/* Input Descripción */}
            <div className="custom-input-group">
              <label>Descripción</label>
              <div className="input-wrapper">
                <IonTextarea 
                  placeholder="Detalles del proyecto..."
                  rows={3}
                  value={description}
                  onIonInput={(e: any) => setDescription(e.target.value)}
                  className="custom-input"
                ></IonTextarea>
              </div>
            </div>

            {/* Toggle */}
            <IonItem lines="none" className="transparent-item">
              <IonLabel style={{ color: '#fff' }}>Privado</IonLabel>
              <IonToggle 
                slot="end" 
                checked={isPrivate} 
                onIonChange={(e) => setIsPrivate(e.detail.checked)} 
              />
            </IonItem>

            <div className="ion-padding-top">
              <IonButton expand="block" color="secondary" onClick={handleCreateRepo}>
                <IonIcon slot="start" icon={addCircleOutline} />
                DEPLOY
              </IonButton>
            </div>
          </IonCardContent>
        </IonCard>

        <IonLoading isOpen={loading} message="Conectando..." />
        <IonToast isOpen={!!message} message={message || ''} duration={3000} onDidDismiss={() => setMessage(null)} />
      </IonContent>
    </IonPage>
  );
};

export default Tab2;