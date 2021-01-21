//package imports
import { Layout } from "antd";
import { BrowserRouter, Route, Switch } from "react-router-dom";
//local imports
import "./App.less";
import CartRoute from "./components/routes/CartRoute";
import CatalogRoute from "./components/routes/CatalogRoute";
import CollectionRoute from "./components/routes/CollectionRoute";

const { Header, Footer, Content } = Layout;

function App() {
  return (
    <div className="App">
      <Layout id="Main-Layout">
        <Header>

        </Header>
        <Content style={{ height: 'calc(100% - 80px)' }}>
          <BrowserRouter>
            <Switch>
              <Route path="/collection" component={CollectionRoute} />
              <Route path="/cart" component={CartRoute} />
              <Route path="/" component={CatalogRoute} />
            </Switch>
          </BrowserRouter>
        </Content>
        <Footer>Footer</Footer>
      </Layout>
    </div>
  );
}

export default App;
