// src/pages/Tab2.tsx
import { 
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar,
  IonItem, IonLabel, IonInput, IonTextarea, IonButton, 
  IonIcon, IonToggle, IonLoading, IonToast, IonList, IonCard, IonCardContent
} from '@ionic/react';
import { addCircleOutline, gitNetworkOutline } from 'ionicons/icons';
import { useState } from 'react';
import { useHistory } from 'react-router-dom'; 
import { githubService } from '../services/github.service';
import './Tab2.css';

const Tab2: React.FC = () => {
  const history = useHistory();
  
  // Variables para guardar lo que escribe el usuario
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [isPrivate, setIsPrivate] = useState<boolean>(false);
  
  // Variables para controlar la carga y mensajes
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleCreateRepo = async () => {
    // 1. Validamos que haya puesto un nombre
    if (!name.trim()) {
      setMessage('El nombre del repositorio es obligatorio');
      return;
    }

    try {
      setLoading(true);
      // 2. Llamamos al servicio nuevo que creamos
      await githubService.createRepo(name, description, isPrivate);
      
      // 3. Si todo sale bien:
      setMessage('¡Repositorio creado con éxito!');
      setName('');        // Limpiamos los campos
      setDescription('');
      
      // Esperamos 1.5 segundos y vamos a la lista para ver el nuevo repo
      setTimeout(() => {
        history.push('/tab1');
        window.location.href = '/tab1'; // Forzamos recarga para ver el cambio
      }, 1500);

    } catch (error) {
      setMessage('Error: Es posible que ese nombre ya exista en tu GitHub.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Crear Proyecto</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        
        <div style={{ textAlign: 'center', margin: '30px 0' }}>
          <IonIcon icon={gitNetworkOutline} style={{ fontSize: '80px', color: '#3880ff' }} />
          <h2>Nuevo Repositorio</h2>
          <p>Llena los datos para crear un proyecto en tu GitHub</p>
        </div>

        <IonCard>
          <IonCardContent>
            <IonList lines="full">
              {/* Campo Nombre */}
              <IonItem>
                <IonInput 
                  label="Nombre del Repositorio" 
                  labelPlacement="stacked"
                  placeholder="Ej: examen-final-movil"
                  value={name}
                  onIonInput={(e: any) => setName(e.target.value)}
                ></IonInput>
              </IonItem>

              {/* Campo Descripción */}
              <IonItem>
                <IonTextarea 
                  label="Descripción (Opcional)" 
                  labelPlacement="stacked"
                  placeholder="¿De qué trata este proyecto?"
                  rows={3}
                  value={description}
                  onIonInput={(e: any) => setDescription(e.target.value)}
                ></IonTextarea>
              </IonItem>

              {/* Switch Privado/Público */}
              <IonItem>
                <IonLabel>
                  <h2>Repositorio Privado</h2>
                  <p>Solo tú podrás verlo</p>
                </IonLabel>
                <IonToggle 
                  slot="end" 
                  checked={isPrivate} 
                  onIonChange={(e) => setIsPrivate(e.detail.checked)} 
                />
              </IonItem>
            </IonList>

            <div className="ion-padding">
              <IonButton expand="block" onClick={handleCreateRepo}>
                <IonIcon slot="start" icon={addCircleOutline} />
                Crear en GitHub
              </IonButton>
            </div>
          </IonCardContent>
        </IonCard>

        {/* Indicador de carga y Mensajes flotantes */}
        <IonLoading isOpen={loading} message="Conectando con GitHub..." />
        <IonToast 
          isOpen={!!message} 
          message={message || ''} 
          duration={3000} 
          onDidDismiss={() => setMessage(null)}
          position="bottom"
          color={message?.includes('Error') ? 'danger' : 'success'}
        />

      </IonContent>
    </IonPage>
  );
};

export default Tab2;