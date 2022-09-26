//import logo from '../assets/image/logo.svg';
import { Routers, store } from '../config';
import { Provider } from 'react-redux';

function App() {
  return (//component App dibungkus Provider yg memiliki props store agar store dapat digunakan sebagai state global
    <Provider store = {store}>
      <Routers/>
    </Provider>
  );
}

export default App;
