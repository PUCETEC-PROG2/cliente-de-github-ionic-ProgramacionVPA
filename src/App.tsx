import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { listOutline, addCircleOutline, personCircleOutline } from 'ionicons/icons';
import Tab1 from './pages/Tab1';
import Tab2 from './pages/Tab2';
import Tab3 from './pages/Tab3';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          <Route exact path="/proyectos">
            <Tab1 />
          </Route>
          <Route exact path="/crear">
            <Tab2 />
          </Route>
          <Route path="/perfil">
            <Tab3 />
          </Route>
          <Route exact path="/">
            <Redirect to="/proyectos" />
          </Route>
        </IonRouterOutlet>
        
        <IonTabBar slot="bottom" style={{ backgroundColor: '#1e1e1e', borderTop: '1px solid #333' }}>
          
          <IonTabButton tab="tab1" href="/proyectos">
            <IonIcon aria-hidden="true" icon={listOutline} />
            <IonLabel>Proyectos</IonLabel>
          </IonTabButton>
          
          <IonTabButton tab="tab2" href="/crear">
            <IonIcon aria-hidden="true" icon={addCircleOutline} />
            <IonLabel>Crear</IonLabel>
          </IonTabButton>
          
          <IonTabButton tab="tab3" href="/perfil">
            <IonIcon aria-hidden="true" icon={personCircleOutline} />
            <IonLabel>Perfil</IonLabel>
          </IonTabButton>

        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  </IonApp>
);

export default App;